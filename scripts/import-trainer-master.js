#!/usr/bin/env node
/**
 * import-trainer-master.js
 * JBIS のリーディングトレーナーCSV（leadingTrainer.csv）から調教師マスター（trainer_master）を作り、
 * 出馬表の略称（racing_form.trainer_name）との対応（trainer_alias）を作り直す。
 *
 * Usage:
 *   node scripts/import-trainer-master.js <leadingTrainer.csv> [--dry-run]
 *
 * - CSV は JBIS からダウンロードしたもの（Shift_JIS）でも、UTF-8 に変換したものでもよい
 * - trainer_master はフルネーム＋所属で UPSERT する（CSV に無い調教師は消さない）
 * - trainer_alias は match_method='manual' の行を残し、それ以外を作り直す
 * - 予想のバッチはこのテーブルを使わない（ブログ・分析用）
 *
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

'use strict';

const fs = require('fs');
const iconv = require('iconv-lite');
const mysql = require('mysql2/promise');
const config = require('../config/config.js');
const { parseTrainerRankingCsv } = require('./lib/ranking/jbis-ranking');
const { courseOfAffiliation, matchAliases } = require('./lib/trainer/trainer-master');

function decodeCsv(buf) {
  const utf8 = buf.toString('utf8');
  return utf8.includes('調教師名') ? utf8 : iconv.decode(buf, 'CP932');
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) {
    console.error('Usage: node scripts/import-trainer-master.js <leadingTrainer.csv> [--dry-run]');
    process.exit(1);
  }

  const rows = parseTrainerRankingCsv(decodeCsv(fs.readFileSync(file)));
  if (!rows.length) throw new Error('CSV から調教師を1人も読めませんでした');
  console.log(`[INFO] CSV ${rows.length}人 ${dryRun ? '(dry-run: DBに書き込まない)' : ''}`);

  const pool = mysql.createPool(config.mysql);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    for (const r of rows) {
      await conn.execute(
        `INSERT INTO trainer_master (full_name, affiliation, course, source)
         VALUES (?, ?, ?, 'jbis_csv')
         ON DUPLICATE KEY UPDATE course = VALUES(course)`,
        [r.trainerName, r.affiliation || '', courseOfAffiliation(r.affiliation)]
      );
    }

    const [masterRows] = await conn.query('SELECT trainer_id, full_name, affiliation, course FROM trainer_master');
    const masters = masterRows.map((m) => ({ trainerId: m.trainer_id, fullName: m.full_name, affiliation: m.affiliation, course: m.course }));

    const [formRows] = await conn.query(
      `SELECT trainer_name, RIGHT(CAST(race_id AS CHAR), 2) AS bb, COUNT(*) AS n
         FROM racing_form
        WHERE trainer_name IS NOT NULL AND trainer_name <> ''
        GROUP BY trainer_name, bb`
    );
    const byShort = new Map();
    for (const r of formRows) {
      if (!byShort.has(r.trainer_name)) byShort.set(r.trainer_name, { shortName: r.trainer_name, venueCounts: {}, starts: 0 });
      const t = byShort.get(r.trainer_name);
      t.venueCounts[r.bb] = Number(r.n);
      t.starts += Number(r.n);
    }

    const [manualRows] = await conn.query(`SELECT short_name FROM trainer_alias WHERE match_method = 'manual'`);
    const skip = new Set(manualRows.map((r) => r.short_name));

    const { aliases, unresolved } = matchAliases({ masters, shortNames: [...byShort.values()], skip });

    await conn.query(`DELETE FROM trainer_alias WHERE match_method <> 'manual'`);
    for (const a of aliases) {
      await conn.execute(
        'INSERT INTO trainer_alias (short_name, trainer_id, course, match_method) VALUES (?, ?, ?, ?)',
        [a.shortName, a.trainerId, a.course, a.matchMethod]
      );
    }

    if (dryRun) await conn.rollback();
    else await conn.commit();

    const count = (m) => aliases.filter((a) => a.matchMethod === m).length;
    const linkedNames = new Set([...aliases.map((a) => a.shortName), ...skip]);
    const linkedStarts = [...linkedNames].reduce((s, n) => s + (byShort.get(n)?.starts || 0), 0);
    const totalStarts = [...byShort.values()].reduce((s, t) => s + t.starts, 0);
    console.log(`[OK] trainer_master ${masters.length}人 / 出馬表の略称 ${byShort.size}件（手動 ${skip.size}件は据え置き）`);
    console.log(`[OK] trainer_alias ${aliases.length}件: 完全一致 ${count('exact')} / 前方一致 ${count('prefix')} / 文字の順 ${count('subsequence')}`);
    console.log(`[OK] 結び付いた出走 ${linkedStarts} / ${totalStarts}（${(linkedStarts / totalStarts * 100).toFixed(1)}%）`);
    if (unresolved.length) {
      console.log(`[WARN] 結び付かなかった略称 ${unresolved.length}件（手動で trainer_alias に match_method='manual' で入れられます）`);
      unresolved.sort((a, b) => (b.starts || 0) - (a.starts || 0)).forEach((u) =>
        console.log(`  ${u.shortName}（${u.starts}走）候補: ${u.candidates.join(', ') || 'なし'}`)
      );
    }
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
    await pool.end();
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error('[FATAL]', e.message || e);
    process.exit(1);
  });
}

module.exports = { decodeCsv };
