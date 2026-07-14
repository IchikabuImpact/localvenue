# 予想スコアリング設計書

最終更新: 2026-06-07

---

## 1. モデル名

`yosou-v1`（`MODEL_VERSION` 定数、`scripts/lib/prediction/scoring.js`）

---

## 2. スコア構成

スコアは **コアファクター4本 + サテライトファクター（可変）** の合算です。

### コアファクター

| ファクター | ソース | 取得方法 | スコアレンジ |
|-----------|--------|---------|------------|
| 騎手スコア（jockey） | `jockey_ranking` | 名前頭3文字で前方一致 | 1〜100 |
| 調教師スコア（trainer） | `trainer_ranking` | 名前前方一致 + クラス乗数 | 実質0〜100 |
| 種牡馬スコア（sire） | `sire_ranking` | 名前前方一致（馬場状態・距離別） | 0〜100 |
| カスタム（custom） | 馬番・年齢 | 偶数馬番=馬番値加算、年齢2歳+40/3歳+30/4歳+20 | 0〜60 |

### サテライトファクター（プラグイン型）

ファイルは `scripts/lib/prediction/satellites/` に置く。
各ファイルは `{ name, bonuses: Map<horse_number, score> }` を返す関数を export する。
ON/OFF は `predict-race-use-case.js` の `satellites` 配列への追加・削除で制御。

| ファクター | ファイル | ボーナス | capPct | 条件 |
|-----------|---------|---------|--------|------|
| ImprovementFactor | `satellites/improvement-factor.js` | +10 | なし | 前走より着順が1以上改善 |
| WetTrackFactor    | `satellites/wet-track-factor.js`   | 条件別sireスコア − allスコアの差分 | 10% | 馬場状態が重または不良のとき |
| DistanceFactor    | `satellites/distance-factor.js`    | +20 | 10% | 今走と同距離で1着実績あり |
| ClassJumpFactor   | `satellites/class-jump-factor.js`  | +20 | 10% | 前走より1段階以上クラス上昇 |
| SummerBodyWeight  | `scoring.js` | 最終スコア×0.9/1.1 | なし | 7〜9月の馬体重増減と性別で補正 |

### SummerBodyWeight の補正

7月から9月のレースだけ、コア+サテライト合計後の最終スコアに倍率補正をかける。

| 条件 | 補正 |
|------|------|
| 牝馬、馬体重 +5kg〜+7kg | 10%ボーナス（×1.1） |
| 牝馬、馬体重 -7kg以下 | 10%割引（×0.9） |
| 牡馬、馬体重 -10kg以下 | 10%割引（×0.9） |
| 上記以外、または7〜9月以外 | 補正なし（×1.0） |

3歳/3歳以上による分岐は現時点では入れず、ROIを見て後続調整する。

---

## 3. 調教師スコアの補正ロジック

```
tRaw = (JBIS登録あり) ? trainer_ranking.score : trainerFallback
tScore = Math.round(tRaw × trainerClassMultiplier)
```

**クラスレベル（レース名から判定）：**

| レベル | 条件 | 乗数 | フォールバック |
|--------|------|------|-------------|
| 5（重賞） | 重賞/GI/Jpn1等 | 1.0 | 60 |
| 4（A/B1） | A1〜A4/B1 | 1.0 | 40 |
| 3（B2/B3） | B2/B3 | 0.8 | 20 |
| 2（C1/C2） | C1/C2 | 0.6 | 10 |
| 1（C3/新馬） | C3/C4/新馬/2歳/3歳新 | 0.4 | 10 |
| null（不明） | 解析できない場合 | 0.7 | 20 |

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
        "improvement": 10,
        "wettrack": 0,
        "distance": 20,
        "classjump": 0,
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
  "generatedAt": "2026-06-04T01:00:00.000Z"
}
```

- `items` はスコア降順。`best = items[0]`
- 旧レコード（2026-05-23以前）は `trainerJbis` / `trainerMultiplier` / `improvement` なし
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
| ⑥ | 上3F（末脚トレンド） | 未収集 | スクレイピング追加必要 |

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
