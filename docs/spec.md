# LocalVenue 現状仕様 (As-Is)

最終更新: 2026-11-03

---

## 1. システムの目的

- NAR/楽天競馬由来のデータを取得し、MySQLに蓄積する
- スコアリングロジックで予想を生成し、DBに保存する
- 保存済みデータから静的HTMLを生成し、`public/` に出力する
- 生成済みの静的HTMLを公開環境へ反映する

---

## 2. バッチ構成

### 2.1 予想バッチ（朝）
- エントリポイント: `cron/yosou.sh` → `scripts/daily-yosou-batch.js`
- 実行順: 001（カレンダー）→ 002（レース数）→ 003（race_id列挙）→ 004+005（出馬表+予想、並列2）
- 完了後: `generate-daily-pages.js`（HTML生成）→ ヘルスチェック（異常時は `recover-daily.js`）→ `autoupdate.sh`（push）
- 1日に複数回実行する。実行時刻は各環境の crontab で管理する

### 2.2 結果バッチ（夜）
- エントリポイント: `cron/result.sh` → `scripts/daily-result-batch.js`
- 実行順: 003 → 101（結果）→ 102（評価）→ 103（ROI）→ 104（日次集計）→ HTML生成
- 完了後: ヘルスチェック（異常時は `recover-daily.js --result`）→ `autoupdate.sh`（push）
- 開催時間中に複数回実行する。実行時刻は各環境の crontab で管理する
- 101 exit 2（未確定）/ 102 exit 2（予想なし）/ exit 3（結果なし）はスキップして続行

### 2.3 月次バッチ
- エントリポイント: `cron/monthly.sh`
- 実行内容: external_request_logクリーンアップ → 騎手ランキング → 2歳種牡馬ランキング → 種牡馬ランキング（距離×馬場状態別）
- 調教師ランキングは含まれない（`scripts/ops/monthly-fetch-trainer-ranking.sh` で手動取得）
- 月1回実行する。実行時刻は各環境の crontab で管理する

### 2.4 静的ページ生成
- エントリポイント: `scripts/generate-daily-pages.js`
- 出力: `public/index.html` / `public/recovery.html` / `public/YYYYMMDDRRBB.html` / `public/daily/YYYYMMDD/`
- 保持期間: `config.htmlRetentionDays`（デフォルト30日）を超えた日付のファイルを自動削除

### 2.5 ヘルスチェック
- 日次ヘルスチェック: `cron/health-check.sh` → `scripts/ops/daily-health-check.js`（当日分のレース数・予想数・生成HTML数の整合性、`horse_win_pattern_rules`テーブルの存在を確認）
- schema.sqlとDBのカラム照合: `cron/schema-drift-check.sh` → `scripts/ops/schema-drift-check.js`（詳細は [HORSE_PATTERN_RULES.md](HORSE_PATTERN_RULES.md) の運用ルール参照）
  - `data/schema.sql` の `CREATE TABLE` 定義と実DBの `information_schema.COLUMNS` を突き合わせ、schema.sqlにあってDBに無いカラム／テーブルを検出する
  - 2026-08-17〜19に発生した「コードとschema.sqlはpushしたが本番DBへのALTER TABLEを適用し忘れ、cronバッチが2日間失敗し続けた」事故の再発防止用。ユニットテストはDBをモックするため気付けない領域を、実DB照合でカバーする
  - 異常時は `logs/alerts.log` に `ALERT` 行を出力（通知連携は別途検討中）

---

## 3. 予想ロジック（yosou-v1）

`scripts/005-predict-race.js`（実処理は `scripts/lib/prediction/`）によるスコアリング。Claude等の外部AIは不使用。

**コアファクター:**

| 要素 | 内容 |
|------|------|
| 騎手スコア | jockey_ranking と頭3文字前方一致 |
| 調教師スコア | trainer_ranking と前方一致 + レースクラス乗数（0.4〜1.0） |
| 種牡馬スコア | sire_ranking と前方一致（馬場状態別、`all` にフォールバック） |
| カスタム | 偶数馬番=馬番値加算、年齢2歳+40/3歳+30/4歳+20 |
| 若駒レース補正 | 3歳以下が6割以上のレースで、種牡馬スコアと2歳種牡馬ランキングを加味 |

**コアに上乗せする補正:**

| 種類 | 内容 |
|------|------|
| 期間限定ボーナス | 設定ファイルの期間内のみ、血統・斤量条件に応じてコアスコアの%を加算 |
| 馬別ルール | `horse_win_pattern_rules` の条件に一致した馬に加算 |
| サテライト | 着順改善・重不良・距離実績・クラス上昇・上がり3F・ペース想定 |
| 会場別サテライト | 高知・佐賀の距離別脚質 |
| 夏季馬体重補正 | 7〜9月のみ、最終スコアに ×1.05 / ×0.95 |

詳細: → `docs/PREDICTION_SCORING.md`, `docs/HORSE_PATTERN_RULES.md`

- 最高得点1頭を `best`（◎）に選出
- 全頭スコアを `prediction.memo.items` JSON に格納
- 上位5頭を `○` として表示

---

## 4. 評価・ROI集計

- `prediction_eval`: race_idごとの単勝・複勝・馬複の的中フラグと払戻額
- `prediction_roi`: strategy 別のレース単位ROI（102: single/place/quinella、103: ev_win/ev_place）
- `prediction_roi_daily`: 日次ROI（ymd × strategy）
- `prediction_roi_summary`: 指定日を終点にした期間別ROIサマリー（直近30日 × strategy）

公開ページの評価対象: **単勝（single）・複勝（place）・馬複4頭ボックス（quinella、6点）の3種**

---

## 5. デプロイ構成

```
バッチ実行環境（生成 → git push）→ GitHub（main）→ VPS（git pull → 静的配信）
```

- VPS は `git pull` するだけで HTML / CSS / JS が更新される。VPS では動的なプログラムを動かさない
- `autoupdate.sh` は push 前に `git pull --rebase -X ours` を実行
- 公開環境の具体的なホスト名・ユーザー名・絶対パスは、公開ドキュメントに含めない

---

## 6. JBIS スロットル制御

- `scripts/lib/jbis-throttle.js` が JBIS へのリクエスト間隔を制御
- 最低間隔: 7秒 + ランダムジッター 0〜2秒（WAF対策）
- リクエスト履歴を `external_request_log` テーブルに記録
- monthly.sh が毎月1日に当月以前のログを削除

---

## 7. ブログ

- `content/blog/*.md` を `scripts/generate-blog-pages.js` で `public/blog/` へ変換する（手動実行）
- 日次のHTML生成は、トップページに最新記事のティザーを表示するために記事一覧だけを読む
- 詳細: → `docs/BLOG_DESIGN.md`, `docs/BLOG_REQUIREMENTS.md`
