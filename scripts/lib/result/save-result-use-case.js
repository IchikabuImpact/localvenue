'use strict';

const { narToRakutenRaceIdCandidates, buildRakutenResultUrl } = require('./rakuten-race-code');
const { parseRakutenResultHtml, isNotReadyText, pickResultTable } = require('./rakuten-result-parser');
const cheerio = require('cheerio');

class ResultNotReadyError extends Error { constructor(message) { super(message); this.exitCode = 2; } }

class SaveResultUseCase {
  constructor({ resultClient, resultRepository, logger = console }) { this.resultClient = resultClient; this.resultRepository = resultRepository; this.logger = logger; }
  async execute({ raceId, bb }) {
    const candIds = narToRakutenRaceIdCandidates(raceId);
    if (!candIds.length) throw new Error(`Unsupported venue BB=${bb} (no Rakuten mapping)`);
    let html = null, usedRid = null, usedUrl = null, lastErr = null;
    for (const rid of candIds) {
      const url = buildRakutenResultUrl(rid);
      try {
        this.logger.log(`[try] ${url}`);
        const h = await this.resultClient.fetchHtml(url);
        const $ = cheerio.load(h);
        if (isNotReadyText($('body').text())) throw new ResultNotReadyError(`Result not ready yet: ${url}`);
        const table = pickResultTable($);
        if (table && table.length) { html = h; usedRid = rid; usedUrl = url; break; }
        lastErr = new Error('result table not found');
      } catch (e) { if (e.exitCode === 2) throw e; lastErr = e; }
    }
    if (!html) throw new Error(`failed to fetch any Rakuten page. tried=${candIds.join(', ')} last=${lastErr?.message || lastErr}`);
    this.logger.log(`[info] Rakuten RACEID=${usedRid} ← ${usedUrl}`);
    const { rows, payouts } = parseRakutenResultHtml(html);
    if (!rows.length) throw new Error('no result rows parsed');
    if (!payouts.length) this.logger.warn('[WARN] 払戻テーブルが見つかりませんでした（未発表 or DOM差異の可能性）');
    await this.resultRepository.connect();
    try {
      await this.resultRepository.save({ raceId, rows, payouts });
      if (payouts.length) this.logger.log(`[OK] race_id=${raceId} → upsert ${payouts.length} rows into race_payouts`);
      this.logger.log(`[OK] race_id=${raceId} → upsert ${rows.length} rows into race_results`);
      return { rows, payouts, usedRid, usedUrl };
    } finally { try { await this.resultRepository.close(); } catch { /* ignore */ } }
  }
}
module.exports = { SaveResultUseCase, ResultNotReadyError };
