#!/usr/bin/env bash
# @copyright © 2026 IchikabuImpact
# @license Commercial use prohibited without permission.

cd "$(dirname "$0")"

for d in 800 850 900 1000 1200 1230 1300 1400 1500 1600 1700 1750 1800 1900 2000 2100 2200 2400 2600; do
  node ../fetch-sire-ranking.js $d
done
