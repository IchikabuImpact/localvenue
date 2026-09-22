#!/bin/bash
# =============================================================
# autoupdate-dev.sh — 開発環境専用 git push（devブランチのみ）
#   本番の cron/autoupdate.sh とは別物。VPSには一切影響しない。
#   git-autoupdate-dev.sh 側にmainブランチへのpushを拒否する安全装置がある。
# =============================================================

exec bash ~/bin/git-autoupdate-dev.sh /home/ichikabu/projects/localvenue-dev
