'use strict';

const { buildDebaTableUrl } = require('./deba-table-url');

class SaveRacingFormUseCase {
  constructor({ debaTableClient, racingFormParser, racingFormRepository, logger = console }) {
    this.debaTableClient = debaTableClient;
    this.racingFormParser = racingFormParser;
    this.racingFormRepository = racingFormRepository;
    this.logger = logger;
  }

  async execute(race) {
    const url = buildDebaTableUrl(race);
    this.logger.log(`[info] ${race.raceId} → ${url}`);

    const html = await this.debaTableClient.fetchHtml(url);
    const rows = this.racingFormParser.parse(html, { yy: race.yy });
    if (!rows.length) throw new Error('出馬表の抽出に失敗しました（0頭）');

    await this.racingFormRepository.connect();
    try {
      const savedRows = await this.racingFormRepository.saveRaceForm({ raceId: race.raceId, rows });
      this.logger.log(`[OK] race_id=${race.raceId} → upsert ${rows.length} rows`);
      return { rows, savedRows };
    } finally {
      try { await this.racingFormRepository.close(); } catch { /* ignore */ }
    }
  }
}

module.exports = { SaveRacingFormUseCase };
