'use strict';
const { evaluatePrediction } = require('./evaluation-calculator');
class PredictionMissingError extends Error { constructor() { super('予想が見つかりません（prediction が空）'); this.exitCode = 2; } }
class ResultMissingError extends Error { constructor() { super('結果が見つかりません（race_results が空）'); this.exitCode = 3; } }
class EvaluatePredictionUseCase {
  constructor({ evaluationRepository, logger = console }) { this.evaluationRepository = evaluationRepository; this.logger = logger; }
  async execute({ raceId, stakeWin = 0, stakePlace = 0, stakeQuinella = 0 }) {
    await this.evaluationRepository.connect();
    try {
      const prediction = await this.evaluationRepository.findLatestPrediction(raceId);
      if (!prediction) throw new PredictionMissingError();
      const resultRows = await this.evaluationRepository.findResultRows(raceId);
      if (!resultRows.length) throw new ResultMissingError();
      const payoutRows = await this.evaluationRepository.findPayoutRows(raceId);
      const evaluation = evaluatePrediction({ raceId, prediction, resultRows, payoutRows, stakeWin, stakePlace, stakeQuinella });
      const winnersText = evaluation.winners.map(w => `馬番${w.horse_number}（${w.horse_name || ''}）`).join(', ');
      this.logger.log('=== EVAL RESULT ===');
      this.logger.log(`race_id: ${raceId}`);
      this.logger.log(`model : ${prediction.model_version}  at ${prediction.created_at?.toISOString?.() || prediction.created_at}`);
      this.logger.log(`予想◎ : ${evaluation.bestNo ? '馬番' + evaluation.bestNo : '(不明)'}`);
      this.logger.log(`結果  : 1着 ${winnersText}${evaluation.winners.length > 1 ? '（同着）' : ''}`);
      this.logger.log(`単勝   : ${evaluation.winHit ? `的中 🎯（払戻 ${evaluation.winPayout} 円/100円）` : '不的中 ❌'}`);
      this.logger.log(`複勝   : ${evaluation.placeHit ? `的中 🎯（払戻 ${evaluation.placePayout} 円/100円）` : '不的中 ❌'}`);
      if (evaluation.top4.length) this.logger.log(`馬複◎4: ${evaluation.top4.join(' ')} → ${evaluation.quinellaHit ? `的中 🎯（払戻 ${evaluation.quinellaPayout} 円/100円×6）` : '不的中 ❌'}`);
      if (evaluation.predictedOrder.length) this.logger.log(`予想順: ${evaluation.predictedOrder.slice(0, 5).join(' → ')} ...`);
      this.logger.log(`実着順: ${evaluation.actualOrder.slice(0, 5).join(' → ')} ...`);
      await this.evaluationRepository.upsertPredictionEval(evaluation.evalRow);
      for (const row of evaluation.roiRows) await this.evaluationRepository.upsertPredictionROI(row);
      return evaluation;
    } finally { try { await this.evaluationRepository.close(); } catch { /* ignore */ } }
  }
}
module.exports = { EvaluatePredictionUseCase, PredictionMissingError, ResultMissingError };
