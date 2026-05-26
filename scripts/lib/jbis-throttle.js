/**
 * @file  scripts/lib/jbis-throttle.js
 * @role  JBIS へのHTTPリクエストをキュー的に制御するスロットルモジュール
 *
 * 設計:
 *   - 状態管理: /tmp/jbis-throttle.json（軽量・使い捨て・再起動で自動リセット）
 *   - リクエスト履歴: MySQL external_request_log テーブル（監査ログ）
 *   - レート制限: MIN_INTERVAL_MS(7秒) + ランダムジッター(0〜2秒)
 *     → 最速でも約7〜9秒間隔 ≒ 最大8リクエスト/分（< 10/分を保証）
 *
 * 使い方:
 *   const { waitForRateLimit, logRequest } = require('./lib/jbis-throttle');
 *
 *   await waitForRateLimit();           // リクエスト前に必ず呼ぶ
 *   const html = await fetchHtml(url);  // 実際のHTTPリクエスト
 *   await logRequest(url);              // リクエスト記録（失敗でも呼ぶ）
 *
 * @copyright © 2026 IchikabuImpact
 */

'use strict';

const fs     = require('fs');
const path   = require('path');
const mysql  = require('mysql2/promise');

// -------- 定数 --------
const SERVICE        = 'jbis';
const MIN_INTERVAL_MS = 7000;  // 最低間隔: 7秒
const JITTER_MAX_MS   = 2000;  // ランダム上乗せ: 0〜2秒（WAF対策）
const STATE_FILE      = '/tmp/jbis-throttle.json';  // 使い捨て状態ファイル

// -------- 状態ファイル読み書き --------
function readState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    }
  } catch { /* ファイルが壊れていたら無視して初期値を使う */ }
  return { lastRequestAt: 0, totalCount: 0 };
}

function writeState(state) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state), 'utf8');
  } catch (e) {
    console.warn(`[throttle] 状態ファイル書き込み失敗（無視）: ${e.message}`);
  }
}

// -------- コアロジック --------
/**
 * レート制限を適用して待機する。
 * リクエスト直前に await waitForRateLimit() を呼ぶこと。
 */
async function waitForRateLimit() {
  const state   = readState();
  const elapsed = Date.now() - state.lastRequestAt;
  const jitter  = Math.floor(Math.random() * JITTER_MAX_MS);
  const wait    = Math.max(0, (MIN_INTERVAL_MS + jitter) - elapsed);

  if (wait > 0) {
    console.log(
      `[throttle] JBIS レート制限: ${wait}ms 待機 ` +
      `(前回リクエストから ${elapsed}ms 経過, jitter=${jitter}ms)`
    );
    await new Promise(r => setTimeout(r, wait));
  }

  // 状態更新（HTTPリクエスト直前のタイムスタンプを記録）
  writeState({
    lastRequestAt: Date.now(),
    totalCount: (state.totalCount || 0) + 1,
  });
}

/**
 * リクエスト実行後に MySQL へ履歴を記録する。
 * @param {string} url  リクエストした URL
 * @param {boolean} success  成功フラグ（デフォルト true）
 */
async function logRequest(url, success = true) {
  let conn;
  try {
    const config = require('../../config/config.js');
    conn = await mysql.createConnection({
      host:     config.mysql.host     || 'localhost',
      user:     config.mysql.user,
      password: config.mysql.password,
      port:     config.mysql.port     || 3306,
      database: config.mysql.database,
      charset:  'utf8mb4',
    });
    await conn.execute(
      `INSERT INTO external_request_log (service, url, success) VALUES (?, ?, ?)`,
      [SERVICE, url, success ? 1 : 0]
    );
  } catch (e) {
    // ログ記録失敗はバッチ全体を止めない（警告のみ）
    console.warn(`[throttle] ログDB記録失敗（無視）: ${e.message}`);
  } finally {
    if (conn) { try { await conn.end(); } catch { /* ignore */ } }
  }
}

/**
 * 状態ファイルの内容をデバッグ表示する（任意）。
 */
function showState() {
  const s = readState();
  console.log(
    `[throttle] 状態: lastRequestAt=${new Date(s.lastRequestAt).toISOString()} ` +
    `totalCount=${s.totalCount}`
  );
}

module.exports = { waitForRateLimit, logRequest, showState, MIN_INTERVAL_MS, JITTER_MAX_MS };
