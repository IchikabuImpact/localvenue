# 101〜104 結果取得・予想評価・ROI集計リファクタリングメモ

最終更新: 2026-05-29

## 目的

`101-save-result-db.js`、`102-eval-prediction.js`、`103-eval-roi.js`、`104-aggregate-roi-daily.js` のCLI契約と終了コードを保ちながら、DDD / Onion Architecture に寄せる第一段階を実施した。

## 保持する外部契約

```bash
node scripts/101-save-result-db.js YYYYMMDDRRBB
node scripts/102-eval-prediction.js YYYYMMDDRRBB [--stake-win 100] [--stake-place 100]
node scripts/103-eval-roi.js --from YYYY-MM-DD --to YYYY-MM-DD [--model yosou-v1]
node scripts/104-aggregate-roi-daily.js [YYYYMMDD]
```

101 の未確定 exit 2、102 の predictionなし exit 2 / resultなし exit 3 は維持する。

## 変更後の構造

```text
scripts/lib/result/      # 101: Rakuten結果HTML取得/解析/保存
scripts/lib/evaluation/  # 102: 的中評価と single/place ROI
scripts/lib/roi/         # 103/104: EV ROI と日次ROI集計
```

## Unit Test の対象

- NAR race_id から楽天 race_id 候補生成
- 楽天結果HTMLから着順/単勝/複勝の抽出
- prediction.memo と race_payouts による的中評価
- EV ROI 計算、日次ROI引数処理

## まだ Integration / Smoke Test に回すもの

- 楽天競馬への実HTTP
- MySQL実DBへの `race_results` / `race_payouts` / `prediction_eval` / `prediction_roi` / `prediction_roi_daily` 保存
- `daily-result-batch.js` からの 101〜104 通し実行
