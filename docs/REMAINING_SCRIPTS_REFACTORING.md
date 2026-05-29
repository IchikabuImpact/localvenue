# Remaining Scripts Refactoring Notes

## 目的

`001`〜`005`、`101`〜`104` と同じ方針で、残っていた運用系スクリプトも「薄い CLI entrypoint」と「テスト可能な lib 層」に分離しました。既存の呼び出し方・環境変数・標準出力の意味は維持し、HTTP / DB / child_process への依存を lib の境界へ寄せています。

## 対象

- `daily-yosou-batch.js`
- `daily-result-batch.js`
- `fetch-jockey-ranking.js`
- `fetch-sire-ranking.js`
- `fetch-trainer-ranking.js`
- `generate-daily-pages.js`
- `dump-db-context.js`
- `init-db-connection.js`
- `setup-phase1.js`
- `server.js`

## レイヤ分割

| 領域 | 新しい配置 | 役割 |
|---|---|---|
| 共通日付/CLI | `scripts/lib/shared/*` | JST 今日、YYYYMMDD 変換、`--name=value` 形式のオプション取得 |
| バッチ実行 | `scripts/lib/batch/batch-utils.js` | Node 子プロセス実行、stdout capture、race_id 出力の整形、並列数制御、バッチログ |
| JBIS ranking | `scripts/lib/ranking/jbis-ranking.js` | URL 生成、HTTP retry、HTML parse、ranking テーブル保存、順位スコア変換 |
| ページ生成補助 | `scripts/lib/pagegen/page-utils.js` | JSON memo の安全な decode、merge conflict marker 除去、保持期限 cutoff 算出 |
| DB 運用 | `scripts/lib/db/*` | DB 作成、Phase1 table 作成、DB context markdown 生成 |
| 静的サーバ | `scripts/lib/server/static-server.js` | Express static app の生成と起動 |

## 方針

1. **CLI は薄く保つ**
   - 引数・環境変数・ログの入口だけを各 `scripts/*.js` に残します。
   - 実処理は `scripts/lib/**` に寄せ、unit test で検証できる形にします。

2. **既存の運用契約は壊さない**
   - `daily-yosou-batch.js [YYYYMMDD]` / `daily-result-batch.js [YYYYMMDD]` の呼び出し方を維持します。
   - `PARALLEL`, `NODE_BIN`, `STAKE_WIN`, `STAKE_PLACE` の扱いも維持します。
   - JBIS ranking の URL パラメータ、rate limit logging、DB upsert の意味を維持します。

3. **DB / HTTP / child_process を差し替え可能にする**
   - `createNodeRunner()` は `spawnFn` / `existsFn` を差し替えられます。
   - ranking / DB helper は MySQL client や axios client を注入できるようにし、実 DB なしでテスト可能にしています。

4. **大きい HTML 生成は段階的に分離する**
   - 今回は安全な純粋関数（JSON decode、conflict marker 除去、cutoff 算出）を先に切り出しました。
   - `generate-daily-pages.js` のテンプレート生成やクエリ分離は、画面差分が大きくなりやすいため次回以降に小さく進めます。

## Unit Test の範囲

- バッチ共通処理: race_id 出力整形、並列実行制御、Node runner の stdout capture。
- 日付共通処理: JST 今日、YYYYMMDD/ISO 変換。
- JBIS ranking: URL contract、people/sire ranking parser、rank score 変換。
- ページ生成補助: JSON parse、merge conflict marker 除去、保持期限 cutoff。
- DB 運用補助: DB config 解決、CREATE TABLE SQL、markdown escape。
- 静的サーバ: Express app の生成。

## 次の候補

- `generate-daily-pages.js` の SQL query と HTML template をさらに `Repository` / `Renderer` に分ける。
- ranking scripts の DB 保存部分を `Repository` class として命名し直す。
- 実 MySQL / HTTP を使う smoke test は、ローカルまたは CI の専用環境が用意できた段階で追加する。
