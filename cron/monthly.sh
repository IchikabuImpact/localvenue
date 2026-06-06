#!/bin/bash
# =============================================================
# monthly.sh — 月次マスターデータ更新バッチ
#   JBIS から騎手・種牡馬ランキングを取得して DB へ保存
#
# 処理順:
#   [1] fetch-jockey-ranking.js  — 騎手ランキング（地方 top100）
#   [2] fetch-sire-ranking.js    — 種牡馬ランキング（距離別 top100）
#
# crontab 設定例:
#   0 3 1 * * /home/ichikabu/projects/localvenue/cron/monthly.sh
#   ↑ 毎月1日 03:00 に実行
# =============================================================

PROJECT=/home/ichikabu/projects/localvenue
LOG=$PROJECT/logs/monthly.log

# --- cron は環境が薄いため HOME などを明示設定 ---
export HOME=${HOME:-/home/ichikabu}
export USER=${USER:-ichikabu}

# ログディレクトリを最初に確保（exec より前に必要）
mkdir -p "$PROJECT/logs"

# 以降の全 stdout/stderr をログへ集約
exec >> "$LOG" 2>&1

echo "========================================"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 月次バッチ 開始 ($(date '+%Y年%m月'))"
echo "========================================"

# nvm 読み込み
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] node コマンドが見つかりません。PATH=$PATH"
  exit 1
fi
echo "[INFO] $(node --version) / nvm loaded"

cd "$PROJECT/scripts"

# [0] 先月以前の external_request_log を削除（当月分のみ保持）
echo "[$(date '+%Y-%m-%d %H:%M:%S')] [0] external_request_log クリーンアップ 開始"
node -e "
const mysql  = require('mysql2/promise');
const config = require('../config/config.js');
(async () => {
  const conn = await mysql.createConnection({
    host: config.mysql.host, user: config.mysql.user,
    password: config.mysql.password, database: config.mysql.database,
    port: config.mysql.port || 3306,
  });
  try {
    const [r] = await conn.execute(
      \`DELETE FROM external_request_log
         WHERE requested_at < DATE_FORMAT(NOW(), '%Y-%m-01 00:00:00')\`
    );
    console.log('[cleanup] 削除件数:', r.affectedRows, '件');
  } finally {
    await conn.end();
  }
})().catch(e => { console.warn('[cleanup] 失敗（無視）:', e.message); });
"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] [0] external_request_log クリーンアップ 終了"

# [1] 騎手ランキング（地方 division=3）
echo "[$(date '+%Y-%m-%d %H:%M:%S')] [1] 騎手ランキング取得 開始"
node fetch-jockey-ranking.js --division=3
EXIT_CODE=$?
echo "[$(date '+%Y-%m-%d %H:%M:%S')] [1] 騎手ランキング取得 終了 (exit=$EXIT_CODE)"

if [ $EXIT_CODE -ne 0 ]; then
  echo "[ERROR] 騎手ランキング取得失敗。処理を中断します。"
  exit $EXIT_CODE
fi

# [2] 種牡馬ランキング（距離別 — 地方ダート平地の主要距離）
DISTANCES="800 1200 1300 1400 1500 1600 1800 2000 2100 2200"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] [2] 種牡馬ランキング取得 開始 (距離: $DISTANCES)"

CONDITIONS="all 良 稍重 重 不良"
SIRE_ERRORS=0
for DIST in $DISTANCES; do
  for COND in $CONDITIONS; do
    echo "[$(date '+%Y-%m-%d %H:%M:%S')]   距離 ${DIST}m  条件 ${COND} ..."
    node fetch-sire-ranking.js "$DIST" --condition "$COND"
    if [ $? -ne 0 ]; then
      echo "[WARN] 距離 ${DIST}m 条件 ${COND} の取得失敗。次へ続行。"
      SIRE_ERRORS=$((SIRE_ERRORS + 1))
    fi
    # ※ JBIS への待機は jbis-throttle.js が自動制御（7〜9秒）するため sleep 不要
  done
done

echo "[$(date '+%Y-%m-%d %H:%M:%S')] [2] 種牡馬ランキング取得 終了 (失敗距離: ${SIRE_ERRORS}件)"

echo "========================================"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 月次バッチ 完了"
echo "========================================"
