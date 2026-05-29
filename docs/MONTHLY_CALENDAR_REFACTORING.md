# 001 月間開催カレンダー取得リファクタリングメモ

最終更新: 2026-05-29

## 目的

`001-save-monthly-calendar.js` と `001-save-monthly-calendar-rakuten.js` の既存の呼び出し方を保ったまま、段階的に DDD / Onion Architecture に寄せるための第一段階を実施した。

今回のゴールは「完全な層分離」ではなく、以下の2点を優先する。

1. 日次バッチや npm script からの既存呼び出しを壊さない。
2. HTTP / DB に依存しない処理を切り出し、Unit Test で固定する。

## 保持する外部契約

以下の呼び出しは継続して有効である。

```bash
node scripts/001-save-monthly-calendar.js
node scripts/001-save-monthly-calendar.js 2025 09
node scripts/001-save-monthly-calendar.js 20250913
node scripts/001-save-monthly-calendar.js 202509

node scripts/001-save-monthly-calendar-rakuten.js
node scripts/001-save-monthly-calendar-rakuten.js 2026 06
node scripts/001-save-monthly-calendar-rakuten.js 20260526
node scripts/001-save-monthly-calendar-rakuten.js 202606
```

また `package.json` の `scrape:month` は引き続き `node scripts/001-save-monthly-calendar.js` を呼ぶ。

## 変更後の構造

```text
scripts/
  001-save-monthly-calendar.js
  001-save-monthly-calendar-rakuten.js

scripts/lib/calendar/
  parse-year-month.js
  venue-codes.js
  race-days.js
  keiba-go-jp-calendar-client.js
  keiba-go-jp-calendar-parser.js
  rakuten-calendar-client.js
  rakuten-calendar-parser.js
  mysql-calendar-repository.js
  save-monthly-calendar-use-case.js

tests/unit/calendar/
  parse-year-month.test.js
  calendar-parsers.test.js
  save-monthly-calendar-use-case.test.js
```

## レイヤー対応

現時点では `src/` への大移動は行わず、既存の `scripts/` 配下で段階的に分離している。

| 層 | 今回のファイル | 役割 |
|---|---|---|
| Interface / CLI | `scripts/001-save-monthly-calendar*.js` | 既存CLI契約を維持する薄い entrypoint |
| Application | `save-monthly-calendar-use-case.js` | 取得 → 解析 → 件数確認 → 保存のユースケース |
| Domain helper | `parse-year-month.js`, `venue-codes.js`, `race-days.js` | 年月解釈、会場コード、開催日Map操作 |
| Infrastructure HTTP | `keiba-go-jp-calendar-client.js`, `rakuten-calendar-client.js` | 外部サイトからHTMLを取得 |
| Infrastructure Parser | `keiba-go-jp-calendar-parser.js`, `rakuten-calendar-parser.js` | 外部HTMLを内部データへ変換 |
| Infrastructure DB | `mysql-calendar-repository.js` | `calendar` テーブルへの保存 |

## 依存方向

今回の第一段階では、主に以下の方向へ寄せた。

```text
CLI entrypoint
  -> UseCase
    -> CalendarClient interface相当
    -> CalendarParser interface相当
    -> CalendarRepository interface相当

Infrastructure classes
  -> axios / cheerio / mysql2
```

JavaScript上の明示的な interface はまだ導入していないが、UseCase は `fetchMonthlyCalendar` / `parse` / `saveRaceDays` を持つオブジェクトに依存する形にした。これにより Unit Test では fake を注入できる。

## Unit Test の対象

DBや実HTTPを使わずに、以下を `node:test` で固定した。

- `parseYearMonth`
  - `YYYYMMDD`
  - `YYYYMM`
  - `YYYY M`
  - 年のみ指定
  - 引数なし
- `parseKeibaGoJpSchedule`
  - `k_raceDate` / `k_babaCode` から開催日を抽出
  - 対象外会場を除外
  - 同一日・同一会場の重複を除外
- `parseRakutenSchedule`
  - `RACEID` から日付と会場コードを復元
  - 帯広ばんえいを除外
  - 同一日・同一会場の重複を除外
- `SaveMonthlyCalendarUseCase`
  - 開催情報ありの場合に repository へ保存する
  - 開催情報なしの場合に保存しない

## schema.sql との照合結果

今回の `MySqlCalendarRepository` は `calendar (race_date, venucode, venue)` に対して upsert する。`data/schema.sql` の `calendar` テーブルは以下の定義であり、列名・型・主キーは repository の保存対象と整合している。

- `race_date` は `date NOT NULL`
- `venucode` は `int NOT NULL`
- `venue` は `varchar(255) DEFAULT NULL`
- 主キーは `(race_date, venucode)`

この確認は `tests/unit/calendar/mysql-calendar-repository.test.js` にも追加し、実DBがない環境でも schema 定義と保存SQLの基本的なずれを検知できるようにした。

## まだ Unit Test にしないもの

以下は Unit Test ではなく、今後 Integration / Smoke Test として扱う。

- `MySqlCalendarRepository`
  - MySQL 接続、transaction、`ON DUPLICATE KEY UPDATE` の確認が主目的のため。
- `KeibaGoJpCalendarClient` / `RakutenCalendarClient` の実HTTP疎通
  - 外部サイト状態に依存するため、Unit Test の必須経路にはしない。
- CLI全体の実行
  - 実DB・実HTTPが必要なため、Smoke Test として別扱いにする。

## フォールバック方針

`001-save-monthly-calendar.js` の keiba.go.jp 取得失敗時に、`001-save-monthly-calendar-rakuten.js` を `spawn` する既存挙動は維持している。

将来的には `SaveMonthlyCalendarUseCase` が複数 provider を順番に試す構造へ移せるが、今回は呼び出し互換と変更範囲の小ささを優先し、フォールバックは CLI entrypoint 側に残した。

## 次の候補

1. `MySqlCalendarRepository` 用の test DB Integration Test を追加する。
2. `CalendarClient` / `CalendarParser` / `CalendarRepository` の JSDoc typedef を追加し、擬似interfaceを明文化する。
3. `scripts/lib/calendar` を将来的に `src/application`, `src/domain`, `src/infrastructure` へ移す。
4. 楽天フォールバックを provider 配列方式に移し、UseCase 側で扱えるようにする。
