# 予想スコアリング リファクタリング方針

> 運用しながら段階的に改善する。コアは壊さず、補正を積み上げる。

---

## 基本方針

### Core Score（柱・常時動作）
現行の `yosou-v1` スコアをそのまま維持する。

```
core = jockeyScore + trainerScore + sireScore + customScore
```

### Correction Factor（補正・条件付きON/OFF）
Core の上に補正値を乗せる形で拡張する。

```
finalScore = core + Σ( factor.isActive(ctx) ? factor.delta(horse, ctx) : 0 )
```

補正はプラスにもマイナスにもなりうる。

---

## インターフェース仕様（将来実装）

```javascript
class CorrectionFactor {
  get name()  { return 'unnamed'; }
  isActive(ctx) { return true; }       // ON/OFF判定
  delta(horse, ctx) { return 0; }      // 補正値（正負可）
}

// ctx に入れる情報
// ctx.venueCode       '11'=水沢 '23'=笠松...
// ctx.distanceM       1300, 1400...
// ctx.trackCondition  '良','稍重','重','不良'
// ctx.raceClassLevel  1〜5
// ctx.raceHistoryMap  horse_name → 過去成績[] （未実装）
```

---

## 実装候補ファクター

| 優先度 | ファクター | isActive 条件 | 必要データ | 状態 |
|--------|-----------|--------------|----------|------|
| ★★★ | ImprovementFactor（着順上昇度） | 過去3件以上 | race_results（既存） | 未実装 |
| ★★☆ | WetTrackFactor（重・不良専用サイアー） | 馬場=重/不良 | sire_ranking条件別（収集済み） | 未実装 |
| ★★☆ | VenueFactor（会場別補正） | 会場=水沢など | ROI分析（データあり） | 未実装 |
| ★☆☆ | DistanceFactor（距離適性） | 常時 | race_results（既存） | 未実装 |
| ★☆☆ | ClassJumpFactor（クラス上昇） | クラス変化時 | race_info（既存） | 未実装 |
| ☆☆☆ | 上3F Factor（末脚トレンド） | 常時 | **未収集** | スクレイピング要 |

---

## 今日実装済み（2026-06-03）

### 調教師スコアのクラス別補正
- JBIS未登録調教師にレースクラス-1段階のフォールバックスコアを付与
- **クラス別乗数**: 下級クラスほど調教師スコアを抑える（詳細は scoring.js）

### 経緯
- 大穴的中のパターン分析で「騎手スコア高 + 調教師スコア低 = 大穴」を確認
- JBISの地方調教師ランキングは100件上限（racing_form 363人中カバー率20%）
- 上位クラスでは調教師の質が結果に直結するが、下級クラスは相関が弱い

---

## 参考：2026-06-03 大穴観察メモ

**名古屋2R ウインモアナ（単勝万馬券）**
- JRA芝で惨敗 → NAR転入後じわじわ上昇
- 上3Fのトレンド: 43.0 → 42.5 → 42.0 → 41.4 → 40.8 → 39.5（急激な末脚改善）
- **上昇度ファクター**の必要性を示す典型例
- 現行スコアでは着順トレンドを拾えない

---

## 注意事項

- `scoring.js` のコアを直接書き換えるのは最小限に
- 新しい補正ファクターは `scripts/lib/prediction/factors/` 配下に追加
- `isActive()` で条件制御 → コースや馬場でON/OFFが切り替わる設計
- 週単位でROI影響を計測してから本番採用を判断する
