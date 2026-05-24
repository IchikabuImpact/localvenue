#!/bin/bash
# =============================================================
# result.sh — 結果バッチ ラッパー
#   レース結果取得→予想評価→ROI集計→HTML生成→git push
#
# crontab 設定例:
#   0 13 * * * /home/ichikabu/projects/localvenue/cron/result.sh
#   0 21 * * * /home/ichikabu/projects/localvenue/cron/result.sh
# =============================================================

PROJECT=/home/ichikabu/projects/localvenue
LOG=$PROJECT/logs/result.log

export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

mkdir -p "$PROJECT/logs"

echo "========================================" >> "$LOG"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 結果バッチ 開始" >> "$LOG"
echo "========================================" >> "$LOG"

cd "$PROJECT"
node scripts/daily-result-batch.js >> "$LOG" 2>&1
EXIT_CODE=$?

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 結果バッチ 終了 (exit=$EXIT_CODE)" >> "$LOG"

if [ $EXIT_CODE -ne 0 ]; then
  exit $EXIT_CODE
fi

# HTML 生成＋git push（結果をすぐ公開）
bash "$PROJECT/cron/autoupdate.sh"
