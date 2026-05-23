#!/usr/bin/env bash
# create-database.sh
# MySQL のインストールから DB・ユーザー作成までを一括で行うセットアップスクリプト。
# Usage:
#   bash create-database.sh
#
# @copyright © 2026 IchikabuImpact
# @license Commercial use prohibited without permission.

set -euo pipefail

# -------- 設定 --------
DB_NAME="localvenue"
DB_USER="localvenue"
DB_PASS="yourpassword"   # ← 本番環境では変更してください

# -------- パッケージ更新 --------
echo "[1/4] パッケージ更新..."
sudo apt update

# -------- MySQL サーバー インストール --------
echo "[2/4] MySQL サーバーをインストール..."
sudo apt install -y mysql-server

# -------- サービス起動 --------
echo "[3/4] MySQL サービスを起動..."
# systemd 環境
sudo systemctl enable --now mysql 2>/dev/null || \
# WSL で systemd が無い場合の代替
sudo service mysql start 2>/dev/null || \
sudo /etc/init.d/mysql start

# バージョン確認
mysql --version

# -------- DB・ユーザー作成 --------
echo "[4/4] データベース・ユーザーを作成..."
sudo mysql -u root <<SQL
CREATE DATABASE IF NOT EXISTS ${DB_NAME}
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost'
  IDENTIFIED BY '${DB_PASS}';

GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';

ALTER USER '${DB_USER}'@'localhost'
  IDENTIFIED WITH mysql_native_password BY '${DB_PASS}';

GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';

FLUSH PRIVILEGES;
SQL

echo ""
echo "========================================="
echo "[OK] セットアップ完了"
echo "  Database : ${DB_NAME}"
echo "  User     : ${DB_USER}"
echo "  Password : ${DB_PASS}"
echo "========================================="
echo "次のステップ:"
echo "  1. config/config.js のパスワードを上記に合わせる"
echo "  2. node data/data_reset.js  (スキーマ適用 + マスターデータ投入)"
echo "========================================="
