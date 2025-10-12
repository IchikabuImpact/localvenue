// api-sire-score.js
const express = require('express');
const mysql = require('mysql2/promise');
const config = require('./config.js');

const app = express();
const pool = mysql.createPool({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  port: config.mysql.port,
  waitForConnections: true,
  connectionLimit: 8,
});

// GET /api/sire-score?distance=1300&sire_id=0001028940
// もしくは /api/sire-score?distance=1300&sire_name=ヘニーヒューズ
app.get('/api/sire-score', async (req, res) => {
  try {
    const distance = Number(req.query.distance);
    const sireId = (req.query.sire_id || '').trim();
    const sireName = (req.query.sire_name || '').trim();

    if (!Number.isFinite(distance) || (!sireId && !sireName)) {
      return res.status(400).json({ error: 'distance と sire_id か sire_name のどちらかが必要です' });
    }

    const conn = await pool.getConnection();
    try {
      let row;
      if (sireId) {
        [ [row] ] = await conn.query(
          'SELECT distance_m, sire_id, sire_name, score FROM sire_ranking WHERE distance_m=? AND sire_id=?',
          [distance, sireId]
        );
      } else {
        // 名前で引く場合は完全一致→なければ前方一致の順
        const [rowsExact] = await conn.query(
          'SELECT distance_m, sire_id, sire_name, score FROM sire_ranking WHERE distance_m=? AND sire_name=? LIMIT 1',
          [distance, sireName]
        );
        row = rowsExact[0];
        if (!row) {
          const [rowsLike] = await conn.query(
            'SELECT distance_m, sire_id, sire_name, score FROM sire_ranking WHERE distance_m=? AND sire_name LIKE ? ORDER BY score DESC LIMIT 1',
            [distance, `${sireName}%`]
          );
          row = rowsLike[0];
        }
      }
      if (!row) return res.status(404).json({ error: 'not found' });
      res.json(row);
    } finally {
      conn.release();
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'internal error' });
  }
});

app.listen(3080, () => console.log('sire-score API listening on :3080'));
