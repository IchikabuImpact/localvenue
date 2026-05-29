# 002 会場別レース数取得リファクタリングメモ

最終更新: 2026-05-29

## 目的

`002-save-race-count-by-date.js` の既存の呼び出し方を保ったまま、`001` と同じく DDD / Onion Architecture に寄せるための第一段階を実施した。

今回のゴールは以下の2点。

1. `daily-yosou-batch.js` からの既存呼び出しと手動実行のCLI契約を壊さない。
2. 日付正規化、RaceList HTMLのレース数抽出、use case の流れ、DB保存SQL契約を Unit Test で固定する。

## 保持する外部契約

以下の呼び出しは継続して有効である。

```bash
node scripts/002-save-race-count-by-date.js 20251116
node scripts/002-save-race-count-by-date.js 2025-09-14
node scripts/002-save-race-count-by-date.js
node scripts/002-save-race-count-by-date.js 20251116 31
```

## 変更後の構造

```text
scripts/
  002-save-race-count-by-date.js

scripts/lib/race-count/
  normalize-date-arg.js
  parse-one-code.js
  race-list-url.js
  keiba-race-list-client.js
  race-count-parser.js
  mysql-race-count-repository.js
  save-race-count-by-date-use-case.js

tests/unit/race-count/
  normalize-date-arg.test.js
  race-count-parser.test.js
  mysql-race-count-repository.test.js
  save-race-count-by-date-use-case.test.js
```

## レイヤー対応

| 層 | 今回のファイル | 役割 |
|---|---|---|
| Interface / CLI | `scripts/002-save-race-count-by-date.js` | 既存CLI契約を維持する薄い entrypoint |
| Application | `save-race-count-by-date-use-case.js` | calendar会場取得 → RaceList取得 → レース数解析 → DB保存 |
| Domain helper | `normalize-date-arg.js`, `parse-one-code.js`, `race-list-url.js` | 日付正規化、強制会場コード解釈、URL生成 |
| Infrastructure HTTP | `keiba-race-list-client.js` | keiba.go.jp RaceList HTML取得 |
| Infrastructure Parser | `race-count-parser.js` | RaceList HTMLから最大レース番号を抽出 |
| Infrastructure DB | `mysql-race-count-repository.js` | `calendar` 読み込み、`race_cnt` / `race_count_by_date` 保存 |

## schema.sql との照合結果

今回の `MySqlRaceCountRepository` は以下を行う。

1. `calendar (race_date, venucode)` から対象日の会場コードを取得する。
2. 互換用テーブル `race_cnt (id, cnt)` へ upsert する。
3. 正テーブル `race_count_by_date (ymd, venue_code, total_races)` へ upsert する。

`data/schema.sql` 上でも以下の定義と整合している。

- `race_cnt.id` は `varchar(10) NOT NULL`
- `race_cnt.cnt` は `int NOT NULL`
- `race_cnt` の主キーは `id`
- `race_count_by_date.ymd` は `char(8) NOT NULL`
- `race_count_by_date.venue_code` は `varchar(4) NOT NULL`
- `race_count_by_date.total_races` は `int NOT NULL`
- `race_count_by_date` の主キーは `(ymd, venue_code)`

この照合は `tests/unit/race-count/mysql-race-count-repository.test.js` で実DBなしに検証する。

## Unit Test の対象

DBや実HTTPを使わずに、以下を `node:test` で固定した。

- `normalizeDateArg`
  - `YYYYMMDD`
  - `YYYY-MM-DD`
  - 引数なしのJST今日
  - 不正形式
- `parseOneVenueCode`
  - 1〜3桁数値
  - 不正値は `null`
- `parseRaceCountFromRaceListHtml`
  - `href` の `k_raceNo` から最大レース番号を抽出
  - `NR` / `NＲ` テキストによるフォールバック
  - 未検出時は `0`
- `SaveRaceCountByDateUseCase`
  - calendar会場ごとの取得/保存
  - 1会場強制実行
  - calendarに会場がない場合の早期終了
- `MySqlRaceCountRepository`
  - `schema.sql` との静的互換
  - fake MySQL client による SQL 契約

## まだ Integration / Smoke Test に回すもの

- 実DBに対する `INSERT ... ON DUPLICATE KEY UPDATE`
- keiba.go.jp への実HTTP疎通
- `node scripts/002-save-race-count-by-date.js YYYYMMDD` の実行

この環境では `config/config.js` と MySQL client が無いため、実DB照合は行わず、schema とSQL契約の静的検証までを対象にする。
