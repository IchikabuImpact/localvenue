'use strict';
function jstTodayYmd(now = new Date()) { const jst = new Date(now.getTime() + 9 * 3600 * 1000); return `${jst.getUTCFullYear()}${String(jst.getUTCMonth() + 1).padStart(2, '0')}${String(jst.getUTCDate()).padStart(2, '0')}`; }
function parseTargetYmd(arg, now) { const ymd = arg || jstTodayYmd(now); if (!/^\d{8}$/.test(ymd)) throw new Error('Usage: node 104-aggregate-roi-daily.js [YYYYMMDD]'); return ymd; }
function ymdToIso(ymd) { return `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`; }
class AggregateDailyRoiUseCase {
  constructor({ roiRepository, logger = console }) { this.roiRepository = roiRepository; this.logger = logger; }
  async execute({ targetYmd }) {
    const isoDate = ymdToIso(targetYmd);
    await this.roiRepository.connect();
    try {
      this.logger.log(`[info] Aggregating ROI for ${isoDate} (race_id prefix: ${targetYmd})...`);
      const rows = await this.roiRepository.aggregateDaily(targetYmd);
      if (rows.length === 0) this.logger.warn(`[WARN] No ROI data found in prediction_roi for date ${targetYmd}`);
      for (const row of rows) await this.roiRepository.upsertDaily({ isoDate, row });
      const summaryRows = typeof this.roiRepository.aggregateSummary === 'function'
        ? await this.roiRepository.aggregateSummary({ isoDate, periodDays: 30 })
        : [];
      if (typeof this.roiRepository.upsertSummary === 'function') {
        for (const row of summaryRows) await this.roiRepository.upsertSummary({ isoDate, periodDays: 30, row });
      }
      const dailyRows = await this.roiRepository.findDailyRows(isoDate);
      this.logger.log(`--- Daily ROI Setup Report for ${isoDate} ---`);
      if (dailyRows.length === 0) this.logger.log('No data in prediction_roi_daily (Result not ready?)');
      else {
        const models = [...new Set(dailyRows.map(d => d.model_version))];
        for (const ver of models) {
          const entry = dailyRows.filter(d => d.model_version === ver);
          this.logger.log(`[Model: ${ver}]`);
          entry.forEach(d => this.logger.log(`  - ${d.strategy.padEnd(6)}: ${d.races} races, invest ${d.invest_yen}, return ${d.return_yen}, ROI ${d.roi_percent}%`));
          if (!entry.some(d => d.strategy === 'single'))   this.logger.warn(`  [WARN] Missing 'single' strategy for ${ver}`);
          if (!entry.some(d => d.strategy === 'place'))    this.logger.warn(`  [WARN] Missing 'place' strategy for ${ver}`);
          if (!entry.some(d => d.strategy === 'quinella')) this.logger.warn(`  [WARN] Missing 'quinella' strategy for ${ver}`);
        }
      }
      if (summaryRows.length > 0) {
        this.logger.log(`--- 30-day ROI Summary through ${isoDate} ---`);
        summaryRows.forEach(d => this.logger.log(`  - ${d.strategy.padEnd(8)}: ${d.races} races, invest ${d.invest_yen}, return ${d.return_yen}, ROI ${d.roi_percent}%`));
      }
      this.logger.log('[OK] Aggregation completed.');
      return { rows, dailyRows, summaryRows, isoDate };
    } finally { try { await this.roiRepository.close(); } catch { /* ignore */ } }
  }
}
module.exports = { jstTodayYmd, parseTargetYmd, ymdToIso, AggregateDailyRoiUseCase };
