/**
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */
module.exports = {
  mysql: {
    host: 'localhost',
    user: 'YOUR_USER',
    password: 'YOUR_PASSWORD',
    database: 'YOUR_DB',
    port: 3306
  },
  // 生成済み静的HTMLの保持日数（この日数より古いものをバッチ実行時に自動削除）
  htmlRetentionDays: 30
};
