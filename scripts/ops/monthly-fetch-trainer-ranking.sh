#!/bin/bash
# 月次手動実行: トレーナーランキング取得
# Usage: bash scripts/ops/monthly-fetch-trainer-ranking.sh [YYYY]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

YEAR=${1:-$(date +%Y)}
echo "[monthly-fetch-trainer-ranking] year=$YEAR"
node "$SCRIPT_DIR/scripts/fetch-trainer-ranking.js" --year="$YEAR" --division=3
