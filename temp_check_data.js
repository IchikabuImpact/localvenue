const mysql = require('mysql2/promise');
const config = require('./config/config.js');

(async () => {
    const conn = await mysql.createConnection(config.mysql);
    const [cRows] = await conn.execute(
        'SELECT * FROM race_count_by_date WHERE ymd = "20260201"'
    );
    console.log('--- RACE COUNT BY DATE ---');
    console.log(JSON.stringify(cRows, null, 2));

    const [rRows] = await conn.execute(
        'SELECT race_id, horse_number, horse_name FROM racing_form WHERE race_id IN ("202602010131", "202602010132")'
    );
    console.log('--- RACING FORM ---');
    console.log(JSON.stringify(rRows, null, 2));

    const [pRows] = await conn.execute(
        'SELECT race_id, model_version, memo FROM prediction WHERE race_id IN ("202602010131", "202602010132")'
    );
    console.log('--- PREDICTION ---');
    console.log(JSON.stringify(pRows, null, 2));
    await conn.end();
})();
