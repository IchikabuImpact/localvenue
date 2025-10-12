@echo off
REM ============================================
REM  monthly-fetch-sire-ranking.bat
REM  Windows バッチファイル
REM  JBIS サイアーランキングを距離ごとに取得
REM  実行例: ダブルクリック または cmd から実行
REM ============================================

setlocal enabledelayedexpansion

REM Node.js スクリプトのパス
set SCRIPT=fetch-sire-ranking.js

REM 保存用ログディレクトリ
set LOGDIR=dumps
if not exist %LOGDIR% (
  mkdir %LOGDIR%
)

REM 処理対象の距離リスト
set DISTANCES=1000 1100 1200 1300 1400 1500 1600 1700 1800 1900 2000

REM 今日の日付をファイル名用に取得 (yyyy-mm-dd)
for /f "tokens=1-3 delims=/- " %%a in ("%date%") do (
  set YYYY=%%a
  set MM=%%b
  set DD=%%c
)
set TODAY=%YYYY%-%MM%-%DD%

echo ============================================
echo [START] JBIS sire ranking fetch %TODAY%
echo ============================================

for %%D in (%DISTANCES%) do (
  echo --- Distance %%D ---
  node %SCRIPT% %%D > %LOGDIR%\sire_rank_%%D_%TODAY%.log 2>&1
  if errorlevel 1 (
    echo [ERROR] Distance %%D failed. See log: %LOGDIR%\sire_rank_%%D_%TODAY%.log
  ) else (
    echo [OK] Distance %%D done.
  )
)

echo ============================================
echo [FINISH] All distances completed.
echo Logs are in %LOGDIR%\
echo ============================================

endlocal
pause
