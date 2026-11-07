# 予想スコアリング設計書

最終更新: 2026-11-03

---

## 1. モデル名

`yosou-v1`（`MODEL_VERSION` 定数、`scripts/lib/prediction/scoring.js`）

---

## 2. スコア構成

計算順序（`calculatePrediction`）:

```
coreScore = 騎手 + 調教師 + 種牡馬 + カスタム + 若駒レース補正
total     = coreScore + 期間限定ボーナス + 馬別ルール + サテライト（capPct があれば coreScore の%で上限）
score     = round(total × 夏季馬体重倍率)
```

### コアファクター

| ファクター | ソース | 取得方法 | スコアレンジ |
|-----------|--------|---------|------------|
| 騎手スコア（jockey） | `jockey_ranking` | 名前頭3文字で前方一致 | 1〜100 |
| 調教師スコア（trainer） | `trainer_ranking` | 名前前方一致 + クラス乗数 | 実質0〜100 |
| 種牡馬スコア（sire） | `sire_ranking` | 名前前方一致（馬場状態・距離別） | 0〜100 |
| カスタム（custom） | 馬番・年齢 | 偶数馬番=馬番値加算、年齢2歳+40/3歳+30/4歳+20 | 0〜60 |
| 若駒レース補正（youngSireBoost / juvenileSireRankingBonus） | `sire_ranking`, `juvenile_sire_ranking` | 若駒レースのみ、種牡馬スコアの30% + 2歳種牡馬スコアの15% | 可変 |

若駒レースは「出走馬の6割以上が3歳以下」またはレース名に `2歳` / `3歳` / `新馬` を含むレース。割合は `config/scoring/default.json` の `youngRace` で設定する。

### 期間限定ボーナス（設定ファイル）

`config/scoring/default.json` の `summerBonus` で定義し、`startYmd`〜`endYmd` のレースだけ、コアスコアの%を加算する。設定は `scoring.js` の `DEFAULT_SCORING_CONFIG` に上書きマージされ、ファイルが読めない場合や検証に失敗した場合はエラーで停止する（`config.scoringConfigPath` で読み込み先を変更可）。

| ファクター | 条件 |
|-----------|------|
| summerSire | 父が対象血統（良/稍重と重/不良で別リスト） |
| summerBroodmareSire | 母父が対象血統（良/稍重と重/不良で別リスト） |
| summerDamFamily | 母が対象牝系 |
| summerWeightAllowance | 斤量がレース最大より2kg以上軽く、馬体重450kg以下の牝馬または3歳牝馬 |

現在の期間は 2026-07-01〜2026-09-30 のため、2026-11-03 時点では無効。来年も使う場合は期間の更新が必要。

### 馬別ルール（DB）

`horse_win_pattern_rules` の条件に一致した馬に加点する。詳細は [HORSE_PATTERN_RULES.md](HORSE_PATTERN_RULES.md)。

### サテライトファクター（プラグイン型）

ファイルは `scripts/lib/prediction/satellites/` に置く。
各ファイルは `{ name, bonuses: Map<horse_number, score> }` を返す関数を export する。
ON/OFF は `predict-race-use-case.js` の `satellites` 配列への追加・削除で制御。

| ファクター | ファイル | ボーナス | capPct | 条件 |
|-----------|---------|---------|--------|------|
| ImprovementFactor | `satellites/improvement-factor.js` | +15 | なし | 前走より着順が1以上改善 |
| WetTrackFactor    | `satellites/wet-track-factor.js`   | 条件別sireスコア − allスコアの差分 | 10% | 馬場状態が重または不良のとき |
| DistanceFactor    | `satellites/distance-factor.js`    | +20 | 10% | 今走と同距離で1着実績あり |
| ClassJumpFactor   | `satellites/class-jump-factor.js`  | +20 | 10% | 前走より1段階以上クラス上昇 |
| LastKickFactor    | `satellites/last-kick-factor.js`   | +15 | 10% | 直近2走で上がり3Fが改善 |
| PaceFactor        | `satellites/pace-factor.js`        | 脚質ごとに0〜15（下表） | 10% | 出走馬の脚質構成から推定したペースに応じて優遇脚質を変える |
| kochi_running_style | `satellites/venue/31/running-style-factor.js` | 距離・脚質別 + ペース圧補正 | 12% | 高知（baba_code=31）のみ |
| saga_running_style  | `satellites/venue/32/running-style-factor.js` | 距離・脚質別 | 10% | 佐賀（baba_code=32）のみ |

会場別サテライトは `satellites/venue/loader.js` が `venue/<baba_code>/index.js` を読み込む。該当ディレクトリが無い会場では何も加算しない。

### PaceFactor（ペース想定）

出走全馬の `running_style`（逃げ/先行/差し/追込。過去レースの通過順位比率から推定）を集計し、
「逃げ+先行」の頭数（`frontCount`）でレース展開を3区分に分類する。

| 区分 | 条件 | 想定 | ボーナス（逃げ/先行/差し/追込） |
|------|------|------|------------------------------|
| ハイペース | frontCount ≥ 4 | 前が競り合って垂れやすい | 0 / 0 / +15 / +12 |
| スローペース | frontCount ≤ 1 | 楽な逃げになりやすい | +15 / +10 / 0 / 0 |
| ミドルペース | 上記以外 | 小幅に逃げ・差し寄り | +5 / +5 / +8 / +3 |

会場を問わず全レースで適用（`predict-race-use-case.js` に直接wired、venue固有ではない）。
会場別の `kochi_running_style` / `saga_running_style` とは独立して加算される。

### SummerBodyWeight の補正

7月から9月のレースだけ（年を問わない。設定ファイルの期間とは独立）、コア+サテライト合計後の最終スコアに倍率補正をかける。

| 条件 | 補正 |
|------|------|
| 牝馬2〜4歳、馬体重 +5kg〜+15kg | 5%ボーナス（×1.05） |
| 牝馬5歳以上、馬体重 +5kg〜+7kg | 5%ボーナス（×1.05） |
| 牝馬、馬体重 -7kg以下 | 5%割引（×0.95） |
| 牡馬、馬体重 -10kg以下 | 5%割引（×0.95） |
| 上記以外、または7〜9月以外 | 補正なし（×1.0） |

2〜4歳牝馬は成長分を考慮して増加許容幅を広めに取り、5歳以上牝馬は太め残りを避けるため狭めに評価する。

---

## 3. 調教師スコアの補正ロジック

```
tRaw = (JBIS登録あり) ? trainer_ranking.score : trainerFallback
tScore = Math.round(tRaw × trainerClassMultiplier)
```

`trainer_ranking` は `scripts/fetch-trainer-ranking.js` で JBIS のリーディングトレーナー（地方）の CSV から作る（手動実行。cron には入っていない）。

- 全調教師（約560人）の所属（`affiliation`）・出走回数・勝利数・勝率・複勝率・収得賞金を保存する
- 予想に使う `score` は、地方の調教師を収得賞金の順に並べた上位100人だけに付ける（1位=100 … 100位=1）。それより下と中央の調教師は `score = 0`
- 予想側（`findTrainerScores`）は `score > 0` の行だけを読む。`score = 0` の調教師は「JBIS登録なし」と同じ扱いでフォールバックになる
- CSV は URL の並び順の指定に関係なく勝利数の順で返るので、スクリプトの中で賞金順に並べ直している
- 2026-11-07 に列を追加したとき、`score` は追加前の値（旧方式で取得した102人分）に戻した。次に取得スクリプトを実行すると、上記の方式でスコアが入れ替わる

**クラスレベル（レース名から判定）：**

| レベル | 条件 | 乗数 | フォールバック |
|--------|------|------|-------------|
| 5（重賞） | 重賞/グランプリ/ダービー/オークス/GI/Jpn1等 | 1.0 | 40 |
| 4（A/B1） | A1〜A4/B1 | 1.0 | 20 |
| 3（B2/B3） | B2/B3 | 0.8 | 10 |
| 2（C1/C2） | C1/C2 | 0.6 | 10 |
| 1（C3/新馬） | C3/C4/新馬/2歳/3歳新 | 0.4 | **20**（試験運用中、通常10） |
| null（不明） | 解析できない場合 | 0.7 | 10 |

> **試験運用（判断待ち）**: 2026-08-23 から1週間の予定で、Lv1（C3/C4/新馬）だけ無名調教師（JBIS未登録）のフォールバックスコアを10→20に引き上げた。同クラス帯は無名調教師の馬が大穴を出す傾向が観測されたため、ペナルティを緩めて穴馬を拾いやすくする狙い。2026-11-03 時点でも20のまま。`scripts/lib/prediction/scoring.js` の `trainerFallbackScore()` を参照。的中率・ROIを見て本採用か10に戻すか判断する。

### 既知の問題（2026-11-03 時点、未修正）

- **クラス判定の誤爆**: `parseRaceClassLevel()` の `/A[1-4]?/` は数字なしの `A` にも一致する。`JRA交流 C2` のように英字 `A` を含むレース名は Lv4 と判定される。
- **`scoring.js` のコメントが実装と不一致**: `trainerFallbackScore()` のコメントは Lv5→60 / Lv4→40 / Lv3→20 と書いているが、実際の値は上の表のとおり。コメントの意図が正しい場合は実装側の不具合になるため、確認が必要。

---

## 4. 種牡馬スコアの取得ロジック

```sql
-- trackCondition（例: '重'）が指定された場合
SELECT sire_name,
  COALESCE(
    MAX(CASE WHEN track_condition = '重' THEN score END),
    MAX(CASE WHEN track_condition = 'all' THEN score END),
    MAX(score)
  ) AS score
FROM sire_ranking GROUP BY sire_name
```

`sire_ranking` の `track_condition` は `all` / `良` / `稍重` / `重` / `不良` の5種。
距離別（`distance_m`）データもあるが、現在は全距離のMAXをGROUP BYで取得している。

---

## 5. prediction.memo の JSON 構造

```json
{
  "model": "yosou-v1",
  "race_id": "202606041219",
  "items": [
    {
      "horse_number": 2,
      "horse_name": "クロシオバンザイ",
      "score": 279,
      "breakdown": {
        "jockey": 64,
        "trainer": 90,
        "trainerJbis": 90,
        "trainerMultiplier": 1,
        "sire": 83,
        "custom": 32,
        "youngRace": false,
        "youngSireBoost": 0,
        "juvenileSireRank": 0,
        "juvenileSireRankingBonus": 0,
        "summerSire": 0,
        "summerBroodmareSire": 0,
        "summerDamFamily": 0,
        "summerWeightAllowance": 0,
        "improvement": 15,
        "wettrack": 0,
        "distance": 20,
        "classjump": 0,
        "lastkick": 0,
        "pace": 8,
        "bodyweightMultiplier": 1,
        "bodyweightAdjustment": 0,
        "horseWeightDiff": null
      }
    }
  ],
  "best": { "horse_number": 2, "horse_name": "...", "score": 279, "breakdown": {...} },
  "weather": "晴",
  "trackCondition": "稍重",
  "raceClass": 2,
  "paceType": "middle",
  "generatedAt": "2026-06-04T01:00:00.000Z"
}
```

- `items` はスコア降順。`best = items[0]`
- `breakdown` のキーはファクターの追加に合わせて増えるため、古いレコードには無いキーがある（例: 2026-05-23以前は `trainerJbis` / `trainerMultiplier` / `improvement` なし）
- 馬別ルールと会場別サテライトのキーは、該当する場合に `breakdown` へ追加される
- 旧レコードに `trainer: 4294967287` が存在する場合は `>>> 0` バグ由来（表示上の問題のみ、運用に影響なし）

---

## 6. 現在のデータ規模（2026-06-04 時点）

| テーブル | 件数 | 補足 |
|---------|------|------|
| prediction | 526 | 2026-05-23〜運用中 |
| race_results | 5,415 | 約540レース分（ImprovementFactor の過去データ） |
| jockey_ranking | 104 | 2026年分 |
| trainer_ranking | 102 | 2026年分 |
| sire_ranking | 8,382 | 距離別×馬場状態別 |
| race_info | 244 | 馬場状態・距離・レース名 |

---

## 7. 今後のサテライトファクター候補

| 優先度 | ファクター | 必要データ | 状態 |
|--------|-----------|-----------|------|
| ① | ImprovementFactor（着順上昇度） | race_results | **実装済み** |
| ② | WetTrackFactor（重・不良専用サイアー） | sire_ranking（track_condition別） | **実装済み** |
| ③ | VenueFactor（会場別補正） | prediction_roi（蓄積待ち） | データ蓄積中 |
| ④ | DistanceFactor（距離適性） | race_results | **実装済み** |
| ⑤ | ClassJumpFactor（クラス上昇） | race_info | **実装済み** |
| ⑥ | LastKickFactor（上3F末脚トレンド） | racing_form（agari_3f_1/2） | **実装済み** |
| ⑦ | PaceFactor（ペース想定） | racing_form（running_style） | **実装済み** |

---

## 8. サテライトファクターの追加手順

1. `scripts/lib/prediction/satellites/xxx-factor.js` を作成
   - export: `async function computeXxxBonuses(racingFormRows, raceId, ...) => Map<horse_number, bonus>`
2. `predict-race-use-case.js` の `satellites` 配列に追加
   ```js
   const xxxBonuses = await computeXxxBonuses(...);
   const satellites = [
     { name: 'improvement', bonuses: improvementBonuses },
     { name: 'xxx',         bonuses: xxxBonuses },
   ];
   ```
3. `scoring.js` の変更は不要（`satellites` パラメータで自動展開される）
