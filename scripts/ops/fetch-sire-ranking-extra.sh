#!/usr/bin/env bash
# NAR追加距離（標準10距離に含まれない各場のコース） × 全馬場状態
# 850:水沢 900:川崎 1000:門別/金沢/園田/高知/佐賀
# 1230:園田/姫路 1700:名古屋/園田 1750:佐賀
# 1900:笠松/名古屋/高知 2400:船橋/大井 2600:大井
# @copyright © 2026 IchikabuImpact

cd "$(dirname "$0")/.."

DISTANCES="850 900 1000 1230 1700 1750 1900 2400 2600"

for cond in all 良 稍重 重 不良; do
  echo "=== ${cond} ==="
  for d in $DISTANCES; do
    node fetch-sire-ranking.js $d --condition "$cond"
  done
done
