#!/bin/bash
# data/schema.sql と実DBのカラム構成を照合するヘルスチェック。
# 「コードとschema.sqlはpushしたが、本番DBへのALTER TABLEを忘れた」事故の再発防止用。
# ズレを検出したら ALERT を alerts.log に残す（通知連携は別途 cron/health-check.sh 系と同様の想定）。

PROJECT=/home/ichikabu/projects/localvenue
LOG=$PROJECT/logs/schema-drift.log
ALERT_LOG=$PROJECT/logs/alerts.log

export HOME=${HOME:-/home/ichikabu}
export USER=${USER:-ichikabu}

mkdir -p "$PROJECT/logs"
exec >> "$LOG" 2>&1

export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd "$PROJECT" || exit 1

echo "[$(date '+%Y-%m-%d %H:%M:%S')] schema-drift-check start"
if node scripts/ops/schema-drift-check.js; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] schema-drift-check OK"
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ALERT schema-drift-check FAILED (data/schema.sql と実DBのカラムがズレています)" | tee -a "$ALERT_LOG"
  exit 1
fi
