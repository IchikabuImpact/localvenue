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
  // true: 予想を常に上書き（開発用）/ false: 予想が既にあればスキップ（運用モード）
  debug: false,
  // スコアリング補正設定。相対パスはプロジェクトルート基準。未指定時は config/scoring/default.json
  scoringConfigPath: 'config/scoring/default.json',
  // 生成済み静的HTMLの保持日数（この日数より古いものをバッチ実行時に自動削除）
  htmlRetentionDays: 30
};
