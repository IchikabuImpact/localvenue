'use strict';

const mysql = require('mysql2/promise');

async function bulkInsertOrUpdate(conn, table, cols, rows, onDupCols) {
  if (!rows.length) return;
  const placeholders = rows.map(() => '(' + cols.map(() => '?').join(',') + ')').join(',');
  const params = rows.flatMap(r => cols.map(c => r[c]));
  const onDup = onDupCols.map(c => `${c}=VALUES(${c})`).join(', ');
  const sql = `INSERT INTO ${table} (${cols.join(',')}) VALUES ${placeholders} ON DUPLICATE KEY UPDATE ${onDup}`;
  await conn.execute(sql, params);
}

class MySqlResultRepository {
  constructor({ mysqlConfig, mysqlClient = mysql }) { this.mysqlConfig = mysqlConfig; this.mysqlClient = mysqlClient; this.conn = null; }
  async connect() {
    this.conn = await this.mysqlClient.createConnection({ host: this.mysqlConfig.host || 'localhost', user: this.mysqlConfig.user, password: this.mysqlConfig.password, port: this.mysqlConfig.port, database: this.mysqlConfig.database || 'localkeiba', charset: 'utf8mb4' });
  }
  async close() { if (this.conn) await this.conn.end(); }
  async save({ raceId, rows, payouts }) {
    const resultCols = ['race_id', 'frame_number', 'horse_number', 'horse_name', 'official_finish_position', 'dead_heat_group', 'dead_heat_order_in_group', 'finish_time', 'margin', 'jockey_name', 'odds_final', 'prize', 'disqualified', 'notes'];
    const resultRows = rows.map(r => ({ race_id: raceId, frame_number: r.frame_number ?? null, horse_number: r.horse_number, horse_name: r.horse_name ?? null, official_finish_position: r.official_finish_position, dead_heat_group: r.dead_heat_group ?? null, dead_heat_order_in_group: r.dead_heat_order_in_group ?? null, finish_time: r.finish_time ?? null, margin: r.margin ?? null, jockey_name: r.jockey_name ?? null, odds_final: r.odds_final ?? null, prize: r.prize ?? null, disqualified: r.disqualified ? 1 : 0, notes: r.notes ?? null }));
    await bulkInsertOrUpdate(this.conn, 'race_results', resultCols, resultRows, ['frame_number', 'horse_name', 'official_finish_position', 'dead_heat_group', 'dead_heat_order_in_group', 'finish_time', 'margin', 'jockey_name', 'odds_final', 'prize', 'disqualified', 'notes']);
    if (payouts.length) {
      const payoutCols = ['race_id', 'bet_type', 'horse_number', 'payout', 'popularity'];
      const payoutRows = payouts.map(p => ({ race_id: raceId, bet_type: p.bet_type, horse_number: p.horse_number, payout: p.payout ?? null, popularity: p.popularity ?? null }));
      await bulkInsertOrUpdate(this.conn, 'race_payouts', payoutCols, payoutRows, ['payout', 'popularity']);
    }
  }
}
module.exports = { MySqlResultRepository, bulkInsertOrUpdate };
