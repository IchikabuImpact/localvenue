# DBバックアップ方針

最終更新: 2026-09-23

## 概要

`localvenue` データベースを毎日自動でダンプし、稼働マシンとは別のLAN内NASへ保存する。
実IPアドレス・マウントパス・スクリプトの絶対パス等、環境固有の値はこの公開ドキュメントには書かず、
各環境のローカル専用メモ（gitignore対象）で管理する（`docs/DB_CONTEXT.md`と同じ運用）。

## 方式

1. `mysqldump --single-transaction --routines --triggers` でDB全体をダンプ
   - `--single-transaction` によりInnoDBテーブルをロックせず整合性のあるスナップショットを取得
2. ダンプは一旦ローカルの一時領域に書き出してからgzip圧縮する
   - NAS書き込み中に失敗しても、既存の正常なバックアップを壊さないため
3. 圧縮後にNAS（SMB/CIFSでホストマシンにマウント済み）へコピー
4. コピー成功を確認してからローカルの一時ファイルを削除

## スケジュール

- cronで毎日 3:30 JST に実行（日中バッチの合間、深夜の非稼働時間帯）

## 保持世代数

- 直近 **5世代** のみ保持。6世代目以降は自動削除（ファイル名の日時で新しい順にソート）
- 1日1回の実行のため、実質「直近5日分」に相当する

## 失敗時の通知

以下のいずれかで失敗した場合、Slack Webhook通知 + デスクトップ通知（`notify-send`）で知らせる:

- NASのマウントが外れている（自動再マウントを試みても失敗した場合）
- `mysqldump` 自体がエラー終了、または出力が空
- NASへのコピーに失敗

失敗時はローカルの一時ファイルを残さず削除し、正常なバックアップだけがNAS上に残るようにしている。

## リストア手順

1. **cronバッチを止める**（復旧中に予想・結果バッチが書き込むと競合するため）
   ```bash
   crontab -l > crontab.bak.txt   # 復元用に退避
   crontab -r                      # 一時的に全ジョブを止める
   ```
2. **NAS上のバックアップ一覧を確認し、使う世代を選ぶ**（ローカル専用メモのマウントパス配下）
   ```bash
   ls -lt <マウントパス>/localvenue-backup/
   ```
3. **（推奨）復旧前の現状もダンプしておく**（切り戻せるように）
   ```bash
   mysqldump --single-transaction -u <user> -p<password> localvenue > before-restore.sql
   ```
4. **対象世代を復元**
   ```bash
   gunzip -c localvenue_YYYYMMDD_HHMMSS.sql.gz | mysql -u <user> -p <database>
   ```
5. **health-check で整合性を確認**
   ```bash
   node scripts/ops/daily-health-check.js $(date '+%Y%m%d')
   ```
6. **問題なければcrontabを復元**
   ```bash
   crontab crontab.bak.txt
   ```

### 注意点

- リストアは対象日のデータを**丸ごと上書き**する。特定テーブル・特定レースだけ戻したい場合は
  ダンプファイルから該当箇所を手動で抜き出す必要がある。
- バックアップは1日1回・直近5世代のみなので、直近5日以内に気づかないと該当世代が消えている
  可能性がある。異常に気づいたら早めに対応すること。

## 環境固有の設定値

NASのホスト名/IP、共有フォルダ名、マウントポイント、認証情報ファイルの場所、バックアップスクリプトの
実際の配置場所は、各環境のローカル専用メモ（`docs/OPS_LOCAL.md`、gitignore対象）を参照。
