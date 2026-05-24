#!/bin/bash
# =============================================================
# yosou.sh — 朝バッチ ラッパー
#   出馬表スクレイピング＋AI予想生成＋HTML公開
#
# crontab 設定例:
#   0 10 * * * /home/ichikabu/projects/localvenue/cron/yosou.sh
# =============================================================

PROJECT=/home/ichikabu/projects/localvenue
LOG=$PROJECT/logs/yosou.log

export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

mkdir -p "$PROJECT/logs"

echo "========================================" >> "$LOG"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 朝バッチ 開始" >> "$LOG"
echo "========================================" >> "$LOG"

cd "$PROJECT"
node scripts/daily-yosou-batch.js >> "$LOG" 2>&1
EXIT_CODE=$?

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 朝バッチ 終了 (exit=$EXIT_CODE)" >> "$LOG"

if [ $EXIT_CODE -ne 0 ]; then
  exit $EXIT_CODE
fi

# HTML 生成＋git push（出馬表・予想をすぐ公開）
bash "$PROJECT/cron/autoupdate.sh"
