// config/api.config.js の見本。コピーして接続情報を入れる（config/api.config.js は git 管理外）。
// 出馬表API（scripts/api-server.js）専用。予想・結果のバッチが使う config/config.js とは別にしてある。
// 本番DBに負荷をかけないよう、開発用DB（毎晩本番から同期）を読む想定。
module.exports = {
  host: '0.0.0.0', // LAN 内から呼べるようにする。外に公開しないこと
  port: 8132,
  mysql: {
    host: 'localhost',
    user: 'localvenue_dev',
    password: 'YOUR_PASSWORD',
    database: 'localvenue_dev',
    port: 3306,
  },
};
