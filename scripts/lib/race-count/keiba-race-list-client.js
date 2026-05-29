'use strict';

const axios = require('axios');
const { buildRaceListUrl } = require('./race-list-url');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36';
const HTTP_TIMEOUT_MS = 20000;
const RETRY_MAX = 3;
const RETRY_DELAY_MS = 2000;

class KeibaRaceListClient {
  constructor({ httpClient = axios, logger = console, sleep = ms => new Promise(r => setTimeout(r, ms)) } = {}) {
    this.httpClient = httpClient;
    this.logger = logger;
    this.sleep = sleep;
  }

  async fetchRaceListHtml({ dateISO, babaCode }) {
    const url = buildRaceListUrl({ dateISO, babaCode });
    let lastErr;

    for (let attempt = 1; attempt <= RETRY_MAX; attempt++) {
      try {
        const res = await this.httpClient.get(url, {
          headers: {
            'User-Agent':      UA,
            'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3',
            'Accept-Encoding': 'gzip, deflate, br',
          },
          timeout: HTTP_TIMEOUT_MS,
          decompress: true,
        });
        if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
        return res.data;
      } catch (e) {
        lastErr = e;
        const status = e.response?.status;
        const wait = status === 429 ? RETRY_DELAY_MS * attempt * 2 : RETRY_DELAY_MS * attempt;
        this.logger.warn(`  [WARN] attempt ${attempt}/${RETRY_MAX} failed (${status || e.code || e.message}), retry in ${wait}ms...`);
        if (attempt < RETRY_MAX) await this.sleep(wait);
      }
    }

    throw lastErr;
  }
}

module.exports = { KeibaRaceListClient };
