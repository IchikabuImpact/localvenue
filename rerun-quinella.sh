#!/bin/bash
set -euo pipefail

LOG=/home/ichikabu/projects/localvenue/logs/rerun-quinella.log
mkdir -p /home/ichikabu/projects/localvenue/logs
echo "START $(date '+%Y-%m-%d %H:%M:%S')" > "$LOG"

export HOME=/home/ichikabu
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: node not found" >> "$LOG"; exit 1
fi
echo "$(node --version) ready" >> "$LOG"

cd /home/ichikabu/projects/localvenue

for ymd in 20260523 20260524 20260525 20260526 20260527 20260528 20260529; do
  echo "" >> "$LOG"
  echo "$(date '+%H:%M:%S') ====== RESULT-BATCH: $ymd ======" >> "$LOG"
  node scripts/daily-result-batch.js "$ymd" >> "$LOG" 2>&1
  echo "$(date '+%H:%M:%S') ====== DONE: $ymd ======" >> "$LOG"
done

echo "" >> "$LOG"
echo "$(date '+%Y-%m-%d %H:%M:%S') 全日程完了" >> "$LOG"
echo "END" >> "$LOG"
