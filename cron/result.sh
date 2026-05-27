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

# --- cron は環境が薄いため HOME などを明示設定 ---
export HOME=${HOME:-/home/ichikabu}
export USER=${USER:-ichikabu}

# ログディレクトリを最初に確保（exec より前に必要）
mkdir -p "$PROJECT/logs"

# 以降の全 stdout/stderr をログへ集約（cron のメール通知を完全に抑止）
exec >> "$LOG" 2>&1

echo "========================================"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 結果バッチ 開始"
echo "========================================"

# nvm 読み込み（exec 後なので出力もログへ入る）
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# node が PATH にあるか確認
if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] node コマンドが見つかりません。PATH=$PATH"
  exit 1
fi
echo "[INFO] $(node --version) / nvm loaded"

cd "$PROJECT"
node scripts/daily-result-batch.js
EXIT_CODE=$?

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 結果バッチ 終了 (exit=$EXIT_CODE)"

if [ $EXIT_CODE -ne 0 ]; then
  exit $EXIT_CODE
fi

# HTML 生成＋git push（結果をすぐ公開）
echo "[$(date '+%Y-%m-%d %H:%M:%S')] git push 開始"
bash "$PROJECT/cron/autoupdate.sh"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 結果バッチ 全工程 完了"
