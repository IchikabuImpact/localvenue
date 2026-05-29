'use strict';

const { MODEL_VERSION, calculatePrediction } = require('./scoring');

class PredictRaceUseCase {
  constructor({ predictionRepository, logger = console, now = () => new Date().toISOString() }) {
    this.predictionRepository = predictionRepository;
    this.logger = logger;
    this.now = now;
  }

  async execute({ raceId, year }) {
    await this.predictionRepository.connect();
    try {
      const racingFormRows = await this.predictionRepository.findRacingFormRows(raceId);
      if (!racingFormRows.length) throw new Error(`racing_form が空: race_id=${raceId}`);

      const jockeyRows = await this.predictionRepository.findJockeyScores(year);
      const trainerRows = await this.predictionRepository.findTrainerScores(year);
      const sireRows = await this.predictionRepository.findSireScores();

      const memo = calculatePrediction({
        raceId,
        racingFormRows,
        jockeyRows,
        trainerRows,
        sireRows,
        generatedAt: this.now(),
      });

      await this.predictionRepository.savePrediction({ raceId, modelVersion: MODEL_VERSION, memo });
      this.logger.log(`[OK] race_id=${raceId} 推奨: 馬番${memo.best.horse_number} (score=${memo.best.score}) 内訳=${JSON.stringify(memo.best.breakdown)}`);
      return memo;
    } finally {
      try { await this.predictionRepository.close(); } catch { /* ignore */ }
    }
  }
}

module.exports = { PredictRaceUseCase };
