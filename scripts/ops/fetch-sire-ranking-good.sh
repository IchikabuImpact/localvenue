#!/usr/bin/env bash
# 良・稍重ダートの種牡馬ランキングを取得する
# @copyright © 2026 IchikabuImpact

cd "$(dirname "$0")/.."

# NAR全場の使用距離（帯広ばんえい除く）
DISTANCES="800 850 900 1000 1200 1230 1300 1400 1500 1600 1700 1750 1800 1900 2000 2100 2200 2400 2600"

echo "=== 良馬場 (condition=2) ==="
for d in $DISTANCES; do
  node fetch-sire-ranking.js $d --condition 良
done

echo "=== 稍重馬場 (condition=3) ==="
for d in $DISTANCES; do
  node fetch-sire-ranking.js $d --condition 稍重
done
