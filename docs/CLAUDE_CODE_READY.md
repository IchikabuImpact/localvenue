# Claude Code 作業準備ノート（初版）

最終更新: 2026-11-03

## 目的
日次運用を壊さずに Claude Code が安全に作業開始できるよう、最小限の共通前提を定義します。

## 最低限メンテナンスするドキュメント
- `README.md`: セットアップ手順・運用手順（オペレーター向け）
- `docs/ARCHITECTURE.md`: スクリプト別の引数・終了コード・入出力
- `docs/spec.md`: 現状の運用と責務（As-Is）
- `docs/PREDICTION_SCORING.md`: 予想スコアの仕様
- `docs/REFAC_PROPOSAL.md`: リファクタリング計画と進捗

## エージェント向け推奨ルール
1. CLI 引数形式を変更する場合は、`README.md` と `docs/ARCHITECTURE.md` を同時更新する。
2. 日付指定バッチは同日再実行時の冪等性を維持する。
3. 終了コードの意味を API 契約として扱う。
4. DB 影響のある変更では、コミットメッセージ/PR本文に対象テーブルを明記する。
## 並行作業の分担例
- A担当: 収集・予想（`001`〜`005`, `daily-yosou-batch.js`）
- B担当: 結果・評価（`101`〜`104`, `daily-result-batch.js`）
- C担当: 静的ページ生成（`generate-daily-pages.js`, `public/` テンプレート）
- D担当: ドキュメント・契約（`README.md`, `docs/*.md`）

## クイック検証チェックリスト
- `npm run yosou:date -- 20260201`
- `npm run result:date -- 20260201`
- `node scripts/generate-daily-pages.js 20260201`
- `public/` 配下の生成ファイルが想定通り更新されることを確認する
