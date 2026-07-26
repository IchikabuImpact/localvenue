#!/bin/bash
# 本番運用ヘルスチェック。異常時はログに ALERT を残し、必要なら復旧スクリプトを手動実行する。

PROJECT=/home/ichikabu/projects/localvenue
LOG=$PROJECT/logs/health.log
ALERT_LOG=$PROJECT/logs/alerts.log

export HOME=${HOME:-/home/ichikabu}
export USER=${USER:-ichikabu}

mkdir -p "$PROJECT/logs"
exec >> "$LOG" 2>&1

export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

YMD=${1:-$(date '+%Y%m%d')}
cd "$PROJECT" || exit 1

echo "[$(date '+%Y-%m-%d %H:%M:%S')] health-check start: $YMD"
if node scripts/ops/daily-health-check.js "$YMD"; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] health-check OK: $YMD"
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ALERT health-check FAILED: $YMD" | tee -a "$ALERT_LOG"
  exit 1
fi
