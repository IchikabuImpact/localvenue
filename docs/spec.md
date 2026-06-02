# LocalVenue 現状仕様 (As-Is)

最終更新: 2026-05-28

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
- 完了後: `generate-daily-pages.js`（HTML生成）→ `autoupdate.sh`（push）
- cron: 7:55 / 8:00 / 10:10〜20:40（30分おき）

### 2.2 結果バッチ（夜）
- エントリポイント: `cron/result.sh` → `scripts/daily-result-batch.js`
- 実行順: 003 → 101（結果）→ 102（評価）→ 103（ROI）→ 104（日次集計）→ HTML生成
- 完了後: `autoupdate.sh`（push）
- cron: 10:30〜21:00（30分おき、予想バッチの20分後）
- 101 exit 2（未確定）/ 102 exit 2（予想なし）/ exit 3（結果なし）はスキップして続行

### 2.3 月次バッチ
- エントリポイント: `cron/monthly.sh`
- 実行内容: external_request_logクリーンアップ → 騎手ランキング → 種牡馬ランキング（距離別）
- cron: 毎月1日 3:00

### 2.4 静的ページ生成
- エントリポイント: `scripts/generate-daily-pages.js`
- 出力: `public/index.html` / `public/recovery.html` / `public/YYYYMMDDRRBB.html` / `public/daily/YYYYMMDD/`
- 保持期間: `config.htmlRetentionDays`（デフォルト30日）を超えた日付のファイルを自動削除

---

## 3. 予想ロジック（yosou-v1）

`scripts/005-predict-race.js` によるスコアリング。Claude等の外部AIは不使用。

| 要素 | 内容 |
|------|------|
| 騎手スコア | jockey_ranking と頭3文字前方一致 |
| 調教師スコア | trainer_ranking と前方一致 |
| 種牡馬スコア | sire_ranking と前方一致 |
| 偶数馬番ボーナス | 馬番の値をそのまま加算 |
| 年齢ボーナス | 2歳+40 / 3歳+30 / 4歳+20 |

- 最高得点1頭を `best`（◎）に選出
- 全頭スコアを `prediction.memo.items` JSON に格納
- 上位5頭を `○` として表示

---

## 4. 評価・ROI集計

- `prediction_eval`: race_idごとの単勝・複勝的中フラグと払戻額
- `prediction_roi`: strategy（single/place）別の累積ROI
- `prediction_roi_daily`: 日次ROI（ymd × strategy）

現在の評価対象: **単勝（single）・複勝（place）の2種**

---

## 5. デプロイ構成

```
バッチ実行環境 → GitHub（main）→ 公開環境
```

- `autoupdate.sh` は push 前に `git pull --rebase -X ours` を実行
- 公開環境の具体的なホスト名・ユーザー名・絶対パスは、公開ドキュメントに含めない

---

## 6. JBIS スロットル制御

- `scripts/lib/jbis-throttle.js` が JBIS へのリクエスト間隔を制御
- 最低間隔: 7秒 + ランダムジッター 0〜2秒（WAF対策）
- リクエスト履歴を `external_request_log` テーブルに記録
- monthly.sh が毎月1日に当月以前のログを削除

---

## 7. 今後の拡張予定

### 馬複5頭ボックス予想（次セッション）
- `prediction.memo.items` 上位5頭で馬複ボックス10点購入を想定
- 追加が必要なもの:
  - `102-eval-prediction.js`: 馬複的中判定ロジック
  - `prediction_roi` の strategy: `quinella` を追加
  - `104-aggregate-roi-daily.js`: quinella集計
  - `generate-daily-pages.js`: 馬複結果表示
  - `prediction_eval`: 馬複用カラム追加（schema変更）
