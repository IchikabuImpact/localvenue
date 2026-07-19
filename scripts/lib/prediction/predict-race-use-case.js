'use strict';
const { MODEL_VERSION, calculatePrediction, parseRaceClassLevel } = require('./scoring');
const { computeImprovementBonuses } = require('./satellites/improvement-factor');
const { computeWetTrackBonuses, WET_CONDITIONS } = require('./satellites/wet-track-factor');
const { computeDistanceBonuses } = require('./satellites/distance-factor');
const { computeClassJumpBonuses } = require('./satellites/class-jump-factor');
const { computeLastKickBonuses } = require('./satellites/last-kick-factor');
const { loadVenueSatellites } = require('./satellites/venue/loader');

class PredictionSkippedError extends Error {
  constructor(msg) { super(msg); this.exitCode = 4; }
}

// race_start_time（JST "HH:MM"）と race_id から締め切り時刻（開始2分前）を返す
function computeDeadline(raceId, startTimeStr) {
  if (!startTimeStr) return null;
  const m = startTimeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const hh = parseInt(m[1], 10), mm = parseInt(m[2], 10);
  const ymd = raceId.slice(0, 8);
  const raceStartJst = new Date(
    `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}T${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:00+09:00`
  );
  return new Date(raceStartJst.getTime() - 2 * 60 * 1000);
}

class PredictRaceUseCase {
  constructor({
    predictionRepository,
    racingFormRepository,
    rankingRepository,
    logger = console,
    now = () => new Date(),
    debug = false,
    scoringConfig = null,
  }) {
    this.predictionRepository = predictionRepository;
    this.racingFormRepository = racingFormRepository;
    this.rankingRepository    = rankingRepository;
    this.logger = logger;
    this.now   = now;
    this.debug = debug;
    this.scoringConfig = scoringConfig;
  }

  async execute({ raceId, year }) {
    await Promise.all([
      this.predictionRepository.connect(),
      this.racingFormRepository.connect(),
      this.rankingRepository.connect(),
    ]);
    try {
      // race_info から天候・馬場状態・開始時刻を取得
      const raceInfo = await this.predictionRepository.findRaceInfo(raceId);
      // 取得できない場合は「良」をデフォルトとする
      const trackCondition = raceInfo?.track_condition || '良';
      const weather        = raceInfo?.weather         ?? null;
      const startTimeStr   = raceInfo?.race_start_time ?? null;
      const raceTitle      = raceInfo?.race_title       ?? null;

      // 上書き制御（debug: false の場合のみ）
      if (!this.debug) {
        const deadline = computeDeadline(raceId, startTimeStr);
        if (deadline && this.now() >= deadline) {
          throw new PredictionSkippedError(
            `締め切り済みのためスキップ: ${raceId} (開始 ${startTimeStr}, 締め切り ${deadline.toLocaleTimeString('ja-JP', { timeZone: 'Asia/Tokyo' })})`
          );
        }
      }

      const isWet = WET_CONDITIONS.has(trackCondition);
      const [racingFormRows, jockeyRows, trainerRows, sireRows, condSireRows, allSireRows] = await Promise.all([
        this.racingFormRepository.findByRaceId(raceId),
        this.rankingRepository.findJockeyScores(year),
        this.rankingRepository.findTrainerScores(year),
        this.rankingRepository.findSireScores(trackCondition),
        isWet ? this.rankingRepository.findSireRawScores(trackCondition) : Promise.resolve([]),
        isWet ? this.rankingRepository.findSireRawScores('all')           : Promise.resolve([]),
      ]);

      if (!racingFormRows.length) throw new Error(`racing_form が空: race_id=${raceId}`);

      const distanceM    = raceInfo?.distance_m ?? null;
      const currentClass = parseRaceClassLevel(raceTitle);
      const [improvementBonuses, wetTrack, distanceFactor, classJump, lastKick] = await Promise.all([
        computeImprovementBonuses(
          racingFormRows,
          raceId,
          (horseName, beforeRaceId) => this.predictionRepository.findRecentResultsByHorseName(horseName, beforeRaceId)
        ),
        Promise.resolve(computeWetTrackBonuses(racingFormRows, trackCondition, condSireRows, allSireRows)),
        computeDistanceBonuses(
          racingFormRows,
          distanceM,
          (horseName, beforeRaceId) => this.predictionRepository.findResultsWithDistanceByHorseName(horseName, beforeRaceId),
          raceId
        ),
        computeClassJumpBonuses(
          racingFormRows,
          currentClass,
          (horseName, beforeRaceId) => this.predictionRepository.findLastRaceTitleByHorseName(horseName, beforeRaceId),
          raceId
        ),
        Promise.resolve(computeLastKickBonuses(racingFormRows)),
      ]);
      const babaCode = String(raceId).slice(10, 12);
      const venueContext = { raceId, distanceM, trackCondition, weather, raceTitle };
      const venueFactors = await loadVenueSatellites(babaCode, racingFormRows, venueContext);

      const satellites = [
        { name: 'improvement', bonuses: improvementBonuses },
        { name: 'wettrack',    bonuses: wetTrack.bonuses,       capPct: wetTrack.capPct },
        { name: 'distance',    bonuses: distanceFactor.bonuses, capPct: distanceFactor.capPct },
        { name: 'classjump',   bonuses: classJump.bonuses,      capPct: classJump.capPct },
        { name: 'lastkick',    bonuses: lastKick.bonuses,       capPct: lastKick.capPct },
        ...venueFactors,
      ];

      const memo = calculatePrediction({
        raceId,
        racingFormRows,
        jockeyRows,
        trainerRows,
        sireRows,
        weather,
        trackCondition,
        raceTitle,
        satellites,
        scoringConfig: this.scoringConfig,
        generatedAt: this.now().toISOString(),
      });

      await this.predictionRepository.savePrediction({ raceId, modelVersion: MODEL_VERSION, memo });

      const condStr = `馬場:${trackCondition}`;
      const wxStr   = weather ? ` 天候:${weather}` : '';
      this.logger.log(`[OK] race_id=${raceId} 推奨: 馬番${memo.best.horse_number} (score=${memo.best.score}) 内訳=${JSON.stringify(memo.best.breakdown)} ${wxStr}${condStr}`);
      return memo;
    } finally {
      await Promise.allSettled([
        this.predictionRepository.close(),
        this.racingFormRepository.close(),
        this.rankingRepository.close(),
      ]);
    }
  }
}

module.exports = { PredictRaceUseCase, PredictionSkippedError, computeDeadline };
