#!/usr/bin/env bash
# @copyright © 2026 IchikabuImpact
# @license Commercial use prohibited without permission.

set -euo pipefail

# 例: 毎月定期実行（地方 = division=3 を既定）
#   crontab 例)  7 3 1 * * /path/to/monthly-fetch-jockey-ranking.sh >> /var/log/jockey_rank.log 2>&1

cd "$(dirname "$0")"

# 基本はHTMLダンプを自動削除（KEEP_DUMPS=1 を付けたら残す）
node fetch-jockey-ranking.js --division=3
