# 馬別勝ちパターン加点ルール（horse_win_pattern_rules）

最終更新: 2026-08-17

このファイルを読めば、他のファイルを開かずに仕組み全体を把握できることを目的とする。

---

## 1. 仕組み

「特定の1頭」に対する予想加点ルールをDBで管理し、条件に一致したときだけ
コアスコアに `bonus_pct` %を加算する機構。会場全体・脚質全体にかかる
`satellites/`（[PREDICTION_SCORING.md](PREDICTION_SCORING.md) 参照）とは別枠で、
「この馬だけ」の個別事情（得意条件・馬体重帯など）を反映するためのもの。

関与ファイルは3つだけ:

| ファイル | 役割 |
|---------|------|
| `data/schema.sql`（`horse_win_pattern_rules` テーブル） | ルール定義の永続化 |
| `scripts/lib/prediction/mysql-prediction-repository.js`（`findActiveHorsePatternRules`） | レースIDから有効ルールを取得 |
| `scripts/lib/prediction/horse-pattern-factor.js`（`ruleMatches` / `buildHorsePatternScoringFactor`） | 1頭ごとに条件一致判定してボーナス計算 |

呼び出し元は `predict-race-use-case.js`。`buildHorsePatternScoringFactor(horsePatternRules)` を
`scoringFactors` に追加するだけで、他のコアファクターと同じ経路でスコアに乗る。

---

## 2. ルールを追加する方法

`data/seed-master.sql` の `horse_win_pattern_rules` INSERT 文に1行足すだけで完結する
（コード変更は不要。条件の種類を増やす場合のみ3.のカラム追加が要る）。

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

## 4. 現在登録済みのルール（seed-master.sql）

| rule_code | 馬名 | 会場 | 条件 | bonus_pct |
|-----------|------|------|------|-----------|
| `shishi_kochi_inner_type_s` | シシ | 高知(31) | 1-4枠、逃げ/先行、他に逃げ馬なし、先行勢3頭以下 | 10% |
| `honeyberry_fast_track` | ハニーベリー | 全会場 | 馬場状態=良 | 15% |
| `kenocean_oi_weight_band` | ケンオーシャン | 大井(20) | 馬体重486〜495kg | 10% |

---

## 5. テスト

- `tests/unit/prediction/horse-pattern-factor.test.js` — `ruleMatches` の条件判定単体
- `tests/unit/prediction/mysql-prediction-repository.test.js` — スキーマ互換性・SQL取得内容
- `tests/unit/prediction/predict-race-use-case.test.js` — エンドツーエンドの加点反映

ルールの条件カラムを追加した場合は、上記3ファイル＋本ドキュメントの4.表を更新すること。
