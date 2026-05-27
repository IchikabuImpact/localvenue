# 外部セキュリティ簡易診断レポート（IPAの一般的な観点）

- 対象: `https://kenchanbaken.pinkgold.space/`
- 実施日 (UTC): 2026-05-27
- 実施方式: 外部からの非破壊・ブラックボックス簡易確認（手動 + curl）

## 1) 主要な確認結果（要約）

- **重大な露出は現時点で未検出**（`.git`, `.env`, `phpinfo.php`, `server-status`, `wp-admin`, `/api/` などは 404）。
- **HTTPセキュリティヘッダは良好**。
  - `Content-Security-Policy`, `HSTS`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` を確認。
- **TLS必須運用の方向性は良好**（HTTPS応答に HSTS あり）。
- **単純な反射型XSS/SQLi/パストラバーサル文字列の混入は確認できず**（静的HTML配信の挙動）。

## 2) 実施コマンド

```bash
curl -I -L --max-time 15 https://kenchanbaken.pinkgold.space/
curl -sS -L --max-time 20 https://kenchanbaken.pinkgold.space/ | head -n 80
curl -sS --max-time 15 https://kenchanbaken.pinkgold.space/robots.txt
curl -sS --max-time 15 https://kenchanbaken.pinkgold.space/.well-known/security.txt

for p in / /index.html /login /admin /.git/HEAD /.env /phpinfo.php /server-status /wp-admin/ /api/; do
  code=$(curl -s -o /tmp/out -w '%{http_code}' --max-time 10 https://kenchanbaken.pinkgold.space$p)
  echo "$p $code"
done

curl -s -X OPTIONS -i --max-time 10 https://kenchanbaken.pinkgold.space/ | head -n 20
```

## 3) 観点別評価（IPAで一般的に気をつけるレベル）

### A. 入力値起点の典型脆弱性（XSS/SQLi/OSコマンド注入など）
- 観測上、公開ページは静的HTML中心で、問い合わせフォームや明示的な動的入力点は未確認。
- `index.html?q=...` に対する簡易ペイロード投入で反射は見られず。
- ただし、**非公開エンドポイントや将来追加機能は未評価**。

### B. 設定不備・情報漏えい
- 代表的な漏えいパス（`.git/HEAD`, `.env`, `phpinfo.php`, `server-status` 等）は 404。
- `robots.txt` と `/.well-known/security.txt` は未配置（404）。
  - 脆弱性ではないが、連絡窓口整備の観点では `security.txt` を置く価値あり。

### C. ブラウザ防御ヘッダ
- 以下を確認し、内容も妥当:
  - `content-security-policy: default-src 'self'; ... frame-ancestors 'none'`
  - `strict-transport-security: max-age=31536000; includeSubDomains; preload`
  - `x-frame-options: DENY`
  - `x-content-type-options: nosniff`
  - `referrer-policy: strict-origin-when-cross-origin`
  - `permissions-policy: geolocation=(), microphone=(), camera=()`

### D. HTTPメソッド
- `OPTIONS` 応答で `OPTIONS,HEAD,GET,POST` を許可。
- 現状の公開面が静的に近いため、実害は低めだが、不要なら `POST` を閉じる運用も検討可。

## 4) 推奨アクション（優先順）

1. **運用監視の整備**: WAF/アクセスログ監視とアラート（4xx/5xx急増、異常UA、連続スキャン）
2. **`security.txt` の設置**: 連絡先・PGPキー・開示ポリシー明記
3. **不要メソッドの最小化**: 使っていない `POST` を閉じる
4. **定期診断の自動化**: 月次でヘッダ確認・露出ファイル確認・依存更新チェック

## 5) 免責・限界

- 本結果は**外部からの限定的な簡易診断**です。
- サーバ内部設定、アプリ実装、認証領域、CI/CD、依存ライブラリ、クラウド権限等は未検証。
- 本格的には、ステージング環境での認証付き動的診断（DAST）＋コード診断（SAST）を推奨。
