# 馬別勝ちパターン加点ルール（horse_win_pattern_rules）

最終更新: 2026-11-03

このファイルを読めば、他のファイルを開かずに仕組み全体を把握できることを目的とする。

---

## 1. 仕組み

「特定の1頭」に対する予想加点ルールをDBで管理し、条件に一致したときだけ
コアスコアに `bonus_pct` %を加算する機構。会場全体・脚質全体にかかる
`satellites/`（[PREDICTION_SCORING.md](PREDICTION_SCORING.md) 参照）とは別枠で、
「この馬だけ」の個別事情（得意条件・馬体重帯など）を反映するためのもの。
狙いは、特定の条件が揃うと回収率が跳ね上がったり大穴を開けたりする馬の要素をDBに入れ、スコアを上げること。

関与ファイルは3つだけ:

| ファイル | 役割 |
|---------|------|
| `data/schema.sql`（`horse_win_pattern_rules` テーブル） | ルール定義の永続化 |
| `scripts/lib/prediction/mysql-prediction-repository.js`（`findActiveHorsePatternRules`） | レースIDから有効ルールを取得 |
| `scripts/lib/prediction/horse-pattern-factor.js`（`ruleMatches` / `buildHorsePatternScoringFactor`） | 1頭ごとに条件一致判定してボーナス計算 |

呼び出し元は `predict-race-use-case.js`。`buildHorsePatternScoringFactor(horsePatternRules)` を
`scoringFactors` に追加するだけで、他のコアファクターと同じ経路でスコアに乗る。

運用面では次の2つもこのテーブルを参照する。

- `scripts/lib/ops/daily-health.js`: テーブルの存在を確認する
- `scripts/ops/recover-daily.js`: テーブルが無ければ作成し、`shishi_kochi_inner_type_s` を投入する（CREATE文とルールを `schema.sql` / `seed-master.sql` とは別に持っている）

---

## 2. ルールを追加する方法

次の2つを行う（コード変更は不要。条件の種類を増やす場合のみ3.のカラム追加が要る）。

1. **本番DBに同じ行を INSERT する**。これをしないとルールは効かない
2. 新規構築用に `data/seed-master.sql` の INSERT 文にも1行足す

seed が読まれるのは `node data/data_reset.js` のときだけで、バッチは読まない。`data_reset.js` は `schema.sql` の `DROP TABLE` を実行して全データを消すため、本番への反映には使わない。

追加したら `SELECT rule_code FROM horse_win_pattern_rules` で本番DBに入ったことを確認する。

```sql
('rule_code一意キー', 'ルール名', '馬名（完全一致）', 'パターン種別（任意メモ）', baba_code,
 min_frame_number, max_frame_number, JSON_ARRAY('脚質',...), JSON_ARRAY('馬場状態',...),
 max_escape_count_excluding_self, max_front_runner_count,
 min_horse_weight, max_horse_weight, bonus_pct, enabled, 'notes')
```

条件を使わない項目は `NULL` にする（NULLは「制約なし＝常に一致」を意味する）。

---

## 3. 条件カラム一覧

| カラム | 意味 | NULL時の挙動 |
|--------|------|-------------|
| `horse_name` | 対象馬名 | 必須・完全一致（`norm()`で表記ゆれ吸収） |
| `baba_code` | 競馬場コード（[VENUE_CODES.md](VENUE_CODES.md)参照。大井=20, 高知=31等） | 全会場対象 |
| `min_frame_number` / `max_frame_number` | 枠番範囲 | 制約なし |
| `target_running_styles` | 脚質配列（例 `["逃げ","先行"]`） | 全脚質対象 |
| `target_track_conditions` | 馬場状態配列（例 `["良"]`） | 全馬場対象 |
| `max_escape_count_excluding_self` | 自馬以外の逃げ馬数の上限 | 制約なし |
| `max_front_runner_count` | 逃げ+先行の総頭数上限 | 制約なし |
| `min_horse_weight` / `max_horse_weight` | 馬体重(kg)範囲 | 制約なし（片方だけの指定も可）。`racing_form.horse_weight` がnullの馬は不一致扱い |
| `bonus_pct` | コアスコアへの加点率(%)。複数ルール一致時は合算 | — |
| `enabled` | 0で無効化 | — |
| `active_from_ymd` / `active_to_ymd` | 有効期間（YYYYMMDD） | 無期限 |

---

## 4. 登録済みのルール（2026-11-03 時点）

| rule_code | 馬名 | 会場 | 条件 | bonus_pct | 本番DB |
|-----------|------|------|------|-----------|--------|
| `shishi_kochi_inner_type_s` | シシ | 高知(31) | 1-4枠、逃げ/先行、他に逃げ馬なし、先行勢3頭以下 | 10% | 登録済み |
| `honeyberry_fast_track` | ハニーベリー | 全会場 | 馬場状態=良 | 15% | 登録済み |
| `kenocean_oi_weight_band` | ケンオーシャン | 大井(20) | 馬体重486〜495kg | 10% | 登録済み（2026-11-03 に登録。それ以前のレースには未適用） |

本番DBには、ほかに期間限定のルールがある。seed には入れない。

| rule_code | 馬名 | 会場 | 有効期間 | bonus_pct |
|-----------|------|------|----------|-----------|
| `blackreishi_mombetsu_20261103` | ブラックレイシ | 門別(36) | 2026-11-03 | 50% |
| `magicalweek_mombetsu_20261103` | マジカルウィーク | 門別(36) | 2026-11-03 | 100% |
| `flaringbaron_mombetsu_20261103` | フレアリングバロン | 門別(36) | 2026-11-03 | 30% |
| `kouyudaidai_mombetsu_20261103` | コウユーダイダイ | 門別(36) | 2026-11-03 | 30% |
| `yunahawkpower_mombetsu_20261103` | ユナホークパワー | 門別(36) | 2026-11-03 | 90% |
| `missionfellow_mombetsu_20261103` | ミッションフェロー | 門別(36) | 2026-11-03 | 30% |

### 厩舎・騎手との組み合わせを指定する方法

ルールに厩舎と騎手の列は無い。ただし出走表が出れば、その日の馬の厩舎と騎手は決まる。`horse_name`、`baba_code` に加えて `active_from_ymd` と `active_to_ymd` をその開催日にすると、「馬×厩舎×騎手」を実質的に指定できる。期間が過ぎれば自動で効かなくなる。

このような買い目向けのルールは `pattern_type` を揃えておくと（例: `門別穴TYPE`）、後で成績を集計できる。

### 適用範囲

ルールに書いた条件以外に、曜日や会場の制限は無い。全レースの予想で判定し、`baba_code` が NULL のルールは全会場が対象。実際の加点は `prediction.memo` の `breakdown.horsePattern` で確認できる。

データが無いと条件を満たせない。`running_style` や `horse_weight` が NULL の馬は、その条件を指定したルールに一致しない。

---

## 5. 条件カラムを追加するときの運用ルール（重要）

2026-08-17に本ドキュメントの4章の `min_horse_weight`/`max_horse_weight` を追加した際、
`data/schema.sql`・コード・seedはpushしたが**本番DBへのALTER TABLE適用を忘れ**、
2026-08-18〜19の2日間、cronのyosou/resultバッチが `Unknown column` エラーで全滅した
（ユニットテストはDBをモックしているため、この種のズレは検知できない）。

条件カラムを追加するときは必ずこの順で行う:

1. `data/schema.sql` にカラム追加
2. **その場で本番DB（`config/config.js` が指すDB）に `ALTER TABLE` を実行**（pushより先）
3. `node scripts/ops/schema-drift-check.js` でズレが無いことを確認（`ok: true` になること）
4. コード（`mysql-prediction-repository.js` のSELECT等）・テスト・seedを更新してcommit/push

`scripts/ops/schema-drift-check.js`（ラッパーは `cron/schema-drift-check.sh`。2026-11-03 時点で crontab には未登録で、手動実行）は、
`data/schema.sql` のCREATE TABLE定義と実DBの `information_schema.COLUMNS` を突き合わせ、
ズレを検出するヘルスチェック。詳細は [spec.md](spec.md) 2.5節。

---

## 6. テスト

- `tests/unit/prediction/horse-pattern-factor.test.js` — `ruleMatches` の条件判定単体
- `tests/unit/prediction/mysql-prediction-repository.test.js` — スキーマ互換性・SQL取得内容
- `tests/unit/prediction/predict-race-use-case.test.js` — エンドツーエンドの加点反映
- `tests/unit/ops/schema-drift-check.test.js` — schema.sqlパース・実DB照合ロジック単体（実DBそのものへの疎通は`node scripts/ops/schema-drift-check.js`で確認）

ルールの条件カラムを追加した場合は、上記4ファイル＋本ドキュメントの4.表を更新すること。
追加後は5章の手順（本番DBへのALTER TABLE適用→schema-drift-checkでの確認）を必ず実施すること。
