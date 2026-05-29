'use strict';
const { safeJSON, calculateRaceRoi } = require('./roi-calculator');
class EvalRoiUseCase {
  constructor({ roiRepository, logger = console }) { this.roiRepository = roiRepository; this.logger = logger; }
  async execute(options) {
    await this.roiRepository.connect();
    try {
      const races = await this.roiRepository.findTargetRaces(options);
      if (!races.length) { this.logger.log('No target races.'); return { win: { stake: 0, returned: 0 }, place: { stake: 0, returned: 0 } }; }
      const totals = { win: { stake: 0, returned: 0 }, place: { stake: 0, returned: 0 } };
      for (const { race_id } of races) {
        const pred = await this.roiRepository.findLatestPrediction({ raceId: race_id, model: options.model });
        if (!pred) continue;
        const memo = safeJSON(pred.memo); const items = Array.isArray(memo?.items) ? memo.items : [];
        if (!items.length) continue;
        const payoutRows = await this.roiRepository.findPayoutRows(race_id);
        const rows = calculateRaceRoi({ raceId: race_id, modelVersion: pred.model_version, items, payoutRows, mode: options.mode, stake: options.stake, threshold: options.threshold, useScoreForPlace: options.useScoreForPlace, placeTemp: options.placeTemp, placeMass: options.placeMass });
        for (const row of rows) { await this.roiRepository.upsertROI(row); if (row.strategy === 'ev_win') { totals.win.stake += row.stake; totals.win.returned += row.returned; } if (row.strategy === 'ev_place') { totals.place.stake += row.stake; totals.place.returned += row.returned; } }
      }
      if (options.mode === 'both' || options.mode === 'win') this.logger.log(`WIN EV>=${options.threshold} : stake=${Math.round(totals.win.stake)} return=${Math.round(totals.win.returned)} ROI=${(totals.win.stake ? totals.win.returned / totals.win.stake * 100 : 0).toFixed(2)}%`);
      if (options.mode === 'both' || options.mode === 'place') this.logger.log(`PLACE EV>=${options.threshold} : stake=${Math.round(totals.place.stake)} return=${Math.round(totals.place.returned)} ROI=${(totals.place.stake ? totals.place.returned / totals.place.stake * 100 : 0).toFixed(2)}%`);
      return totals;
    } finally { try { await this.roiRepository.close(); } catch { /* ignore */ } }
  }
}
module.exports = { EvalRoiUseCase };
