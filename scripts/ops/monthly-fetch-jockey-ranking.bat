@echo off
setlocal enabledelayedexpansion
REM 例: タスク スケジューラで毎月実行

pushd %~dp0

REM 既定: 地方(division=3) / HTMLダンプは自動削除
node ..\\fetch-jockey-ranking.js --division=3

popd
endlocal
