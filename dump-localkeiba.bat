@echo off
REM dump-localkeiba.bat
REM マスタ系テーブル(baba, jockey_ranking, sire_ranking, venue_master)を
REM スキーマ＋データ込みで localkeiba.sql にダンプする

echo Dumping localkeiba (baba, jockey_ranking, sire_ranking, venue_master)...
mysqldump -p localkeiba baba jockey_ranking sire_ranking venue_master > localkeiba.sql

IF ERRORLEVEL 1 (
  echo ❌ mysqldump failed.
  EXIT /B 1
)

echo ✅ Dump created: localkeiba.sql
EXIT /B 0