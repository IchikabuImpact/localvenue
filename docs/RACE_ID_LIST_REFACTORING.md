# 003 race_id 一覧出力リファクタリングメモ

最終更新: 2026-05-29

## 目的

`003-list-race-ids.js` の既存の呼び出し方と stdout 契約を保ったまま、`001` / `002` と同じく DDD / Onion Architecture に寄せるための第一段階を実施した。

このスクリプトはバッチ間のパイプ連携に使われるため、特に以下を重視する。

1. `stdout` には race_id だけを1行1件で出す。
2. Usage / warning / fatal は従来通り `stderr` に出す。
3. `node scripts/003-list-race-ids.js YYYYMMDD` のCLI契約を壊さない。

## 保持する外部契約

```bash
node scripts/003-list-race-ids.js YYYYMMDD
```

出力形式は引き続き以下である。

```text
YYYYMMDDRRBB
```

- `YYYYMMDD`: 対象日
- `RR`: 2桁レース番号
- `BB`: 2桁NAR会場コード

## 変更後の構造

```text
scripts/
  003-list-race-ids.js

scripts/lib/race-id/
  validate-ymd.js
  race-id-generator.js
  mysql-race-id-repository.js
  list-race-ids-use-case.js

tests/unit/race-id/
  validate-ymd.test.js
  race-id-generator.test.js
  mysql-race-id-repository.test.js
  list-race-ids-use-case.test.js
```

## レイヤー対応

| 層 | 今回のファイル | 役割 |
|---|---|---|
| Interface / CLI | `scripts/003-list-race-ids.js` | 既存CLI契約と stdout 契約を維持する thin entrypoint |
| Application | `list-race-ids-use-case.js` | DB取得 → race_id生成 → output への出力 |
| Domain helper | `validate-ymd.js`, `race-id-generator.js` | `YYYYMMDD`検証と race_id 生成規則 |
| Infrastructure DB | `mysql-race-id-repository.js` | `race_count_by_date` から `venue_code`, `total_races` を取得 |

## schema.sql との照合結果

`MySqlRaceIdRepository` は `race_count_by_date` から以下を取得する。

```sql
SELECT venue_code, total_races
FROM race_count_by_date
WHERE ymd = ?
ORDER BY venue_code
```

`data/schema.sql` 上でも以下の定義と整合している。

- `ymd` は `char(8) NOT NULL`
- `venue_code` は `varchar(4) NOT NULL`
- `total_races` は `int NOT NULL`
- 主キーは `(ymd, venue_code)`

この照合は `tests/unit/race-id/mysql-race-id-repository.test.js` で実DBなしに検証する。

## Unit Test の対象

DBを使わずに、以下を `node:test` で固定した。

- `parseYmdArg` / `isValidYmd`
  - `YYYYMMDD` のみ許可
  - 不正値は Usage エラー
- `generateRaceIdsForVenue` / `generateRaceIds`
  - `YYYYMMDD + RR + BB` 形式
  - レース番号と会場コードのゼロ埋め
  - `total_races` が0または不正な場合は空
- `ListRaceIdsUseCase`
  - DB取得順に race_id を output へ流す
  - データなしの場合は警告して正常終了
- `MySqlRaceIdRepository`
  - `schema.sql` との静的互換
  - fake MySQL client による SELECT SQL 契約

## まだ Integration / Smoke Test に回すもの

- 実DBの `race_count_by_date` からの取得
- `node scripts/003-list-race-ids.js YYYYMMDD` の実行
- `daily-yosou-batch.js` / `daily-result-batch.js` からのパイプ連携確認

この環境では `config/config.js` と MySQL client が無いため、実DB照合は行わず、schema とSQL契約の静的検証までを対象にする。
