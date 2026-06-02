#!/usr/bin/env bash
# 台風・大雨対策: 重・不良ダートの種牡馬ランキングを取得する
# @copyright © 2026 IchikabuImpact

cd "$(dirname "$0")/.."

DISTANCES="800 850 900 1000 1200 1230 1300 1400 1500 1600 1700 1750 1800 1900 2000 2100 2200 2400 2600"

echo "=== 重馬場 (condition=4) ==="
for d in $DISTANCES; do
  node fetch-sire-ranking.js $d --condition 重
done

echo "=== 不良馬場 (condition=5) ==="
for d in $DISTANCES; do
  node fetch-sire-ranking.js $d --condition 不良
done
