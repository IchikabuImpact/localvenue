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

# --- cron は環境が薄いため HOME などを明示設定 ---
export HOME=${HOME:-/home/ichikabu}
export USER=${USER:-ichikabu}

# exec より前のキャナリーログ（/tmp に書く → 失敗しても無音にならない）
echo "[$(date '+%Y-%m-%d %H:%M:%S')] yosou.sh ENTRY HOME=$HOME PROJECT=$PROJECT" \
  >> /tmp/yosou-canary.log 2>/dev/null

# ログディレクトリを最初に確保（exec より前に必要）
mkdir -p "$PROJECT/logs" \
  || { echo "[$(date '+%Y-%m-%d %H:%M:%S')] mkdir FAILED" >> /tmp/yosou-canary.log; exit 1; }

# 以降の全 stdout/stderr をログへ集約（cron のメール通知を完全に抑止）
exec >> "$LOG" 2>&1

# exec 直後の確認ログ（ここが書けなければ exec redirect が失敗している）
echo "[$(date '+%Y-%m-%d %H:%M:%S')] exec redirect OK"

echo "========================================"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 朝バッチ 開始"
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

YMD=$(date '+%Y%m%d')
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 対象日: $YMD"

cd "$PROJECT"

# [1] 出馬表取得 + AI予想生成（DB保存）
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 朝バッチ 開始 ($YMD)"
node scripts/daily-yosou-batch.js "$YMD"
EXIT_CODE=$?
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 朝バッチ 終了 (exit=$EXIT_CODE)"

if [ $EXIT_CODE -ne 0 ]; then
  exit $EXIT_CODE
fi

# [2] 静的HTML生成（予想ページを public/ へ書き出す）
echo "[$(date '+%Y-%m-%d %H:%M:%S')] HTML生成 開始"
node scripts/generate-daily-pages.js "$YMD"
EXIT_CODE=$?
echo "[$(date '+%Y-%m-%d %H:%M:%S')] HTML生成 終了 (exit=$EXIT_CODE)"

if [ $EXIT_CODE -ne 0 ]; then
  exit $EXIT_CODE
fi

# [3] git push（出馬表・予想ページをVPSへ公開）
echo "[$(date '+%Y-%m-%d %H:%M:%S')] git push 開始"
bash "$PROJECT/cron/autoupdate.sh"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 朝バッチ 全工程 完了"
