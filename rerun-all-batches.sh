#!/bin/bash
set -euo pipefail

LOG=/home/ichikabu/projects/localvenue/logs/rerun-batch.log
mkdir -p /home/ichikabu/projects/localvenue/logs

echo "START" > "$LOG"
echo "$(date '+%Y-%m-%d %H:%M:%S') バッチ再実行開始" >> "$LOG"

export HOME=/home/ichikabu
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: node not found" >> "$LOG"
  exit 1
fi
echo "$(node --version) ready" >> "$LOG"

cd /home/ichikabu/projects/localvenue

for ymd in 20260523 20260524 20260525 20260526 20260527 20260528 20260529; do
  echo "" >> "$LOG"
  echo "$(date '+%H:%M:%S') ====== PREDICT: $ymd ======" >> "$LOG"

  race_ids=$(node scripts/003-list-race-ids.js "$ymd" 2>>"$LOG" || true)
  race_count=$(echo "$race_ids" | grep -c '[0-9]' 2>/dev/null || echo "0")
  echo "$(date '+%H:%M:%S')  race_ids: ${race_count} 件" >> "$LOG"

  if [ -n "$race_ids" ]; then
    while IFS= read -r race_id; do
      [ -z "$race_id" ] && continue
      echo "$(date '+%H:%M:%S')  [005] $race_id" >> "$LOG"
      node scripts/005-predict-race.js "$race_id" >> "$LOG" 2>&1
    done <<< "$race_ids"
  fi

  echo "" >> "$LOG"
  echo "$(date '+%H:%M:%S') ====== RESULT-BATCH: $ymd ======" >> "$LOG"
  node scripts/daily-result-batch.js "$ymd" >> "$LOG" 2>&1

  echo "$(date '+%H:%M:%S') ====== DONE: $ymd ======" >> "$LOG"
done

echo "" >> "$LOG"
echo "$(date '+%Y-%m-%d %H:%M:%S') 全日程 完了" >> "$LOG"
echo "END" >> "$LOG"
