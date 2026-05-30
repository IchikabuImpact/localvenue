'use strict';

const { toYmd } = require('./normalize-date-arg');
const { buildRaceListUrl } = require('./race-list-url');

class SaveRaceCountByDateUseCase {
  constructor({ raceListClient, raceCountParser, raceCountRepository, logger = console }) {
    this.raceListClient = raceListClient;
    this.raceCountParser = raceCountParser;
    this.raceCountRepository = raceCountRepository;
    this.logger = logger;
  }

  async execute({ dateISO, oneVenueCode = null }) {
    const ymd = toYmd(dateISO);
    this.logger.log(`[INFO] target date: ${dateISO}`);

    await this.raceCountRepository.connect();

    try {
      let codes = await this.raceCountRepository.findVenueCodesByDate(dateISO);

      if (codes.length === 0 && !oneVenueCode) {
        this.logger.log('[INFO] calendar に該当会場なし。終了。');
        return { total: 0, ok: 0, ng: 0, codes: [] };
      }

      if (oneVenueCode) {
        if (!codes.includes(oneVenueCode)) {
          this.logger.warn(`[WARN] calendar に ${oneVenueCode} がありませんが強制実行します`);
        }
        codes = [oneVenueCode];
      }

      this.logger.log(`[INFO] venues: ${codes.join(', ')}`);
      await this.raceCountRepository.beginTransaction();

      let ok = 0;
      let ng = 0;

      for (const code of codes) {
        try {
          const html = await this.raceListClient.fetchRaceListHtml({ dateISO, babaCode: code });
          const cnt = this.raceCountParser.parse(html);
          if (cnt === 0) throw new Error(`レース数取得失敗 (babaCode=${code}, url=${buildRaceListUrl({ dateISO, babaCode: code })})`);

          await this.raceCountRepository.saveRaceCount({
            ymd,
            venueCode: code,
            totalRaces: cnt,
          });

          this.logger.log(`[OK] ${code}: ${cnt}R`);
          ok++;

          // race_info（天候・馬場状態・距離等）を保存（失敗しても続行）
          try {
            const raceInfoList = this.raceCountParser.parseRaceInfo(html, code, ymd);
            if (raceInfoList.length > 0) {
              await this.raceCountRepository.saveRaceInfoBatch(raceInfoList);
              const knownConditions = raceInfoList.filter(r => r.trackCondition).length;
              this.logger.log(`[INFO] race_info saved: ${code} ${raceInfoList.length}R (馬場状態確定: ${knownConditions}R)`);
            }
          } catch (e2) {
            this.logger.warn(`[WARN] race_info save failed (babaCode=${code}): ${e2.message || e2}`);
          }
        } catch (e) {
          this.logger.error(`[NG] ${code}: ${e.message || e}`);
          ng++;
        }
      }

      await this.raceCountRepository.commit();
      this.logger.log(`[DONE] total=${codes.length}, ok=${ok}, ng=${ng}`);
      return { total: codes.length, ok, ng, codes };
    } catch (e) {
      try { await this.raceCountRepository.rollback(); } catch { /* ignore */ }
      throw e;
    } finally {
      try { await this.raceCountRepository.close(); } catch { /* ignore */ }
    }
  }
}

module.exports = { SaveRaceCountByDateUseCase };
