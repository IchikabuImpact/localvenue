#!/usr/bin/env bash
# dump-localkeiba.sh
# マスタ系テーブル(baba, jockey_ranking, sire_ranking, venue_master)を
# スキーマ＋データ込みで localkeiba.sql にダンプする

set -euo pipefail

mysqldump -p \
  localkeiba \
  baba jockey_ranking sire_ranking venue_master \
  > localkeiba.sql

echo "✅ Dump created: localkeiba.sql"