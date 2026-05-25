#!/bin/bash
# =============================================================
# yosou.sh — 朝バッチ ラッパー
#   出馬表スクレイピング＋AI予想生成＋HTML生成＋git push
#
# 処理順:
#   [1] daily-yosou-batch.js  — 出馬表取得・AI予想生成（DB保存）
#   [2] generate-daily-pages.js — 静的HTML生成（public/ へ書き出し）
#   [3] autoupdate.sh         — git push（VPS へ公開）
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

YMD=$(date '+%Y%m%d')

echo "========================================" >> "$LOG"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 朝バッチ 開始 ($YMD)" >> "$LOG"
echo "========================================" >> "$LOG"

cd "$PROJECT"

# [1] 出馬表取得 + AI予想生成（DB保存）
node scripts/daily-yosou-batch.js "$YMD" >> "$LOG" 2>&1
EXIT_CODE=$?
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 朝バッチ 終了 (exit=$EXIT_CODE)" >> "$LOG"

if [ $EXIT_CODE -ne 0 ]; then
  exit $EXIT_CODE
fi

# [2] 静的HTML生成（予想ページを public/ へ書き出す）
echo "[$(date '+%Y-%m-%d %H:%M:%S')] HTML生成 開始" >> "$LOG"
node scripts/generate-daily-pages.js "$YMD" >> "$LOG" 2>&1
EXIT_CODE=$?
echo "[$(date '+%Y-%m-%d %H:%M:%S')] HTML生成 終了 (exit=$EXIT_CODE)" >> "$LOG"

if [ $EXIT_CODE -ne 0 ]; then
  exit $EXIT_CODE
fi

# [3] git push（出馬表・予想ページをVPSへ公開）
bash "$PROJECT/cron/autoupdate.sh"
