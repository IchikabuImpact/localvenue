'use strict';
const { MODEL_VERSION, calculatePrediction } = require('./scoring');

class PredictionAlreadyExistsError extends Error {
  constructor() { super('予想が既に存在します（運用モード: スキップ）'); this.exitCode = 4; }
}

class PredictRaceUseCase {
  constructor({ predictionRepository, racingFormRepository, rankingRepository, logger = console, now = () => new Date().toISOString(), debug = false }) {
    this.predictionRepository = predictionRepository;
    this.racingFormRepository = racingFormRepository;
    this.rankingRepository    = rankingRepository;
    this.logger = logger;
    this.now = now;
    this.debug = debug;
  }

  async execute({ raceId, year }) {
    await Promise.all([
      this.predictionRepository.connect(),
      this.racingFormRepository.connect(),
      this.rankingRepository.connect(),
    ]);
    try {
      // 運用モードでは既存の予想があればスキップ
      if (!this.debug) {
        const existing = await this.predictionRepository.findExistingPrediction(raceId);
        if (existing) throw new PredictionAlreadyExistsError();
      }

      // race_info から天候・馬場状態を取得（なければ null のまま続行）
      const raceInfo = await this.predictionRepository.findRaceInfo(raceId);
      const trackCondition = raceInfo?.track_condition ?? null;
      const weather        = raceInfo?.weather         ?? null;

      const [racingFormRows, jockeyRows, trainerRows, sireRows] = await Promise.all([
        this.racingFormRepository.findByRaceId(raceId),
        this.rankingRepository.findJockeyScores(year),
        this.rankingRepository.findTrainerScores(year),
        this.rankingRepository.findSireScores(trackCondition),
      ]);

      if (!racingFormRows.length) throw new Error(`racing_form が空: race_id=${raceId}`);

      const memo = calculatePrediction({
        raceId,
        racingFormRows,
        jockeyRows,
        trainerRows,
        sireRows,
        weather,
        trackCondition,
        generatedAt: this.now(),
      });

      await this.predictionRepository.savePrediction({ raceId, modelVersion: MODEL_VERSION, memo });

      const condStr = trackCondition ? ` 馬場:${trackCondition}` : '';
      const wxStr   = weather        ? ` 天候:${weather}`        : '';
      this.logger.log(`[OK] race_id=${raceId} 推奨: 馬番${memo.best.horse_number} (score=${memo.best.score}) 内訳=${JSON.stringify(memo.best.breakdown)}${wxStr}${condStr}`);
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

module.exports = { PredictRaceUseCase, PredictionAlreadyExistsError };
