#!/bin/bash
# =============================================================
# autoupdate.sh — git push（VPS 公開反映）
#   バッチ完了後に呼ばれる共通シェル。
#   public/ の変更を git push することで
#   VPS 側は git pull するだけで最新ページが反映される。
#
# 呼び出し元:
#   cron/yosou.sh  （朝バッチ完了後）
#   cron/result.sh （結果バッチ完了後）
# =============================================================

PROJECT=/home/ichikabu/projects/localvenue
LOG=$PROJECT/logs/autoupdate.log

mkdir -p "$PROJECT/logs"

echo "----------------------------------------" >> "$LOG"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] autoupdate 開始" >> "$LOG"

cd "$PROJECT"

/usr/bin/git add .
if /usr/bin/git diff --cached --quiet; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] git: 変更なし、push スキップ" >> "$LOG"
else
  /usr/bin/git commit -a --message="data update $(date '+%Y%m%d-%H%M')" >> "$LOG" 2>&1
  /usr/bin/git push >> "$LOG" 2>&1
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] git push 完了" >> "$LOG"
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] autoupdate 完了" >> "$LOG"
exit 0
