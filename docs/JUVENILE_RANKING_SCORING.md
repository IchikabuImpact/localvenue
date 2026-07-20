# 若駒戦向け血統ランキング補正

## 目的

2歳戦・3歳戦は出走馬の過去データが少なく、通常の近走・距離・脚質ファクターだけでは評価が不安定になりやすい。
そのため、若駒中心のレースに限って血統評価を少し強め、JBISの2歳種牡馬ランキングも補助的に加点する。

## 取得データ

月次バッチで JBIS の2歳種牡馬ランキングを取得し、`juvenile_sire_ranking` に保存する。

```bash
node scripts/fetch-juvenile-sire-ranking.js --division=3 --ranking=2
```

- `division=3`: 地方
- `ranking=2`: JBISの2歳種牡馬ランキング
- 保存スコアは既存ランキングと同じく順位ベースで、1位を100点として順位が下がるほど小さくする。

## スコア反映

`calculatePrediction()` は以下の条件で若駒戦と判定する。

- 出走馬のうち `sex_age` が3歳以下の馬が60%以上
- またはレース名に `2歳`、`3歳`、`新馬` が含まれる

若駒戦の場合だけ、以下を加点する。

| 項目 | 既定値 | 内容 |
| --- | ---: | --- |
| `youngRace.sireBoostPct` | 30 | 既存の種牡馬スコアに対する追加加点率 |
| `youngRace.juvenileSireRankingBonusPct` | 15 | 2歳種牡馬ランキングスコアに対する加点率 |

設定は `config/scoring/default.json` の `summerBonus.youngRace` で変更できる。

## 既存DBへの反映

新規構築では `data/schema.sql` に含まれる。
既存DBへ反映する場合は、以下のテーブルを作成する。

```sql
CREATE TABLE juvenile_sire_ranking (
  year int NOT NULL,
  division tinyint NOT NULL DEFAULT '3',
  sire_id bigint NOT NULL,
  sire_name varchar(255) NOT NULL,
  score int NOT NULL,
  PRIMARY KEY (year, division, sire_id),
  KEY idx_juvenile_sire_ranking_name (year, division, sire_name),
  KEY idx_juvenile_sire_ranking_score (year, division, score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```
