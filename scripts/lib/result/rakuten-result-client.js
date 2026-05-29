'use strict';

const axios = require('axios').default;
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari';
const HTTP_TIMEOUT_MS = 20000;

class RakutenResultClient {
  constructor({ httpClient = axios } = {}) { this.httpClient = httpClient; }
  async fetchHtml(url) {
    const res = await this.httpClient.get(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'ja,en;q=0.9' }, timeout: HTTP_TIMEOUT_MS });
    return res.data;
  }
}

module.exports = { RakutenResultClient };
