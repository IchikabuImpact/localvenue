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

exec bash ~/bin/git-autoupdate.sh /home/ichikabu/projects/localvenue
