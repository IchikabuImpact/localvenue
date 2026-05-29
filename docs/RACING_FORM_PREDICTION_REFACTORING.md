# 004/005 出馬表保存・予想生成リファクタリングメモ

最終更新: 2026-05-29

## 目的

`004-racing-form-to-db.js` と `005-predict-race.js` の既存CLI契約を保ったまま、DDD / Onion Architecture に寄せる第一段階を実施した。

## 保持する外部契約

```bash
node scripts/004-racing-form-to-db.js YYYYMMDDRRBB
node scripts/005-predict-race.js YYYYMMDDRRBB
```

## 変更後の構造

```text
scripts/lib/racing-form/
  race-id.js
  deba-table-url.js
  keiba-deba-table-client.js
  racing-form-parser.js
  mysql-racing-form-repository.js
  save-racing-form-use-case.js

scripts/lib/prediction/
  race-id.js
  scoring.js
  mysql-prediction-repository.js
  predict-race-use-case.js
```

## レイヤー対応

| 層 | 004 | 005 |
|---|---|---|
| Interface / CLI | `004-racing-form-to-db.js` | `005-predict-race.js` |
| Application | `SaveRacingFormUseCase` | `PredictRaceUseCase` |
| Domain helper | `race-id.js`, `deba-table-url.js` | `race-id.js`, `scoring.js` |
| Infrastructure HTTP | `KeibaDebaTableClient` | なし |
| Infrastructure Parser | `RacingFormParser` | なし |
| Infrastructure DB | `MySqlRacingFormRepository` | `MySqlPredictionRepository` |

## schema.sql との照合結果

- 004 は `racing_form` の既存カラム `race_id`, `frame_number`, `horse_number`, `horse_name`, `sex_age`, `hair`, `birthyear`, `birthymonth`, `sire`, `dam`, `broodmare_sire`, `jockey_name`, `affiliation`, `carried_weight`, `trainer_name`, `owner`, `breeder` へ保存する。
- `racing_form` の主キーは `(race_id, horse_number)` で、既存通り同一 `race_id` を削除してから upsert する。
- 005 は `prediction (race_id, model_version, memo)` へ保存し、`uq_prediction_race_model (race_id, model_version)` による upsert を維持する。

これらは `tests/unit/racing-form/mysql-racing-form-repository.test.js` と `tests/unit/prediction/mysql-prediction-repository.test.js` で `data/schema.sql` と静的照合する。

## Unit Test の対象

- 004
  - race_id 分解
  - DebaTable URL生成
  - DebaTable 5行ブロック parser
  - racing_form 保存SQLとパラメータ順
  - use case の取得→パース→保存フロー
- 005
  - custom score
  - jockey/trainer/sire score 照合
  - best horse 選定
  - prediction repository SQL契約
  - use case の取得→計算→保存フロー

## まだ Integration / Smoke Test に回すもの

- keiba.go.jp DebaTable への実HTTP
- MySQL実DBへの `racing_form` / `prediction` 保存
- `daily-yosou-batch.js` からの 004/005 並列実行
