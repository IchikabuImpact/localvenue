'use strict';
const { MODEL_VERSION, calculatePrediction } = require('./scoring');

class PredictRaceUseCase {
  constructor({ predictionRepository, racingFormRepository, rankingRepository, logger = console, now = () => new Date().toISOString() }) {
    this.predictionRepository = predictionRepository;
    this.racingFormRepository = racingFormRepository;
    this.rankingRepository    = rankingRepository;
    this.logger = logger;
    this.now = now;
  }

  async execute({ raceId, year }) {
    await Promise.all([
      this.predictionRepository.connect(),
      this.racingFormRepository.connect(),
      this.rankingRepository.connect(),
    ]);
    try {
      const [racingFormRows, jockeyRows, trainerRows, sireRows] = await Promise.all([
        this.racingFormRepository.findByRaceId(raceId),
        this.rankingRepository.findJockeyScores(year),
        this.rankingRepository.findTrainerScores(year),
        this.rankingRepository.findSireScores(),
      ]);

      if (!racingFormRows.length) throw new Error(`racing_form が空: race_id=${raceId}`);

      const memo = calculatePrediction({ raceId, racingFormRows, jockeyRows, trainerRows, sireRows, generatedAt: this.now() });

      await this.predictionRepository.savePrediction({ raceId, modelVersion: MODEL_VERSION, memo });
      this.logger.log(`[OK] race_id=${raceId} 推奨: 馬番${memo.best.horse_number} (score=${memo.best.score}) 内訳=${JSON.stringify(memo.best.breakdown)}`);
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

module.exports = { PredictRaceUseCase };
