// list-race-ids.js
// 使い方: node list-race-ids.js 20251013
// 目的: save-race-count-by-date.js が入れた「本日の開催(会場ごとのレース数)」をDBから読み、
//       あなたのRACEID規則に従って 1RACEID/行 で標準出力へ出す。
//       ★下はダミー実装。実DBのquery・RACEID生成ロジックに置き換えてください。

const day = process.argv[2];
if (!/^\d{8}$/.test(day)) {
  console.error('Usage: node list-race-ids.js YYYYMMDD');
  process.exit(1);
}

// ▼ここでDB接続して、本日の (venue_code, total_races) を取得する
//   例: SELECT venue_code, total_races FROM race_count_by_date WHERE ymd = ?;
async function fetchVenueRaceCounts(ymd) {
  // TODO: 実装
  // 例として2会場×各12Rのダミー
  return [
    { venue_code: '01', total_races: 12 },
    { venue_code: '03', total_races: 12 },
  ];
}

// ▼あなたのRACEID規則に合わせて生成してください。
//   ここでは「YYYYMMDD + venue(2桁) + raceNo(2桁)」 → 202510130131 形式の例
function makeRaceId(ymd, venue, rno) {
  const rr = String(rno).padStart(2, '0');
  return `${ymd}${venue}${rr}`;
}

(async () => {
  const rows = await fetchVenueRaceCounts(day);

  for (const { venue_code, total_races } of rows) {
    for (let r = 1; r <= total_races; r++) {
      console.log(makeRaceId(day, venue_code, r));
    }
  }
})();
