#!/usr/bin/env bash
# @copyright © 2026 IchikabuImpact
# @license Commercial use prohibited without permission.

cd "$(dirname "$0")"

for d in 800 1200 1300 1400 1500 1600 1800 2000 2100 2200; do
  node ../fetch-sire-ranking.js $d
done
