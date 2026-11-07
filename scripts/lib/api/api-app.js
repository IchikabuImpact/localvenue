'use strict';

const express = require('express');
const {
  USAGE,
  buildDayListText,
  buildRaceId,
  buildRacecardText,
  parseRacecardQuery,
} = require('./racecard-text');

// 日本語を \u に変換せず UTF-8 のまま返す。charset を明示してブラウザでも文字化けしないようにする
function sendJson(res, status, body) {
  res.status(status);
  res.set('Content-Type', 'application/json; charset=utf-8');
  res.set('Cache-Control', 'no-store');
  res.send(Buffer.from(JSON.stringify(body, null, 2) + '\n', 'utf8'));
}

function sendText(res, status, text) {
  res.status(status);
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.set('Cache-Control', 'no-store');
  res.send(Buffer.from(text, 'utf8'));
}

function wantsText(req) {
  return String(req.query.format || '').toLowerCase() === 'text';
}

function usageResponse(res, req, status = 200, error = null) {
  if (wantsText(req)) return sendText(res, status, (error ? `エラー: ${error}\n\n` : '') + USAGE + '\n');
  return sendJson(res, status, { ok: !error, ...(error ? { error } : {}), usage: USAGE });
}

/**
 * @param {{ repository: import('./racecard-repository').RacecardRepository, logger?: Console }} deps
 */
function createApiApp({ repository, logger = console }) {
  const app = express();
  app.disable('x-powered-by');

  app.get('/', (req, res) => usageResponse(res, req));

  app.get('/racecard', async (req, res) => {
    try {
      if (!req.query.date && !req.query.baba && !req.query.race) return usageResponse(res, req);
      const venues = await repository.findVenues();
      const q = parseRacecardQuery(req.query, venues);
      if (!q.ok) return usageResponse(res, req, 400, q.error);

      if (q.babaCode === null) {
        const races = await repository.findDayRaces(q.date);
        const text = buildDayListText(q.date, races);
        if (wantsText(req)) return sendText(res, 200, text);
        return sendJson(res, 200, { ok: true, date: q.date, races, text });
      }

      const raceId = buildRaceId(q.date, q.babaCode, q.raceNo);
      const venue = venues.find((v) => v.code === q.babaCode).name;
      const race = await repository.findRace(raceId, q.babaCode);
      if (!race) {
        const day = (await repository.findDayRaces(q.date)).filter((r) => r.babaCode === q.babaCode);
        const error = day.length
          ? `${venue}${q.raceNo}R の出馬表はありません。この日の${venue}は ${day.map((r) => `${r.raceNo}R`).join(', ')} です`
          : `${q.date} の${venue}の出馬表はありません。date だけを指定すると、その日の開催の一覧が見られます`;
        if (wantsText(req)) return sendText(res, 404, `エラー: ${error}\n`);
        return sendJson(res, 404, { ok: false, error, race_id: raceId });
      }

      const text = buildRacecardText({ raceId, date: q.date, babaCode: q.babaCode, venue, raceNo: q.raceNo, ...race });
      if (wantsText(req)) return sendText(res, 200, text);
      return sendJson(res, 200, {
        ok: true,
        race_id: raceId,
        date: q.date,
        baba_code: q.babaCode,
        venue,
        race_no: q.raceNo,
        race_title: race.info?.race_title ?? null,
        horse_count: race.horses.length,
        text,
      });
    } catch (e) {
      logger.error('[api] /racecard failed:', e);
      if (wantsText(req)) return sendText(res, 500, 'エラー: サーバーで問題が起きました\n');
      return sendJson(res, 500, { ok: false, error: 'サーバーで問題が起きました' });
    }
  });

  app.use((req, res) => usageResponse(res, req, 404, `${req.path} はありません`));

  return app;
}

module.exports = { createApiApp, sendJson, sendText };
