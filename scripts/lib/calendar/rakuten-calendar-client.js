'use strict';

const axios = require('axios');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36';
const HTTP_TIMEOUT_MS = 30000;
const RETRY_MAX = 3;
const RETRY_DELAY_MS = 3000;
const CALENDAR_URL = 'https://keiba.rakuten.co.jp/calendar';

class RakutenCalendarClient {
  constructor({ httpClient = axios, logger = console, sleep = ms => new Promise(r => setTimeout(r, ms)) } = {}) {
    this.httpClient = httpClient;
    this.logger = logger;
    this.sleep = sleep;
  }

  async fetchMonthlyCalendar({ year, month }) {
    const monthNum = parseInt(month, 10);
    this.logger.log(`[INFO] Rakuten カレンダー取得: ${year}-${month}`);
    this.logger.log(`[INFO] URL: ${CALENDAR_URL} (POST tYear=${year}&tMonth=${monthNum})`);

    let lastErr;
    for (let attempt = 1; attempt <= RETRY_MAX; attempt++) {
      try {
        const res = await this.httpClient.post(
          CALENDAR_URL,
          new URLSearchParams({ tYear: year, tMonth: String(monthNum) }).toString(),
          {
            headers: {
              'User-Agent':   UA,
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept':       'text/html,application/xhtml+xml,*/*;q=0.8',
              'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3',
              'Origin':       'https://keiba.rakuten.co.jp',
              'Referer':      CALENDAR_URL,
            },
            timeout: HTTP_TIMEOUT_MS,
          }
        );
        if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
        return res.data;
      } catch (e) {
        lastErr = e;
        const status = e.response?.status;
        const wait = status === 429 ? RETRY_DELAY_MS * attempt * 2 : RETRY_DELAY_MS * attempt;
        this.logger.warn(`[WARN] attempt ${attempt}/${RETRY_MAX} failed (${status || e.code || e.message}). retry in ${wait}ms...`);
        if (attempt < RETRY_MAX) await this.sleep(wait);
      }
    }
    throw lastErr;
  }
}

module.exports = { RakutenCalendarClient };
