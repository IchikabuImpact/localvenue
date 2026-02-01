# Database Context

Generated at: 2026-02-01T00:38:19.407Z

## Table: baba

### Schema

| Field | Type | Null | Key | Default | Extra |
|---|---|---|---|---|---|
| baba_code | tinyint | NO |  | 0 |  |
| baba_name | text | YES |  | null |  |
| rakuten_baba_code | char(4) | YES |  | null |  |

### Data (39 rows)

| baba_code | baba_name | rakuten_baba_code |
| --- | --- | --- |
| 1 | 北見ば | NULL |
| 2 | 岩見ば | NULL |
| 3 | 帯広ば | 0304 |
| 4 | 旭川ば | NULL |
| 7 | 旭川 | NULL |
| 8 | 札幌 | NULL |
| 10 | 盛岡 | 1006 |
| 11 | 水沢 | 1106 |
| 12 | 上山 | NULL |
| 15 | 足利 | NULL |
| 16 | 宇都宮 | NULL |
| 17 | 高崎 | NULL |
| 18 | 浦和 | 1800 |
| 19 | 船橋 | 1914 |
| 20 | 大井 | 2015 |
| 21 | 川崎 | 2135 |
| 22 | 金沢 | 2218 |
| 23 | 笠松 | 2300 |
| 24 | 名古屋 | 2400 |
| 25 | 中京 | NULL |
| 27 | 園田 | 2726 |
| 28 | 姫路 | 2800 |
| 30 | 福山 | NULL |
| 31 | 高知 | 3129 |
| 32 | 佐賀 | 3230 |
| 33 | 荒尾 | NULL |
| 36 | 門別 | 3600 |
| 41 | ばんえ | NULL |
| 42 | 北海道 | NULL |
| 43 | 岩手 | NULL |
| 44 | 新潟 | NULL |
| 45 | 北関東 | NULL |
| 46 | 南関東 | NULL |
| 47 | 栃木 | NULL |
| 48 | 東海 | NULL |
| 49 | 愛知 | NULL |
| 50 | 兵庫 | NULL |
| 61 | 九州 | NULL |
| 80 | 全国 | NULL |

---

## Table: calendar

### Schema

| Field | Type | Null | Key | Default | Extra |
|---|---|---|---|---|---|
| race_date | date | NO | PRI | null |  |
| venucode | int | NO | PRI | null |  |
| venue | varchar(255) | YES |  | null |  |

### Data (384 rows)

| race_date | venucode | venue |
| --- | --- | --- |
| 2025-09-30T15:00:00.000Z | 19 | 船橋 |
| 2025-09-30T15:00:00.000Z | 24 | 名古屋 |
| 2025-09-30T15:00:00.000Z | 27 | 園田 |
| 2025-09-30T15:00:00.000Z | 36 | 門別 |
| 2025-10-01T15:00:00.000Z | 19 | 船橋 |
| 2025-10-01T15:00:00.000Z | 24 | 名古屋 |
| 2025-10-01T15:00:00.000Z | 27 | 園田 |
| 2025-10-01T15:00:00.000Z | 36 | 門別 |
| 2025-10-02T15:00:00.000Z | 19 | 船橋 |
| 2025-10-02T15:00:00.000Z | 24 | 名古屋 |
| 2025-10-02T15:00:00.000Z | 27 | 園田 |
| 2025-10-03T15:00:00.000Z | 31 | 高知 |
| 2025-10-03T15:00:00.000Z | 32 | 佐賀 |
| 2025-10-04T15:00:00.000Z | 11 | 水沢 |
| 2025-10-04T15:00:00.000Z | 20 | 大井 |
| 2025-10-04T15:00:00.000Z | 31 | 高知 |
| 2025-10-04T15:00:00.000Z | 32 | 佐賀 |
| 2025-10-05T15:00:00.000Z | 11 | 水沢 |
| 2025-10-05T15:00:00.000Z | 20 | 大井 |
| 2025-10-05T15:00:00.000Z | 22 | 金沢 |
| 2025-10-06T15:00:00.000Z | 11 | 水沢 |
| 2025-10-06T15:00:00.000Z | 20 | 大井 |
| 2025-10-06T15:00:00.000Z | 22 | 金沢 |
| 2025-10-06T15:00:00.000Z | 23 | 笠松 |
| 2025-10-06T15:00:00.000Z | 36 | 門別 |
| 2025-10-07T15:00:00.000Z | 20 | 大井 |
| 2025-10-07T15:00:00.000Z | 23 | 笠松 |
| 2025-10-07T15:00:00.000Z | 27 | 園田 |
| 2025-10-07T15:00:00.000Z | 36 | 門別 |
| 2025-10-08T15:00:00.000Z | 20 | 大井 |
| 2025-10-08T15:00:00.000Z | 23 | 笠松 |
| 2025-10-08T15:00:00.000Z | 27 | 園田 |
| 2025-10-08T15:00:00.000Z | 36 | 門別 |
| 2025-10-09T15:00:00.000Z | 20 | 大井 |
| 2025-10-09T15:00:00.000Z | 23 | 笠松 |
| 2025-10-09T15:00:00.000Z | 27 | 園田 |
| 2025-10-10T15:00:00.000Z | 22 | 金沢 |
| 2025-10-10T15:00:00.000Z | 31 | 高知 |
| 2025-10-10T15:00:00.000Z | 32 | 佐賀 |
| 2025-10-11T15:00:00.000Z | 10 | 盛岡 |
| 2025-10-11T15:00:00.000Z | 22 | 金沢 |
| 2025-10-11T15:00:00.000Z | 31 | 高知 |
| 2025-10-11T15:00:00.000Z | 32 | 佐賀 |
| 2025-10-12T15:00:00.000Z | 10 | 盛岡 |
| 2025-10-12T15:00:00.000Z | 21 | 川崎 |
| 2025-10-12T15:00:00.000Z | 32 | 佐賀 |
| 2025-10-13T15:00:00.000Z | 10 | 盛岡 |
| 2025-10-13T15:00:00.000Z | 21 | 川崎 |
| 2025-10-13T15:00:00.000Z | 22 | 金沢 |
| 2025-10-13T15:00:00.000Z | 24 | 名古屋 |
| 2025-10-13T15:00:00.000Z | 36 | 門別 |
| 2025-10-14T15:00:00.000Z | 21 | 川崎 |
| 2025-10-14T15:00:00.000Z | 24 | 名古屋 |
| 2025-10-14T15:00:00.000Z | 27 | 園田 |
| 2025-10-14T15:00:00.000Z | 36 | 門別 |
| 2025-10-15T15:00:00.000Z | 21 | 川崎 |
| 2025-10-15T15:00:00.000Z | 24 | 名古屋 |
| 2025-10-15T15:00:00.000Z | 27 | 園田 |
| 2025-10-15T15:00:00.000Z | 36 | 門別 |
| 2025-10-16T15:00:00.000Z | 21 | 川崎 |
| 2025-10-16T15:00:00.000Z | 24 | 名古屋 |
| 2025-10-16T15:00:00.000Z | 27 | 園田 |
| 2025-10-17T15:00:00.000Z | 31 | 高知 |
| 2025-10-17T15:00:00.000Z | 32 | 佐賀 |
| 2025-10-18T15:00:00.000Z | 10 | 盛岡 |
| 2025-10-18T15:00:00.000Z | 22 | 金沢 |
| 2025-10-18T15:00:00.000Z | 31 | 高知 |
| 2025-10-18T15:00:00.000Z | 32 | 佐賀 |
| 2025-10-19T15:00:00.000Z | 10 | 盛岡 |
| 2025-10-19T15:00:00.000Z | 20 | 大井 |
| 2025-10-20T15:00:00.000Z | 10 | 盛岡 |
| 2025-10-20T15:00:00.000Z | 20 | 大井 |
| 2025-10-20T15:00:00.000Z | 22 | 金沢 |
| 2025-10-20T15:00:00.000Z | 23 | 笠松 |
| 2025-10-20T15:00:00.000Z | 36 | 門別 |
| 2025-10-21T15:00:00.000Z | 20 | 大井 |
| 2025-10-21T15:00:00.000Z | 23 | 笠松 |
| 2025-10-21T15:00:00.000Z | 27 | 園田 |
| 2025-10-21T15:00:00.000Z | 36 | 門別 |
| 2025-10-22T15:00:00.000Z | 20 | 大井 |
| 2025-10-22T15:00:00.000Z | 23 | 笠松 |
| 2025-10-22T15:00:00.000Z | 27 | 園田 |
| 2025-10-22T15:00:00.000Z | 36 | 門別 |
| 2025-10-23T15:00:00.000Z | 20 | 大井 |
| 2025-10-23T15:00:00.000Z | 23 | 笠松 |
| 2025-10-23T15:00:00.000Z | 27 | 園田 |
| 2025-10-24T15:00:00.000Z | 22 | 金沢 |
| 2025-10-24T15:00:00.000Z | 31 | 高知 |
| 2025-10-24T15:00:00.000Z | 32 | 佐賀 |
| 2025-10-25T15:00:00.000Z | 10 | 盛岡 |
| 2025-10-25T15:00:00.000Z | 31 | 高知 |
| 2025-10-25T15:00:00.000Z | 32 | 佐賀 |
| 2025-10-26T15:00:00.000Z | 10 | 盛岡 |
| 2025-10-26T15:00:00.000Z | 18 | 浦和 |
| 2025-10-26T15:00:00.000Z | 22 | 金沢 |
| 2025-10-26T15:00:00.000Z | 32 | 佐賀 |
| 2025-10-27T15:00:00.000Z | 10 | 盛岡 |
| 2025-10-27T15:00:00.000Z | 18 | 浦和 |
| 2025-10-27T15:00:00.000Z | 22 | 金沢 |
| 2025-10-27T15:00:00.000Z | 24 | 名古屋 |
| 2025-10-27T15:00:00.000Z | 27 | 園田 |
| 2025-10-27T15:00:00.000Z | 36 | 門別 |
| 2025-10-28T15:00:00.000Z | 18 | 浦和 |
| 2025-10-28T15:00:00.000Z | 24 | 名古屋 |
| 2025-10-28T15:00:00.000Z | 27 | 園田 |
| 2025-10-28T15:00:00.000Z | 36 | 門別 |
| 2025-10-29T15:00:00.000Z | 18 | 浦和 |
| 2025-10-29T15:00:00.000Z | 24 | 名古屋 |
| 2025-10-29T15:00:00.000Z | 27 | 園田 |
| 2025-10-29T15:00:00.000Z | 36 | 門別 |
| 2025-10-30T15:00:00.000Z | 18 | 浦和 |
| 2025-10-30T15:00:00.000Z | 24 | 名古屋 |
| 2025-10-31T15:00:00.000Z | 10 | 盛岡 |
| 2025-10-31T15:00:00.000Z | 31 | 高知 |
| 2025-10-31T15:00:00.000Z | 32 | 佐賀 |
| 2025-11-01T15:00:00.000Z | 10 | 盛岡 |
| 2025-11-01T15:00:00.000Z | 31 | 高知 |
| 2025-11-01T15:00:00.000Z | 32 | 佐賀 |
| 2025-11-02T15:00:00.000Z | 19 | 船橋 |
| 2025-11-02T15:00:00.000Z | 27 | 園田 |
| 2025-11-02T15:00:00.000Z | 36 | 門別 |
| 2025-11-03T15:00:00.000Z | 10 | 盛岡 |
| 2025-11-03T15:00:00.000Z | 19 | 船橋 |
| 2025-11-03T15:00:00.000Z | 22 | 金沢 |
| 2025-11-03T15:00:00.000Z | 23 | 笠松 |
| 2025-11-03T15:00:00.000Z | 27 | 園田 |
| 2025-11-04T15:00:00.000Z | 19 | 船橋 |
| 2025-11-04T15:00:00.000Z | 22 | 金沢 |
| 2025-11-04T15:00:00.000Z | 23 | 笠松 |
| 2025-11-04T15:00:00.000Z | 27 | 園田 |
| 2025-11-04T15:00:00.000Z | 36 | 門別 |
| 2025-11-05T15:00:00.000Z | 19 | 船橋 |
| 2025-11-05T15:00:00.000Z | 23 | 笠松 |
| 2025-11-05T15:00:00.000Z | 27 | 園田 |
| 2025-11-05T15:00:00.000Z | 36 | 門別 |
| 2025-11-06T15:00:00.000Z | 19 | 船橋 |
| 2025-11-06T15:00:00.000Z | 24 | 名古屋 |
| 2025-11-06T15:00:00.000Z | 32 | 佐賀 |
| 2025-11-07T15:00:00.000Z | 31 | 高知 |
| 2025-11-07T15:00:00.000Z | 32 | 佐賀 |
| 2025-11-08T15:00:00.000Z | 22 | 金沢 |
| 2025-11-08T15:00:00.000Z | 31 | 高知 |
| 2025-11-08T15:00:00.000Z | 32 | 佐賀 |
| 2025-11-09T15:00:00.000Z | 10 | 盛岡 |
| 2025-11-09T15:00:00.000Z | 20 | 大井 |
| 2025-11-09T15:00:00.000Z | 22 | 金沢 |
| 2025-11-09T15:00:00.000Z | 24 | 名古屋 |
| 2025-11-10T15:00:00.000Z | 10 | 盛岡 |
| 2025-11-10T15:00:00.000Z | 20 | 大井 |
| 2025-11-10T15:00:00.000Z | 22 | 金沢 |
| 2025-11-10T15:00:00.000Z | 24 | 名古屋 |
| 2025-11-10T15:00:00.000Z | 27 | 園田 |
| 2025-11-10T15:00:00.000Z | 36 | 門別 |
| 2025-11-11T15:00:00.000Z | 10 | 盛岡 |
| 2025-11-11T15:00:00.000Z | 20 | 大井 |
| 2025-11-11T15:00:00.000Z | 24 | 名古屋 |
| 2025-11-11T15:00:00.000Z | 27 | 園田 |
| 2025-11-11T15:00:00.000Z | 36 | 門別 |
| 2025-11-12T15:00:00.000Z | 20 | 大井 |
| 2025-11-12T15:00:00.000Z | 24 | 名古屋 |
| 2025-11-12T15:00:00.000Z | 27 | 園田 |
| 2025-11-12T15:00:00.000Z | 36 | 門別 |
| 2025-11-13T15:00:00.000Z | 20 | 大井 |
| 2025-11-13T15:00:00.000Z | 23 | 笠松 |
| 2025-11-14T15:00:00.000Z | 31 | 高知 |
| 2025-11-14T15:00:00.000Z | 32 | 佐賀 |
| 2025-11-15T15:00:00.000Z | 10 | 盛岡 |
| 2025-11-15T15:00:00.000Z | 22 | 金沢 |
| 2025-11-15T15:00:00.000Z | 31 | 高知 |
| 2025-11-15T15:00:00.000Z | 32 | 佐賀 |
| 2025-11-16T15:00:00.000Z | 10 | 盛岡 |
| 2025-11-16T15:00:00.000Z | 21 | 川崎 |
| 2025-11-16T15:00:00.000Z | 22 | 金沢 |
| 2025-11-17T15:00:00.000Z | 10 | 盛岡 |
| 2025-11-17T15:00:00.000Z | 21 | 川崎 |
| 2025-11-17T15:00:00.000Z | 23 | 笠松 |
| 2025-11-17T15:00:00.000Z | 27 | 園田 |
| 2025-11-18T15:00:00.000Z | 21 | 川崎 |
| 2025-11-18T15:00:00.000Z | 23 | 笠松 |
| 2025-11-18T15:00:00.000Z | 27 | 園田 |
| 2025-11-19T15:00:00.000Z | 21 | 川崎 |
| 2025-11-19T15:00:00.000Z | 24 | 名古屋 |
| 2025-11-19T15:00:00.000Z | 27 | 園田 |
| 2025-11-20T15:00:00.000Z | 21 | 川崎 |
| 2025-11-20T15:00:00.000Z | 24 | 名古屋 |
| 2025-11-21T15:00:00.000Z | 32 | 佐賀 |
| 2025-11-22T15:00:00.000Z | 22 | 金沢 |
| 2025-11-22T15:00:00.000Z | 31 | 高知 |
| 2025-11-22T15:00:00.000Z | 32 | 佐賀 |
| 2025-11-23T15:00:00.000Z | 11 | 水沢 |
| 2025-11-23T15:00:00.000Z | 22 | 金沢 |
| 2025-11-23T15:00:00.000Z | 31 | 高知 |
| 2025-11-23T15:00:00.000Z | 32 | 佐賀 |
| 2025-11-24T15:00:00.000Z | 11 | 水沢 |
| 2025-11-24T15:00:00.000Z | 18 | 浦和 |
| 2025-11-24T15:00:00.000Z | 22 | 金沢 |
| 2025-11-24T15:00:00.000Z | 24 | 名古屋 |
| 2025-11-24T15:00:00.000Z | 27 | 園田 |
| 2025-11-25T15:00:00.000Z | 11 | 水沢 |
| 2025-11-25T15:00:00.000Z | 18 | 浦和 |
| 2025-11-25T15:00:00.000Z | 24 | 名古屋 |
| 2025-11-25T15:00:00.000Z | 27 | 園田 |
| 2025-11-26T15:00:00.000Z | 18 | 浦和 |
| 2025-11-26T15:00:00.000Z | 23 | 笠松 |
| 2025-11-26T15:00:00.000Z | 27 | 園田 |
| 2025-11-27T15:00:00.000Z | 18 | 浦和 |
| 2025-11-27T15:00:00.000Z | 23 | 笠松 |
| 2025-11-28T15:00:00.000Z | 31 | 高知 |
| 2025-11-29T15:00:00.000Z | 11 | 水沢 |
| 2025-11-29T15:00:00.000Z | 31 | 高知 |
| 2025-11-29T15:00:00.000Z | 32 | 佐賀 |
| 2025-11-30T15:00:00.000Z | 11 | 水沢 |
| 2025-11-30T15:00:00.000Z | 20 | 大井 |
| 2025-11-30T15:00:00.000Z | 22 | 金沢 |
| 2025-11-30T15:00:00.000Z | 23 | 笠松 |
| 2025-12-01T15:00:00.000Z | 11 | 水沢 |
| 2025-12-01T15:00:00.000Z | 20 | 大井 |
| 2025-12-01T15:00:00.000Z | 22 | 金沢 |
| 2025-12-01T15:00:00.000Z | 27 | 園田 |
| 2025-12-02T15:00:00.000Z | 20 | 大井 |
| 2025-12-02T15:00:00.000Z | 23 | 笠松 |
| 2025-12-02T15:00:00.000Z | 27 | 園田 |
| 2025-12-03T15:00:00.000Z | 20 | 大井 |
| 2025-12-03T15:00:00.000Z | 24 | 名古屋 |
| 2025-12-03T15:00:00.000Z | 27 | 園田 |
| 2025-12-04T15:00:00.000Z | 20 | 大井 |
| 2025-12-04T15:00:00.000Z | 24 | 名古屋 |
| 2025-12-05T15:00:00.000Z | 31 | 高知 |
| 2025-12-05T15:00:00.000Z | 32 | 佐賀 |
| 2025-12-06T15:00:00.000Z | 22 | 金沢 |
| 2025-12-06T15:00:00.000Z | 31 | 高知 |
| 2025-12-06T15:00:00.000Z | 32 | 佐賀 |
| 2025-12-07T15:00:00.000Z | 11 | 水沢 |
| 2025-12-07T15:00:00.000Z | 19 | 船橋 |
| 2025-12-07T15:00:00.000Z | 22 | 金沢 |
| 2025-12-08T15:00:00.000Z | 11 | 水沢 |
| 2025-12-08T15:00:00.000Z | 19 | 船橋 |
| 2025-12-08T15:00:00.000Z | 22 | 金沢 |
| 2025-12-08T15:00:00.000Z | 24 | 名古屋 |
| 2025-12-08T15:00:00.000Z | 27 | 園田 |
| 2025-12-09T15:00:00.000Z | 11 | 水沢 |
| 2025-12-09T15:00:00.000Z | 19 | 船橋 |
| 2025-12-09T15:00:00.000Z | 24 | 名古屋 |
| 2025-12-09T15:00:00.000Z | 27 | 園田 |
| 2025-12-10T15:00:00.000Z | 19 | 船橋 |
| 2025-12-10T15:00:00.000Z | 23 | 笠松 |
| 2025-12-10T15:00:00.000Z | 27 | 園田 |
| 2025-12-11T15:00:00.000Z | 19 | 船橋 |
| 2025-12-11T15:00:00.000Z | 23 | 笠松 |
| 2025-12-12T15:00:00.000Z | 31 | 高知 |
| 2025-12-12T15:00:00.000Z | 32 | 佐賀 |
| 2025-12-13T15:00:00.000Z | 11 | 水沢 |
| 2025-12-13T15:00:00.000Z | 22 | 金沢 |
| 2025-12-13T15:00:00.000Z | 31 | 高知 |
| 2025-12-13T15:00:00.000Z | 32 | 佐賀 |
| 2025-12-14T15:00:00.000Z | 11 | 水沢 |
| 2025-12-14T15:00:00.000Z | 21 | 川崎 |
| 2025-12-14T15:00:00.000Z | 22 | 金沢 |
| 2025-12-15T15:00:00.000Z | 11 | 水沢 |
| 2025-12-15T15:00:00.000Z | 21 | 川崎 |
| 2025-12-15T15:00:00.000Z | 22 | 金沢 |
| 2025-12-15T15:00:00.000Z | 23 | 笠松 |
| 2025-12-15T15:00:00.000Z | 27 | 園田 |
| 2025-12-16T15:00:00.000Z | 21 | 川崎 |
| 2025-12-16T15:00:00.000Z | 23 | 笠松 |
| 2025-12-16T15:00:00.000Z | 27 | 園田 |
| 2025-12-17T15:00:00.000Z | 21 | 川崎 |
| 2025-12-17T15:00:00.000Z | 24 | 名古屋 |
| 2025-12-17T15:00:00.000Z | 27 | 園田 |
| 2025-12-18T15:00:00.000Z | 21 | 川崎 |
| 2025-12-18T15:00:00.000Z | 22 | 金沢 |
| 2025-12-18T15:00:00.000Z | 24 | 名古屋 |
| 2025-12-19T15:00:00.000Z | 31 | 高知 |
| 2025-12-19T15:00:00.000Z | 32 | 佐賀 |
| 2025-12-20T15:00:00.000Z | 11 | 水沢 |
| 2025-12-20T15:00:00.000Z | 31 | 高知 |
| 2025-12-20T15:00:00.000Z | 32 | 佐賀 |
| 2025-12-21T15:00:00.000Z | 11 | 水沢 |
| 2025-12-21T15:00:00.000Z | 18 | 浦和 |
| 2025-12-21T15:00:00.000Z | 24 | 名古屋 |
| 2025-12-22T15:00:00.000Z | 11 | 水沢 |
| 2025-12-22T15:00:00.000Z | 18 | 浦和 |
| 2025-12-22T15:00:00.000Z | 24 | 名古屋 |
| 2025-12-22T15:00:00.000Z | 27 | 園田 |
| 2025-12-23T15:00:00.000Z | 18 | 浦和 |
| 2025-12-23T15:00:00.000Z | 20 | 大井 |
| 2025-12-23T15:00:00.000Z | 24 | 名古屋 |
| 2025-12-23T15:00:00.000Z | 27 | 園田 |
| 2025-12-24T15:00:00.000Z | 18 | 浦和 |
| 2025-12-24T15:00:00.000Z | 20 | 大井 |
| 2025-12-24T15:00:00.000Z | 27 | 園田 |
| 2025-12-25T15:00:00.000Z | 20 | 大井 |
| 2025-12-25T15:00:00.000Z | 22 | 金沢 |
| 2025-12-25T15:00:00.000Z | 23 | 笠松 |
| 2025-12-26T15:00:00.000Z | 22 | 金沢 |
| 2025-12-26T15:00:00.000Z | 32 | 佐賀 |
| 2025-12-27T15:00:00.000Z | 22 | 金沢 |
| 2025-12-27T15:00:00.000Z | 31 | 高知 |
| 2025-12-27T15:00:00.000Z | 32 | 佐賀 |
| 2025-12-28T15:00:00.000Z | 11 | 水沢 |
| 2025-12-28T15:00:00.000Z | 20 | 大井 |
| 2025-12-28T15:00:00.000Z | 23 | 笠松 |
| 2025-12-28T15:00:00.000Z | 27 | 園田 |
| 2025-12-28T15:00:00.000Z | 31 | 高知 |
| 2025-12-29T15:00:00.000Z | 11 | 水沢 |
| 2025-12-29T15:00:00.000Z | 20 | 大井 |
| 2025-12-29T15:00:00.000Z | 23 | 笠松 |
| 2025-12-29T15:00:00.000Z | 27 | 園田 |
| 2025-12-30T15:00:00.000Z | 11 | 水沢 |
| 2025-12-30T15:00:00.000Z | 20 | 大井 |
| 2025-12-30T15:00:00.000Z | 23 | 笠松 |
| 2025-12-30T15:00:00.000Z | 27 | 園田 |
| 2025-12-30T15:00:00.000Z | 31 | 高知 |
| 2026-01-31T15:00:00.000Z | 31 | 高知 |
| 2026-01-31T15:00:00.000Z | 32 | 佐賀 |
| 2026-02-01T15:00:00.000Z | 21 | 川崎 |
| 2026-02-01T15:00:00.000Z | 23 | 笠松 |
| 2026-02-01T15:00:00.000Z | 31 | 高知 |
| 2026-02-02T15:00:00.000Z | 21 | 川崎 |
| 2026-02-02T15:00:00.000Z | 28 | 姫路 |
| 2026-02-02T15:00:00.000Z | 31 | 高知 |
| 2026-02-03T15:00:00.000Z | 21 | 川崎 |
| 2026-02-03T15:00:00.000Z | 23 | 笠松 |
| 2026-02-03T15:00:00.000Z | 28 | 姫路 |
| 2026-02-04T15:00:00.000Z | 21 | 川崎 |
| 2026-02-04T15:00:00.000Z | 23 | 笠松 |
| 2026-02-04T15:00:00.000Z | 28 | 姫路 |
| 2026-02-05T15:00:00.000Z | 21 | 川崎 |
| 2026-02-05T15:00:00.000Z | 23 | 笠松 |
| 2026-02-06T15:00:00.000Z | 32 | 佐賀 |
| 2026-02-07T15:00:00.000Z | 31 | 高知 |
| 2026-02-07T15:00:00.000Z | 32 | 佐賀 |
| 2026-02-08T15:00:00.000Z | 19 | 船橋 |
| 2026-02-08T15:00:00.000Z | 24 | 名古屋 |
| 2026-02-09T15:00:00.000Z | 19 | 船橋 |
| 2026-02-09T15:00:00.000Z | 24 | 名古屋 |
| 2026-02-09T15:00:00.000Z | 28 | 姫路 |
| 2026-02-09T15:00:00.000Z | 31 | 高知 |
| 2026-02-10T15:00:00.000Z | 19 | 船橋 |
| 2026-02-10T15:00:00.000Z | 24 | 名古屋 |
| 2026-02-10T15:00:00.000Z | 28 | 姫路 |
| 2026-02-10T15:00:00.000Z | 31 | 高知 |
| 2026-02-11T15:00:00.000Z | 19 | 船橋 |
| 2026-02-11T15:00:00.000Z | 24 | 名古屋 |
| 2026-02-11T15:00:00.000Z | 28 | 姫路 |
| 2026-02-11T15:00:00.000Z | 32 | 佐賀 |
| 2026-02-12T15:00:00.000Z | 19 | 船橋 |
| 2026-02-12T15:00:00.000Z | 24 | 名古屋 |
| 2026-02-13T15:00:00.000Z | 32 | 佐賀 |
| 2026-02-14T15:00:00.000Z | 31 | 高知 |
| 2026-02-14T15:00:00.000Z | 32 | 佐賀 |
| 2026-02-15T15:00:00.000Z | 20 | 大井 |
| 2026-02-15T15:00:00.000Z | 23 | 笠松 |
| 2026-02-16T15:00:00.000Z | 20 | 大井 |
| 2026-02-16T15:00:00.000Z | 28 | 姫路 |
| 2026-02-16T15:00:00.000Z | 31 | 高知 |
| 2026-02-17T15:00:00.000Z | 20 | 大井 |
| 2026-02-17T15:00:00.000Z | 23 | 笠松 |
| 2026-02-17T15:00:00.000Z | 28 | 姫路 |
| 2026-02-17T15:00:00.000Z | 31 | 高知 |
| 2026-02-18T15:00:00.000Z | 20 | 大井 |
| 2026-02-18T15:00:00.000Z | 23 | 笠松 |
| 2026-02-18T15:00:00.000Z | 28 | 姫路 |
| 2026-02-19T15:00:00.000Z | 20 | 大井 |
| 2026-02-19T15:00:00.000Z | 23 | 笠松 |
| 2026-02-20T15:00:00.000Z | 32 | 佐賀 |
| 2026-02-21T15:00:00.000Z | 31 | 高知 |
| 2026-02-21T15:00:00.000Z | 32 | 佐賀 |
| 2026-02-22T15:00:00.000Z | 18 | 浦和 |
| 2026-02-22T15:00:00.000Z | 24 | 名古屋 |
| 2026-02-22T15:00:00.000Z | 31 | 高知 |
| 2026-02-24T15:00:00.000Z | 18 | 浦和 |
| 2026-02-24T15:00:00.000Z | 24 | 名古屋 |
| 2026-02-24T15:00:00.000Z | 28 | 姫路 |
| 2026-02-24T15:00:00.000Z | 31 | 高知 |
| 2026-02-24T15:00:00.000Z | 32 | 佐賀 |
| 2026-02-25T15:00:00.000Z | 18 | 浦和 |
| 2026-02-25T15:00:00.000Z | 24 | 名古屋 |
| 2026-02-25T15:00:00.000Z | 28 | 姫路 |
| 2026-02-26T15:00:00.000Z | 18 | 浦和 |
| 2026-02-26T15:00:00.000Z | 24 | 名古屋 |
| 2026-02-26T15:00:00.000Z | 28 | 姫路 |
| 2026-02-27T15:00:00.000Z | 18 | 浦和 |
| 2026-02-27T15:00:00.000Z | 32 | 佐賀 |

---

## Table: jockey_ranking

### Schema

| Field | Type | Null | Key | Default | Extra |
|---|---|---|---|---|---|
| year | int | NO | PRI | null |  |
| jockey_name | varchar(255) | NO | PRI | null |  |
| score | int | NO | MUL | null |  |

### Data (104 rows)

| year | jockey_name | score |
| --- | --- | --- |
| 2025 | 大柿 一真 | 1 |
| 2025 | 城野 慈尚 | 2 |
| 2025 | 達城 龍次 | 2 |
| 2025 | 松戸 政也 | 3 |
| 2025 | 竹村 達也 | 3 |
| 2025 | 宮内 勇樹 | 4 |
| 2025 | 佐野 遥久 | 5 |
| 2025 | 高木 健 | 6 |
| 2025 | 及川 裕一 | 7 |
| 2025 | 松本 一心 | 7 |
| 2025 | 木之前 葵 | 8 |
| 2025 | 大山 龍太郎 | 9 |
| 2025 | 友森 翔太郎 | 10 |
| 2025 | 大山 真吾 | 11 |
| 2025 | 宮川 実 | 12 |
| 2025 | 本橋 孝太 | 13 |
| 2025 | 畑中 信司 | 14 |
| 2025 | 郷間 勇太 | 14 |
| 2025 | 山崎 誠士 | 15 |
| 2025 | 出水 拓人 | 16 |
| 2025 | 小林 凌 | 17 |
| 2025 | 阿部 英俊 | 18 |
| 2025 | 竹吉 徹 | 19 |
| 2025 | 山本 咲希到 | 20 |
| 2025 | 川原 正一 | 21 |
| 2025 | 加茂 飛翔 | 22 |
| 2025 | 山崎 雅由 | 23 |
| 2025 | 福原 杏 | 24 |
| 2025 | 新庄 海誠 | 25 |
| 2025 | 高橋 愛叶 | 26 |
| 2025 | 岡 遼太郎 | 27 |
| 2025 | 藤田 凌 | 28 |
| 2025 | 村上 弘樹 | 29 |
| 2025 | 安藤 洋一 | 30 |
| 2025 | 杉浦 健太 | 31 |
| 2025 | 岡村 卓弥 | 32 |
| 2025 | 佐々木 志音 | 33 |
| 2025 | 金山 昇馬 | 34 |
| 2025 | 土方 颯太 | 35 |
| 2025 | 田野 豊三 | 36 |
| 2025 | 岩本 怜 | 37 |
| 2025 | 長谷部 駿弥 | 38 |
| 2025 | 岡村 健司 | 39 |
| 2025 | 鈴木 祐 | 40 |
| 2025 | 笹田 知宏 | 41 |
| 2025 | 吉井 章 | 42 |
| 2025 | 明星 晴大 | 43 |
| 2025 | 鴨宮 祥行 | 44 |
| 2025 | 長谷川 蓮 | 45 |
| 2025 | 服部 茂史 | 46 |
| 2025 | 大畑 慧悟 | 47 |
| 2025 | 岩橋 勇二 | 48 |
| 2025 | 大畑 雅章 | 49 |
| 2025 | 柴田 勇真 | 50 |
| 2025 | 張田 昂 | 51 |
| 2025 | 村上 忍 | 52 |
| 2025 | 岡部 誠 | 53 |
| 2025 | 宮下 瞳 | 54 |
| 2025 | 高橋 悠里 | 55 |
| 2025 | 塚本 涼人 | 56 |
| 2025 | 山中 悠希 | 57 |
| 2025 | 細川 智史 | 58 |
| 2025 | 山本 聡紀 | 59 |
| 2025 | 多田羅 誠也 | 60 |
| 2025 | 阿部 龍 | 61 |
| 2025 | 町田 直希 | 62 |
| 2025 | 菅原 辰徳 | 63 |
| 2025 | 和田 譲治 | 64 |
| 2025 | 西 啓太 | 65 |
| 2025 | 井上 瑛太 | 66 |
| 2025 | 桑村 真明 | 67 |
| 2025 | 加藤 翔馬 | 68 |
| 2025 | 山田 義貴 | 69 |
| 2025 | 小野 楓馬 | 70 |
| 2025 | 栗原 大河 | 71 |
| 2025 | 青柳 正義 | 72 |
| 2025 | 石川 慎将 | 73 |
| 2025 | 丸野 勝虎 | 74 |
| 2025 | 赤岡 修次 | 75 |
| 2025 | 今井 貴大 | 76 |
| 2025 | 下原 理 | 77 |
| 2025 | 筒井 勇介 | 78 |
| 2025 | 御神本 訓史 | 79 |
| 2025 | 山本 政聡 | 80 |
| 2025 | 飛田 愛斗 | 81 |
| 2025 | 本田 正重 | 82 |
| 2025 | 加藤 聡一 | 83 |
| 2025 | 山口 勲 | 84 |
| 2025 | 永森 大智 | 85 |
| 2025 | 吉原 寛人 | 86 |
| 2025 | 高松 亮 | 87 |
| 2025 | 廣瀬 航 | 88 |
| 2025 | 落合 玄太 | 89 |
| 2025 | 渡邊 竜也 | 90 |
| 2025 | 吉村 智洋 | 91 |
| 2025 | 中島 龍也 | 92 |
| 2025 | 野畑 凌 | 93 |
| 2025 | 石川 倭 | 94 |
| 2025 | 小牧 太 | 95 |
| 2025 | 望月 洵輝 | 96 |
| 2025 | 山本 聡哉 | 97 |
| 2025 | 塚本 征吾 | 98 |
| 2025 | 矢野 貴之 | 99 |
| 2025 | 笹川 翼 | 100 |

---

## Table: prediction

### Schema

| Field | Type | Null | Key | Default | Extra |
|---|---|---|---|---|---|
| prediction_id | bigint | NO | PRI | null | auto_increment |
| race_id | bigint | NO | MUL | null |  |
| model_version | varchar(32) | YES |  | null |  |
| memo | json | NO |  | null |  |
| created_at | timestamp | NO |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |

### Data (68 rows)

| prediction_id | race_id | model_version | memo | created_at |
| --- | --- | --- | --- | --- |
| 3 | 202510130110 | yosou-v1 | {"best":{"score":128,"breakdown":{"sire":0,"custom":32,"jockey":96},"horse_name":"スマイルバニラ","horse_number":2},"items":[{"score":128,"breakdown":{"sire":0,"custom":32,"jockey":96},"horse_name":"スマイルバニラ","horse_number":2},{"score":118,"breakdown":{"sire":0,"custom":30,"jockey":88},"horse_name":"ノーブルアイル","horse_number":3},{"score":91,"breakdown":{"sire":0,"custom":30,"jockey":61},"horse_name":"ラセーヌ","horse_number":11},{"score":89,"breakdown":{"sire":0,"custom":30,"jockey":59},"horse_name":"アイドルフェスタ","horse_number":1},{"score":52,"breakdown":{"sire":0,"custom":34,"jockey":18},"horse_name":"ソノバシノギ","horse_number":4},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"ダンストンローザ","horse_number":10},{"score":38,"breakdown":{"sire":0,"custom":38,"jockey":0},"horse_name":"グローブミッション","horse_number":8},{"score":36,"breakdown":{"sire":0,"custom":36,"jockey":0},"horse_name":"シプレーノート","horse_number":6},{"score":36,"breakdown":{"sire":0,"custom":0,"jockey":36},"horse_name":"キタスクワート","horse_number":9},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"メモリーメイラード","horse_number":5},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"ファータフィオーレ","horse_number":7}],"model":"yosou-v1","race_id":"202510130110","generatedAt":"2025-10-12T22:00:08.285Z"} | 2025-10-12T22:00:08.000Z |
| 4 | 202511160110 | yosou-v1 | {"best":{"score":128,"breakdown":{"sire":0,"custom":40,"jockey":88},"horse_name":"ユキノレックス","horse_number":7},"items":[{"score":128,"breakdown":{"sire":0,"custom":40,"jockey":88},"horse_name":"ユキノレックス","horse_number":7},{"score":99,"breakdown":{"sire":0,"custom":40,"jockey":59},"horse_name":"タカマキセブン","horse_number":3},{"score":82,"breakdown":{"sire":0,"custom":46,"jockey":36},"horse_name":"ラヴレインブーケ","horse_number":6},{"score":59,"breakdown":{"sire":0,"custom":44,"jockey":15},"horse_name":"ヤッティライネン","horse_number":4},{"score":57,"breakdown":{"sire":0,"custom":48,"jockey":9},"horse_name":"スピードブラッシュ","horse_number":8},{"score":42,"breakdown":{"sire":0,"custom":42,"jockey":0},"horse_name":"サマーカムカム","horse_number":2},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"モンサンジャスミン","horse_number":1},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"エボリスピナ","horse_number":5}],"model":"yosou-v1","race_id":"202511160110","generatedAt":"2025-11-16T10:46:21.098Z"} | 2025-11-16T10:46:21.000Z |
| 5 | 202511160210 | yosou-v1 | {"best":{"score":144,"breakdown":{"sire":0,"custom":48,"jockey":96},"horse_name":"サリーレチーマ","horse_number":8},"items":[{"score":144,"breakdown":{"sire":0,"custom":48,"jockey":96},"horse_name":"サリーレチーマ","horse_number":8},{"score":128,"breakdown":{"sire":0,"custom":40,"jockey":88},"horse_name":"シュガーストーン","horse_number":9},{"score":122,"breakdown":{"sire":0,"custom":40,"jockey":82},"horse_name":"アデレード","horse_number":11},{"score":105,"breakdown":{"sire":0,"custom":44,"jockey":61},"horse_name":"アクアノート","horse_number":4},{"score":99,"breakdown":{"sire":0,"custom":40,"jockey":59},"horse_name":"サンドロック","horse_number":5},{"score":94,"breakdown":{"sire":0,"custom":42,"jockey":52},"horse_name":"ルーネンバーグ","horse_number":2},{"score":86,"breakdown":{"sire":0,"custom":46,"jockey":40},"horse_name":"コンバットイズモ","horse_number":6},{"score":58,"breakdown":{"sire":0,"custom":40,"jockey":18},"horse_name":"ユウユウロッゲン","horse_number":7},{"score":50,"breakdown":{"sire":0,"custom":50,"jockey":0},"horse_name":"ジュノヴェール","horse_number":10},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"セイバーダンス","horse_number":1},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"ササキンアンジェラ","horse_number":3}],"model":"yosou-v1","race_id":"202511160210","generatedAt":"2025-11-16T10:46:21.183Z"} | 2025-11-16T10:46:21.000Z |
| 6 | 202511160310 | yosou-v1 | {"best":{"score":134,"breakdown":{"sire":0,"custom":38,"jockey":96},"horse_name":"シベリアンデネブ","horse_number":8},"items":[{"score":134,"breakdown":{"sire":0,"custom":38,"jockey":96},"horse_name":"シベリアンデネブ","horse_number":8},{"score":112,"breakdown":{"sire":0,"custom":30,"jockey":82},"horse_name":"レジリエント","horse_number":3},{"score":101,"breakdown":{"sire":0,"custom":40,"jockey":61},"horse_name":"ラセーヌ","horse_number":10},{"score":89,"breakdown":{"sire":0,"custom":30,"jockey":59},"horse_name":"アストラアヴィス","horse_number":9},{"score":82,"breakdown":{"sire":0,"custom":30,"jockey":52},"horse_name":"ギフテッドアベリア","horse_number":1},{"score":72,"breakdown":{"sire":0,"custom":32,"jockey":40},"horse_name":"ラグーンフライト","horse_number":2},{"score":66,"breakdown":{"sire":0,"custom":30,"jockey":36},"horse_name":"ミヤビノオウザ","horse_number":7},{"score":60,"breakdown":{"sire":0,"custom":42,"jockey":18},"horse_name":"ベルレンヌ","horse_number":12},{"score":36,"breakdown":{"sire":0,"custom":36,"jockey":0},"horse_name":"クラッチ","horse_number":6},{"score":34,"breakdown":{"sire":0,"custom":34,"jockey":0},"horse_name":"リースアンドリボン","horse_number":4},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"ライブリブランコ","horse_number":5},{"score":11,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"メイショウリリアム","horse_number":11}],"model":"yosou-v1","race_id":"202511160310","generatedAt":"2025-11-16T10:46:38.052Z"} | 2025-11-16T10:46:38.000Z |
| 7 | 202511160410 | yosou-v1 | {"best":{"score":88,"breakdown":{"sire":0,"custom":6,"jockey":82},"horse_name":"オルグージョ","horse_number":6},"items":[{"score":88,"breakdown":{"sire":0,"custom":6,"jockey":82},"horse_name":"オルグージョ","horse_number":6},{"score":44,"breakdown":{"sire":0,"custom":4,"jockey":40},"horse_name":"サクラトップスカイ","horse_number":4},{"score":44,"breakdown":{"sire":0,"custom":8,"jockey":36},"horse_name":"ラストパラダイス","horse_number":8},{"score":39,"breakdown":{"sire":0,"custom":30,"jockey":9},"horse_name":"アーブルラーブル","horse_number":1},{"score":38,"breakdown":{"sire":0,"custom":20,"jockey":18},"horse_name":"ワイルドブーケ","horse_number":7},{"score":32,"breakdown":{"sire":0,"custom":32,"jockey":0},"horse_name":"ジーティービート","horse_number":2},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"エンジェライト","horse_number":3},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"ナビール","horse_number":5},{"score":9,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"タイセイナトゥーラ","horse_number":9}],"model":"yosou-v1","race_id":"202511160410","generatedAt":"2025-11-16T10:46:38.266Z"} | 2025-11-16T10:46:38.000Z |
| 8 | 202511160510 | yosou-v1 | {"best":{"score":126,"breakdown":{"sire":0,"custom":30,"jockey":96},"horse_name":"ロバリアステージ","horse_number":7},"items":[{"score":126,"breakdown":{"sire":0,"custom":30,"jockey":96},"horse_name":"ロバリアステージ","horse_number":7},{"score":108,"breakdown":{"sire":0,"custom":26,"jockey":82},"horse_name":"ティーエスフェアリ","horse_number":6},{"score":108,"breakdown":{"sire":0,"custom":20,"jockey":88},"horse_name":"リメリック","horse_number":9},{"score":91,"breakdown":{"sire":0,"custom":32,"jockey":59},"horse_name":"カラジシ","horse_number":2},{"score":55,"breakdown":{"sire":0,"custom":40,"jockey":15},"horse_name":"ホロヨイマンゲツ","horse_number":10},{"score":44,"breakdown":{"sire":0,"custom":4,"jockey":40},"horse_name":"ストレート","horse_number":4},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"トレベルフィーユ","horse_number":1},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"ウインドモア","horse_number":3},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"オンザバサラ","horse_number":5},{"score":8,"breakdown":{"sire":0,"custom":8,"jockey":0},"horse_name":"メイショウフラム","horse_number":8}],"model":"yosou-v1","race_id":"202511160510","generatedAt":"2025-11-16T10:46:55.180Z"} | 2025-11-16T10:46:55.000Z |
| 9 | 202511160610 | yosou-v1 | {"best":{"score":93,"breakdown":{"sire":0,"custom":32,"jockey":61},"horse_name":"ヴィクトリアランド","horse_number":2},"items":[{"score":93,"breakdown":{"sire":0,"custom":32,"jockey":61},"horse_name":"ヴィクトリアランド","horse_number":2},{"score":79,"breakdown":{"sire":0,"custom":20,"jockey":59},"horse_name":"メッチャサザン","horse_number":3},{"score":70,"breakdown":{"sire":0,"custom":30,"jockey":40},"horse_name":"スパーク","horse_number":5},{"score":58,"breakdown":{"sire":0,"custom":40,"jockey":18},"horse_name":"アルデムラータ","horse_number":10},{"score":39,"breakdown":{"sire":0,"custom":30,"jockey":9},"horse_name":"メイショウイントロ","horse_number":7},{"score":38,"breakdown":{"sire":0,"custom":38,"jockey":0},"horse_name":"ライジンシチー","horse_number":8},{"score":34,"breakdown":{"sire":0,"custom":34,"jockey":0},"horse_name":"メモリーメイラード","horse_number":4},{"score":21,"breakdown":{"sire":0,"custom":6,"jockey":15},"horse_name":"クリノサンシャイン","horse_number":6},{"score":9,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"エルメルクリオ","horse_number":9},{"score":1,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"ドルチェヴィータ","horse_number":1}],"model":"yosou-v1","race_id":"202511160610","generatedAt":"2025-11-16T10:46:55.344Z"} | 2025-11-16T10:46:55.000Z |
| 10 | 202511160710 | yosou-v1 | {"best":{"score":97,"breakdown":{"sire":0,"custom":36,"jockey":61},"horse_name":"キタノフローラ","horse_number":6},"items":[{"score":97,"breakdown":{"sire":0,"custom":36,"jockey":61},"horse_name":"キタノフローラ","horse_number":6},{"score":97,"breakdown":{"sire":0,"custom":38,"jockey":59},"horse_name":"セラトーン","horse_number":8},{"score":88,"breakdown":{"sire":0,"custom":0,"jockey":88},"horse_name":"フェズカズマ","horse_number":1},{"score":52,"breakdown":{"sire":0,"custom":0,"jockey":52},"horse_name":"デフィデリ","horse_number":7},{"score":40,"breakdown":{"sire":0,"custom":22,"jockey":18},"horse_name":"ネコニコタツ","horse_number":2},{"score":33,"breakdown":{"sire":0,"custom":24,"jockey":9},"horse_name":"フジサンワイシーシ","horse_number":4},{"score":5,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"ハッシュタグ","horse_number":5},{"score":3,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"ローガンマウンテン","horse_number":3}],"model":"yosou-v1","race_id":"202511160710","generatedAt":"2025-11-16T10:47:12.251Z"} | 2025-11-16T10:47:12.000Z |
| 11 | 202511160810 | yosou-v1 | {"best":{"score":114,"breakdown":{"sire":0,"custom":32,"jockey":82},"horse_name":"コヴェナント","horse_number":2},"items":[{"score":114,"breakdown":{"sire":0,"custom":32,"jockey":82},"horse_name":"コヴェナント","horse_number":2},{"score":67,"breakdown":{"sire":0,"custom":8,"jockey":59},"horse_name":"ベアビリーブ","horse_number":8},{"score":58,"breakdown":{"sire":0,"custom":6,"jockey":52},"horse_name":"モルデュール","horse_number":6},{"score":39,"breakdown":{"sire":0,"custom":30,"jockey":9},"horse_name":"コルヴィーナ","horse_number":11},{"score":36,"breakdown":{"sire":0,"custom":0,"jockey":36},"horse_name":"キャビネットバトル","horse_number":1},{"score":20,"breakdown":{"sire":0,"custom":20,"jockey":0},"horse_name":"ミリオーレアルバ","horse_number":7},{"score":18,"breakdown":{"sire":0,"custom":0,"jockey":18},"horse_name":"エムティヒビキ","horse_number":3},{"score":15,"breakdown":{"sire":0,"custom":0,"jockey":15},"horse_name":"バイオレットモーヴ","horse_number":9},{"score":10,"breakdown":{"sire":0,"custom":10,"jockey":0},"horse_name":"ジュンツーポイント","horse_number":10},{"score":5,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"エイシンヌチマシヌ","horse_number":5},{"score":4,"breakdown":{"sire":0,"custom":4,"jockey":0},"horse_name":"キッカケ","horse_number":4}],"model":"yosou-v1","race_id":"202511160810","generatedAt":"2025-11-16T10:47:12.397Z"} | 2025-11-16T10:47:12.000Z |
| 12 | 202511160910 | yosou-v1 | {"best":{"score":136,"breakdown":{"sire":0,"custom":40,"jockey":96},"horse_name":"アルシャンティ","horse_number":10},"items":[{"score":136,"breakdown":{"sire":0,"custom":40,"jockey":96},"horse_name":"アルシャンティ","horse_number":10},{"score":108,"breakdown":{"sire":0,"custom":20,"jockey":88},"horse_name":"ジュレヴァー","horse_number":7},{"score":82,"breakdown":{"sire":0,"custom":0,"jockey":82},"horse_name":"ハーイ","horse_number":5},{"score":61,"breakdown":{"sire":0,"custom":0,"jockey":61},"horse_name":"ヒロシゲウェーブ","horse_number":9},{"score":58,"breakdown":{"sire":0,"custom":6,"jockey":52},"horse_name":"ロコルルハーツ","horse_number":6},{"score":48,"breakdown":{"sire":0,"custom":12,"jockey":36},"horse_name":"オラフ","horse_number":12},{"score":45,"breakdown":{"sire":0,"custom":30,"jockey":15},"horse_name":"エーデルムート","horse_number":11},{"score":44,"breakdown":{"sire":0,"custom":4,"jockey":40},"horse_name":"ボルドーグリフォン","horse_number":4},{"score":20,"breakdown":{"sire":0,"custom":20,"jockey":0},"horse_name":"パワームーブ","horse_number":3},{"score":9,"breakdown":{"sire":0,"custom":0,"jockey":9},"horse_name":"エースレイジング","horse_number":1},{"score":8,"breakdown":{"sire":0,"custom":8,"jockey":0},"horse_name":"ハウファアイルゴー","horse_number":8},{"score":2,"breakdown":{"sire":0,"custom":2,"jockey":0},"horse_name":"レースラヴェンダー","horse_number":2}],"model":"yosou-v1","race_id":"202511160910","generatedAt":"2025-11-16T10:47:29.306Z"} | 2025-11-16T10:47:29.000Z |
| 13 | 202511161010 | yosou-v1 | {"best":{"score":94,"breakdown":{"sire":0,"custom":6,"jockey":88},"horse_name":"ロッキータイタン","horse_number":6},"items":[{"score":94,"breakdown":{"sire":0,"custom":6,"jockey":88},"horse_name":"ロッキータイタン","horse_number":6},{"score":82,"breakdown":{"sire":0,"custom":0,"jockey":82},"horse_name":"ビッグリュウオー","horse_number":7},{"score":82,"breakdown":{"sire":0,"custom":30,"jockey":52},"horse_name":"チェンジオブハート","horse_number":9},{"score":70,"breakdown":{"sire":0,"custom":30,"jockey":40},"horse_name":"スカーレットクロス","horse_number":1},{"score":65,"breakdown":{"sire":0,"custom":4,"jockey":61},"horse_name":"ホウオウエーデル","horse_number":4},{"score":50,"breakdown":{"sire":0,"custom":32,"jockey":18},"horse_name":"インカノメザメ","horse_number":2},{"score":36,"breakdown":{"sire":0,"custom":0,"jockey":36},"horse_name":"ビービーアクティブ","horse_number":3},{"score":35,"breakdown":{"sire":0,"custom":20,"jockey":15},"horse_name":"リリーピンシャー","horse_number":11},{"score":20,"breakdown":{"sire":0,"custom":20,"jockey":0},"horse_name":"エスカルチャ","horse_number":5},{"score":17,"breakdown":{"sire":0,"custom":8,"jockey":9},"horse_name":"タイキモンストル","horse_number":8},{"score":10,"breakdown":{"sire":0,"custom":10,"jockey":0},"horse_name":"エイシンデュエラー","horse_number":10}],"model":"yosou-v1","race_id":"202511161010","generatedAt":"2025-11-16T10:47:29.515Z"} | 2025-11-16T10:47:29.000Z |
| 14 | 202511161110 | yosou-v1 | {"best":{"score":98,"breakdown":{"sire":0,"custom":2,"jockey":96},"horse_name":"ウラヤ","horse_number":2},"items":[{"score":98,"breakdown":{"sire":0,"custom":2,"jockey":96},"horse_name":"ウラヤ","horse_number":2},{"score":98,"breakdown":{"sire":0,"custom":10,"jockey":88},"horse_name":"スターシューター","horse_number":10},{"score":85,"breakdown":{"sire":0,"custom":26,"jockey":59},"horse_name":"オスカーブレイン","horse_number":6},{"score":82,"breakdown":{"sire":0,"custom":0,"jockey":82},"horse_name":"ロードオブザチェコ","horse_number":1},{"score":61,"breakdown":{"sire":0,"custom":0,"jockey":61},"horse_name":"スプラウティング","horse_number":3},{"score":56,"breakdown":{"sire":0,"custom":4,"jockey":52},"horse_name":"ブリスタイム","horse_number":4},{"score":40,"breakdown":{"sire":0,"custom":0,"jockey":40},"horse_name":"ファイナルキング","horse_number":11},{"score":36,"breakdown":{"sire":0,"custom":0,"jockey":36},"horse_name":"レディブラウン","horse_number":5},{"score":28,"breakdown":{"sire":0,"custom":28,"jockey":0},"horse_name":"エイシントルペード","horse_number":8},{"score":18,"breakdown":{"sire":0,"custom":0,"jockey":18},"horse_name":"グットフォーチュン","horse_number":9},{"score":15,"breakdown":{"sire":0,"custom":0,"jockey":15},"horse_name":"アップテンペスト","horse_number":7},{"score":12,"breakdown":{"sire":0,"custom":12,"jockey":0},"horse_name":"グアドループ","horse_number":12}],"model":"yosou-v1","race_id":"202511161110","generatedAt":"2025-11-16T10:47:46.344Z"} | 2025-11-16T10:47:46.000Z |
| 15 | 202511161210 | yosou-v1 | {"best":{"score":126,"breakdown":{"sire":0,"custom":30,"jockey":96},"horse_name":"ショウナンナスカ","horse_number":7},"items":[{"score":126,"breakdown":{"sire":0,"custom":30,"jockey":96},"horse_name":"ショウナンナスカ","horse_number":7},{"score":118,"breakdown":{"sire":0,"custom":30,"jockey":88},"horse_name":"トンヤイビーン","horse_number":9},{"score":112,"breakdown":{"sire":0,"custom":30,"jockey":82},"horse_name":"ヒナノツルツル","horse_number":5},{"score":74,"breakdown":{"sire":0,"custom":22,"jockey":52},"horse_name":"ミツカネトーラス","horse_number":2},{"score":70,"breakdown":{"sire":0,"custom":30,"jockey":40},"horse_name":"ネイビス","horse_number":11},{"score":67,"breakdown":{"sire":0,"custom":8,"jockey":59},"horse_name":"モンサンイルベント","horse_number":8},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"ジェイルブレイク","horse_number":10},{"score":29,"breakdown":{"sire":0,"custom":20,"jockey":9},"horse_name":"タイガードラゴン","horse_number":3},{"score":24,"breakdown":{"sire":0,"custom":6,"jockey":18},"horse_name":"ユウユウスプレマン","horse_number":6},{"score":4,"breakdown":{"sire":0,"custom":4,"jockey":0},"horse_name":"キタノクーヴェル","horse_number":4},{"score":1,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"マカベウス","horse_number":1}],"model":"yosou-v1","race_id":"202511161210","generatedAt":"2025-11-16T10:47:46.532Z"} | 2025-11-16T10:47:46.000Z |
| 16 | 202511160122 | yosou-v1 | {"best":{"score":128,"breakdown":{"sire":0,"custom":40,"jockey":88},"horse_name":"ユキノレックス","horse_number":7},"items":[{"score":128,"breakdown":{"sire":0,"custom":40,"jockey":88},"horse_name":"ユキノレックス","horse_number":7},{"score":99,"breakdown":{"sire":0,"custom":40,"jockey":59},"horse_name":"タカマキセブン","horse_number":3},{"score":82,"breakdown":{"sire":0,"custom":46,"jockey":36},"horse_name":"ラヴレインブーケ","horse_number":6},{"score":59,"breakdown":{"sire":0,"custom":44,"jockey":15},"horse_name":"ヤッティライネン","horse_number":4},{"score":57,"breakdown":{"sire":0,"custom":48,"jockey":9},"horse_name":"スピードブラッシュ","horse_number":8},{"score":42,"breakdown":{"sire":0,"custom":42,"jockey":0},"horse_name":"サマーカムカム","horse_number":2},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"モンサンジャスミン","horse_number":1},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"エボリスピナ","horse_number":5}],"model":"yosou-v1","race_id":"202511160122","generatedAt":"2025-11-16T10:48:03.460Z"} | 2025-11-16T10:48:03.000Z |
| 17 | 202511160222 | yosou-v1 | {"best":{"score":144,"breakdown":{"sire":0,"custom":48,"jockey":96},"horse_name":"サリーレチーマ","horse_number":8},"items":[{"score":144,"breakdown":{"sire":0,"custom":48,"jockey":96},"horse_name":"サリーレチーマ","horse_number":8},{"score":128,"breakdown":{"sire":0,"custom":40,"jockey":88},"horse_name":"シュガーストーン","horse_number":9},{"score":122,"breakdown":{"sire":0,"custom":40,"jockey":82},"horse_name":"アデレード","horse_number":11},{"score":105,"breakdown":{"sire":0,"custom":44,"jockey":61},"horse_name":"アクアノート","horse_number":4},{"score":99,"breakdown":{"sire":0,"custom":40,"jockey":59},"horse_name":"サンドロック","horse_number":5},{"score":94,"breakdown":{"sire":0,"custom":42,"jockey":52},"horse_name":"ルーネンバーグ","horse_number":2},{"score":86,"breakdown":{"sire":0,"custom":46,"jockey":40},"horse_name":"コンバットイズモ","horse_number":6},{"score":58,"breakdown":{"sire":0,"custom":40,"jockey":18},"horse_name":"ユウユウロッゲン","horse_number":7},{"score":50,"breakdown":{"sire":0,"custom":50,"jockey":0},"horse_name":"ジュノヴェール","horse_number":10},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"セイバーダンス","horse_number":1},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"ササキンアンジェラ","horse_number":3}],"model":"yosou-v1","race_id":"202511160222","generatedAt":"2025-11-16T10:48:03.599Z"} | 2025-11-16T10:48:03.000Z |
| 18 | 202511160322 | yosou-v1 | {"best":{"score":134,"breakdown":{"sire":0,"custom":38,"jockey":96},"horse_name":"シベリアンデネブ","horse_number":8},"items":[{"score":134,"breakdown":{"sire":0,"custom":38,"jockey":96},"horse_name":"シベリアンデネブ","horse_number":8},{"score":112,"breakdown":{"sire":0,"custom":30,"jockey":82},"horse_name":"レジリエント","horse_number":3},{"score":101,"breakdown":{"sire":0,"custom":40,"jockey":61},"horse_name":"ラセーヌ","horse_number":10},{"score":89,"breakdown":{"sire":0,"custom":30,"jockey":59},"horse_name":"アストラアヴィス","horse_number":9},{"score":82,"breakdown":{"sire":0,"custom":30,"jockey":52},"horse_name":"ギフテッドアベリア","horse_number":1},{"score":72,"breakdown":{"sire":0,"custom":32,"jockey":40},"horse_name":"ラグーンフライト","horse_number":2},{"score":66,"breakdown":{"sire":0,"custom":30,"jockey":36},"horse_name":"ミヤビノオウザ","horse_number":7},{"score":60,"breakdown":{"sire":0,"custom":42,"jockey":18},"horse_name":"ベルレンヌ","horse_number":12},{"score":36,"breakdown":{"sire":0,"custom":36,"jockey":0},"horse_name":"クラッチ","horse_number":6},{"score":34,"breakdown":{"sire":0,"custom":34,"jockey":0},"horse_name":"リースアンドリボン","horse_number":4},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"ライブリブランコ","horse_number":5},{"score":11,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"メイショウリリアム","horse_number":11}],"model":"yosou-v1","race_id":"202511160322","generatedAt":"2025-11-16T10:48:20.505Z"} | 2025-11-16T10:48:20.000Z |
| 19 | 202511160422 | yosou-v1 | {"best":{"score":88,"breakdown":{"sire":0,"custom":6,"jockey":82},"horse_name":"オルグージョ","horse_number":6},"items":[{"score":88,"breakdown":{"sire":0,"custom":6,"jockey":82},"horse_name":"オルグージョ","horse_number":6},{"score":44,"breakdown":{"sire":0,"custom":4,"jockey":40},"horse_name":"サクラトップスカイ","horse_number":4},{"score":44,"breakdown":{"sire":0,"custom":8,"jockey":36},"horse_name":"ラストパラダイス","horse_number":8},{"score":39,"breakdown":{"sire":0,"custom":30,"jockey":9},"horse_name":"アーブルラーブル","horse_number":1},{"score":38,"breakdown":{"sire":0,"custom":20,"jockey":18},"horse_name":"ワイルドブーケ","horse_number":7},{"score":32,"breakdown":{"sire":0,"custom":32,"jockey":0},"horse_name":"ジーティービート","horse_number":2},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"エンジェライト","horse_number":3},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"ナビール","horse_number":5},{"score":9,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"タイセイナトゥーラ","horse_number":9}],"model":"yosou-v1","race_id":"202511160422","generatedAt":"2025-11-16T10:48:20.773Z"} | 2025-11-16T10:48:20.000Z |
| 20 | 202511160522 | yosou-v1 | {"best":{"score":126,"breakdown":{"sire":0,"custom":30,"jockey":96},"horse_name":"ロバリアステージ","horse_number":7},"items":[{"score":126,"breakdown":{"sire":0,"custom":30,"jockey":96},"horse_name":"ロバリアステージ","horse_number":7},{"score":108,"breakdown":{"sire":0,"custom":26,"jockey":82},"horse_name":"ティーエスフェアリ","horse_number":6},{"score":108,"breakdown":{"sire":0,"custom":20,"jockey":88},"horse_name":"リメリック","horse_number":9},{"score":91,"breakdown":{"sire":0,"custom":32,"jockey":59},"horse_name":"カラジシ","horse_number":2},{"score":55,"breakdown":{"sire":0,"custom":40,"jockey":15},"horse_name":"ホロヨイマンゲツ","horse_number":10},{"score":44,"breakdown":{"sire":0,"custom":4,"jockey":40},"horse_name":"ストレート","horse_number":4},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"トレベルフィーユ","horse_number":1},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"ウインドモア","horse_number":3},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"オンザバサラ","horse_number":5},{"score":8,"breakdown":{"sire":0,"custom":8,"jockey":0},"horse_name":"メイショウフラム","horse_number":8}],"model":"yosou-v1","race_id":"202511160522","generatedAt":"2025-11-16T10:48:37.738Z"} | 2025-11-16T10:48:37.000Z |
| 21 | 202511160622 | yosou-v1 | {"best":{"score":93,"breakdown":{"sire":0,"custom":32,"jockey":61},"horse_name":"ヴィクトリアランド","horse_number":2},"items":[{"score":93,"breakdown":{"sire":0,"custom":32,"jockey":61},"horse_name":"ヴィクトリアランド","horse_number":2},{"score":79,"breakdown":{"sire":0,"custom":20,"jockey":59},"horse_name":"メッチャサザン","horse_number":3},{"score":70,"breakdown":{"sire":0,"custom":30,"jockey":40},"horse_name":"スパーク","horse_number":5},{"score":58,"breakdown":{"sire":0,"custom":40,"jockey":18},"horse_name":"アルデムラータ","horse_number":10},{"score":39,"breakdown":{"sire":0,"custom":30,"jockey":9},"horse_name":"メイショウイントロ","horse_number":7},{"score":38,"breakdown":{"sire":0,"custom":38,"jockey":0},"horse_name":"ライジンシチー","horse_number":8},{"score":34,"breakdown":{"sire":0,"custom":34,"jockey":0},"horse_name":"メモリーメイラード","horse_number":4},{"score":21,"breakdown":{"sire":0,"custom":6,"jockey":15},"horse_name":"クリノサンシャイン","horse_number":6},{"score":9,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"エルメルクリオ","horse_number":9},{"score":1,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"ドルチェヴィータ","horse_number":1}],"model":"yosou-v1","race_id":"202511160622","generatedAt":"2025-11-16T10:48:37.984Z"} | 2025-11-16T10:48:37.000Z |
| 22 | 202511160722 | yosou-v1 | {"best":{"score":97,"breakdown":{"sire":0,"custom":36,"jockey":61},"horse_name":"キタノフローラ","horse_number":6},"items":[{"score":97,"breakdown":{"sire":0,"custom":36,"jockey":61},"horse_name":"キタノフローラ","horse_number":6},{"score":97,"breakdown":{"sire":0,"custom":38,"jockey":59},"horse_name":"セラトーン","horse_number":8},{"score":88,"breakdown":{"sire":0,"custom":0,"jockey":88},"horse_name":"フェズカズマ","horse_number":1},{"score":52,"breakdown":{"sire":0,"custom":0,"jockey":52},"horse_name":"デフィデリ","horse_number":7},{"score":40,"breakdown":{"sire":0,"custom":22,"jockey":18},"horse_name":"ネコニコタツ","horse_number":2},{"score":33,"breakdown":{"sire":0,"custom":24,"jockey":9},"horse_name":"フジサンワイシーシ","horse_number":4},{"score":5,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"ハッシュタグ","horse_number":5},{"score":3,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"ローガンマウンテン","horse_number":3}],"model":"yosou-v1","race_id":"202511160722","generatedAt":"2025-11-16T10:48:55.031Z"} | 2025-11-16T10:48:55.000Z |
| 23 | 202511160822 | yosou-v1 | {"best":{"score":114,"breakdown":{"sire":0,"custom":32,"jockey":82},"horse_name":"コヴェナント","horse_number":2},"items":[{"score":114,"breakdown":{"sire":0,"custom":32,"jockey":82},"horse_name":"コヴェナント","horse_number":2},{"score":67,"breakdown":{"sire":0,"custom":8,"jockey":59},"horse_name":"ベアビリーブ","horse_number":8},{"score":58,"breakdown":{"sire":0,"custom":6,"jockey":52},"horse_name":"モルデュール","horse_number":6},{"score":39,"breakdown":{"sire":0,"custom":30,"jockey":9},"horse_name":"コルヴィーナ","horse_number":11},{"score":36,"breakdown":{"sire":0,"custom":0,"jockey":36},"horse_name":"キャビネットバトル","horse_number":1},{"score":20,"breakdown":{"sire":0,"custom":20,"jockey":0},"horse_name":"ミリオーレアルバ","horse_number":7},{"score":18,"breakdown":{"sire":0,"custom":0,"jockey":18},"horse_name":"エムティヒビキ","horse_number":3},{"score":15,"breakdown":{"sire":0,"custom":0,"jockey":15},"horse_name":"バイオレットモーヴ","horse_number":9},{"score":10,"breakdown":{"sire":0,"custom":10,"jockey":0},"horse_name":"ジュンツーポイント","horse_number":10},{"score":5,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"エイシンヌチマシヌ","horse_number":5},{"score":4,"breakdown":{"sire":0,"custom":4,"jockey":0},"horse_name":"キッカケ","horse_number":4}],"model":"yosou-v1","race_id":"202511160822","generatedAt":"2025-11-16T10:48:55.059Z"} | 2025-11-16T10:48:55.000Z |
| 24 | 202511161022 | yosou-v1 | {"best":{"score":94,"breakdown":{"sire":0,"custom":6,"jockey":88},"horse_name":"ロッキータイタン","horse_number":6},"items":[{"score":94,"breakdown":{"sire":0,"custom":6,"jockey":88},"horse_name":"ロッキータイタン","horse_number":6},{"score":82,"breakdown":{"sire":0,"custom":0,"jockey":82},"horse_name":"ビッグリュウオー","horse_number":7},{"score":82,"breakdown":{"sire":0,"custom":30,"jockey":52},"horse_name":"チェンジオブハート","horse_number":9},{"score":70,"breakdown":{"sire":0,"custom":30,"jockey":40},"horse_name":"スカーレットクロス","horse_number":1},{"score":65,"breakdown":{"sire":0,"custom":4,"jockey":61},"horse_name":"ホウオウエーデル","horse_number":4},{"score":50,"breakdown":{"sire":0,"custom":32,"jockey":18},"horse_name":"インカノメザメ","horse_number":2},{"score":36,"breakdown":{"sire":0,"custom":0,"jockey":36},"horse_name":"ビービーアクティブ","horse_number":3},{"score":35,"breakdown":{"sire":0,"custom":20,"jockey":15},"horse_name":"リリーピンシャー","horse_number":11},{"score":20,"breakdown":{"sire":0,"custom":20,"jockey":0},"horse_name":"エスカルチャ","horse_number":5},{"score":17,"breakdown":{"sire":0,"custom":8,"jockey":9},"horse_name":"タイキモンストル","horse_number":8},{"score":10,"breakdown":{"sire":0,"custom":10,"jockey":0},"horse_name":"エイシンデュエラー","horse_number":10}],"model":"yosou-v1","race_id":"202511161022","generatedAt":"2025-11-16T10:49:12.371Z"} | 2025-11-16T10:49:12.000Z |
| 25 | 202511160922 | yosou-v1 | {"best":{"score":136,"breakdown":{"sire":0,"custom":40,"jockey":96},"horse_name":"アルシャンティ","horse_number":10},"items":[{"score":136,"breakdown":{"sire":0,"custom":40,"jockey":96},"horse_name":"アルシャンティ","horse_number":10},{"score":108,"breakdown":{"sire":0,"custom":20,"jockey":88},"horse_name":"ジュレヴァー","horse_number":7},{"score":82,"breakdown":{"sire":0,"custom":0,"jockey":82},"horse_name":"ハーイ","horse_number":5},{"score":61,"breakdown":{"sire":0,"custom":0,"jockey":61},"horse_name":"ヒロシゲウェーブ","horse_number":9},{"score":58,"breakdown":{"sire":0,"custom":6,"jockey":52},"horse_name":"ロコルルハーツ","horse_number":6},{"score":48,"breakdown":{"sire":0,"custom":12,"jockey":36},"horse_name":"オラフ","horse_number":12},{"score":45,"breakdown":{"sire":0,"custom":30,"jockey":15},"horse_name":"エーデルムート","horse_number":11},{"score":44,"breakdown":{"sire":0,"custom":4,"jockey":40},"horse_name":"ボルドーグリフォン","horse_number":4},{"score":20,"breakdown":{"sire":0,"custom":20,"jockey":0},"horse_name":"パワームーブ","horse_number":3},{"score":9,"breakdown":{"sire":0,"custom":0,"jockey":9},"horse_name":"エースレイジング","horse_number":1},{"score":8,"breakdown":{"sire":0,"custom":8,"jockey":0},"horse_name":"ハウファアイルゴー","horse_number":8},{"score":2,"breakdown":{"sire":0,"custom":2,"jockey":0},"horse_name":"レースラヴェンダー","horse_number":2}],"model":"yosou-v1","race_id":"202511160922","generatedAt":"2025-11-16T10:49:12.506Z"} | 2025-11-16T10:49:12.000Z |
| 26 | 202511160131 | yosou-v1 | {"best":{"score":128,"breakdown":{"sire":0,"custom":40,"jockey":88},"horse_name":"ユキノレックス","horse_number":7},"items":[{"score":128,"breakdown":{"sire":0,"custom":40,"jockey":88},"horse_name":"ユキノレックス","horse_number":7},{"score":99,"breakdown":{"sire":0,"custom":40,"jockey":59},"horse_name":"タカマキセブン","horse_number":3},{"score":82,"breakdown":{"sire":0,"custom":46,"jockey":36},"horse_name":"ラヴレインブーケ","horse_number":6},{"score":59,"breakdown":{"sire":0,"custom":44,"jockey":15},"horse_name":"ヤッティライネン","horse_number":4},{"score":57,"breakdown":{"sire":0,"custom":48,"jockey":9},"horse_name":"スピードブラッシュ","horse_number":8},{"score":42,"breakdown":{"sire":0,"custom":42,"jockey":0},"horse_name":"サマーカムカム","horse_number":2},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"モンサンジャスミン","horse_number":1},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"エボリスピナ","horse_number":5}],"model":"yosou-v1","race_id":"202511160131","generatedAt":"2025-11-16T10:49:29.610Z"} | 2025-11-16T10:49:29.000Z |
| 27 | 202511160231 | yosou-v1 | {"best":{"score":144,"breakdown":{"sire":0,"custom":48,"jockey":96},"horse_name":"サリーレチーマ","horse_number":8},"items":[{"score":144,"breakdown":{"sire":0,"custom":48,"jockey":96},"horse_name":"サリーレチーマ","horse_number":8},{"score":128,"breakdown":{"sire":0,"custom":40,"jockey":88},"horse_name":"シュガーストーン","horse_number":9},{"score":122,"breakdown":{"sire":0,"custom":40,"jockey":82},"horse_name":"アデレード","horse_number":11},{"score":105,"breakdown":{"sire":0,"custom":44,"jockey":61},"horse_name":"アクアノート","horse_number":4},{"score":99,"breakdown":{"sire":0,"custom":40,"jockey":59},"horse_name":"サンドロック","horse_number":5},{"score":94,"breakdown":{"sire":0,"custom":42,"jockey":52},"horse_name":"ルーネンバーグ","horse_number":2},{"score":86,"breakdown":{"sire":0,"custom":46,"jockey":40},"horse_name":"コンバットイズモ","horse_number":6},{"score":58,"breakdown":{"sire":0,"custom":40,"jockey":18},"horse_name":"ユウユウロッゲン","horse_number":7},{"score":50,"breakdown":{"sire":0,"custom":50,"jockey":0},"horse_name":"ジュノヴェール","horse_number":10},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"セイバーダンス","horse_number":1},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"ササキンアンジェラ","horse_number":3}],"model":"yosou-v1","race_id":"202511160231","generatedAt":"2025-11-16T10:49:29.835Z"} | 2025-11-16T10:49:29.000Z |
| 28 | 202511160331 | yosou-v1 | {"best":{"score":134,"breakdown":{"sire":0,"custom":38,"jockey":96},"horse_name":"シベリアンデネブ","horse_number":8},"items":[{"score":134,"breakdown":{"sire":0,"custom":38,"jockey":96},"horse_name":"シベリアンデネブ","horse_number":8},{"score":112,"breakdown":{"sire":0,"custom":30,"jockey":82},"horse_name":"レジリエント","horse_number":3},{"score":101,"breakdown":{"sire":0,"custom":40,"jockey":61},"horse_name":"ラセーヌ","horse_number":10},{"score":89,"breakdown":{"sire":0,"custom":30,"jockey":59},"horse_name":"アストラアヴィス","horse_number":9},{"score":82,"breakdown":{"sire":0,"custom":30,"jockey":52},"horse_name":"ギフテッドアベリア","horse_number":1},{"score":72,"breakdown":{"sire":0,"custom":32,"jockey":40},"horse_name":"ラグーンフライト","horse_number":2},{"score":66,"breakdown":{"sire":0,"custom":30,"jockey":36},"horse_name":"ミヤビノオウザ","horse_number":7},{"score":60,"breakdown":{"sire":0,"custom":42,"jockey":18},"horse_name":"ベルレンヌ","horse_number":12},{"score":36,"breakdown":{"sire":0,"custom":36,"jockey":0},"horse_name":"クラッチ","horse_number":6},{"score":34,"breakdown":{"sire":0,"custom":34,"jockey":0},"horse_name":"リースアンドリボン","horse_number":4},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"ライブリブランコ","horse_number":5},{"score":11,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"メイショウリリアム","horse_number":11}],"model":"yosou-v1","race_id":"202511160331","generatedAt":"2025-11-16T10:49:46.732Z"} | 2025-11-16T10:49:46.000Z |
| 29 | 202511160431 | yosou-v1 | {"best":{"score":88,"breakdown":{"sire":0,"custom":6,"jockey":82},"horse_name":"オルグージョ","horse_number":6},"items":[{"score":88,"breakdown":{"sire":0,"custom":6,"jockey":82},"horse_name":"オルグージョ","horse_number":6},{"score":44,"breakdown":{"sire":0,"custom":4,"jockey":40},"horse_name":"サクラトップスカイ","horse_number":4},{"score":44,"breakdown":{"sire":0,"custom":8,"jockey":36},"horse_name":"ラストパラダイス","horse_number":8},{"score":39,"breakdown":{"sire":0,"custom":30,"jockey":9},"horse_name":"アーブルラーブル","horse_number":1},{"score":38,"breakdown":{"sire":0,"custom":20,"jockey":18},"horse_name":"ワイルドブーケ","horse_number":7},{"score":32,"breakdown":{"sire":0,"custom":32,"jockey":0},"horse_name":"ジーティービート","horse_number":2},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"エンジェライト","horse_number":3},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"ナビール","horse_number":5},{"score":9,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"タイセイナトゥーラ","horse_number":9}],"model":"yosou-v1","race_id":"202511160431","generatedAt":"2025-11-16T10:49:46.834Z"} | 2025-11-16T10:49:46.000Z |
| 30 | 202511160531 | yosou-v1 | {"best":{"score":126,"breakdown":{"sire":0,"custom":30,"jockey":96},"horse_name":"ロバリアステージ","horse_number":7},"items":[{"score":126,"breakdown":{"sire":0,"custom":30,"jockey":96},"horse_name":"ロバリアステージ","horse_number":7},{"score":108,"breakdown":{"sire":0,"custom":26,"jockey":82},"horse_name":"ティーエスフェアリ","horse_number":6},{"score":108,"breakdown":{"sire":0,"custom":20,"jockey":88},"horse_name":"リメリック","horse_number":9},{"score":91,"breakdown":{"sire":0,"custom":32,"jockey":59},"horse_name":"カラジシ","horse_number":2},{"score":55,"breakdown":{"sire":0,"custom":40,"jockey":15},"horse_name":"ホロヨイマンゲツ","horse_number":10},{"score":44,"breakdown":{"sire":0,"custom":4,"jockey":40},"horse_name":"ストレート","horse_number":4},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"トレベルフィーユ","horse_number":1},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"ウインドモア","horse_number":3},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"オンザバサラ","horse_number":5},{"score":8,"breakdown":{"sire":0,"custom":8,"jockey":0},"horse_name":"メイショウフラム","horse_number":8}],"model":"yosou-v1","race_id":"202511160531","generatedAt":"2025-11-16T10:50:03.916Z"} | 2025-11-16T10:50:03.000Z |
| 31 | 202511160631 | yosou-v1 | {"best":{"score":93,"breakdown":{"sire":0,"custom":32,"jockey":61},"horse_name":"ヴィクトリアランド","horse_number":2},"items":[{"score":93,"breakdown":{"sire":0,"custom":32,"jockey":61},"horse_name":"ヴィクトリアランド","horse_number":2},{"score":79,"breakdown":{"sire":0,"custom":20,"jockey":59},"horse_name":"メッチャサザン","horse_number":3},{"score":70,"breakdown":{"sire":0,"custom":30,"jockey":40},"horse_name":"スパーク","horse_number":5},{"score":58,"breakdown":{"sire":0,"custom":40,"jockey":18},"horse_name":"アルデムラータ","horse_number":10},{"score":39,"breakdown":{"sire":0,"custom":30,"jockey":9},"horse_name":"メイショウイントロ","horse_number":7},{"score":38,"breakdown":{"sire":0,"custom":38,"jockey":0},"horse_name":"ライジンシチー","horse_number":8},{"score":34,"breakdown":{"sire":0,"custom":34,"jockey":0},"horse_name":"メモリーメイラード","horse_number":4},{"score":21,"breakdown":{"sire":0,"custom":6,"jockey":15},"horse_name":"クリノサンシャイン","horse_number":6},{"score":9,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"エルメルクリオ","horse_number":9},{"score":1,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"ドルチェヴィータ","horse_number":1}],"model":"yosou-v1","race_id":"202511160631","generatedAt":"2025-11-16T10:50:03.952Z"} | 2025-11-16T10:50:03.000Z |
| 32 | 202511160831 | yosou-v1 | {"best":{"score":114,"breakdown":{"sire":0,"custom":32,"jockey":82},"horse_name":"コヴェナント","horse_number":2},"items":[{"score":114,"breakdown":{"sire":0,"custom":32,"jockey":82},"horse_name":"コヴェナント","horse_number":2},{"score":67,"breakdown":{"sire":0,"custom":8,"jockey":59},"horse_name":"ベアビリーブ","horse_number":8},{"score":58,"breakdown":{"sire":0,"custom":6,"jockey":52},"horse_name":"モルデュール","horse_number":6},{"score":39,"breakdown":{"sire":0,"custom":30,"jockey":9},"horse_name":"コルヴィーナ","horse_number":11},{"score":36,"breakdown":{"sire":0,"custom":0,"jockey":36},"horse_name":"キャビネットバトル","horse_number":1},{"score":20,"breakdown":{"sire":0,"custom":20,"jockey":0},"horse_name":"ミリオーレアルバ","horse_number":7},{"score":18,"breakdown":{"sire":0,"custom":0,"jockey":18},"horse_name":"エムティヒビキ","horse_number":3},{"score":15,"breakdown":{"sire":0,"custom":0,"jockey":15},"horse_name":"バイオレットモーヴ","horse_number":9},{"score":10,"breakdown":{"sire":0,"custom":10,"jockey":0},"horse_name":"ジュンツーポイント","horse_number":10},{"score":5,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"エイシンヌチマシヌ","horse_number":5},{"score":4,"breakdown":{"sire":0,"custom":4,"jockey":0},"horse_name":"キッカケ","horse_number":4}],"model":"yosou-v1","race_id":"202511160831","generatedAt":"2025-11-16T10:50:20.850Z"} | 2025-11-16T10:50:20.000Z |
| 33 | 202511160731 | yosou-v1 | {"best":{"score":97,"breakdown":{"sire":0,"custom":36,"jockey":61},"horse_name":"キタノフローラ","horse_number":6},"items":[{"score":97,"breakdown":{"sire":0,"custom":36,"jockey":61},"horse_name":"キタノフローラ","horse_number":6},{"score":97,"breakdown":{"sire":0,"custom":38,"jockey":59},"horse_name":"セラトーン","horse_number":8},{"score":88,"breakdown":{"sire":0,"custom":0,"jockey":88},"horse_name":"フェズカズマ","horse_number":1},{"score":52,"breakdown":{"sire":0,"custom":0,"jockey":52},"horse_name":"デフィデリ","horse_number":7},{"score":40,"breakdown":{"sire":0,"custom":22,"jockey":18},"horse_name":"ネコニコタツ","horse_number":2},{"score":33,"breakdown":{"sire":0,"custom":24,"jockey":9},"horse_name":"フジサンワイシーシ","horse_number":4},{"score":5,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"ハッシュタグ","horse_number":5},{"score":3,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"ローガンマウンテン","horse_number":3}],"model":"yosou-v1","race_id":"202511160731","generatedAt":"2025-11-16T10:50:21.046Z"} | 2025-11-16T10:50:21.000Z |
| 34 | 202511160931 | yosou-v1 | {"best":{"score":136,"breakdown":{"sire":0,"custom":40,"jockey":96},"horse_name":"アルシャンティ","horse_number":10},"items":[{"score":136,"breakdown":{"sire":0,"custom":40,"jockey":96},"horse_name":"アルシャンティ","horse_number":10},{"score":108,"breakdown":{"sire":0,"custom":20,"jockey":88},"horse_name":"ジュレヴァー","horse_number":7},{"score":82,"breakdown":{"sire":0,"custom":0,"jockey":82},"horse_name":"ハーイ","horse_number":5},{"score":61,"breakdown":{"sire":0,"custom":0,"jockey":61},"horse_name":"ヒロシゲウェーブ","horse_number":9},{"score":58,"breakdown":{"sire":0,"custom":6,"jockey":52},"horse_name":"ロコルルハーツ","horse_number":6},{"score":48,"breakdown":{"sire":0,"custom":12,"jockey":36},"horse_name":"オラフ","horse_number":12},{"score":45,"breakdown":{"sire":0,"custom":30,"jockey":15},"horse_name":"エーデルムート","horse_number":11},{"score":44,"breakdown":{"sire":0,"custom":4,"jockey":40},"horse_name":"ボルドーグリフォン","horse_number":4},{"score":20,"breakdown":{"sire":0,"custom":20,"jockey":0},"horse_name":"パワームーブ","horse_number":3},{"score":9,"breakdown":{"sire":0,"custom":0,"jockey":9},"horse_name":"エースレイジング","horse_number":1},{"score":8,"breakdown":{"sire":0,"custom":8,"jockey":0},"horse_name":"ハウファアイルゴー","horse_number":8},{"score":2,"breakdown":{"sire":0,"custom":2,"jockey":0},"horse_name":"レースラヴェンダー","horse_number":2}],"model":"yosou-v1","race_id":"202511160931","generatedAt":"2025-11-16T10:50:38.051Z"} | 2025-11-16T10:50:38.000Z |
| 35 | 202511161031 | yosou-v1 | {"best":{"score":94,"breakdown":{"sire":0,"custom":6,"jockey":88},"horse_name":"ロッキータイタン","horse_number":6},"items":[{"score":94,"breakdown":{"sire":0,"custom":6,"jockey":88},"horse_name":"ロッキータイタン","horse_number":6},{"score":82,"breakdown":{"sire":0,"custom":0,"jockey":82},"horse_name":"ビッグリュウオー","horse_number":7},{"score":82,"breakdown":{"sire":0,"custom":30,"jockey":52},"horse_name":"チェンジオブハート","horse_number":9},{"score":70,"breakdown":{"sire":0,"custom":30,"jockey":40},"horse_name":"スカーレットクロス","horse_number":1},{"score":65,"breakdown":{"sire":0,"custom":4,"jockey":61},"horse_name":"ホウオウエーデル","horse_number":4},{"score":50,"breakdown":{"sire":0,"custom":32,"jockey":18},"horse_name":"インカノメザメ","horse_number":2},{"score":36,"breakdown":{"sire":0,"custom":0,"jockey":36},"horse_name":"ビービーアクティブ","horse_number":3},{"score":35,"breakdown":{"sire":0,"custom":20,"jockey":15},"horse_name":"リリーピンシャー","horse_number":11},{"score":20,"breakdown":{"sire":0,"custom":20,"jockey":0},"horse_name":"エスカルチャ","horse_number":5},{"score":17,"breakdown":{"sire":0,"custom":8,"jockey":9},"horse_name":"タイキモンストル","horse_number":8},{"score":10,"breakdown":{"sire":0,"custom":10,"jockey":0},"horse_name":"エイシンデュエラー","horse_number":10}],"model":"yosou-v1","race_id":"202511161031","generatedAt":"2025-11-16T10:50:38.261Z"} | 2025-11-16T10:50:38.000Z |
| 36 | 202511161131 | yosou-v1 | {"best":{"score":98,"breakdown":{"sire":0,"custom":2,"jockey":96},"horse_name":"ウラヤ","horse_number":2},"items":[{"score":98,"breakdown":{"sire":0,"custom":2,"jockey":96},"horse_name":"ウラヤ","horse_number":2},{"score":98,"breakdown":{"sire":0,"custom":10,"jockey":88},"horse_name":"スターシューター","horse_number":10},{"score":85,"breakdown":{"sire":0,"custom":26,"jockey":59},"horse_name":"オスカーブレイン","horse_number":6},{"score":82,"breakdown":{"sire":0,"custom":0,"jockey":82},"horse_name":"ロードオブザチェコ","horse_number":1},{"score":61,"breakdown":{"sire":0,"custom":0,"jockey":61},"horse_name":"スプラウティング","horse_number":3},{"score":56,"breakdown":{"sire":0,"custom":4,"jockey":52},"horse_name":"ブリスタイム","horse_number":4},{"score":40,"breakdown":{"sire":0,"custom":0,"jockey":40},"horse_name":"ファイナルキング","horse_number":11},{"score":36,"breakdown":{"sire":0,"custom":0,"jockey":36},"horse_name":"レディブラウン","horse_number":5},{"score":28,"breakdown":{"sire":0,"custom":28,"jockey":0},"horse_name":"エイシントルペード","horse_number":8},{"score":18,"breakdown":{"sire":0,"custom":0,"jockey":18},"horse_name":"グットフォーチュン","horse_number":9},{"score":15,"breakdown":{"sire":0,"custom":0,"jockey":15},"horse_name":"アップテンペスト","horse_number":7},{"score":12,"breakdown":{"sire":0,"custom":12,"jockey":0},"horse_name":"グアドループ","horse_number":12}],"model":"yosou-v1","race_id":"202511161131","generatedAt":"2025-11-16T10:50:55.298Z"} | 2025-11-16T10:50:55.000Z |
| 37 | 202511161231 | yosou-v1 | {"best":{"score":126,"breakdown":{"sire":0,"custom":30,"jockey":96},"horse_name":"ショウナンナスカ","horse_number":7},"items":[{"score":126,"breakdown":{"sire":0,"custom":30,"jockey":96},"horse_name":"ショウナンナスカ","horse_number":7},{"score":118,"breakdown":{"sire":0,"custom":30,"jockey":88},"horse_name":"トンヤイビーン","horse_number":9},{"score":112,"breakdown":{"sire":0,"custom":30,"jockey":82},"horse_name":"ヒナノツルツル","horse_number":5},{"score":74,"breakdown":{"sire":0,"custom":22,"jockey":52},"horse_name":"ミツカネトーラス","horse_number":2},{"score":70,"breakdown":{"sire":0,"custom":30,"jockey":40},"horse_name":"ネイビス","horse_number":11},{"score":67,"breakdown":{"sire":0,"custom":8,"jockey":59},"horse_name":"モンサンイルベント","horse_number":8},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"ジェイルブレイク","horse_number":10},{"score":29,"breakdown":{"sire":0,"custom":20,"jockey":9},"horse_name":"タイガードラゴン","horse_number":3},{"score":24,"breakdown":{"sire":0,"custom":6,"jockey":18},"horse_name":"ユウユウスプレマン","horse_number":6},{"score":4,"breakdown":{"sire":0,"custom":4,"jockey":0},"horse_name":"キタノクーヴェル","horse_number":4},{"score":1,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"マカベウス","horse_number":1}],"model":"yosou-v1","race_id":"202511161231","generatedAt":"2025-11-16T10:50:55.458Z"} | 2025-11-16T10:50:55.000Z |
| 38 | 202511160132 | yosou-v1 | {"best":{"score":128,"breakdown":{"sire":0,"custom":40,"jockey":88},"horse_name":"ユキノレックス","horse_number":7},"items":[{"score":128,"breakdown":{"sire":0,"custom":40,"jockey":88},"horse_name":"ユキノレックス","horse_number":7},{"score":99,"breakdown":{"sire":0,"custom":40,"jockey":59},"horse_name":"タカマキセブン","horse_number":3},{"score":82,"breakdown":{"sire":0,"custom":46,"jockey":36},"horse_name":"ラヴレインブーケ","horse_number":6},{"score":59,"breakdown":{"sire":0,"custom":44,"jockey":15},"horse_name":"ヤッティライネン","horse_number":4},{"score":57,"breakdown":{"sire":0,"custom":48,"jockey":9},"horse_name":"スピードブラッシュ","horse_number":8},{"score":42,"breakdown":{"sire":0,"custom":42,"jockey":0},"horse_name":"サマーカムカム","horse_number":2},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"モンサンジャスミン","horse_number":1},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"エボリスピナ","horse_number":5}],"model":"yosou-v1","race_id":"202511160132","generatedAt":"2025-11-16T10:51:12.969Z"} | 2025-11-16T10:51:12.000Z |
| 39 | 202511160232 | yosou-v1 | {"best":{"score":144,"breakdown":{"sire":0,"custom":48,"jockey":96},"horse_name":"サリーレチーマ","horse_number":8},"items":[{"score":144,"breakdown":{"sire":0,"custom":48,"jockey":96},"horse_name":"サリーレチーマ","horse_number":8},{"score":128,"breakdown":{"sire":0,"custom":40,"jockey":88},"horse_name":"シュガーストーン","horse_number":9},{"score":122,"breakdown":{"sire":0,"custom":40,"jockey":82},"horse_name":"アデレード","horse_number":11},{"score":105,"breakdown":{"sire":0,"custom":44,"jockey":61},"horse_name":"アクアノート","horse_number":4},{"score":99,"breakdown":{"sire":0,"custom":40,"jockey":59},"horse_name":"サンドロック","horse_number":5},{"score":94,"breakdown":{"sire":0,"custom":42,"jockey":52},"horse_name":"ルーネンバーグ","horse_number":2},{"score":86,"breakdown":{"sire":0,"custom":46,"jockey":40},"horse_name":"コンバットイズモ","horse_number":6},{"score":58,"breakdown":{"sire":0,"custom":40,"jockey":18},"horse_name":"ユウユウロッゲン","horse_number":7},{"score":50,"breakdown":{"sire":0,"custom":50,"jockey":0},"horse_name":"ジュノヴェール","horse_number":10},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"セイバーダンス","horse_number":1},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"ササキンアンジェラ","horse_number":3}],"model":"yosou-v1","race_id":"202511160232","generatedAt":"2025-11-16T10:51:13.020Z"} | 2025-11-16T10:51:13.000Z |
| 40 | 202511160432 | yosou-v1 | {"best":{"score":88,"breakdown":{"sire":0,"custom":6,"jockey":82},"horse_name":"オルグージョ","horse_number":6},"items":[{"score":88,"breakdown":{"sire":0,"custom":6,"jockey":82},"horse_name":"オルグージョ","horse_number":6},{"score":44,"breakdown":{"sire":0,"custom":4,"jockey":40},"horse_name":"サクラトップスカイ","horse_number":4},{"score":44,"breakdown":{"sire":0,"custom":8,"jockey":36},"horse_name":"ラストパラダイス","horse_number":8},{"score":39,"breakdown":{"sire":0,"custom":30,"jockey":9},"horse_name":"アーブルラーブル","horse_number":1},{"score":38,"breakdown":{"sire":0,"custom":20,"jockey":18},"horse_name":"ワイルドブーケ","horse_number":7},{"score":32,"breakdown":{"sire":0,"custom":32,"jockey":0},"horse_name":"ジーティービート","horse_number":2},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"エンジェライト","horse_number":3},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"ナビール","horse_number":5},{"score":9,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"タイセイナトゥーラ","horse_number":9}],"model":"yosou-v1","race_id":"202511160432","generatedAt":"2025-11-16T10:51:31.947Z"} | 2025-11-16T10:51:31.000Z |
| 41 | 202511160332 | yosou-v1 | {"best":{"score":134,"breakdown":{"sire":0,"custom":38,"jockey":96},"horse_name":"シベリアンデネブ","horse_number":8},"items":[{"score":134,"breakdown":{"sire":0,"custom":38,"jockey":96},"horse_name":"シベリアンデネブ","horse_number":8},{"score":112,"breakdown":{"sire":0,"custom":30,"jockey":82},"horse_name":"レジリエント","horse_number":3},{"score":101,"breakdown":{"sire":0,"custom":40,"jockey":61},"horse_name":"ラセーヌ","horse_number":10},{"score":89,"breakdown":{"sire":0,"custom":30,"jockey":59},"horse_name":"アストラアヴィス","horse_number":9},{"score":82,"breakdown":{"sire":0,"custom":30,"jockey":52},"horse_name":"ギフテッドアベリア","horse_number":1},{"score":72,"breakdown":{"sire":0,"custom":32,"jockey":40},"horse_name":"ラグーンフライト","horse_number":2},{"score":66,"breakdown":{"sire":0,"custom":30,"jockey":36},"horse_name":"ミヤビノオウザ","horse_number":7},{"score":60,"breakdown":{"sire":0,"custom":42,"jockey":18},"horse_name":"ベルレンヌ","horse_number":12},{"score":36,"breakdown":{"sire":0,"custom":36,"jockey":0},"horse_name":"クラッチ","horse_number":6},{"score":34,"breakdown":{"sire":0,"custom":34,"jockey":0},"horse_name":"リースアンドリボン","horse_number":4},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"ライブリブランコ","horse_number":5},{"score":11,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"メイショウリリアム","horse_number":11}],"model":"yosou-v1","race_id":"202511160332","generatedAt":"2025-11-16T10:51:31.963Z"} | 2025-11-16T10:51:31.000Z |
| 42 | 202511160532 | yosou-v1 | {"best":{"score":126,"breakdown":{"sire":0,"custom":30,"jockey":96},"horse_name":"ロバリアステージ","horse_number":7},"items":[{"score":126,"breakdown":{"sire":0,"custom":30,"jockey":96},"horse_name":"ロバリアステージ","horse_number":7},{"score":108,"breakdown":{"sire":0,"custom":26,"jockey":82},"horse_name":"ティーエスフェアリ","horse_number":6},{"score":108,"breakdown":{"sire":0,"custom":20,"jockey":88},"horse_name":"リメリック","horse_number":9},{"score":91,"breakdown":{"sire":0,"custom":32,"jockey":59},"horse_name":"カラジシ","horse_number":2},{"score":55,"breakdown":{"sire":0,"custom":40,"jockey":15},"horse_name":"ホロヨイマンゲツ","horse_number":10},{"score":44,"breakdown":{"sire":0,"custom":4,"jockey":40},"horse_name":"ストレート","horse_number":4},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"トレベルフィーユ","horse_number":1},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"ウインドモア","horse_number":3},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"オンザバサラ","horse_number":5},{"score":8,"breakdown":{"sire":0,"custom":8,"jockey":0},"horse_name":"メイショウフラム","horse_number":8}],"model":"yosou-v1","race_id":"202511160532","generatedAt":"2025-11-16T10:51:50.704Z"} | 2025-11-16T10:51:50.000Z |
| 43 | 202511160632 | yosou-v1 | {"best":{"score":93,"breakdown":{"sire":0,"custom":32,"jockey":61},"horse_name":"ヴィクトリアランド","horse_number":2},"items":[{"score":93,"breakdown":{"sire":0,"custom":32,"jockey":61},"horse_name":"ヴィクトリアランド","horse_number":2},{"score":79,"breakdown":{"sire":0,"custom":20,"jockey":59},"horse_name":"メッチャサザン","horse_number":3},{"score":70,"breakdown":{"sire":0,"custom":30,"jockey":40},"horse_name":"スパーク","horse_number":5},{"score":58,"breakdown":{"sire":0,"custom":40,"jockey":18},"horse_name":"アルデムラータ","horse_number":10},{"score":39,"breakdown":{"sire":0,"custom":30,"jockey":9},"horse_name":"メイショウイントロ","horse_number":7},{"score":38,"breakdown":{"sire":0,"custom":38,"jockey":0},"horse_name":"ライジンシチー","horse_number":8},{"score":34,"breakdown":{"sire":0,"custom":34,"jockey":0},"horse_name":"メモリーメイラード","horse_number":4},{"score":21,"breakdown":{"sire":0,"custom":6,"jockey":15},"horse_name":"クリノサンシャイン","horse_number":6},{"score":9,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"エルメルクリオ","horse_number":9},{"score":1,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"ドルチェヴィータ","horse_number":1}],"model":"yosou-v1","race_id":"202511160632","generatedAt":"2025-11-16T10:51:50.836Z"} | 2025-11-16T10:51:50.000Z |
| 44 | 202511160832 | yosou-v1 | {"best":{"score":114,"breakdown":{"sire":0,"custom":32,"jockey":82},"horse_name":"コヴェナント","horse_number":2},"items":[{"score":114,"breakdown":{"sire":0,"custom":32,"jockey":82},"horse_name":"コヴェナント","horse_number":2},{"score":67,"breakdown":{"sire":0,"custom":8,"jockey":59},"horse_name":"ベアビリーブ","horse_number":8},{"score":58,"breakdown":{"sire":0,"custom":6,"jockey":52},"horse_name":"モルデュール","horse_number":6},{"score":39,"breakdown":{"sire":0,"custom":30,"jockey":9},"horse_name":"コルヴィーナ","horse_number":11},{"score":36,"breakdown":{"sire":0,"custom":0,"jockey":36},"horse_name":"キャビネットバトル","horse_number":1},{"score":20,"breakdown":{"sire":0,"custom":20,"jockey":0},"horse_name":"ミリオーレアルバ","horse_number":7},{"score":18,"breakdown":{"sire":0,"custom":0,"jockey":18},"horse_name":"エムティヒビキ","horse_number":3},{"score":15,"breakdown":{"sire":0,"custom":0,"jockey":15},"horse_name":"バイオレットモーヴ","horse_number":9},{"score":10,"breakdown":{"sire":0,"custom":10,"jockey":0},"horse_name":"ジュンツーポイント","horse_number":10},{"score":5,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"エイシンヌチマシヌ","horse_number":5},{"score":4,"breakdown":{"sire":0,"custom":4,"jockey":0},"horse_name":"キッカケ","horse_number":4}],"model":"yosou-v1","race_id":"202511160832","generatedAt":"2025-11-16T10:52:09.557Z"} | 2025-11-16T10:52:09.000Z |
| 45 | 202511160732 | yosou-v1 | {"best":{"score":97,"breakdown":{"sire":0,"custom":36,"jockey":61},"horse_name":"キタノフローラ","horse_number":6},"items":[{"score":97,"breakdown":{"sire":0,"custom":36,"jockey":61},"horse_name":"キタノフローラ","horse_number":6},{"score":97,"breakdown":{"sire":0,"custom":38,"jockey":59},"horse_name":"セラトーン","horse_number":8},{"score":88,"breakdown":{"sire":0,"custom":0,"jockey":88},"horse_name":"フェズカズマ","horse_number":1},{"score":52,"breakdown":{"sire":0,"custom":0,"jockey":52},"horse_name":"デフィデリ","horse_number":7},{"score":40,"breakdown":{"sire":0,"custom":22,"jockey":18},"horse_name":"ネコニコタツ","horse_number":2},{"score":33,"breakdown":{"sire":0,"custom":24,"jockey":9},"horse_name":"フジサンワイシーシ","horse_number":4},{"score":5,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"ハッシュタグ","horse_number":5},{"score":3,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"ローガンマウンテン","horse_number":3}],"model":"yosou-v1","race_id":"202511160732","generatedAt":"2025-11-16T10:52:09.654Z"} | 2025-11-16T10:52:09.000Z |
| 46 | 202511160932 | yosou-v1 | {"best":{"score":136,"breakdown":{"sire":0,"custom":40,"jockey":96},"horse_name":"アルシャンティ","horse_number":10},"items":[{"score":136,"breakdown":{"sire":0,"custom":40,"jockey":96},"horse_name":"アルシャンティ","horse_number":10},{"score":108,"breakdown":{"sire":0,"custom":20,"jockey":88},"horse_name":"ジュレヴァー","horse_number":7},{"score":82,"breakdown":{"sire":0,"custom":0,"jockey":82},"horse_name":"ハーイ","horse_number":5},{"score":61,"breakdown":{"sire":0,"custom":0,"jockey":61},"horse_name":"ヒロシゲウェーブ","horse_number":9},{"score":58,"breakdown":{"sire":0,"custom":6,"jockey":52},"horse_name":"ロコルルハーツ","horse_number":6},{"score":48,"breakdown":{"sire":0,"custom":12,"jockey":36},"horse_name":"オラフ","horse_number":12},{"score":45,"breakdown":{"sire":0,"custom":30,"jockey":15},"horse_name":"エーデルムート","horse_number":11},{"score":44,"breakdown":{"sire":0,"custom":4,"jockey":40},"horse_name":"ボルドーグリフォン","horse_number":4},{"score":20,"breakdown":{"sire":0,"custom":20,"jockey":0},"horse_name":"パワームーブ","horse_number":3},{"score":9,"breakdown":{"sire":0,"custom":0,"jockey":9},"horse_name":"エースレイジング","horse_number":1},{"score":8,"breakdown":{"sire":0,"custom":8,"jockey":0},"horse_name":"ハウファアイルゴー","horse_number":8},{"score":2,"breakdown":{"sire":0,"custom":2,"jockey":0},"horse_name":"レースラヴェンダー","horse_number":2}],"model":"yosou-v1","race_id":"202511160932","generatedAt":"2025-11-16T10:52:28.299Z"} | 2025-11-16T10:52:28.000Z |
| 47 | 202511161032 | yosou-v1 | {"best":{"score":94,"breakdown":{"sire":0,"custom":6,"jockey":88},"horse_name":"ロッキータイタン","horse_number":6},"items":[{"score":94,"breakdown":{"sire":0,"custom":6,"jockey":88},"horse_name":"ロッキータイタン","horse_number":6},{"score":82,"breakdown":{"sire":0,"custom":0,"jockey":82},"horse_name":"ビッグリュウオー","horse_number":7},{"score":82,"breakdown":{"sire":0,"custom":30,"jockey":52},"horse_name":"チェンジオブハート","horse_number":9},{"score":70,"breakdown":{"sire":0,"custom":30,"jockey":40},"horse_name":"スカーレットクロス","horse_number":1},{"score":65,"breakdown":{"sire":0,"custom":4,"jockey":61},"horse_name":"ホウオウエーデル","horse_number":4},{"score":50,"breakdown":{"sire":0,"custom":32,"jockey":18},"horse_name":"インカノメザメ","horse_number":2},{"score":36,"breakdown":{"sire":0,"custom":0,"jockey":36},"horse_name":"ビービーアクティブ","horse_number":3},{"score":35,"breakdown":{"sire":0,"custom":20,"jockey":15},"horse_name":"リリーピンシャー","horse_number":11},{"score":20,"breakdown":{"sire":0,"custom":20,"jockey":0},"horse_name":"エスカルチャ","horse_number":5},{"score":17,"breakdown":{"sire":0,"custom":8,"jockey":9},"horse_name":"タイキモンストル","horse_number":8},{"score":10,"breakdown":{"sire":0,"custom":10,"jockey":0},"horse_name":"エイシンデュエラー","horse_number":10}],"model":"yosou-v1","race_id":"202511161032","generatedAt":"2025-11-16T10:52:28.393Z"} | 2025-11-16T10:52:28.000Z |
| 48 | 202511161132 | yosou-v1 | {"best":{"score":98,"breakdown":{"sire":0,"custom":2,"jockey":96},"horse_name":"ウラヤ","horse_number":2},"items":[{"score":98,"breakdown":{"sire":0,"custom":2,"jockey":96},"horse_name":"ウラヤ","horse_number":2},{"score":98,"breakdown":{"sire":0,"custom":10,"jockey":88},"horse_name":"スターシューター","horse_number":10},{"score":85,"breakdown":{"sire":0,"custom":26,"jockey":59},"horse_name":"オスカーブレイン","horse_number":6},{"score":82,"breakdown":{"sire":0,"custom":0,"jockey":82},"horse_name":"ロードオブザチェコ","horse_number":1},{"score":61,"breakdown":{"sire":0,"custom":0,"jockey":61},"horse_name":"スプラウティング","horse_number":3},{"score":56,"breakdown":{"sire":0,"custom":4,"jockey":52},"horse_name":"ブリスタイム","horse_number":4},{"score":40,"breakdown":{"sire":0,"custom":0,"jockey":40},"horse_name":"ファイナルキング","horse_number":11},{"score":36,"breakdown":{"sire":0,"custom":0,"jockey":36},"horse_name":"レディブラウン","horse_number":5},{"score":28,"breakdown":{"sire":0,"custom":28,"jockey":0},"horse_name":"エイシントルペード","horse_number":8},{"score":18,"breakdown":{"sire":0,"custom":0,"jockey":18},"horse_name":"グットフォーチュン","horse_number":9},{"score":15,"breakdown":{"sire":0,"custom":0,"jockey":15},"horse_name":"アップテンペスト","horse_number":7},{"score":12,"breakdown":{"sire":0,"custom":12,"jockey":0},"horse_name":"グアドループ","horse_number":12}],"model":"yosou-v1","race_id":"202511161132","generatedAt":"2025-11-16T10:52:46.251Z"} | 2025-11-16T10:52:46.000Z |
| 49 | 202512200131 | yosou-v1 | {"best":{"score":133,"breakdown":{"sire":0,"custom":48,"jockey":85},"horse_name":"カンタベリービーム","horse_number":8},"items":[{"score":133,"breakdown":{"sire":0,"custom":48,"jockey":85},"horse_name":"カンタベリービーム","horse_number":8},{"score":94,"breakdown":{"sire":0,"custom":46,"jockey":48},"horse_name":"コスモラパウィラ","horse_number":6},{"score":54,"breakdown":{"sire":0,"custom":40,"jockey":14},"horse_name":"シーザソング","horse_number":7},{"score":52,"breakdown":{"sire":0,"custom":40,"jockey":12},"horse_name":"ランギロア","horse_number":9},{"score":44,"breakdown":{"sire":0,"custom":42,"jockey":2},"horse_name":"タスクディライト","horse_number":2},{"score":44,"breakdown":{"sire":0,"custom":44,"jockey":0},"horse_name":"チュラリヴァル","horse_number":4},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"ラッキートリガー","horse_number":1},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"レディアエラ","horse_number":3},{"score":32,"breakdown":{"sire":0,"custom":0,"jockey":32},"horse_name":"テンサラ","horse_number":5}],"model":"yosou-v1","race_id":"202512200131","generatedAt":"2025-12-20T06:56:58.332Z"} | 2025-12-20T06:56:57.000Z |
| 50 | 202512200231 | yosou-v1 | {"best":{"score":129,"breakdown":{"sire":0,"custom":44,"jockey":85},"horse_name":"リバージャスミン","horse_number":4},"items":[{"score":129,"breakdown":{"sire":0,"custom":44,"jockey":85},"horse_name":"リバージャスミン","horse_number":4},{"score":106,"breakdown":{"sire":0,"custom":40,"jockey":66},"horse_name":"カナデルラーケン","horse_number":5},{"score":72,"breakdown":{"sire":0,"custom":40,"jockey":32},"horse_name":"ホットロッドスター","horse_number":9},{"score":56,"breakdown":{"sire":0,"custom":42,"jockey":14},"horse_name":"クレレガール","horse_number":2},{"score":54,"breakdown":{"sire":0,"custom":40,"jockey":14},"horse_name":"スマートターキン","horse_number":7},{"score":50,"breakdown":{"sire":0,"custom":50,"jockey":0},"horse_name":"ドクターバローズ","horse_number":10},{"score":48,"breakdown":{"sire":0,"custom":48,"jockey":0},"horse_name":"タマールカ","horse_number":8},{"score":46,"breakdown":{"sire":0,"custom":46,"jockey":0},"horse_name":"キンデアポチャン","horse_number":6},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"アピールパワー","horse_number":1},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"オリヴィオリヴィ","horse_number":3}],"model":"yosou-v1","race_id":"202512200231","generatedAt":"2025-12-20T06:56:58.446Z"} | 2025-12-20T06:56:57.000Z |
| 51 | 202512200331 | yosou-v1 | {"best":{"score":90,"breakdown":{"sire":0,"custom":42,"jockey":48},"horse_name":"バリキング","horse_number":2},"items":[{"score":90,"breakdown":{"sire":0,"custom":42,"jockey":48},"horse_name":"バリキング","horse_number":2},{"score":77,"breakdown":{"sire":0,"custom":50,"jockey":27},"horse_name":"オーシンミリオン","horse_number":10},{"score":62,"breakdown":{"sire":0,"custom":48,"jockey":14},"horse_name":"アカリボーイ","horse_number":8},{"score":60,"breakdown":{"sire":0,"custom":46,"jockey":14},"horse_name":"マジックステラ","horse_number":6},{"score":44,"breakdown":{"sire":0,"custom":44,"jockey":0},"horse_name":"ミアソレイユ","horse_number":4},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"エスケーブラッド","horse_number":1},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"アーユーリアル","horse_number":3},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"ソレユケカツコ","horse_number":5},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"メイジョウエナジー","horse_number":7},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"ルゼンチ","horse_number":9}],"model":"yosou-v1","race_id":"202512200331","generatedAt":"2025-12-20T06:57:15.442Z"} | 2025-12-20T06:57:15.000Z |
| 52 | 202512200431 | yosou-v1 | {"best":{"score":96,"breakdown":{"sire":0,"custom":30,"jockey":66},"horse_name":"ハンドレインジ","horse_number":7},"items":[{"score":96,"breakdown":{"sire":0,"custom":30,"jockey":66},"horse_name":"ハンドレインジ","horse_number":7},{"score":63,"breakdown":{"sire":0,"custom":40,"jockey":23},"horse_name":"ロイヤルジョダーナ","horse_number":10},{"score":61,"breakdown":{"sire":0,"custom":34,"jockey":27},"horse_name":"ジーティーハッピー","horse_number":4},{"score":50,"breakdown":{"sire":0,"custom":2,"jockey":48},"horse_name":"ディヴァージオン","horse_number":2},{"score":44,"breakdown":{"sire":0,"custom":30,"jockey":14},"horse_name":"エースオーディン","horse_number":3},{"score":36,"breakdown":{"sire":0,"custom":36,"jockey":0},"horse_name":"プリンセスダイヤ","horse_number":6},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"リワードエレイン","horse_number":9},{"score":8,"breakdown":{"sire":0,"custom":8,"jockey":0},"horse_name":"スマイル","horse_number":8},{"score":5,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"コスモザウル","horse_number":5},{"score":1,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"サツマノカゼ","horse_number":1}],"model":"yosou-v1","race_id":"202512200431","generatedAt":"2025-12-20T06:57:15.476Z"} | 2025-12-20T06:57:15.000Z |
| 53 | 202512200631 | yosou-v1 | {"best":{"score":59,"breakdown":{"sire":0,"custom":32,"jockey":27},"horse_name":"クリノバーグマン","horse_number":2},"items":[{"score":59,"breakdown":{"sire":0,"custom":32,"jockey":27},"horse_name":"クリノバーグマン","horse_number":2},{"score":53,"breakdown":{"sire":0,"custom":30,"jockey":23},"horse_name":"コールイングミー","horse_number":5},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"アツィオーネ","horse_number":10},{"score":38,"breakdown":{"sire":0,"custom":38,"jockey":0},"horse_name":"メルヘンライズ","horse_number":8},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"レアルシチー","horse_number":7},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"アルマリカシバ","horse_number":9},{"score":28,"breakdown":{"sire":0,"custom":26,"jockey":2},"horse_name":"イニシャルティー","horse_number":6},{"score":24,"breakdown":{"sire":0,"custom":24,"jockey":0},"horse_name":"パレットキャット","horse_number":4},{"score":20,"breakdown":{"sire":0,"custom":20,"jockey":0},"horse_name":"クニノダイヤ","horse_number":3},{"score":1,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"アンダーザブリッジ","horse_number":1}],"model":"yosou-v1","race_id":"202512200631","generatedAt":"2025-12-20T06:57:32.226Z"} | 2025-12-20T06:57:31.000Z |
| 54 | 202512200531 | yosou-v1 | {"best":{"score":95,"breakdown":{"sire":0,"custom":10,"jockey":85},"horse_name":"ホワイトヘッド","horse_number":10},"items":[{"score":95,"breakdown":{"sire":0,"custom":10,"jockey":85},"horse_name":"ホワイトヘッド","horse_number":10},{"score":75,"breakdown":{"sire":0,"custom":0,"jockey":75},"horse_name":"アルドーレ","horse_number":5},{"score":68,"breakdown":{"sire":0,"custom":36,"jockey":32},"horse_name":"ユラリユラメイテ","horse_number":6},{"score":66,"breakdown":{"sire":0,"custom":0,"jockey":66},"horse_name":"カムランベイ","horse_number":7},{"score":48,"breakdown":{"sire":0,"custom":0,"jockey":48},"horse_name":"ウインユアソング","horse_number":3},{"score":25,"breakdown":{"sire":0,"custom":2,"jockey":23},"horse_name":"ナムラテディー","horse_number":2},{"score":12,"breakdown":{"sire":0,"custom":12,"jockey":0},"horse_name":"ベルドラゴ","horse_number":12},{"score":9,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"ヤマイチエスポ","horse_number":9},{"score":8,"breakdown":{"sire":0,"custom":8,"jockey":0},"horse_name":"ラインメッセージ","horse_number":8},{"score":4,"breakdown":{"sire":0,"custom":4,"jockey":0},"horse_name":"コスモメイゲツ","horse_number":4},{"score":2,"breakdown":{"sire":0,"custom":0,"jockey":2},"horse_name":"カプティフ","horse_number":11},{"score":1,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"ムサシフウジン","horse_number":1}],"model":"yosou-v1","race_id":"202512200531","generatedAt":"2025-12-20T06:57:32.336Z"} | 2025-12-20T06:57:31.000Z |
| 55 | 202512200731 | yosou-v1 | {"best":{"score":68,"breakdown":{"sire":0,"custom":20,"jockey":48},"horse_name":"デルマエウロパ","horse_number":3},"items":[{"score":68,"breakdown":{"sire":0,"custom":20,"jockey":48},"horse_name":"デルマエウロパ","horse_number":3},{"score":62,"breakdown":{"sire":0,"custom":30,"jockey":32},"horse_name":"ポジティビティ","horse_number":5},{"score":57,"breakdown":{"sire":0,"custom":34,"jockey":23},"horse_name":"マサウッドテール","horse_number":4},{"score":44,"breakdown":{"sire":0,"custom":30,"jockey":14},"horse_name":"ジャガーノート","horse_number":1},{"score":44,"breakdown":{"sire":0,"custom":30,"jockey":14},"horse_name":"リバティフレイム","horse_number":7},{"score":38,"breakdown":{"sire":0,"custom":38,"jockey":0},"horse_name":"ワイドレッド","horse_number":8},{"score":9,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"ラファエーレ","horse_number":9},{"score":6,"breakdown":{"sire":0,"custom":6,"jockey":0},"horse_name":"エイシンオンタイム","horse_number":6},{"score":4,"breakdown":{"sire":0,"custom":2,"jockey":2},"horse_name":"サクララージャン","horse_number":2}],"model":"yosou-v1","race_id":"202512200731","generatedAt":"2025-12-20T06:57:49.012Z"} | 2025-12-20T06:57:48.000Z |
| 56 | 202512200831 | yosou-v1 | {"best":{"score":96,"breakdown":{"sire":0,"custom":30,"jockey":66},"horse_name":"ニューウォーク","horse_number":7},"items":[{"score":96,"breakdown":{"sire":0,"custom":30,"jockey":66},"horse_name":"ニューウォーク","horse_number":7},{"score":62,"breakdown":{"sire":0,"custom":30,"jockey":32},"horse_name":"ノアプレスリー","horse_number":11},{"score":44,"breakdown":{"sire":0,"custom":30,"jockey":14},"horse_name":"サイカク","horse_number":10},{"score":38,"breakdown":{"sire":0,"custom":36,"jockey":2},"horse_name":"エヌマエリシュ","horse_number":6},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"ベルヴィオレット","horse_number":1},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"アメリカンクール","horse_number":3},{"score":28,"breakdown":{"sire":0,"custom":28,"jockey":0},"horse_name":"オンテンバール","horse_number":8},{"score":22,"breakdown":{"sire":0,"custom":22,"jockey":0},"horse_name":"ペイシャキク","horse_number":2},{"score":12,"breakdown":{"sire":0,"custom":0,"jockey":12},"horse_name":"カルリーノ","horse_number":5},{"score":9,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"ウェルマインド","horse_number":9},{"score":4,"breakdown":{"sire":0,"custom":4,"jockey":0},"horse_name":"インテンスフレイム","horse_number":4}],"model":"yosou-v1","race_id":"202512200831","generatedAt":"2025-12-20T06:57:49.136Z"} | 2025-12-20T06:57:49.000Z |
| 57 | 202512200931 | yosou-v1 | {"best":{"score":121,"breakdown":{"sire":0,"custom":36,"jockey":85},"horse_name":"マイネルアース","horse_number":6},"items":[{"score":121,"breakdown":{"sire":0,"custom":36,"jockey":85},"horse_name":"マイネルアース","horse_number":6},{"score":53,"breakdown":{"sire":0,"custom":30,"jockey":23},"horse_name":"クエンカ","horse_number":3},{"score":38,"breakdown":{"sire":0,"custom":38,"jockey":0},"horse_name":"スピードイエロー","horse_number":8},{"score":34,"breakdown":{"sire":0,"custom":34,"jockey":0},"horse_name":"フーイナム","horse_number":4},{"score":32,"breakdown":{"sire":0,"custom":0,"jockey":32},"horse_name":"ポジティブガール","horse_number":11},{"score":27,"breakdown":{"sire":0,"custom":0,"jockey":27},"horse_name":"カズラポニアン","horse_number":1},{"score":24,"breakdown":{"sire":0,"custom":10,"jockey":14},"horse_name":"ブリックバーン","horse_number":10},{"score":22,"breakdown":{"sire":0,"custom":22,"jockey":0},"horse_name":"ショウナンラジョア","horse_number":2},{"score":20,"breakdown":{"sire":0,"custom":20,"jockey":0},"horse_name":"ヨシュア","horse_number":9},{"score":14,"breakdown":{"sire":0,"custom":0,"jockey":14},"horse_name":"トワキ","horse_number":5},{"score":7,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"フューチャーアイ","horse_number":7}],"model":"yosou-v1","race_id":"202512200931","generatedAt":"2025-12-20T06:58:05.957Z"} | 2025-12-20T06:58:05.000Z |
| 58 | 202512201031 | yosou-v1 | {"best":{"score":105,"breakdown":{"sire":0,"custom":20,"jockey":85},"horse_name":"スカイライト","horse_number":3},"items":[{"score":105,"breakdown":{"sire":0,"custom":20,"jockey":85},"horse_name":"スカイライト","horse_number":3},{"score":28,"breakdown":{"sire":0,"custom":28,"jockey":0},"horse_name":"サノノゴールド","horse_number":8},{"score":23,"breakdown":{"sire":0,"custom":0,"jockey":23},"horse_name":"フィティアンガ","horse_number":9},{"score":20,"breakdown":{"sire":0,"custom":20,"jockey":0},"horse_name":"サノノスピード","horse_number":1},{"score":18,"breakdown":{"sire":0,"custom":6,"jockey":12},"horse_name":"ショットメーカー","horse_number":6},{"score":16,"breakdown":{"sire":0,"custom":2,"jockey":14},"horse_name":"ミステリオーソ","horse_number":2},{"score":7,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"ヤクモ","horse_number":7},{"score":5,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"ハルノサムソン","horse_number":5},{"score":4,"breakdown":{"sire":0,"custom":4,"jockey":0},"horse_name":"サーブルミラージュ","horse_number":4}],"model":"yosou-v1","race_id":"202512201031","generatedAt":"2025-12-20T06:58:05.991Z"} | 2025-12-20T06:58:05.000Z |
| 59 | 202512201231 | yosou-v1 | {"best":{"score":117,"breakdown":{"sire":0,"custom":32,"jockey":85},"horse_name":"フライハイ","horse_number":2},"items":[{"score":117,"breakdown":{"sire":0,"custom":32,"jockey":85},"horse_name":"フライハイ","horse_number":2},{"score":86,"breakdown":{"sire":0,"custom":20,"jockey":66},"horse_name":"ノアファラオ","horse_number":3},{"score":56,"breakdown":{"sire":0,"custom":24,"jockey":32},"horse_name":"ミユキマーベリック","horse_number":4},{"score":53,"breakdown":{"sire":0,"custom":30,"jockey":23},"horse_name":"リライトヒストリー","horse_number":9},{"score":52,"breakdown":{"sire":0,"custom":38,"jockey":14},"horse_name":"ブリスディーシャ","horse_number":8},{"score":47,"breakdown":{"sire":0,"custom":20,"jockey":27},"horse_name":"チークタイム","horse_number":1},{"score":42,"breakdown":{"sire":0,"custom":42,"jockey":0},"horse_name":"チュウオーハーン","horse_number":12},{"score":20,"breakdown":{"sire":0,"custom":20,"jockey":0},"horse_name":"リベラティオ","horse_number":7},{"score":10,"breakdown":{"sire":0,"custom":10,"jockey":0},"horse_name":"ナバロン","horse_number":10},{"score":6,"breakdown":{"sire":0,"custom":6,"jockey":0},"horse_name":"ブラウナイル","horse_number":6},{"score":5,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"マルモルミエール","horse_number":5},{"score":2,"breakdown":{"sire":0,"custom":0,"jockey":2},"horse_name":"ダノンテイオー","horse_number":11}],"model":"yosou-v1","race_id":"202512201231","generatedAt":"2025-12-20T06:58:23.115Z"} | 2025-12-20T06:58:23.000Z |
| 60 | 202512201131 | yosou-v1 | {"best":{"score":105,"breakdown":{"sire":0,"custom":20,"jockey":85},"horse_name":"グランレザンドール","horse_number":5},"items":[{"score":105,"breakdown":{"sire":0,"custom":20,"jockey":85},"horse_name":"グランレザンドール","horse_number":5},{"score":72,"breakdown":{"sire":0,"custom":6,"jockey":66},"horse_name":"カレンルシェルブル","horse_number":6},{"score":14,"breakdown":{"sire":0,"custom":0,"jockey":14},"horse_name":"エイシンツーリング","horse_number":3},{"score":14,"breakdown":{"sire":0,"custom":0,"jockey":14},"horse_name":"モノノフブルー","horse_number":9},{"score":12,"breakdown":{"sire":0,"custom":0,"jockey":12},"horse_name":"ディサーニング","horse_number":7},{"score":8,"breakdown":{"sire":0,"custom":8,"jockey":0},"horse_name":"デルマアズラエル","horse_number":8},{"score":4,"breakdown":{"sire":0,"custom":4,"jockey":0},"horse_name":"ポイントフォワード","horse_number":4},{"score":2,"breakdown":{"sire":0,"custom":0,"jockey":2},"horse_name":"ゲンパチレオニダス","horse_number":1},{"score":2,"breakdown":{"sire":0,"custom":2,"jockey":0},"horse_name":"ウォーターレモン","horse_number":2}],"model":"yosou-v1","race_id":"202512201131","generatedAt":"2025-12-20T06:58:23.308Z"} | 2025-12-20T06:58:23.000Z |
| 61 | 202512200232 | yosou-v1 | {"best":{"score":129,"breakdown":{"sire":0,"custom":44,"jockey":85},"horse_name":"リバージャスミン","horse_number":4},"items":[{"score":129,"breakdown":{"sire":0,"custom":44,"jockey":85},"horse_name":"リバージャスミン","horse_number":4},{"score":106,"breakdown":{"sire":0,"custom":40,"jockey":66},"horse_name":"カナデルラーケン","horse_number":5},{"score":72,"breakdown":{"sire":0,"custom":40,"jockey":32},"horse_name":"ホットロッドスター","horse_number":9},{"score":56,"breakdown":{"sire":0,"custom":42,"jockey":14},"horse_name":"クレレガール","horse_number":2},{"score":54,"breakdown":{"sire":0,"custom":40,"jockey":14},"horse_name":"スマートターキン","horse_number":7},{"score":50,"breakdown":{"sire":0,"custom":50,"jockey":0},"horse_name":"ドクターバローズ","horse_number":10},{"score":48,"breakdown":{"sire":0,"custom":48,"jockey":0},"horse_name":"タマールカ","horse_number":8},{"score":46,"breakdown":{"sire":0,"custom":46,"jockey":0},"horse_name":"キンデアポチャン","horse_number":6},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"アピールパワー","horse_number":1},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"オリヴィオリヴィ","horse_number":3}],"model":"yosou-v1","race_id":"202512200232","generatedAt":"2025-12-20T06:58:40.304Z"} | 2025-12-20T06:58:39.000Z |
| 62 | 202512200132 | yosou-v1 | {"best":{"score":133,"breakdown":{"sire":0,"custom":48,"jockey":85},"horse_name":"カンタベリービーム","horse_number":8},"items":[{"score":133,"breakdown":{"sire":0,"custom":48,"jockey":85},"horse_name":"カンタベリービーム","horse_number":8},{"score":94,"breakdown":{"sire":0,"custom":46,"jockey":48},"horse_name":"コスモラパウィラ","horse_number":6},{"score":54,"breakdown":{"sire":0,"custom":40,"jockey":14},"horse_name":"シーザソング","horse_number":7},{"score":52,"breakdown":{"sire":0,"custom":40,"jockey":12},"horse_name":"ランギロア","horse_number":9},{"score":44,"breakdown":{"sire":0,"custom":42,"jockey":2},"horse_name":"タスクディライト","horse_number":2},{"score":44,"breakdown":{"sire":0,"custom":44,"jockey":0},"horse_name":"チュラリヴァル","horse_number":4},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"ラッキートリガー","horse_number":1},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"レディアエラ","horse_number":3},{"score":32,"breakdown":{"sire":0,"custom":0,"jockey":32},"horse_name":"テンサラ","horse_number":5}],"model":"yosou-v1","race_id":"202512200132","generatedAt":"2025-12-20T06:58:40.474Z"} | 2025-12-20T06:58:40.000Z |
| 63 | 202512200332 | yosou-v1 | {"best":{"score":90,"breakdown":{"sire":0,"custom":42,"jockey":48},"horse_name":"バリキング","horse_number":2},"items":[{"score":90,"breakdown":{"sire":0,"custom":42,"jockey":48},"horse_name":"バリキング","horse_number":2},{"score":77,"breakdown":{"sire":0,"custom":50,"jockey":27},"horse_name":"オーシンミリオン","horse_number":10},{"score":62,"breakdown":{"sire":0,"custom":48,"jockey":14},"horse_name":"アカリボーイ","horse_number":8},{"score":60,"breakdown":{"sire":0,"custom":46,"jockey":14},"horse_name":"マジックステラ","horse_number":6},{"score":44,"breakdown":{"sire":0,"custom":44,"jockey":0},"horse_name":"ミアソレイユ","horse_number":4},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"エスケーブラッド","horse_number":1},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"アーユーリアル","horse_number":3},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"ソレユケカツコ","horse_number":5},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"メイジョウエナジー","horse_number":7},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"ルゼンチ","horse_number":9}],"model":"yosou-v1","race_id":"202512200332","generatedAt":"2025-12-20T06:58:57.000Z"} | 2025-12-20T06:58:56.000Z |
| 64 | 202512200432 | yosou-v1 | {"best":{"score":96,"breakdown":{"sire":0,"custom":30,"jockey":66},"horse_name":"ハンドレインジ","horse_number":7},"items":[{"score":96,"breakdown":{"sire":0,"custom":30,"jockey":66},"horse_name":"ハンドレインジ","horse_number":7},{"score":63,"breakdown":{"sire":0,"custom":40,"jockey":23},"horse_name":"ロイヤルジョダーナ","horse_number":10},{"score":61,"breakdown":{"sire":0,"custom":34,"jockey":27},"horse_name":"ジーティーハッピー","horse_number":4},{"score":50,"breakdown":{"sire":0,"custom":2,"jockey":48},"horse_name":"ディヴァージオン","horse_number":2},{"score":44,"breakdown":{"sire":0,"custom":30,"jockey":14},"horse_name":"エースオーディン","horse_number":3},{"score":36,"breakdown":{"sire":0,"custom":36,"jockey":0},"horse_name":"プリンセスダイヤ","horse_number":6},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"リワードエレイン","horse_number":9},{"score":8,"breakdown":{"sire":0,"custom":8,"jockey":0},"horse_name":"スマイル","horse_number":8},{"score":5,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"コスモザウル","horse_number":5},{"score":1,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"サツマノカゼ","horse_number":1}],"model":"yosou-v1","race_id":"202512200432","generatedAt":"2025-12-20T06:58:57.456Z"} | 2025-12-20T06:58:56.000Z |
| 65 | 202512200532 | yosou-v1 | {"best":{"score":95,"breakdown":{"sire":0,"custom":10,"jockey":85},"horse_name":"ホワイトヘッド","horse_number":10},"items":[{"score":95,"breakdown":{"sire":0,"custom":10,"jockey":85},"horse_name":"ホワイトヘッド","horse_number":10},{"score":75,"breakdown":{"sire":0,"custom":0,"jockey":75},"horse_name":"アルドーレ","horse_number":5},{"score":68,"breakdown":{"sire":0,"custom":36,"jockey":32},"horse_name":"ユラリユラメイテ","horse_number":6},{"score":66,"breakdown":{"sire":0,"custom":0,"jockey":66},"horse_name":"カムランベイ","horse_number":7},{"score":48,"breakdown":{"sire":0,"custom":0,"jockey":48},"horse_name":"ウインユアソング","horse_number":3},{"score":25,"breakdown":{"sire":0,"custom":2,"jockey":23},"horse_name":"ナムラテディー","horse_number":2},{"score":12,"breakdown":{"sire":0,"custom":12,"jockey":0},"horse_name":"ベルドラゴ","horse_number":12},{"score":9,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"ヤマイチエスポ","horse_number":9},{"score":8,"breakdown":{"sire":0,"custom":8,"jockey":0},"horse_name":"ラインメッセージ","horse_number":8},{"score":4,"breakdown":{"sire":0,"custom":4,"jockey":0},"horse_name":"コスモメイゲツ","horse_number":4},{"score":2,"breakdown":{"sire":0,"custom":0,"jockey":2},"horse_name":"カプティフ","horse_number":11},{"score":1,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"ムサシフウジン","horse_number":1}],"model":"yosou-v1","race_id":"202512200532","generatedAt":"2025-12-20T06:59:13.924Z"} | 2025-12-20T06:59:13.000Z |
| 66 | 202512200632 | yosou-v1 | {"best":{"score":59,"breakdown":{"sire":0,"custom":32,"jockey":27},"horse_name":"クリノバーグマン","horse_number":2},"items":[{"score":59,"breakdown":{"sire":0,"custom":32,"jockey":27},"horse_name":"クリノバーグマン","horse_number":2},{"score":53,"breakdown":{"sire":0,"custom":30,"jockey":23},"horse_name":"コールイングミー","horse_number":5},{"score":40,"breakdown":{"sire":0,"custom":40,"jockey":0},"horse_name":"アツィオーネ","horse_number":10},{"score":38,"breakdown":{"sire":0,"custom":38,"jockey":0},"horse_name":"メルヘンライズ","horse_number":8},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"レアルシチー","horse_number":7},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"アルマリカシバ","horse_number":9},{"score":28,"breakdown":{"sire":0,"custom":26,"jockey":2},"horse_name":"イニシャルティー","horse_number":6},{"score":24,"breakdown":{"sire":0,"custom":24,"jockey":0},"horse_name":"パレットキャット","horse_number":4},{"score":20,"breakdown":{"sire":0,"custom":20,"jockey":0},"horse_name":"クニノダイヤ","horse_number":3},{"score":1,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"アンダーザブリッジ","horse_number":1}],"model":"yosou-v1","race_id":"202512200632","generatedAt":"2025-12-20T06:59:14.326Z"} | 2025-12-20T06:59:14.000Z |
| 67 | 202512200732 | yosou-v1 | {"best":{"score":68,"breakdown":{"sire":0,"custom":20,"jockey":48},"horse_name":"デルマエウロパ","horse_number":3},"items":[{"score":68,"breakdown":{"sire":0,"custom":20,"jockey":48},"horse_name":"デルマエウロパ","horse_number":3},{"score":62,"breakdown":{"sire":0,"custom":30,"jockey":32},"horse_name":"ポジティビティ","horse_number":5},{"score":57,"breakdown":{"sire":0,"custom":34,"jockey":23},"horse_name":"マサウッドテール","horse_number":4},{"score":44,"breakdown":{"sire":0,"custom":30,"jockey":14},"horse_name":"ジャガーノート","horse_number":1},{"score":44,"breakdown":{"sire":0,"custom":30,"jockey":14},"horse_name":"リバティフレイム","horse_number":7},{"score":38,"breakdown":{"sire":0,"custom":38,"jockey":0},"horse_name":"ワイドレッド","horse_number":8},{"score":9,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"ラファエーレ","horse_number":9},{"score":6,"breakdown":{"sire":0,"custom":6,"jockey":0},"horse_name":"エイシンオンタイム","horse_number":6},{"score":4,"breakdown":{"sire":0,"custom":2,"jockey":2},"horse_name":"サクララージャン","horse_number":2}],"model":"yosou-v1","race_id":"202512200732","generatedAt":"2025-12-20T06:59:30.765Z"} | 2025-12-20T06:59:30.000Z |
| 68 | 202512200832 | yosou-v1 | {"best":{"score":96,"breakdown":{"sire":0,"custom":30,"jockey":66},"horse_name":"ニューウォーク","horse_number":7},"items":[{"score":96,"breakdown":{"sire":0,"custom":30,"jockey":66},"horse_name":"ニューウォーク","horse_number":7},{"score":62,"breakdown":{"sire":0,"custom":30,"jockey":32},"horse_name":"ノアプレスリー","horse_number":11},{"score":44,"breakdown":{"sire":0,"custom":30,"jockey":14},"horse_name":"サイカク","horse_number":10},{"score":38,"breakdown":{"sire":0,"custom":36,"jockey":2},"horse_name":"エヌマエリシュ","horse_number":6},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"ベルヴィオレット","horse_number":1},{"score":30,"breakdown":{"sire":0,"custom":30,"jockey":0},"horse_name":"アメリカンクール","horse_number":3},{"score":28,"breakdown":{"sire":0,"custom":28,"jockey":0},"horse_name":"オンテンバール","horse_number":8},{"score":22,"breakdown":{"sire":0,"custom":22,"jockey":0},"horse_name":"ペイシャキク","horse_number":2},{"score":12,"breakdown":{"sire":0,"custom":0,"jockey":12},"horse_name":"カルリーノ","horse_number":5},{"score":9,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"ウェルマインド","horse_number":9},{"score":4,"breakdown":{"sire":0,"custom":4,"jockey":0},"horse_name":"インテンスフレイム","horse_number":4}],"model":"yosou-v1","race_id":"202512200832","generatedAt":"2025-12-20T06:59:32.239Z"} | 2025-12-20T06:59:31.000Z |
| 69 | 202512200932 | yosou-v1 | {"best":{"score":121,"breakdown":{"sire":0,"custom":36,"jockey":85},"horse_name":"マイネルアース","horse_number":6},"items":[{"score":121,"breakdown":{"sire":0,"custom":36,"jockey":85},"horse_name":"マイネルアース","horse_number":6},{"score":53,"breakdown":{"sire":0,"custom":30,"jockey":23},"horse_name":"クエンカ","horse_number":3},{"score":38,"breakdown":{"sire":0,"custom":38,"jockey":0},"horse_name":"スピードイエロー","horse_number":8},{"score":34,"breakdown":{"sire":0,"custom":34,"jockey":0},"horse_name":"フーイナム","horse_number":4},{"score":32,"breakdown":{"sire":0,"custom":0,"jockey":32},"horse_name":"ポジティブガール","horse_number":11},{"score":27,"breakdown":{"sire":0,"custom":0,"jockey":27},"horse_name":"カズラポニアン","horse_number":1},{"score":24,"breakdown":{"sire":0,"custom":10,"jockey":14},"horse_name":"ブリックバーン","horse_number":10},{"score":22,"breakdown":{"sire":0,"custom":22,"jockey":0},"horse_name":"ショウナンラジョア","horse_number":2},{"score":20,"breakdown":{"sire":0,"custom":20,"jockey":0},"horse_name":"ヨシュア","horse_number":9},{"score":14,"breakdown":{"sire":0,"custom":0,"jockey":14},"horse_name":"トワキ","horse_number":5},{"score":7,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"フューチャーアイ","horse_number":7}],"model":"yosou-v1","race_id":"202512200932","generatedAt":"2025-12-20T06:59:50.347Z"} | 2025-12-20T06:59:50.000Z |
| 70 | 202512201032 | yosou-v1 | {"best":{"score":105,"breakdown":{"sire":0,"custom":20,"jockey":85},"horse_name":"スカイライト","horse_number":3},"items":[{"score":105,"breakdown":{"sire":0,"custom":20,"jockey":85},"horse_name":"スカイライト","horse_number":3},{"score":28,"breakdown":{"sire":0,"custom":28,"jockey":0},"horse_name":"サノノゴールド","horse_number":8},{"score":23,"breakdown":{"sire":0,"custom":0,"jockey":23},"horse_name":"フィティアンガ","horse_number":9},{"score":20,"breakdown":{"sire":0,"custom":20,"jockey":0},"horse_name":"サノノスピード","horse_number":1},{"score":18,"breakdown":{"sire":0,"custom":6,"jockey":12},"horse_name":"ショットメーカー","horse_number":6},{"score":16,"breakdown":{"sire":0,"custom":2,"jockey":14},"horse_name":"ミステリオーソ","horse_number":2},{"score":7,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"ヤクモ","horse_number":7},{"score":5,"breakdown":{"sire":0,"custom":0,"jockey":0},"horse_name":"ハルノサムソン","horse_number":5},{"score":4,"breakdown":{"sire":0,"custom":4,"jockey":0},"horse_name":"サーブルミラージュ","horse_number":4}],"model":"yosou-v1","race_id":"202512201032","generatedAt":"2025-12-20T06:59:50.347Z"} | 2025-12-20T06:59:50.000Z |

---

## Table: prediction_eval

### Schema

| Field | Type | Null | Key | Default | Extra |
|---|---|---|---|---|---|
| race_id | char(12) | NO | PRI | null |  |
| model_version | varchar(64) | NO | PRI | null |  |
| predicted_horse_number | tinyint | YES |  | null |  |
| win_hit | tinyint(1) | NO |  | 0 |  |
| win_payout | int | YES |  | null |  |
| place_hit | tinyint(1) | NO |  | 0 |  |
| place_payout | int | YES |  | null |  |
| created_at | timestamp | NO |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| updated_at | timestamp | NO |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |

### Data (1 rows)

| race_id | model_version | predicted_horse_number | win_hit | win_payout | place_hit | place_payout | created_at | updated_at |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 202510130110 | yosou-v1 | 2 | 0 | NULL | 1 | 160 | 2025-10-13T01:14:55.000Z | 2025-10-13T02:18:40.000Z |

---

## Table: prediction_roi

### Schema

| Field | Type | Null | Key | Default | Extra |
|---|---|---|---|---|---|
| race_id | char(12) | NO | PRI | null |  |
| model_version | varchar(64) | NO | PRI | null |  |
| strategy | varchar(32) | NO | PRI | null |  |
| stake | int | NO |  | null |  |
| returned | int | NO |  | null |  |
| roi_pct | decimal(8,4) | NO |  | null |  |
| created_at | timestamp | NO |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| updated_at | timestamp | NO |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |

### Data (3 rows)

| race_id | model_version | strategy | stake | returned | roi_pct | created_at | updated_at |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 202510130110 | yosou-v1 | ev_place | 200 | 530 | 265.0000 | 2025-10-13T02:07:41.000Z | 2025-10-13T02:07:41.000Z |
| 202510130110 | yosou-v1 | place | 100 | 160 | 160.0000 | 2025-10-13T02:14:14.000Z | 2025-10-13T02:18:40.000Z |
| 202510130110 | yosou-v1 | single | 100 | 0 | 0.0000 | 2025-10-13T02:14:14.000Z | 2025-10-13T02:18:40.000Z |

---

## Table: prediction_roi_daily

### Schema

| Field | Type | Null | Key | Default | Extra |
|---|---|---|---|---|---|
| ymd | date | NO | PRI | null |  |
| model_version | varchar(32) | NO | PRI | null |  |
| strategy | varchar(32) | NO | PRI | null |  |
| races | int | NO |  | null |  |
| invest_yen | int | NO |  | null |  |
| return_yen | int | NO |  | null |  |
| roi_percent | decimal(7,2) | NO |  | null |  |

### Data (0 rows)

*No data*

---

## Table: race_cnt

### Schema

| Field | Type | Null | Key | Default | Extra |
|---|---|---|---|---|---|
| id | varchar(10) | NO | PRI | null |  |
| cnt | int | NO |  | null |  |
| created_at | timestamp | NO |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |

### Data (15 rows)

| id | cnt | created_at |
| --- | --- | --- |
| 2025101210 | 12 | 2025-10-12T14:29:04.000Z |
| 2025101222 | 10 | 2025-10-12T14:29:05.000Z |
| 2025101231 | 12 | 2025-10-12T14:29:05.000Z |
| 2025101232 | 11 | 2025-10-12T14:29:06.000Z |
| 2025101310 | 12 | 2025-10-12T13:57:21.000Z |
| 2025101321 | 12 | 2025-10-12T13:57:22.000Z |
| 2025101332 | 11 | 2025-10-12T13:57:22.000Z |
| 2025111610 | 12 | 2025-11-16T07:47:56.000Z |
| 2025111622 | 10 | 2025-11-16T07:47:56.000Z |
| 2025111631 | 12 | 2025-11-16T07:47:56.000Z |
| 2025111632 | 11 | 2025-11-16T07:47:57.000Z |
| 2025122031 | 12 | 2025-12-20T06:53:01.000Z |
| 2025122032 | 10 | 2025-12-20T06:53:01.000Z |
| 2026020131 | 10 | 2026-02-01T00:34:34.000Z |
| 2026020132 | 12 | 2026-02-01T00:34:34.000Z |

---

## Table: race_count_by_date

### Schema

| Field | Type | Null | Key | Default | Extra |
|---|---|---|---|---|---|
| ymd | char(8) | NO | PRI | null |  |
| venue_code | varchar(4) | NO | PRI | null |  |
| total_races | int | NO |  | null |  |
| updated_at | timestamp | NO |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |

### Data (8 rows)

| ymd | venue_code | total_races | updated_at |
| --- | --- | --- | --- |
| 20251116 | 10 | 12 | 2025-11-16T10:10:16.000Z |
| 20251116 | 22 | 10 | 2025-11-16T10:10:17.000Z |
| 20251116 | 31 | 12 | 2025-11-16T10:10:17.000Z |
| 20251116 | 32 | 11 | 2025-11-16T10:10:17.000Z |
| 20251220 | 31 | 12 | 2025-12-20T06:53:01.000Z |
| 20251220 | 32 | 10 | 2025-12-20T06:53:01.000Z |
| 20260201 | 31 | 10 | 2026-02-01T00:34:34.000Z |
| 20260201 | 32 | 12 | 2026-02-01T00:34:34.000Z |

---

## Table: race_payouts

### Schema

| Field | Type | Null | Key | Default | Extra |
|---|---|---|---|---|---|
| race_id | bigint | NO | PRI | null |  |
| bet_type | enum('WIN','PLACE') | NO | PRI | null |  |
| horse_number | int | NO | PRI | null |  |
| payout | int | YES |  | null |  |
| popularity | int | YES |  | null |  |
| created_at | timestamp | NO |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| updated_at | timestamp | NO |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |

### Data (4 rows)

| race_id | bet_type | horse_number | payout | popularity | created_at | updated_at |
| --- | --- | --- | --- | --- | --- | --- |
| 202510130110 | WIN | 7 | 460 | 2 | 2025-10-13T00:45:42.000Z | 2025-10-13T00:45:42.000Z |
| 202510130110 | PLACE | 1 | 370 | 7 | 2025-10-13T00:45:42.000Z | 2025-10-13T00:45:42.000Z |
| 202510130110 | PLACE | 2 | 160 | 2 | 2025-10-13T00:45:42.000Z | 2025-10-13T00:45:42.000Z |
| 202510130110 | PLACE | 7 | 180 | 3 | 2025-10-13T00:45:42.000Z | 2025-10-13T00:45:42.000Z |

---

## Table: race_results

### Schema

| Field | Type | Null | Key | Default | Extra |
|---|---|---|---|---|---|
| race_result_id | bigint | NO | PRI | null | auto_increment |
| race_id | bigint | NO | MUL | null |  |
| frame_number | int | NO |  | null |  |
| horse_number | int | NO |  | null |  |
| horse_name | varchar(64) | NO |  | null |  |
| official_finish_position | int | NO |  | null |  |
| dead_heat_group | int | YES |  | null |  |
| dead_heat_order_in_group | int | YES |  | null |  |
| finish_time | varchar(16) | YES |  | null |  |
| margin | varchar(16) | YES |  | null |  |
| jockey_name | varchar(64) | YES | MUL | null |  |
| odds_final | decimal(8,2) | YES |  | null |  |
| prize | int | YES |  | null |  |
| disqualified | tinyint(1) | NO |  | 0 |  |
| notes | varchar(255) | YES |  | null |  |
| created_at | timestamp | NO |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |

### Data (11 rows)

| race_result_id | race_id | frame_number | horse_number | horse_name | official_finish_position | dead_heat_group | dead_heat_order_in_group | finish_time | margin | jockey_name | odds_final | prize | disqualified | notes | created_at |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 202510130110 | 6 | 7 | ファータフィオーレ | 1 | NULL | NULL | 1:00.2 | NULL | 大坪慎 (盛岡) | NULL | NULL | 0 | NULL | 2025-10-12T21:14:46.000Z |
| 2 | 202510130110 | 1 | 1 | アイドルフェスタ | 2 | NULL | NULL | 1:01.0 | ５ | 菅原辰 (水沢) | NULL | NULL | 0 | NULL | 2025-10-12T21:14:46.000Z |
| 3 | 202510130110 | 2 | 2 | スマイルバニラ | 3 | NULL | NULL | 1:01.1 | １／２ | 山本聡 (水沢) | NULL | NULL | 0 | NULL | 2025-10-12T21:14:46.000Z |
| 4 | 202510130110 | 6 | 6 | シプレーノート | 4 | NULL | NULL | 1:01.5 | ２ １／２ | 山本紀 (水沢) | NULL | NULL | 0 | NULL | 2025-10-12T21:14:46.000Z |
| 5 | 202510130110 | 4 | 4 | ソノバシノギ | 5 | NULL | NULL | 1:01.7 | １ | 小林凌 (盛岡) | NULL | NULL | 0 | NULL | 2025-10-12T21:14:46.000Z |
| 6 | 202510130110 | 7 | 8 | グローブミッション | 6 | NULL | NULL | 1:01.7 | クビ | △坂井瑛 (水沢) | NULL | NULL | 0 | NULL | 2025-10-12T21:14:46.000Z |
| 7 | 202510130110 | 8 | 10 | ダンストンローザ | 7 | NULL | NULL | 1:02.2 | ３ | 佐々志 (水沢) | NULL | NULL | 0 | NULL | 2025-10-12T21:14:46.000Z |
| 8 | 202510130110 | 8 | 11 | ラセーヌ | 8 | NULL | NULL | 1:02.7 | ３ | 塚本涼 (水沢) | NULL | NULL | 0 | NULL | 2025-10-12T21:14:46.000Z |
| 9 | 202510130110 | 3 | 3 | ノーブルアイル | 9 | NULL | NULL | 1:03.0 | １ １／２ | 高松亮 (水沢) | NULL | NULL | 0 | NULL | 2025-10-12T21:14:46.000Z |
| 10 | 202510130110 | 7 | 9 | キタスクワート | 10 | NULL | NULL | 1:03.4 | ２ １／２ | 鈴木祐 (盛岡) | NULL | NULL | 0 | NULL | 2025-10-12T21:14:46.000Z |
| 11 | 202510130110 | 5 | 5 | メモリーメイラード | 11 | NULL | NULL | 1:03.8 | ２ １／２ | 南郷家 (盛岡) | NULL | NULL | 0 | NULL | 2025-10-12T21:14:46.000Z |

---

## Table: racing_form

### Schema

| Field | Type | Null | Key | Default | Extra |
|---|---|---|---|---|---|
| race_id | bigint | NO | PRI | null |  |
| frame_number | int | NO |  | null |  |
| horse_number | int | NO | PRI | null |  |
| horse_name | varchar(64) | NO |  | null |  |
| sex_age | varchar(8) | YES |  | null |  |
| hair | varchar(8) | YES |  | null |  |
| birthyear | tinyint unsigned | YES |  | null |  |
| birthymonth | tinyint unsigned | YES |  | null |  |
| sire | varchar(64) | YES |  | null |  |
| dam | varchar(64) | YES |  | null |  |
| broodmare_sire | varchar(64) | YES |  | null |  |
| carried_weight | decimal(4,1) | YES |  | null |  |
| jockey_name | varchar(64) | YES | MUL | null |  |
| affiliation | varchar(16) | YES |  | null |  |
| trainer_name | varchar(64) | YES | MUL | null |  |
| owner | varchar(64) | YES |  | null |  |
| breeder | varchar(64) | YES |  | null |  |
| odds_morning | decimal(8,2) | YES |  | null |  |
| horse_weight | int | YES |  | null |  |
| horse_weight_diff | int | YES |  | null |  |
| draw_number | int | YES |  | null |  |
| remarks | varchar(255) | YES |  | null |  |
| raw_json | json | YES |  | null |  |
| created_at | timestamp | NO |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| updated_at | timestamp | NO |  | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |

### Data (700 rows)

| race_id | frame_number | horse_number | horse_name | sex_age | hair | birthyear | birthymonth | sire | dam | broodmare_sire | carried_weight | jockey_name | affiliation | trainer_name | owner | breeder | odds_morning | horse_weight | horse_weight_diff | draw_number | remarks | raw_json | created_at | updated_at |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 202510130110 | 1 | 1 | アイドルフェスタ | 牝3 | 黒鹿毛 | 22 | 4 | アイドルフェスタ | カリフォルニアクローム | オレハマッテルゼ | 54.0 | 菅原辰 | 岩手 | NULL | NULL | 三嶋牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-10-12T21:48:10.000Z | 2025-10-12T21:48:10.000Z |
| 202510130110 | 2 | 2 | スマイルバニラ | 牝3 | 黒鹿毛 | 22 | 4 | スマイルバニラ | リオンディーズ | ヴィクトワールピサ | 54.0 | 山本聡 | 岩手 | NULL | NULL | 習志野牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-10-12T21:48:10.000Z | 2025-10-12T21:48:10.000Z |
| 202510130110 | 3 | 3 | ノーブルアイル | 牝3 | 黒鹿毛 | 22 | 5 | ノーブルアイル | ミッキーアイル | Blame | 54.0 | 高松亮 | 岩手 | NULL | NULL | 市川フアーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-10-12T21:48:10.000Z | 2025-10-12T21:48:10.000Z |
| 202510130110 | 4 | 4 | ソノバシノギ | 牝3 | 鹿毛 | 22 | 2 | ソノバシノギ | フォーウィールドライブ | ハーツクライ | 54.0 | 小林凌 | 岩手 | NULL | NULL | 新井昭二牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-10-12T21:48:10.000Z | 2025-10-12T21:48:10.000Z |
| 202510130110 | 5 | 5 | メモリーメイラード | 牝3 | 栗毛 | 22 | 5 | メモリーメイラード | スマートファルコン | ヘニーヒューズ | 54.0 | 南郷家 | 岩手 | NULL | NULL | 対馬正 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-10-12T21:48:10.000Z | 2025-10-12T21:48:10.000Z |
| 202510130110 | 6 | 6 | シプレーノート | 牝3 | 鹿毛 | 22 | 4 | シプレーノート | ディーマジェスティ | サクラバクシンオー | 54.0 | 山本紀 | 岩手 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-10-12T21:48:10.000Z | 2025-10-12T21:48:10.000Z |
| 202510130110 | 6 | 7 | ファータフィオーレ | 牝3 | 鹿毛 | 22 | 4 | ファータフィオーレ | サトノアラジン | アドマイヤムーン | 54.0 | 大坪慎 | 岩手 | NULL | NULL | フジワラフアーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-10-12T21:48:10.000Z | 2025-10-12T21:48:10.000Z |
| 202510130110 | 7 | 8 | グローブミッション | 牝3 | 栗毛 | 22 | 4 | グローブミッション | ノーブルミッション | ダイワメジャー | 52.0 | 坂井瑛 | 岩手 | NULL | NULL | 広田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-10-12T21:48:10.000Z | 2025-10-12T21:48:10.000Z |
| 202510130110 | 7 | 9 | キタスクワート | 牡11 | 栗毛 | 14 | 6 | キタスクワート | スクワートルスクワート | ジェネラス | 56.0 | 鈴木祐 | 岩手 | NULL | NULL | 北村牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-10-12T21:48:10.000Z | 2025-10-12T21:48:10.000Z |
| 202510130110 | 8 | 10 | ダンストンローザ | 牝3 | 鹿毛 | 22 | 6 | ダンストンローザ | ストロングリターン | ホワイトマズル | 54.0 | 佐々志 | 岩手 | NULL | NULL | レジェンドファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-10-12T21:48:10.000Z | 2025-10-12T21:48:10.000Z |
| 202510130110 | 8 | 11 | ラセーヌ | 牝3 | 栗毛 | 22 | 4 | ラセーヌ | タワーオブロンドン | キングカメハメハ | 54.0 | 塚本涼 | 岩手 | NULL | NULL | 前田ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-10-12T21:48:10.000Z | 2025-10-12T21:48:10.000Z |
| 202511160110 | 1 | 1 | モンサンジャスミン | 牝2 | 黒鹿毛 | 23 | 4 | モンサンジャスミン | ノヴェリスト | キングカメハメハ | 54.0 | 佐々志 | 岩手 | NULL | NULL | 賀張中川牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:20.000Z | 2025-11-16T10:46:20.000Z |
| 202511160110 | 2 | 2 | サマーカムカム | 牝2 | 青鹿毛 | 23 | 3 | サマーカムカム | ダノンスマッシュ | ディープインパクト | 54.0 | 南郷家 | 岩手 | NULL | NULL | 市川牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:20.000Z | 2025-11-16T10:46:20.000Z |
| 202511160110 | 3 | 3 | タカマキセブン | 牝2 | 鹿毛 | 23 | 5 | タカマキセブン | コパノリッキー | ロージズインメイ | 54.0 | 菅原辰 | 岩手 | NULL | NULL | サカイファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:20.000Z | 2025-11-16T10:46:20.000Z |
| 202511160110 | 4 | 4 | ヤッティライネン | 牡2 | 黒鹿毛 | 23 | 3 | ヤッティライネン | スズカモンスーン | More Than Ready | 55.0 | 阿部英 | 岩手 | NULL | NULL | 辻牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:20.000Z | 2025-11-16T10:46:20.000Z |
| 202511160110 | 5 | 5 | エボリスピナ | 牝2 | 鹿毛 | 23 | 2 | エボリスピナ | ジャスタウェイ | Sea The Stars | 52.0 | 坂井瑛 | 岩手 | NULL | NULL | 谷川牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:20.000Z | 2025-11-16T10:46:20.000Z |
| 202511160110 | 6 | 6 | ラヴレインブーケ | 牝2 | 栗毛 | 23 | 5 | ラヴレインブーケ | ワールドエース | アフリート | 54.0 | 鈴木祐 | 岩手 | NULL | NULL | 静内酒井牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:20.000Z | 2025-11-16T10:46:20.000Z |
| 202511160110 | 7 | 7 | ユキノレックス | 牡2 | 黒鹿毛 | 23 | 4 | ユキノレックス | アメリカンペイトリオット | ハーツクライ | 55.0 | 高松亮 | 岩手 | NULL | NULL | 大滝康晴 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:20.000Z | 2025-11-16T10:46:20.000Z |
| 202511160110 | 8 | 8 | スピードブラッシュ | 牡2 | 栗毛 | 23 | 4 | スピードブラッシュ | オールブラッシュ | キャプテンスティーヴ | 55.0 | 村上忍 | 岩手 | NULL | NULL | 荒谷牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:20.000Z | 2025-11-16T10:46:20.000Z |
| 202511160122 | 1 | 1 | モンサンジャスミン | 牝2 | 黒鹿毛 | 23 | 4 | モンサンジャスミン | ノヴェリスト | キングカメハメハ | 54.0 | 佐々志 | 岩手 | NULL | NULL | 賀張中川牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:02.000Z | 2025-11-16T10:48:02.000Z |
| 202511160122 | 2 | 2 | サマーカムカム | 牝2 | 青鹿毛 | 23 | 3 | サマーカムカム | ダノンスマッシュ | ディープインパクト | 54.0 | 南郷家 | 岩手 | NULL | NULL | 市川牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:02.000Z | 2025-11-16T10:48:02.000Z |
| 202511160122 | 3 | 3 | タカマキセブン | 牝2 | 鹿毛 | 23 | 5 | タカマキセブン | コパノリッキー | ロージズインメイ | 54.0 | 菅原辰 | 岩手 | NULL | NULL | サカイファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:02.000Z | 2025-11-16T10:48:02.000Z |
| 202511160122 | 4 | 4 | ヤッティライネン | 牡2 | 黒鹿毛 | 23 | 3 | ヤッティライネン | スズカモンスーン | More Than Ready | 55.0 | 阿部英 | 岩手 | NULL | NULL | 辻牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:02.000Z | 2025-11-16T10:48:02.000Z |
| 202511160122 | 5 | 5 | エボリスピナ | 牝2 | 鹿毛 | 23 | 2 | エボリスピナ | ジャスタウェイ | Sea The Stars | 52.0 | 坂井瑛 | 岩手 | NULL | NULL | 谷川牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:02.000Z | 2025-11-16T10:48:02.000Z |
| 202511160122 | 6 | 6 | ラヴレインブーケ | 牝2 | 栗毛 | 23 | 5 | ラヴレインブーケ | ワールドエース | アフリート | 54.0 | 鈴木祐 | 岩手 | NULL | NULL | 静内酒井牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:02.000Z | 2025-11-16T10:48:02.000Z |
| 202511160122 | 7 | 7 | ユキノレックス | 牡2 | 黒鹿毛 | 23 | 4 | ユキノレックス | アメリカンペイトリオット | ハーツクライ | 55.0 | 高松亮 | 岩手 | NULL | NULL | 大滝康晴 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:02.000Z | 2025-11-16T10:48:02.000Z |
| 202511160122 | 8 | 8 | スピードブラッシュ | 牡2 | 栗毛 | 23 | 4 | スピードブラッシュ | オールブラッシュ | キャプテンスティーヴ | 55.0 | 村上忍 | 岩手 | NULL | NULL | 荒谷牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:02.000Z | 2025-11-16T10:48:02.000Z |
| 202511160131 | 1 | 1 | モンサンジャスミン | 牝2 | 黒鹿毛 | 23 | 4 | モンサンジャスミン | ノヴェリスト | キングカメハメハ | 54.0 | 佐々志 | 岩手 | NULL | NULL | 賀張中川牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:29.000Z | 2025-11-16T10:49:29.000Z |
| 202511160131 | 2 | 2 | サマーカムカム | 牝2 | 青鹿毛 | 23 | 3 | サマーカムカム | ダノンスマッシュ | ディープインパクト | 54.0 | 南郷家 | 岩手 | NULL | NULL | 市川牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:29.000Z | 2025-11-16T10:49:29.000Z |
| 202511160131 | 3 | 3 | タカマキセブン | 牝2 | 鹿毛 | 23 | 5 | タカマキセブン | コパノリッキー | ロージズインメイ | 54.0 | 菅原辰 | 岩手 | NULL | NULL | サカイファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:29.000Z | 2025-11-16T10:49:29.000Z |
| 202511160131 | 4 | 4 | ヤッティライネン | 牡2 | 黒鹿毛 | 23 | 3 | ヤッティライネン | スズカモンスーン | More Than Ready | 55.0 | 阿部英 | 岩手 | NULL | NULL | 辻牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:29.000Z | 2025-11-16T10:49:29.000Z |
| 202511160131 | 5 | 5 | エボリスピナ | 牝2 | 鹿毛 | 23 | 2 | エボリスピナ | ジャスタウェイ | Sea The Stars | 52.0 | 坂井瑛 | 岩手 | NULL | NULL | 谷川牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:29.000Z | 2025-11-16T10:49:29.000Z |
| 202511160131 | 6 | 6 | ラヴレインブーケ | 牝2 | 栗毛 | 23 | 5 | ラヴレインブーケ | ワールドエース | アフリート | 54.0 | 鈴木祐 | 岩手 | NULL | NULL | 静内酒井牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:29.000Z | 2025-11-16T10:49:29.000Z |
| 202511160131 | 7 | 7 | ユキノレックス | 牡2 | 黒鹿毛 | 23 | 4 | ユキノレックス | アメリカンペイトリオット | ハーツクライ | 55.0 | 高松亮 | 岩手 | NULL | NULL | 大滝康晴 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:29.000Z | 2025-11-16T10:49:29.000Z |
| 202511160131 | 8 | 8 | スピードブラッシュ | 牡2 | 栗毛 | 23 | 4 | スピードブラッシュ | オールブラッシュ | キャプテンスティーヴ | 55.0 | 村上忍 | 岩手 | NULL | NULL | 荒谷牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:29.000Z | 2025-11-16T10:49:29.000Z |
| 202511160132 | 1 | 1 | モンサンジャスミン | 牝2 | 黒鹿毛 | 23 | 4 | モンサンジャスミン | ノヴェリスト | キングカメハメハ | 54.0 | 佐々志 | 岩手 | NULL | NULL | 賀張中川牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:12.000Z | 2025-11-16T10:51:12.000Z |
| 202511160132 | 2 | 2 | サマーカムカム | 牝2 | 青鹿毛 | 23 | 3 | サマーカムカム | ダノンスマッシュ | ディープインパクト | 54.0 | 南郷家 | 岩手 | NULL | NULL | 市川牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:12.000Z | 2025-11-16T10:51:12.000Z |
| 202511160132 | 3 | 3 | タカマキセブン | 牝2 | 鹿毛 | 23 | 5 | タカマキセブン | コパノリッキー | ロージズインメイ | 54.0 | 菅原辰 | 岩手 | NULL | NULL | サカイファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:12.000Z | 2025-11-16T10:51:12.000Z |
| 202511160132 | 4 | 4 | ヤッティライネン | 牡2 | 黒鹿毛 | 23 | 3 | ヤッティライネン | スズカモンスーン | More Than Ready | 55.0 | 阿部英 | 岩手 | NULL | NULL | 辻牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:12.000Z | 2025-11-16T10:51:12.000Z |
| 202511160132 | 5 | 5 | エボリスピナ | 牝2 | 鹿毛 | 23 | 2 | エボリスピナ | ジャスタウェイ | Sea The Stars | 52.0 | 坂井瑛 | 岩手 | NULL | NULL | 谷川牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:12.000Z | 2025-11-16T10:51:12.000Z |
| 202511160132 | 6 | 6 | ラヴレインブーケ | 牝2 | 栗毛 | 23 | 5 | ラヴレインブーケ | ワールドエース | アフリート | 54.0 | 鈴木祐 | 岩手 | NULL | NULL | 静内酒井牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:12.000Z | 2025-11-16T10:51:12.000Z |
| 202511160132 | 7 | 7 | ユキノレックス | 牡2 | 黒鹿毛 | 23 | 4 | ユキノレックス | アメリカンペイトリオット | ハーツクライ | 55.0 | 高松亮 | 岩手 | NULL | NULL | 大滝康晴 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:12.000Z | 2025-11-16T10:51:12.000Z |
| 202511160132 | 8 | 8 | スピードブラッシュ | 牡2 | 栗毛 | 23 | 4 | スピードブラッシュ | オールブラッシュ | キャプテンスティーヴ | 55.0 | 村上忍 | 岩手 | NULL | NULL | 荒谷牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:12.000Z | 2025-11-16T10:51:12.000Z |
| 202511160210 | 1 | 1 | セイバーダンス | 牝2 | 黒鹿毛 | 23 | 3 | セイバーダンス | レッドファルクス | ゴールドアリュール | 54.0 | 大坪慎 | 岩手 | NULL | NULL | 前川義則 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:20.000Z | 2025-11-16T10:46:20.000Z |
| 202511160210 | 2 | 2 | ルーネンバーグ | 牡2 | 鹿毛 | 23 | 4 | ルーネンバーグ | イスラボニータ | エピファネイア | 55.0 | 高橋悠 | 岩手 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:20.000Z | 2025-11-16T10:46:20.000Z |
| 202511160210 | 3 | 3 | ササキンアンジェラ | 牝2 | 青鹿毛 | 23 | 5 | ササキンアンジェラ | ウインバリアシオン | シンボリクリスエス | 52.0 | 坂井瑛 | 岩手 | NULL | NULL | 野々宮牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:20.000Z | 2025-11-16T10:46:20.000Z |
| 202511160210 | 4 | 4 | アクアノート | 牝2 | 鹿毛 | 23 | 3 | アクアノート | タリスマニック | スペシャルウィーク | 54.0 | 塚本涼 | 岩手 | NULL | NULL | 真歌田中牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:20.000Z | 2025-11-16T10:46:20.000Z |
| 202511160210 | 5 | 5 | サンドロック | 牝2 | 鹿毛 | 23 | 5 | サンドロック | カリフォルニアクローム | ネオユニヴァース | 54.0 | 菅原辰 | 岩手 | NULL | NULL | 細川農場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:20.000Z | 2025-11-16T10:46:20.000Z |
| 202511160210 | 6 | 6 | コンバットイズモ | 牝2 | 黒鹿毛 | 23 | 5 | コンバットイズモ | カレンブラックヒル | キンシャサノキセキ | 54.0 | 岩本怜 | 岩手 | NULL | NULL | ラツキー牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:20.000Z | 2025-11-16T10:46:20.000Z |
| 202511160210 | 6 | 7 | ユウユウロッゲン | 牡2 | 青鹿毛 | 23 | 2 | ユウユウロッゲン | フォーウィールドライブ | スズカマンボ | 55.0 | 小林凌 | 岩手 | NULL | NULL | 有限会社ＰＲＩＤＥＲ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:20.000Z | 2025-11-16T10:46:20.000Z |
| 202511160210 | 7 | 8 | サリーレチーマ | 牡2 | 栗毛 | 23 | 4 | サリーレチーマ | アジアエクスプレス | ダンスインザダーク | 55.0 | 山本聡 | 岩手 | NULL | NULL | オリエント牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:20.000Z | 2025-11-16T10:46:20.000Z |
| 202511160210 | 7 | 9 | シュガーストーン | 牡2 | 栗毛 | 23 | 3 | シュガーストーン | アニマルキングダム | Selkirk | 55.0 | 高松亮 | 岩手 | NULL | NULL | 今井秀樹 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:20.000Z | 2025-11-16T10:46:20.000Z |
| 202511160210 | 8 | 10 | ジュノヴェール | 牝2 | 鹿毛 | 23 | 4 | ジュノヴェール | フォーウィールドライブ | キングカメハメハ | 54.0 | 佐々志 | 岩手 | NULL | NULL | 中前牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:20.000Z | 2025-11-16T10:46:20.000Z |
| 202511160210 | 8 | 11 | アデレード | 牝2 | 鹿毛 | 23 | 4 | アデレード | デクラレーションオブウォー | ハーツクライ | 54.0 | 山本政 | 岩手 | NULL | NULL | 日の出牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:20.000Z | 2025-11-16T10:46:20.000Z |
| 202511160222 | 1 | 1 | セイバーダンス | 牝2 | 黒鹿毛 | 23 | 3 | セイバーダンス | レッドファルクス | ゴールドアリュール | 54.0 | 大坪慎 | 岩手 | NULL | NULL | 前川義則 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:03.000Z | 2025-11-16T10:48:03.000Z |
| 202511160222 | 2 | 2 | ルーネンバーグ | 牡2 | 鹿毛 | 23 | 4 | ルーネンバーグ | イスラボニータ | エピファネイア | 55.0 | 高橋悠 | 岩手 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:03.000Z | 2025-11-16T10:48:03.000Z |
| 202511160222 | 3 | 3 | ササキンアンジェラ | 牝2 | 青鹿毛 | 23 | 5 | ササキンアンジェラ | ウインバリアシオン | シンボリクリスエス | 52.0 | 坂井瑛 | 岩手 | NULL | NULL | 野々宮牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:03.000Z | 2025-11-16T10:48:03.000Z |
| 202511160222 | 4 | 4 | アクアノート | 牝2 | 鹿毛 | 23 | 3 | アクアノート | タリスマニック | スペシャルウィーク | 54.0 | 塚本涼 | 岩手 | NULL | NULL | 真歌田中牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:03.000Z | 2025-11-16T10:48:03.000Z |
| 202511160222 | 5 | 5 | サンドロック | 牝2 | 鹿毛 | 23 | 5 | サンドロック | カリフォルニアクローム | ネオユニヴァース | 54.0 | 菅原辰 | 岩手 | NULL | NULL | 細川農場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:03.000Z | 2025-11-16T10:48:03.000Z |
| 202511160222 | 6 | 6 | コンバットイズモ | 牝2 | 黒鹿毛 | 23 | 5 | コンバットイズモ | カレンブラックヒル | キンシャサノキセキ | 54.0 | 岩本怜 | 岩手 | NULL | NULL | ラツキー牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:03.000Z | 2025-11-16T10:48:03.000Z |
| 202511160222 | 6 | 7 | ユウユウロッゲン | 牡2 | 青鹿毛 | 23 | 2 | ユウユウロッゲン | フォーウィールドライブ | スズカマンボ | 55.0 | 小林凌 | 岩手 | NULL | NULL | 有限会社ＰＲＩＤＥＲ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:03.000Z | 2025-11-16T10:48:03.000Z |
| 202511160222 | 7 | 8 | サリーレチーマ | 牡2 | 栗毛 | 23 | 4 | サリーレチーマ | アジアエクスプレス | ダンスインザダーク | 55.0 | 山本聡 | 岩手 | NULL | NULL | オリエント牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:03.000Z | 2025-11-16T10:48:03.000Z |
| 202511160222 | 7 | 9 | シュガーストーン | 牡2 | 栗毛 | 23 | 3 | シュガーストーン | アニマルキングダム | Selkirk | 55.0 | 高松亮 | 岩手 | NULL | NULL | 今井秀樹 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:03.000Z | 2025-11-16T10:48:03.000Z |
| 202511160222 | 8 | 10 | ジュノヴェール | 牝2 | 鹿毛 | 23 | 4 | ジュノヴェール | フォーウィールドライブ | キングカメハメハ | 54.0 | 佐々志 | 岩手 | NULL | NULL | 中前牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:03.000Z | 2025-11-16T10:48:03.000Z |
| 202511160222 | 8 | 11 | アデレード | 牝2 | 鹿毛 | 23 | 4 | アデレード | デクラレーションオブウォー | ハーツクライ | 54.0 | 山本政 | 岩手 | NULL | NULL | 日の出牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:03.000Z | 2025-11-16T10:48:03.000Z |
| 202511160231 | 1 | 1 | セイバーダンス | 牝2 | 黒鹿毛 | 23 | 3 | セイバーダンス | レッドファルクス | ゴールドアリュール | 54.0 | 大坪慎 | 岩手 | NULL | NULL | 前川義則 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:29.000Z | 2025-11-16T10:49:29.000Z |
| 202511160231 | 2 | 2 | ルーネンバーグ | 牡2 | 鹿毛 | 23 | 4 | ルーネンバーグ | イスラボニータ | エピファネイア | 55.0 | 高橋悠 | 岩手 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:29.000Z | 2025-11-16T10:49:29.000Z |
| 202511160231 | 3 | 3 | ササキンアンジェラ | 牝2 | 青鹿毛 | 23 | 5 | ササキンアンジェラ | ウインバリアシオン | シンボリクリスエス | 52.0 | 坂井瑛 | 岩手 | NULL | NULL | 野々宮牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:29.000Z | 2025-11-16T10:49:29.000Z |
| 202511160231 | 4 | 4 | アクアノート | 牝2 | 鹿毛 | 23 | 3 | アクアノート | タリスマニック | スペシャルウィーク | 54.0 | 塚本涼 | 岩手 | NULL | NULL | 真歌田中牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:29.000Z | 2025-11-16T10:49:29.000Z |
| 202511160231 | 5 | 5 | サンドロック | 牝2 | 鹿毛 | 23 | 5 | サンドロック | カリフォルニアクローム | ネオユニヴァース | 54.0 | 菅原辰 | 岩手 | NULL | NULL | 細川農場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:29.000Z | 2025-11-16T10:49:29.000Z |
| 202511160231 | 6 | 6 | コンバットイズモ | 牝2 | 黒鹿毛 | 23 | 5 | コンバットイズモ | カレンブラックヒル | キンシャサノキセキ | 54.0 | 岩本怜 | 岩手 | NULL | NULL | ラツキー牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:29.000Z | 2025-11-16T10:49:29.000Z |
| 202511160231 | 6 | 7 | ユウユウロッゲン | 牡2 | 青鹿毛 | 23 | 2 | ユウユウロッゲン | フォーウィールドライブ | スズカマンボ | 55.0 | 小林凌 | 岩手 | NULL | NULL | 有限会社ＰＲＩＤＥＲ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:29.000Z | 2025-11-16T10:49:29.000Z |
| 202511160231 | 7 | 8 | サリーレチーマ | 牡2 | 栗毛 | 23 | 4 | サリーレチーマ | アジアエクスプレス | ダンスインザダーク | 55.0 | 山本聡 | 岩手 | NULL | NULL | オリエント牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:29.000Z | 2025-11-16T10:49:29.000Z |
| 202511160231 | 7 | 9 | シュガーストーン | 牡2 | 栗毛 | 23 | 3 | シュガーストーン | アニマルキングダム | Selkirk | 55.0 | 高松亮 | 岩手 | NULL | NULL | 今井秀樹 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:29.000Z | 2025-11-16T10:49:29.000Z |
| 202511160231 | 8 | 10 | ジュノヴェール | 牝2 | 鹿毛 | 23 | 4 | ジュノヴェール | フォーウィールドライブ | キングカメハメハ | 54.0 | 佐々志 | 岩手 | NULL | NULL | 中前牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:29.000Z | 2025-11-16T10:49:29.000Z |
| 202511160231 | 8 | 11 | アデレード | 牝2 | 鹿毛 | 23 | 4 | アデレード | デクラレーションオブウォー | ハーツクライ | 54.0 | 山本政 | 岩手 | NULL | NULL | 日の出牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:29.000Z | 2025-11-16T10:49:29.000Z |
| 202511160232 | 1 | 1 | セイバーダンス | 牝2 | 黒鹿毛 | 23 | 3 | セイバーダンス | レッドファルクス | ゴールドアリュール | 54.0 | 大坪慎 | 岩手 | NULL | NULL | 前川義則 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:12.000Z | 2025-11-16T10:51:12.000Z |
| 202511160232 | 2 | 2 | ルーネンバーグ | 牡2 | 鹿毛 | 23 | 4 | ルーネンバーグ | イスラボニータ | エピファネイア | 55.0 | 高橋悠 | 岩手 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:12.000Z | 2025-11-16T10:51:12.000Z |
| 202511160232 | 3 | 3 | ササキンアンジェラ | 牝2 | 青鹿毛 | 23 | 5 | ササキンアンジェラ | ウインバリアシオン | シンボリクリスエス | 52.0 | 坂井瑛 | 岩手 | NULL | NULL | 野々宮牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:12.000Z | 2025-11-16T10:51:12.000Z |
| 202511160232 | 4 | 4 | アクアノート | 牝2 | 鹿毛 | 23 | 3 | アクアノート | タリスマニック | スペシャルウィーク | 54.0 | 塚本涼 | 岩手 | NULL | NULL | 真歌田中牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:12.000Z | 2025-11-16T10:51:12.000Z |
| 202511160232 | 5 | 5 | サンドロック | 牝2 | 鹿毛 | 23 | 5 | サンドロック | カリフォルニアクローム | ネオユニヴァース | 54.0 | 菅原辰 | 岩手 | NULL | NULL | 細川農場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:12.000Z | 2025-11-16T10:51:12.000Z |
| 202511160232 | 6 | 6 | コンバットイズモ | 牝2 | 黒鹿毛 | 23 | 5 | コンバットイズモ | カレンブラックヒル | キンシャサノキセキ | 54.0 | 岩本怜 | 岩手 | NULL | NULL | ラツキー牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:12.000Z | 2025-11-16T10:51:12.000Z |
| 202511160232 | 6 | 7 | ユウユウロッゲン | 牡2 | 青鹿毛 | 23 | 2 | ユウユウロッゲン | フォーウィールドライブ | スズカマンボ | 55.0 | 小林凌 | 岩手 | NULL | NULL | 有限会社ＰＲＩＤＥＲ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:12.000Z | 2025-11-16T10:51:12.000Z |
| 202511160232 | 7 | 8 | サリーレチーマ | 牡2 | 栗毛 | 23 | 4 | サリーレチーマ | アジアエクスプレス | ダンスインザダーク | 55.0 | 山本聡 | 岩手 | NULL | NULL | オリエント牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:12.000Z | 2025-11-16T10:51:12.000Z |
| 202511160232 | 7 | 9 | シュガーストーン | 牡2 | 栗毛 | 23 | 3 | シュガーストーン | アニマルキングダム | Selkirk | 55.0 | 高松亮 | 岩手 | NULL | NULL | 今井秀樹 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:12.000Z | 2025-11-16T10:51:12.000Z |
| 202511160232 | 8 | 10 | ジュノヴェール | 牝2 | 鹿毛 | 23 | 4 | ジュノヴェール | フォーウィールドライブ | キングカメハメハ | 54.0 | 佐々志 | 岩手 | NULL | NULL | 中前牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:12.000Z | 2025-11-16T10:51:12.000Z |
| 202511160232 | 8 | 11 | アデレード | 牝2 | 鹿毛 | 23 | 4 | アデレード | デクラレーションオブウォー | ハーツクライ | 54.0 | 山本政 | 岩手 | NULL | NULL | 日の出牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:12.000Z | 2025-11-16T10:51:12.000Z |
| 202511160310 | 1 | 1 | ギフテッドアベリア | 牝3 | 栗毛 | 22 | 5 | ギフテッドアベリア | サートゥルナーリア | ディープインパクト | 54.0 | 高橋悠 | 岩手 | NULL | NULL | 中田英樹 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:37.000Z | 2025-11-16T10:46:37.000Z |
| 202511160310 | 2 | 2 | ラグーンフライト | 牝3 | 栗毛 | 22 | 4 | ラグーンフライト | ベストウォーリア | ベルシャザール | 54.0 | 岩本怜 | 岩手 | NULL | NULL | 石田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:37.000Z | 2025-11-16T10:46:37.000Z |
| 202511160310 | 3 | 3 | レジリエント | 牡3 | 黒鹿毛 | 22 | 3 | レジリエント | イスラボニータ | Mount Nelson | 56.0 | 山本政 | 岩手 | NULL | NULL | 村上進治 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:37.000Z | 2025-11-16T10:46:37.000Z |
| 202511160310 | 4 | 4 | リースアンドリボン | 牝3 | 栗毛 | 22 | 4 | リースアンドリボン | ダンカーク | トワイニング | 54.0 | 大坪慎 | 岩手 | NULL | NULL | 田中裕之 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:37.000Z | 2025-11-16T10:46:37.000Z |
| 202511160310 | 5 | 5 | ライブリブランコ | 牡3 | 黒鹿毛 | 22 | 4 | ライブリブランコ | ケープブランコ | フジキセキ | 54.0 | 坂井瑛 | 岩手 | NULL | NULL | 早坂牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:37.000Z | 2025-11-16T10:46:37.000Z |
| 202511160310 | 5 | 6 | クラッチ | 牝3 | 鹿毛 | 22 | 5 | クラッチ | ウインバリアシオン | シンボリクリスエス | 54.0 | 南郷家 | 岩手 | NULL | NULL | 荒谷牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:37.000Z | 2025-11-16T10:46:37.000Z |
| 202511160310 | 6 | 7 | ミヤビノオウザ | 牡3 | 鹿毛 | 22 | 4 | ミヤビノオウザ | サングレーザー | アドマイヤムーン | 56.0 | 鈴木祐 | 岩手 | NULL | NULL | 金石牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:37.000Z | 2025-11-16T10:46:37.000Z |
| 202511160310 | 6 | 8 | シベリアンデネブ | 牡3 | 鹿毛 | 22 | 4 | シベリアンデネブ | フィエールマン | Siphon | 56.0 | 山本聡 | 岩手 | NULL | NULL | 天羽禮治 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:37.000Z | 2025-11-16T10:46:37.000Z |
| 202511160310 | 7 | 9 | アストラアヴィス | 牝3 | 栗毛 | 22 | 4 | アストラアヴィス | ホークビル | Unbridled's Song | 54.0 | 菅原辰 | 岩手 | NULL | NULL | 竹島幸治 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:37.000Z | 2025-11-16T10:46:37.000Z |
| 202511160310 | 7 | 10 | ラセーヌ | 牝3 | 栗毛 | 22 | 4 | ラセーヌ | タワーオブロンドン | キングカメハメハ | 54.0 | 塚本涼 | 岩手 | NULL | NULL | 前田ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:37.000Z | 2025-11-16T10:46:37.000Z |
| 202511160310 | 8 | 11 | メイショウリリアム | 牝5 | 芦毛 | 20 | 4 | メイショウリリアム | シルバーステート | キングカメハメハ | 54.0 | 山本紀 | 岩手 | NULL | NULL | 静内白井牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:37.000Z | 2025-11-16T10:46:37.000Z |
| 202511160310 | 8 | 12 | ベルレンヌ | 牝3 | 栗毛 | 22 | 4 | ベルレンヌ | ダンカーク | ルールオブロー | 54.0 | 小林凌 | 岩手 | NULL | NULL | 木部ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:37.000Z | 2025-11-16T10:46:37.000Z |
| 202511160322 | 1 | 1 | ギフテッドアベリア | 牝3 | 栗毛 | 22 | 5 | ギフテッドアベリア | サートゥルナーリア | ディープインパクト | 54.0 | 高橋悠 | 岩手 | NULL | NULL | 中田英樹 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:20.000Z | 2025-11-16T10:48:20.000Z |
| 202511160322 | 2 | 2 | ラグーンフライト | 牝3 | 栗毛 | 22 | 4 | ラグーンフライト | ベストウォーリア | ベルシャザール | 54.0 | 岩本怜 | 岩手 | NULL | NULL | 石田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:20.000Z | 2025-11-16T10:48:20.000Z |
| 202511160322 | 3 | 3 | レジリエント | 牡3 | 黒鹿毛 | 22 | 3 | レジリエント | イスラボニータ | Mount Nelson | 56.0 | 山本政 | 岩手 | NULL | NULL | 村上進治 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:20.000Z | 2025-11-16T10:48:20.000Z |
| 202511160322 | 4 | 4 | リースアンドリボン | 牝3 | 栗毛 | 22 | 4 | リースアンドリボン | ダンカーク | トワイニング | 54.0 | 大坪慎 | 岩手 | NULL | NULL | 田中裕之 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:20.000Z | 2025-11-16T10:48:20.000Z |
| 202511160322 | 5 | 5 | ライブリブランコ | 牡3 | 黒鹿毛 | 22 | 4 | ライブリブランコ | ケープブランコ | フジキセキ | 54.0 | 坂井瑛 | 岩手 | NULL | NULL | 早坂牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:20.000Z | 2025-11-16T10:48:20.000Z |
| 202511160322 | 5 | 6 | クラッチ | 牝3 | 鹿毛 | 22 | 5 | クラッチ | ウインバリアシオン | シンボリクリスエス | 54.0 | 南郷家 | 岩手 | NULL | NULL | 荒谷牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:20.000Z | 2025-11-16T10:48:20.000Z |
| 202511160322 | 6 | 7 | ミヤビノオウザ | 牡3 | 鹿毛 | 22 | 4 | ミヤビノオウザ | サングレーザー | アドマイヤムーン | 56.0 | 鈴木祐 | 岩手 | NULL | NULL | 金石牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:20.000Z | 2025-11-16T10:48:20.000Z |
| 202511160322 | 6 | 8 | シベリアンデネブ | 牡3 | 鹿毛 | 22 | 4 | シベリアンデネブ | フィエールマン | Siphon | 56.0 | 山本聡 | 岩手 | NULL | NULL | 天羽禮治 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:20.000Z | 2025-11-16T10:48:20.000Z |
| 202511160322 | 7 | 9 | アストラアヴィス | 牝3 | 栗毛 | 22 | 4 | アストラアヴィス | ホークビル | Unbridled's Song | 54.0 | 菅原辰 | 岩手 | NULL | NULL | 竹島幸治 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:20.000Z | 2025-11-16T10:48:20.000Z |
| 202511160322 | 7 | 10 | ラセーヌ | 牝3 | 栗毛 | 22 | 4 | ラセーヌ | タワーオブロンドン | キングカメハメハ | 54.0 | 塚本涼 | 岩手 | NULL | NULL | 前田ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:20.000Z | 2025-11-16T10:48:20.000Z |
| 202511160322 | 8 | 11 | メイショウリリアム | 牝5 | 芦毛 | 20 | 4 | メイショウリリアム | シルバーステート | キングカメハメハ | 54.0 | 山本紀 | 岩手 | NULL | NULL | 静内白井牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:20.000Z | 2025-11-16T10:48:20.000Z |
| 202511160322 | 8 | 12 | ベルレンヌ | 牝3 | 栗毛 | 22 | 4 | ベルレンヌ | ダンカーク | ルールオブロー | 54.0 | 小林凌 | 岩手 | NULL | NULL | 木部ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:20.000Z | 2025-11-16T10:48:20.000Z |
| 202511160331 | 1 | 1 | ギフテッドアベリア | 牝3 | 栗毛 | 22 | 5 | ギフテッドアベリア | サートゥルナーリア | ディープインパクト | 54.0 | 高橋悠 | 岩手 | NULL | NULL | 中田英樹 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:46.000Z | 2025-11-16T10:49:46.000Z |
| 202511160331 | 2 | 2 | ラグーンフライト | 牝3 | 栗毛 | 22 | 4 | ラグーンフライト | ベストウォーリア | ベルシャザール | 54.0 | 岩本怜 | 岩手 | NULL | NULL | 石田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:46.000Z | 2025-11-16T10:49:46.000Z |
| 202511160331 | 3 | 3 | レジリエント | 牡3 | 黒鹿毛 | 22 | 3 | レジリエント | イスラボニータ | Mount Nelson | 56.0 | 山本政 | 岩手 | NULL | NULL | 村上進治 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:46.000Z | 2025-11-16T10:49:46.000Z |
| 202511160331 | 4 | 4 | リースアンドリボン | 牝3 | 栗毛 | 22 | 4 | リースアンドリボン | ダンカーク | トワイニング | 54.0 | 大坪慎 | 岩手 | NULL | NULL | 田中裕之 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:46.000Z | 2025-11-16T10:49:46.000Z |
| 202511160331 | 5 | 5 | ライブリブランコ | 牡3 | 黒鹿毛 | 22 | 4 | ライブリブランコ | ケープブランコ | フジキセキ | 54.0 | 坂井瑛 | 岩手 | NULL | NULL | 早坂牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:46.000Z | 2025-11-16T10:49:46.000Z |
| 202511160331 | 5 | 6 | クラッチ | 牝3 | 鹿毛 | 22 | 5 | クラッチ | ウインバリアシオン | シンボリクリスエス | 54.0 | 南郷家 | 岩手 | NULL | NULL | 荒谷牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:46.000Z | 2025-11-16T10:49:46.000Z |
| 202511160331 | 6 | 7 | ミヤビノオウザ | 牡3 | 鹿毛 | 22 | 4 | ミヤビノオウザ | サングレーザー | アドマイヤムーン | 56.0 | 鈴木祐 | 岩手 | NULL | NULL | 金石牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:46.000Z | 2025-11-16T10:49:46.000Z |
| 202511160331 | 6 | 8 | シベリアンデネブ | 牡3 | 鹿毛 | 22 | 4 | シベリアンデネブ | フィエールマン | Siphon | 56.0 | 山本聡 | 岩手 | NULL | NULL | 天羽禮治 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:46.000Z | 2025-11-16T10:49:46.000Z |
| 202511160331 | 7 | 9 | アストラアヴィス | 牝3 | 栗毛 | 22 | 4 | アストラアヴィス | ホークビル | Unbridled's Song | 54.0 | 菅原辰 | 岩手 | NULL | NULL | 竹島幸治 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:46.000Z | 2025-11-16T10:49:46.000Z |
| 202511160331 | 7 | 10 | ラセーヌ | 牝3 | 栗毛 | 22 | 4 | ラセーヌ | タワーオブロンドン | キングカメハメハ | 54.0 | 塚本涼 | 岩手 | NULL | NULL | 前田ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:46.000Z | 2025-11-16T10:49:46.000Z |
| 202511160331 | 8 | 11 | メイショウリリアム | 牝5 | 芦毛 | 20 | 4 | メイショウリリアム | シルバーステート | キングカメハメハ | 54.0 | 山本紀 | 岩手 | NULL | NULL | 静内白井牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:46.000Z | 2025-11-16T10:49:46.000Z |
| 202511160331 | 8 | 12 | ベルレンヌ | 牝3 | 栗毛 | 22 | 4 | ベルレンヌ | ダンカーク | ルールオブロー | 54.0 | 小林凌 | 岩手 | NULL | NULL | 木部ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:46.000Z | 2025-11-16T10:49:46.000Z |
| 202511160332 | 1 | 1 | ギフテッドアベリア | 牝3 | 栗毛 | 22 | 5 | ギフテッドアベリア | サートゥルナーリア | ディープインパクト | 54.0 | 高橋悠 | 岩手 | NULL | NULL | 中田英樹 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:31.000Z | 2025-11-16T10:51:31.000Z |
| 202511160332 | 2 | 2 | ラグーンフライト | 牝3 | 栗毛 | 22 | 4 | ラグーンフライト | ベストウォーリア | ベルシャザール | 54.0 | 岩本怜 | 岩手 | NULL | NULL | 石田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:31.000Z | 2025-11-16T10:51:31.000Z |
| 202511160332 | 3 | 3 | レジリエント | 牡3 | 黒鹿毛 | 22 | 3 | レジリエント | イスラボニータ | Mount Nelson | 56.0 | 山本政 | 岩手 | NULL | NULL | 村上進治 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:31.000Z | 2025-11-16T10:51:31.000Z |
| 202511160332 | 4 | 4 | リースアンドリボン | 牝3 | 栗毛 | 22 | 4 | リースアンドリボン | ダンカーク | トワイニング | 54.0 | 大坪慎 | 岩手 | NULL | NULL | 田中裕之 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:31.000Z | 2025-11-16T10:51:31.000Z |
| 202511160332 | 5 | 5 | ライブリブランコ | 牡3 | 黒鹿毛 | 22 | 4 | ライブリブランコ | ケープブランコ | フジキセキ | 54.0 | 坂井瑛 | 岩手 | NULL | NULL | 早坂牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:31.000Z | 2025-11-16T10:51:31.000Z |
| 202511160332 | 5 | 6 | クラッチ | 牝3 | 鹿毛 | 22 | 5 | クラッチ | ウインバリアシオン | シンボリクリスエス | 54.0 | 南郷家 | 岩手 | NULL | NULL | 荒谷牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:31.000Z | 2025-11-16T10:51:31.000Z |
| 202511160332 | 6 | 7 | ミヤビノオウザ | 牡3 | 鹿毛 | 22 | 4 | ミヤビノオウザ | サングレーザー | アドマイヤムーン | 56.0 | 鈴木祐 | 岩手 | NULL | NULL | 金石牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:31.000Z | 2025-11-16T10:51:31.000Z |
| 202511160332 | 6 | 8 | シベリアンデネブ | 牡3 | 鹿毛 | 22 | 4 | シベリアンデネブ | フィエールマン | Siphon | 56.0 | 山本聡 | 岩手 | NULL | NULL | 天羽禮治 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:31.000Z | 2025-11-16T10:51:31.000Z |
| 202511160332 | 7 | 9 | アストラアヴィス | 牝3 | 栗毛 | 22 | 4 | アストラアヴィス | ホークビル | Unbridled's Song | 54.0 | 菅原辰 | 岩手 | NULL | NULL | 竹島幸治 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:31.000Z | 2025-11-16T10:51:31.000Z |
| 202511160332 | 7 | 10 | ラセーヌ | 牝3 | 栗毛 | 22 | 4 | ラセーヌ | タワーオブロンドン | キングカメハメハ | 54.0 | 塚本涼 | 岩手 | NULL | NULL | 前田ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:31.000Z | 2025-11-16T10:51:31.000Z |
| 202511160332 | 8 | 11 | メイショウリリアム | 牝5 | 芦毛 | 20 | 4 | メイショウリリアム | シルバーステート | キングカメハメハ | 54.0 | 山本紀 | 岩手 | NULL | NULL | 静内白井牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:31.000Z | 2025-11-16T10:51:31.000Z |
| 202511160332 | 8 | 12 | ベルレンヌ | 牝3 | 栗毛 | 22 | 4 | ベルレンヌ | ダンカーク | ルールオブロー | 54.0 | 小林凌 | 岩手 | NULL | NULL | 木部ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:31.000Z | 2025-11-16T10:51:31.000Z |
| 202511160410 | 1 | 1 | アーブルラーブル | 牝3 | 栗毛 | 22 | 4 | アーブルラーブル | ナダル | ヘニーヒューズ | 54.0 | 村上忍 | 岩手 | NULL | NULL | 辻牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:37.000Z | 2025-11-16T10:46:37.000Z |
| 202511160410 | 2 | 2 | ジーティービート | 牡3 | 鹿毛 | 22 | 4 | ジーティービート | サトノアラジン | Camelot | 56.0 | 佐々志 | 岩手 | NULL | NULL | 浦河日成牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:37.000Z | 2025-11-16T10:46:37.000Z |
| 202511160410 | 3 | 3 | エンジェライト | 牝3 | 鹿毛 | 22 | 2 | エンジェライト | レインボーライン | ロージズインメイ | 54.0 | 大坪慎 | 岩手 | NULL | NULL | 株式会社アフリートフ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:37.000Z | 2025-11-16T10:46:37.000Z |
| 202511160410 | 4 | 4 | サクラトップスカイ | NULL | NULL | 0 | 0 | サクラトップスカイ | エピカリス | アドマイヤムーン | NULL | 岩本怜 | 岩手 | NULL | NULL | 細川農場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:37.000Z | 2025-11-16T10:46:37.000Z |
| 202511160410 | 5 | 5 | ナビール | 牡3 | 黒鹿毛 | 22 | 2 | ナビール | モーリス | ルーラーシップ | 56.0 | 山本紀 | 岩手 | NULL | NULL | ノーザンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:37.000Z | 2025-11-16T10:46:37.000Z |
| 202511160410 | 6 | 6 | オルグージョ | NULL | NULL | 0 | 0 | オルグージョ | マイネクイーン | アグネスタキオン | NULL | 山本政 | 岩手 | NULL | NULL | 原弘之 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:37.000Z | 2025-11-16T10:46:37.000Z |
| 202511160410 | 7 | 7 | ワイルドブーケ | 牝4 | 鹿毛 | 21 | 4 | ワイルドブーケ | ワールドエース | ワイルドラッシュ | 54.0 | 小林凌 | 岩手 | NULL | NULL | 千代田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:37.000Z | 2025-11-16T10:46:37.000Z |
| 202511160410 | 8 | 8 | ラストパラダイス | NULL | NULL | 0 | 0 | ラストパラダイス | フェノーメノ | ティンバーカントリー | NULL | 鈴木祐 | 岩手 | NULL | NULL | びらとり牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:37.000Z | 2025-11-16T10:46:37.000Z |
| 202511160410 | 8 | 9 | タイセイナトゥーラ | 牝6 | 黒鹿毛 | 19 | 2 | タイセイナトゥーラ | ドレフォン | ディープインパクト | 52.0 | 坂井瑛 | 岩手 | NULL | NULL | グランド牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:37.000Z | 2025-11-16T10:46:37.000Z |
| 202511160422 | 1 | 1 | アーブルラーブル | 牝3 | 栗毛 | 22 | 4 | アーブルラーブル | ナダル | ヘニーヒューズ | 54.0 | 村上忍 | 岩手 | NULL | NULL | 辻牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:20.000Z | 2025-11-16T10:48:20.000Z |
| 202511160422 | 2 | 2 | ジーティービート | 牡3 | 鹿毛 | 22 | 4 | ジーティービート | サトノアラジン | Camelot | 56.0 | 佐々志 | 岩手 | NULL | NULL | 浦河日成牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:20.000Z | 2025-11-16T10:48:20.000Z |
| 202511160422 | 3 | 3 | エンジェライト | 牝3 | 鹿毛 | 22 | 2 | エンジェライト | レインボーライン | ロージズインメイ | 54.0 | 大坪慎 | 岩手 | NULL | NULL | 株式会社アフリートフ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:20.000Z | 2025-11-16T10:48:20.000Z |
| 202511160422 | 4 | 4 | サクラトップスカイ | NULL | NULL | 0 | 0 | サクラトップスカイ | エピカリス | アドマイヤムーン | NULL | 岩本怜 | 岩手 | NULL | NULL | 細川農場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:20.000Z | 2025-11-16T10:48:20.000Z |
| 202511160422 | 5 | 5 | ナビール | 牡3 | 黒鹿毛 | 22 | 2 | ナビール | モーリス | ルーラーシップ | 56.0 | 山本紀 | 岩手 | NULL | NULL | ノーザンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:20.000Z | 2025-11-16T10:48:20.000Z |
| 202511160422 | 6 | 6 | オルグージョ | NULL | NULL | 0 | 0 | オルグージョ | マイネクイーン | アグネスタキオン | NULL | 山本政 | 岩手 | NULL | NULL | 原弘之 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:20.000Z | 2025-11-16T10:48:20.000Z |
| 202511160422 | 7 | 7 | ワイルドブーケ | 牝4 | 鹿毛 | 21 | 4 | ワイルドブーケ | ワールドエース | ワイルドラッシュ | 54.0 | 小林凌 | 岩手 | NULL | NULL | 千代田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:20.000Z | 2025-11-16T10:48:20.000Z |
| 202511160422 | 8 | 8 | ラストパラダイス | NULL | NULL | 0 | 0 | ラストパラダイス | フェノーメノ | ティンバーカントリー | NULL | 鈴木祐 | 岩手 | NULL | NULL | びらとり牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:20.000Z | 2025-11-16T10:48:20.000Z |
| 202511160422 | 8 | 9 | タイセイナトゥーラ | 牝6 | 黒鹿毛 | 19 | 2 | タイセイナトゥーラ | ドレフォン | ディープインパクト | 52.0 | 坂井瑛 | 岩手 | NULL | NULL | グランド牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:20.000Z | 2025-11-16T10:48:20.000Z |
| 202511160431 | 1 | 1 | アーブルラーブル | 牝3 | 栗毛 | 22 | 4 | アーブルラーブル | ナダル | ヘニーヒューズ | 54.0 | 村上忍 | 岩手 | NULL | NULL | 辻牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:46.000Z | 2025-11-16T10:49:46.000Z |
| 202511160431 | 2 | 2 | ジーティービート | 牡3 | 鹿毛 | 22 | 4 | ジーティービート | サトノアラジン | Camelot | 56.0 | 佐々志 | 岩手 | NULL | NULL | 浦河日成牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:46.000Z | 2025-11-16T10:49:46.000Z |
| 202511160431 | 3 | 3 | エンジェライト | 牝3 | 鹿毛 | 22 | 2 | エンジェライト | レインボーライン | ロージズインメイ | 54.0 | 大坪慎 | 岩手 | NULL | NULL | 株式会社アフリートフ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:46.000Z | 2025-11-16T10:49:46.000Z |
| 202511160431 | 4 | 4 | サクラトップスカイ | NULL | NULL | 0 | 0 | サクラトップスカイ | エピカリス | アドマイヤムーン | NULL | 岩本怜 | 岩手 | NULL | NULL | 細川農場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:46.000Z | 2025-11-16T10:49:46.000Z |
| 202511160431 | 5 | 5 | ナビール | 牡3 | 黒鹿毛 | 22 | 2 | ナビール | モーリス | ルーラーシップ | 56.0 | 山本紀 | 岩手 | NULL | NULL | ノーザンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:46.000Z | 2025-11-16T10:49:46.000Z |
| 202511160431 | 6 | 6 | オルグージョ | NULL | NULL | 0 | 0 | オルグージョ | マイネクイーン | アグネスタキオン | NULL | 山本政 | 岩手 | NULL | NULL | 原弘之 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:46.000Z | 2025-11-16T10:49:46.000Z |
| 202511160431 | 7 | 7 | ワイルドブーケ | 牝4 | 鹿毛 | 21 | 4 | ワイルドブーケ | ワールドエース | ワイルドラッシュ | 54.0 | 小林凌 | 岩手 | NULL | NULL | 千代田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:46.000Z | 2025-11-16T10:49:46.000Z |
| 202511160431 | 8 | 8 | ラストパラダイス | NULL | NULL | 0 | 0 | ラストパラダイス | フェノーメノ | ティンバーカントリー | NULL | 鈴木祐 | 岩手 | NULL | NULL | びらとり牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:46.000Z | 2025-11-16T10:49:46.000Z |
| 202511160431 | 8 | 9 | タイセイナトゥーラ | 牝6 | 黒鹿毛 | 19 | 2 | タイセイナトゥーラ | ドレフォン | ディープインパクト | 52.0 | 坂井瑛 | 岩手 | NULL | NULL | グランド牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:46.000Z | 2025-11-16T10:49:46.000Z |
| 202511160432 | 1 | 1 | アーブルラーブル | 牝3 | 栗毛 | 22 | 4 | アーブルラーブル | ナダル | ヘニーヒューズ | 54.0 | 村上忍 | 岩手 | NULL | NULL | 辻牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:31.000Z | 2025-11-16T10:51:31.000Z |
| 202511160432 | 2 | 2 | ジーティービート | 牡3 | 鹿毛 | 22 | 4 | ジーティービート | サトノアラジン | Camelot | 56.0 | 佐々志 | 岩手 | NULL | NULL | 浦河日成牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:31.000Z | 2025-11-16T10:51:31.000Z |
| 202511160432 | 3 | 3 | エンジェライト | 牝3 | 鹿毛 | 22 | 2 | エンジェライト | レインボーライン | ロージズインメイ | 54.0 | 大坪慎 | 岩手 | NULL | NULL | 株式会社アフリートフ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:31.000Z | 2025-11-16T10:51:31.000Z |
| 202511160432 | 4 | 4 | サクラトップスカイ | NULL | NULL | 0 | 0 | サクラトップスカイ | エピカリス | アドマイヤムーン | NULL | 岩本怜 | 岩手 | NULL | NULL | 細川農場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:31.000Z | 2025-11-16T10:51:31.000Z |
| 202511160432 | 5 | 5 | ナビール | 牡3 | 黒鹿毛 | 22 | 2 | ナビール | モーリス | ルーラーシップ | 56.0 | 山本紀 | 岩手 | NULL | NULL | ノーザンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:31.000Z | 2025-11-16T10:51:31.000Z |
| 202511160432 | 6 | 6 | オルグージョ | NULL | NULL | 0 | 0 | オルグージョ | マイネクイーン | アグネスタキオン | NULL | 山本政 | 岩手 | NULL | NULL | 原弘之 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:31.000Z | 2025-11-16T10:51:31.000Z |
| 202511160432 | 7 | 7 | ワイルドブーケ | 牝4 | 鹿毛 | 21 | 4 | ワイルドブーケ | ワールドエース | ワイルドラッシュ | 54.0 | 小林凌 | 岩手 | NULL | NULL | 千代田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:31.000Z | 2025-11-16T10:51:31.000Z |
| 202511160432 | 8 | 8 | ラストパラダイス | NULL | NULL | 0 | 0 | ラストパラダイス | フェノーメノ | ティンバーカントリー | NULL | 鈴木祐 | 岩手 | NULL | NULL | びらとり牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:31.000Z | 2025-11-16T10:51:31.000Z |
| 202511160432 | 8 | 9 | タイセイナトゥーラ | 牝6 | 黒鹿毛 | 19 | 2 | タイセイナトゥーラ | ドレフォン | ディープインパクト | 52.0 | 坂井瑛 | 岩手 | NULL | NULL | グランド牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:31.000Z | 2025-11-16T10:51:31.000Z |
| 202511160510 | 1 | 1 | トレベルフィーユ | 牝3 | 青鹿毛 | 22 | 4 | トレベルフィーユ | トーセンラー | Anabaa Blue | 54.0 | 南郷家 | 岩手 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:54.000Z | 2025-11-16T10:46:54.000Z |
| 202511160510 | 2 | 2 | カラジシ | 牡3 | 栗毛 | 22 | 3 | カラジシ | アドマイヤマーズ | アドマイヤムーン | 56.0 | 菅原辰 | 岩手 | NULL | NULL | 本桐牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:54.000Z | 2025-11-16T10:46:54.000Z |
| 202511160510 | 3 | 3 | ウインドモア | 牡3 | 栗毛 | 22 | 4 | ウインドモア | アニマルキングダム | トーセンホマレボシ | 56.0 | 大坪慎 | 岩手 | NULL | NULL | 伊藤牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:54.000Z | 2025-11-16T10:46:54.000Z |
| 202511160510 | 4 | 4 | ストレート | 牝5 | 栗毛 | 20 | 4 | ストレート | フリオーソ | フォーティナイナー | 54.0 | 岩本怜 | 岩手 | NULL | NULL | 門別敏朗 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:54.000Z | 2025-11-16T10:46:54.000Z |
| 202511160510 | 5 | 5 | オンザバサラ | 牡3 | 黒鹿毛 | 22 | 3 | オンザバサラ | ハービンジャー | ディープインパクト | 56.0 | 佐々志 | 岩手 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:54.000Z | 2025-11-16T10:46:54.000Z |
| 202511160510 | 6 | 6 | ティーエスフェアリ | 牝4 | 鹿毛 | 21 | 3 | ティーエスフェアリ | トゥザワールド | ハービンジャー | 54.0 | 山本政 | 岩手 | NULL | NULL | 習志野牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:54.000Z | 2025-11-16T10:46:54.000Z |
| 202511160510 | 7 | 7 | ロバリアステージ | 牝3 | 栗毛 | 22 | 3 | ロバリアステージ | ワールドエース | ナカヤマフェスタ | 54.0 | 山本聡 | 岩手 | NULL | NULL | 石田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:54.000Z | 2025-11-16T10:46:54.000Z |
| 202511160510 | 7 | 8 | メイショウフラム | 牝5 | 鹿毛 | 20 | 4 | メイショウフラム | マクフィ | オレハマッテルゼ | 52.0 | 坂井瑛 | 岩手 | NULL | NULL | 赤田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:54.000Z | 2025-11-16T10:46:54.000Z |
| 202511160510 | 8 | 9 | リメリック | 牡4 | 黒鹿毛 | 21 | 4 | リメリック | ダノンバラード | オペラハウス | 56.0 | 高松亮 | 岩手 | NULL | NULL | 松田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:54.000Z | 2025-11-16T10:46:54.000Z |
| 202511160510 | 8 | 10 | ホロヨイマンゲツ | 牡3 | 黒鹿毛 | 22 | 4 | ホロヨイマンゲツ | バゴ | ステイゴールド | 56.0 | 阿部英 | 岩手 | NULL | NULL | ウエスタンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:54.000Z | 2025-11-16T10:46:54.000Z |
| 202511160522 | 1 | 1 | トレベルフィーユ | 牝3 | 青鹿毛 | 22 | 4 | トレベルフィーユ | トーセンラー | Anabaa Blue | 54.0 | 南郷家 | 岩手 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:37.000Z | 2025-11-16T10:48:37.000Z |
| 202511160522 | 2 | 2 | カラジシ | 牡3 | 栗毛 | 22 | 3 | カラジシ | アドマイヤマーズ | アドマイヤムーン | 56.0 | 菅原辰 | 岩手 | NULL | NULL | 本桐牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:37.000Z | 2025-11-16T10:48:37.000Z |
| 202511160522 | 3 | 3 | ウインドモア | 牡3 | 栗毛 | 22 | 4 | ウインドモア | アニマルキングダム | トーセンホマレボシ | 56.0 | 大坪慎 | 岩手 | NULL | NULL | 伊藤牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:37.000Z | 2025-11-16T10:48:37.000Z |
| 202511160522 | 4 | 4 | ストレート | 牝5 | 栗毛 | 20 | 4 | ストレート | フリオーソ | フォーティナイナー | 54.0 | 岩本怜 | 岩手 | NULL | NULL | 門別敏朗 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:37.000Z | 2025-11-16T10:48:37.000Z |
| 202511160522 | 5 | 5 | オンザバサラ | 牡3 | 黒鹿毛 | 22 | 3 | オンザバサラ | ハービンジャー | ディープインパクト | 56.0 | 佐々志 | 岩手 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:37.000Z | 2025-11-16T10:48:37.000Z |
| 202511160522 | 6 | 6 | ティーエスフェアリ | 牝4 | 鹿毛 | 21 | 3 | ティーエスフェアリ | トゥザワールド | ハービンジャー | 54.0 | 山本政 | 岩手 | NULL | NULL | 習志野牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:37.000Z | 2025-11-16T10:48:37.000Z |
| 202511160522 | 7 | 7 | ロバリアステージ | 牝3 | 栗毛 | 22 | 3 | ロバリアステージ | ワールドエース | ナカヤマフェスタ | 54.0 | 山本聡 | 岩手 | NULL | NULL | 石田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:37.000Z | 2025-11-16T10:48:37.000Z |
| 202511160522 | 7 | 8 | メイショウフラム | 牝5 | 鹿毛 | 20 | 4 | メイショウフラム | マクフィ | オレハマッテルゼ | 52.0 | 坂井瑛 | 岩手 | NULL | NULL | 赤田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:37.000Z | 2025-11-16T10:48:37.000Z |
| 202511160522 | 8 | 9 | リメリック | 牡4 | 黒鹿毛 | 21 | 4 | リメリック | ダノンバラード | オペラハウス | 56.0 | 高松亮 | 岩手 | NULL | NULL | 松田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:37.000Z | 2025-11-16T10:48:37.000Z |
| 202511160522 | 8 | 10 | ホロヨイマンゲツ | 牡3 | 黒鹿毛 | 22 | 4 | ホロヨイマンゲツ | バゴ | ステイゴールド | 56.0 | 阿部英 | 岩手 | NULL | NULL | ウエスタンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:37.000Z | 2025-11-16T10:48:37.000Z |
| 202511160531 | 1 | 1 | トレベルフィーユ | 牝3 | 青鹿毛 | 22 | 4 | トレベルフィーユ | トーセンラー | Anabaa Blue | 54.0 | 南郷家 | 岩手 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:03.000Z | 2025-11-16T10:50:03.000Z |
| 202511160531 | 2 | 2 | カラジシ | 牡3 | 栗毛 | 22 | 3 | カラジシ | アドマイヤマーズ | アドマイヤムーン | 56.0 | 菅原辰 | 岩手 | NULL | NULL | 本桐牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:03.000Z | 2025-11-16T10:50:03.000Z |
| 202511160531 | 3 | 3 | ウインドモア | 牡3 | 栗毛 | 22 | 4 | ウインドモア | アニマルキングダム | トーセンホマレボシ | 56.0 | 大坪慎 | 岩手 | NULL | NULL | 伊藤牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:03.000Z | 2025-11-16T10:50:03.000Z |
| 202511160531 | 4 | 4 | ストレート | 牝5 | 栗毛 | 20 | 4 | ストレート | フリオーソ | フォーティナイナー | 54.0 | 岩本怜 | 岩手 | NULL | NULL | 門別敏朗 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:03.000Z | 2025-11-16T10:50:03.000Z |
| 202511160531 | 5 | 5 | オンザバサラ | 牡3 | 黒鹿毛 | 22 | 3 | オンザバサラ | ハービンジャー | ディープインパクト | 56.0 | 佐々志 | 岩手 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:03.000Z | 2025-11-16T10:50:03.000Z |
| 202511160531 | 6 | 6 | ティーエスフェアリ | 牝4 | 鹿毛 | 21 | 3 | ティーエスフェアリ | トゥザワールド | ハービンジャー | 54.0 | 山本政 | 岩手 | NULL | NULL | 習志野牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:03.000Z | 2025-11-16T10:50:03.000Z |
| 202511160531 | 7 | 7 | ロバリアステージ | 牝3 | 栗毛 | 22 | 3 | ロバリアステージ | ワールドエース | ナカヤマフェスタ | 54.0 | 山本聡 | 岩手 | NULL | NULL | 石田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:03.000Z | 2025-11-16T10:50:03.000Z |
| 202511160531 | 7 | 8 | メイショウフラム | 牝5 | 鹿毛 | 20 | 4 | メイショウフラム | マクフィ | オレハマッテルゼ | 52.0 | 坂井瑛 | 岩手 | NULL | NULL | 赤田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:03.000Z | 2025-11-16T10:50:03.000Z |
| 202511160531 | 8 | 9 | リメリック | 牡4 | 黒鹿毛 | 21 | 4 | リメリック | ダノンバラード | オペラハウス | 56.0 | 高松亮 | 岩手 | NULL | NULL | 松田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:03.000Z | 2025-11-16T10:50:03.000Z |
| 202511160531 | 8 | 10 | ホロヨイマンゲツ | 牡3 | 黒鹿毛 | 22 | 4 | ホロヨイマンゲツ | バゴ | ステイゴールド | 56.0 | 阿部英 | 岩手 | NULL | NULL | ウエスタンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:03.000Z | 2025-11-16T10:50:03.000Z |
| 202511160532 | 1 | 1 | トレベルフィーユ | 牝3 | 青鹿毛 | 22 | 4 | トレベルフィーユ | トーセンラー | Anabaa Blue | 54.0 | 南郷家 | 岩手 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:50.000Z | 2025-11-16T10:51:50.000Z |
| 202511160532 | 2 | 2 | カラジシ | 牡3 | 栗毛 | 22 | 3 | カラジシ | アドマイヤマーズ | アドマイヤムーン | 56.0 | 菅原辰 | 岩手 | NULL | NULL | 本桐牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:50.000Z | 2025-11-16T10:51:50.000Z |
| 202511160532 | 3 | 3 | ウインドモア | 牡3 | 栗毛 | 22 | 4 | ウインドモア | アニマルキングダム | トーセンホマレボシ | 56.0 | 大坪慎 | 岩手 | NULL | NULL | 伊藤牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:50.000Z | 2025-11-16T10:51:50.000Z |
| 202511160532 | 4 | 4 | ストレート | 牝5 | 栗毛 | 20 | 4 | ストレート | フリオーソ | フォーティナイナー | 54.0 | 岩本怜 | 岩手 | NULL | NULL | 門別敏朗 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:50.000Z | 2025-11-16T10:51:50.000Z |
| 202511160532 | 5 | 5 | オンザバサラ | 牡3 | 黒鹿毛 | 22 | 3 | オンザバサラ | ハービンジャー | ディープインパクト | 56.0 | 佐々志 | 岩手 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:50.000Z | 2025-11-16T10:51:50.000Z |
| 202511160532 | 6 | 6 | ティーエスフェアリ | 牝4 | 鹿毛 | 21 | 3 | ティーエスフェアリ | トゥザワールド | ハービンジャー | 54.0 | 山本政 | 岩手 | NULL | NULL | 習志野牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:50.000Z | 2025-11-16T10:51:50.000Z |
| 202511160532 | 7 | 7 | ロバリアステージ | 牝3 | 栗毛 | 22 | 3 | ロバリアステージ | ワールドエース | ナカヤマフェスタ | 54.0 | 山本聡 | 岩手 | NULL | NULL | 石田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:50.000Z | 2025-11-16T10:51:50.000Z |
| 202511160532 | 7 | 8 | メイショウフラム | 牝5 | 鹿毛 | 20 | 4 | メイショウフラム | マクフィ | オレハマッテルゼ | 52.0 | 坂井瑛 | 岩手 | NULL | NULL | 赤田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:50.000Z | 2025-11-16T10:51:50.000Z |
| 202511160532 | 8 | 9 | リメリック | 牡4 | 黒鹿毛 | 21 | 4 | リメリック | ダノンバラード | オペラハウス | 56.0 | 高松亮 | 岩手 | NULL | NULL | 松田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:50.000Z | 2025-11-16T10:51:50.000Z |
| 202511160532 | 8 | 10 | ホロヨイマンゲツ | 牡3 | 黒鹿毛 | 22 | 4 | ホロヨイマンゲツ | バゴ | ステイゴールド | 56.0 | 阿部英 | 岩手 | NULL | NULL | ウエスタンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:50.000Z | 2025-11-16T10:51:50.000Z |
| 202511160610 | 1 | 1 | ドルチェヴィータ | 牝7 | 黒鹿毛 | 18 | 2 | ドルチェヴィータ | トランセンド | タニノギムレット | 52.0 | 坂井瑛 | 岩手 | NULL | NULL | 高橋フアーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:54.000Z | 2025-11-16T10:46:54.000Z |
| 202511160610 | 2 | 2 | ヴィクトリアランド | 牝3 | 鹿毛 | 22 | 4 | ヴィクトリアランド | スワーヴリチャード | メイショウサムソン | 54.0 | 塚本涼 | 岩手 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:54.000Z | 2025-11-16T10:46:54.000Z |
| 202511160610 | 3 | 3 | メッチャサザン | 牡4 | 鹿毛 | 21 | 5 | メッチャサザン | ブラックタイド | フレンチデピュティ | 56.0 | 菅原辰 | 岩手 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:54.000Z | 2025-11-16T10:46:54.000Z |
| 202511160610 | 4 | 4 | メモリーメイラード | 牝3 | 栗毛 | 22 | 5 | メモリーメイラード | スマートファルコン | ヘニーヒューズ | 54.0 | 南郷家 | 岩手 | NULL | NULL | 対馬正 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:54.000Z | 2025-11-16T10:46:54.000Z |
| 202511160610 | 5 | 5 | スパーク | 牡3 | 栗毛 | 22 | 4 | スパーク | ガルボ | サウスヴィグラス | 56.0 | 岩本怜 | 岩手 | NULL | NULL | 水丸牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:54.000Z | 2025-11-16T10:46:54.000Z |
| 202511160610 | 6 | 6 | クリノサンシャイン | 牝8 | 鹿毛 | 17 | 3 | クリノサンシャイン | クリノメダリスト | ステイゴールド | 54.0 | 阿部英 | 岩手 | NULL | NULL | 上井農場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:54.000Z | 2025-11-16T10:46:54.000Z |
| 202511160610 | 7 | 7 | メイショウイントロ | 牝3 | 鹿毛 | 22 | 3 | メイショウイントロ | キタサンブラック | エンパイアメーカー | 54.0 | 村上忍 | 岩手 | NULL | NULL | 太陽牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:54.000Z | 2025-11-16T10:46:54.000Z |
| 202511160610 | 7 | 8 | ライジンシチー | 牡3 | 鹿毛 | 22 | 2 | ライジンシチー | サンダースノー | シンボリクリスエス | 56.0 | 山本紀 | 岩手 | NULL | NULL | 幌村牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:54.000Z | 2025-11-16T10:46:54.000Z |
| 202511160610 | 8 | 9 | エルメルクリオ | 牝5 | 青鹿毛 | 20 | 3 | エルメルクリオ | パドトロワ | ダンスインザダーク | 54.0 | 大坪慎 | 岩手 | NULL | NULL | 三村卓也 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:54.000Z | 2025-11-16T10:46:54.000Z |
| 202511160610 | 8 | 10 | アルデムラータ | 牝3 | 芦毛 | 22 | 4 | アルデムラータ | ゴールドシップ | Bernardini | 54.0 | 小林凌 | 岩手 | NULL | NULL | 小島牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:46:54.000Z | 2025-11-16T10:46:54.000Z |
| 202511160622 | 1 | 1 | ドルチェヴィータ | 牝7 | 黒鹿毛 | 18 | 2 | ドルチェヴィータ | トランセンド | タニノギムレット | 52.0 | 坂井瑛 | 岩手 | NULL | NULL | 高橋フアーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:37.000Z | 2025-11-16T10:48:37.000Z |
| 202511160622 | 2 | 2 | ヴィクトリアランド | 牝3 | 鹿毛 | 22 | 4 | ヴィクトリアランド | スワーヴリチャード | メイショウサムソン | 54.0 | 塚本涼 | 岩手 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:37.000Z | 2025-11-16T10:48:37.000Z |
| 202511160622 | 3 | 3 | メッチャサザン | 牡4 | 鹿毛 | 21 | 5 | メッチャサザン | ブラックタイド | フレンチデピュティ | 56.0 | 菅原辰 | 岩手 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:37.000Z | 2025-11-16T10:48:37.000Z |
| 202511160622 | 4 | 4 | メモリーメイラード | 牝3 | 栗毛 | 22 | 5 | メモリーメイラード | スマートファルコン | ヘニーヒューズ | 54.0 | 南郷家 | 岩手 | NULL | NULL | 対馬正 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:37.000Z | 2025-11-16T10:48:37.000Z |
| 202511160622 | 5 | 5 | スパーク | 牡3 | 栗毛 | 22 | 4 | スパーク | ガルボ | サウスヴィグラス | 56.0 | 岩本怜 | 岩手 | NULL | NULL | 水丸牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:37.000Z | 2025-11-16T10:48:37.000Z |
| 202511160622 | 6 | 6 | クリノサンシャイン | 牝8 | 鹿毛 | 17 | 3 | クリノサンシャイン | クリノメダリスト | ステイゴールド | 54.0 | 阿部英 | 岩手 | NULL | NULL | 上井農場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:37.000Z | 2025-11-16T10:48:37.000Z |
| 202511160622 | 7 | 7 | メイショウイントロ | 牝3 | 鹿毛 | 22 | 3 | メイショウイントロ | キタサンブラック | エンパイアメーカー | 54.0 | 村上忍 | 岩手 | NULL | NULL | 太陽牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:37.000Z | 2025-11-16T10:48:37.000Z |
| 202511160622 | 7 | 8 | ライジンシチー | 牡3 | 鹿毛 | 22 | 2 | ライジンシチー | サンダースノー | シンボリクリスエス | 56.0 | 山本紀 | 岩手 | NULL | NULL | 幌村牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:37.000Z | 2025-11-16T10:48:37.000Z |
| 202511160622 | 8 | 9 | エルメルクリオ | 牝5 | 青鹿毛 | 20 | 3 | エルメルクリオ | パドトロワ | ダンスインザダーク | 54.0 | 大坪慎 | 岩手 | NULL | NULL | 三村卓也 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:37.000Z | 2025-11-16T10:48:37.000Z |
| 202511160622 | 8 | 10 | アルデムラータ | 牝3 | 芦毛 | 22 | 4 | アルデムラータ | ゴールドシップ | Bernardini | 54.0 | 小林凌 | 岩手 | NULL | NULL | 小島牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:37.000Z | 2025-11-16T10:48:37.000Z |
| 202511160631 | 1 | 1 | ドルチェヴィータ | 牝7 | 黒鹿毛 | 18 | 2 | ドルチェヴィータ | トランセンド | タニノギムレット | 52.0 | 坂井瑛 | 岩手 | NULL | NULL | 高橋フアーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:03.000Z | 2025-11-16T10:50:03.000Z |
| 202511160631 | 2 | 2 | ヴィクトリアランド | 牝3 | 鹿毛 | 22 | 4 | ヴィクトリアランド | スワーヴリチャード | メイショウサムソン | 54.0 | 塚本涼 | 岩手 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:03.000Z | 2025-11-16T10:50:03.000Z |
| 202511160631 | 3 | 3 | メッチャサザン | 牡4 | 鹿毛 | 21 | 5 | メッチャサザン | ブラックタイド | フレンチデピュティ | 56.0 | 菅原辰 | 岩手 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:03.000Z | 2025-11-16T10:50:03.000Z |
| 202511160631 | 4 | 4 | メモリーメイラード | 牝3 | 栗毛 | 22 | 5 | メモリーメイラード | スマートファルコン | ヘニーヒューズ | 54.0 | 南郷家 | 岩手 | NULL | NULL | 対馬正 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:03.000Z | 2025-11-16T10:50:03.000Z |
| 202511160631 | 5 | 5 | スパーク | 牡3 | 栗毛 | 22 | 4 | スパーク | ガルボ | サウスヴィグラス | 56.0 | 岩本怜 | 岩手 | NULL | NULL | 水丸牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:03.000Z | 2025-11-16T10:50:03.000Z |
| 202511160631 | 6 | 6 | クリノサンシャイン | 牝8 | 鹿毛 | 17 | 3 | クリノサンシャイン | クリノメダリスト | ステイゴールド | 54.0 | 阿部英 | 岩手 | NULL | NULL | 上井農場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:03.000Z | 2025-11-16T10:50:03.000Z |
| 202511160631 | 7 | 7 | メイショウイントロ | 牝3 | 鹿毛 | 22 | 3 | メイショウイントロ | キタサンブラック | エンパイアメーカー | 54.0 | 村上忍 | 岩手 | NULL | NULL | 太陽牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:03.000Z | 2025-11-16T10:50:03.000Z |
| 202511160631 | 7 | 8 | ライジンシチー | 牡3 | 鹿毛 | 22 | 2 | ライジンシチー | サンダースノー | シンボリクリスエス | 56.0 | 山本紀 | 岩手 | NULL | NULL | 幌村牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:03.000Z | 2025-11-16T10:50:03.000Z |
| 202511160631 | 8 | 9 | エルメルクリオ | 牝5 | 青鹿毛 | 20 | 3 | エルメルクリオ | パドトロワ | ダンスインザダーク | 54.0 | 大坪慎 | 岩手 | NULL | NULL | 三村卓也 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:03.000Z | 2025-11-16T10:50:03.000Z |
| 202511160631 | 8 | 10 | アルデムラータ | 牝3 | 芦毛 | 22 | 4 | アルデムラータ | ゴールドシップ | Bernardini | 54.0 | 小林凌 | 岩手 | NULL | NULL | 小島牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:03.000Z | 2025-11-16T10:50:03.000Z |
| 202511160632 | 1 | 1 | ドルチェヴィータ | 牝7 | 黒鹿毛 | 18 | 2 | ドルチェヴィータ | トランセンド | タニノギムレット | 52.0 | 坂井瑛 | 岩手 | NULL | NULL | 高橋フアーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:50.000Z | 2025-11-16T10:51:50.000Z |
| 202511160632 | 2 | 2 | ヴィクトリアランド | 牝3 | 鹿毛 | 22 | 4 | ヴィクトリアランド | スワーヴリチャード | メイショウサムソン | 54.0 | 塚本涼 | 岩手 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:50.000Z | 2025-11-16T10:51:50.000Z |
| 202511160632 | 3 | 3 | メッチャサザン | 牡4 | 鹿毛 | 21 | 5 | メッチャサザン | ブラックタイド | フレンチデピュティ | 56.0 | 菅原辰 | 岩手 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:50.000Z | 2025-11-16T10:51:50.000Z |
| 202511160632 | 4 | 4 | メモリーメイラード | 牝3 | 栗毛 | 22 | 5 | メモリーメイラード | スマートファルコン | ヘニーヒューズ | 54.0 | 南郷家 | 岩手 | NULL | NULL | 対馬正 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:50.000Z | 2025-11-16T10:51:50.000Z |
| 202511160632 | 5 | 5 | スパーク | 牡3 | 栗毛 | 22 | 4 | スパーク | ガルボ | サウスヴィグラス | 56.0 | 岩本怜 | 岩手 | NULL | NULL | 水丸牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:50.000Z | 2025-11-16T10:51:50.000Z |
| 202511160632 | 6 | 6 | クリノサンシャイン | 牝8 | 鹿毛 | 17 | 3 | クリノサンシャイン | クリノメダリスト | ステイゴールド | 54.0 | 阿部英 | 岩手 | NULL | NULL | 上井農場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:50.000Z | 2025-11-16T10:51:50.000Z |
| 202511160632 | 7 | 7 | メイショウイントロ | 牝3 | 鹿毛 | 22 | 3 | メイショウイントロ | キタサンブラック | エンパイアメーカー | 54.0 | 村上忍 | 岩手 | NULL | NULL | 太陽牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:50.000Z | 2025-11-16T10:51:50.000Z |
| 202511160632 | 7 | 8 | ライジンシチー | 牡3 | 鹿毛 | 22 | 2 | ライジンシチー | サンダースノー | シンボリクリスエス | 56.0 | 山本紀 | 岩手 | NULL | NULL | 幌村牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:50.000Z | 2025-11-16T10:51:50.000Z |
| 202511160632 | 8 | 9 | エルメルクリオ | 牝5 | 青鹿毛 | 20 | 3 | エルメルクリオ | パドトロワ | ダンスインザダーク | 54.0 | 大坪慎 | 岩手 | NULL | NULL | 三村卓也 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:50.000Z | 2025-11-16T10:51:50.000Z |
| 202511160632 | 8 | 10 | アルデムラータ | 牝3 | 芦毛 | 22 | 4 | アルデムラータ | ゴールドシップ | Bernardini | 54.0 | 小林凌 | 岩手 | NULL | NULL | 小島牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:51:50.000Z | 2025-11-16T10:51:50.000Z |
| 202511160710 | 1 | 1 | フェズカズマ | 牡6 | 栗毛 | 19 | 1 | フェズカズマ | ドレフォン | ネオユニヴァース | 56.0 | 高松亮 | 岩手 | NULL | NULL | ノーザンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:11.000Z | 2025-11-16T10:47:11.000Z |
| 202511160710 | 2 | 2 | ネコニコタツ | 牝4 | 鹿毛 | 21 | 1 | ネコニコタツ | ディスクリートキャット | タイキシャトル | 54.0 | 小林凌 | 岩手 | NULL | NULL | パカパカファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:11.000Z | 2025-11-16T10:47:11.000Z |
| 202511160710 | 3 | 3 | ローガンマウンテン | 牝6 | 鹿毛 | 19 | 3 | ローガンマウンテン | アポロソニック | Fast Gold | 54.0 | 南郷家 | 岩手 | NULL | NULL | スウィングフィールド | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:11.000Z | 2025-11-16T10:47:11.000Z |
| 202511160710 | 4 | 4 | フジサンワイシーシ | 牡4 | 栗毛 | 21 | 5 | フジサンワイシーシ | アニマルキングダム | アドマイヤムーン | 56.0 | 村上忍 | 岩手 | NULL | NULL | 櫛桁牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:11.000Z | 2025-11-16T10:47:11.000Z |
| 202511160710 | 5 | 5 | ハッシュタグ | 牡11 | 鹿毛 | 14 | 3 | ハッシュタグ | クロフネ | Sunday Silence | 56.0 | 佐々志 | 岩手 | NULL | NULL | ノーザンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:11.000Z | 2025-11-16T10:47:11.000Z |
| 202511160710 | 6 | 6 | キタノフローラ | 牝3 | 鹿毛 | 22 | 3 | キタノフローラ | マクフィ | ゴールドアリュール | 54.0 | 塚本涼 | 岩手 | NULL | NULL | 萩澤泰博 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:11.000Z | 2025-11-16T10:47:11.000Z |
| 202511160710 | 7 | 7 | デフィデリ | 牡6 | 青鹿毛 | 19 | 5 | デフィデリ | ベーカバド | ディクタット | 56.0 | 高橋悠 | 岩手 | NULL | NULL | サンシャイン牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:11.000Z | 2025-11-16T10:47:11.000Z |
| 202511160710 | 8 | 8 | セラトーン | 牡3 | 鹿毛 | 22 | 1 | セラトーン | Saxon Warrior | Rip Van Winkle | 56.0 | 菅原辰 | 岩手 | NULL | NULL | パカパカファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:11.000Z | 2025-11-16T10:47:11.000Z |
| 202511160722 | 1 | 1 | フェズカズマ | 牡6 | 栗毛 | 19 | 1 | フェズカズマ | ドレフォン | ネオユニヴァース | 56.0 | 高松亮 | 岩手 | NULL | NULL | ノーザンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:54.000Z | 2025-11-16T10:48:54.000Z |
| 202511160722 | 2 | 2 | ネコニコタツ | 牝4 | 鹿毛 | 21 | 1 | ネコニコタツ | ディスクリートキャット | タイキシャトル | 54.0 | 小林凌 | 岩手 | NULL | NULL | パカパカファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:54.000Z | 2025-11-16T10:48:54.000Z |
| 202511160722 | 3 | 3 | ローガンマウンテン | 牝6 | 鹿毛 | 19 | 3 | ローガンマウンテン | アポロソニック | Fast Gold | 54.0 | 南郷家 | 岩手 | NULL | NULL | スウィングフィールド | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:54.000Z | 2025-11-16T10:48:54.000Z |
| 202511160722 | 4 | 4 | フジサンワイシーシ | 牡4 | 栗毛 | 21 | 5 | フジサンワイシーシ | アニマルキングダム | アドマイヤムーン | 56.0 | 村上忍 | 岩手 | NULL | NULL | 櫛桁牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:54.000Z | 2025-11-16T10:48:54.000Z |
| 202511160722 | 5 | 5 | ハッシュタグ | 牡11 | 鹿毛 | 14 | 3 | ハッシュタグ | クロフネ | Sunday Silence | 56.0 | 佐々志 | 岩手 | NULL | NULL | ノーザンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:54.000Z | 2025-11-16T10:48:54.000Z |
| 202511160722 | 6 | 6 | キタノフローラ | 牝3 | 鹿毛 | 22 | 3 | キタノフローラ | マクフィ | ゴールドアリュール | 54.0 | 塚本涼 | 岩手 | NULL | NULL | 萩澤泰博 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:54.000Z | 2025-11-16T10:48:54.000Z |
| 202511160722 | 7 | 7 | デフィデリ | 牡6 | 青鹿毛 | 19 | 5 | デフィデリ | ベーカバド | ディクタット | 56.0 | 高橋悠 | 岩手 | NULL | NULL | サンシャイン牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:54.000Z | 2025-11-16T10:48:54.000Z |
| 202511160722 | 8 | 8 | セラトーン | 牡3 | 鹿毛 | 22 | 1 | セラトーン | Saxon Warrior | Rip Van Winkle | 56.0 | 菅原辰 | 岩手 | NULL | NULL | パカパカファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:54.000Z | 2025-11-16T10:48:54.000Z |
| 202511160731 | 1 | 1 | フェズカズマ | 牡6 | 栗毛 | 19 | 1 | フェズカズマ | ドレフォン | ネオユニヴァース | 56.0 | 高松亮 | 岩手 | NULL | NULL | ノーザンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:20.000Z | 2025-11-16T10:50:20.000Z |
| 202511160731 | 2 | 2 | ネコニコタツ | 牝4 | 鹿毛 | 21 | 1 | ネコニコタツ | ディスクリートキャット | タイキシャトル | 54.0 | 小林凌 | 岩手 | NULL | NULL | パカパカファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:20.000Z | 2025-11-16T10:50:20.000Z |
| 202511160731 | 3 | 3 | ローガンマウンテン | 牝6 | 鹿毛 | 19 | 3 | ローガンマウンテン | アポロソニック | Fast Gold | 54.0 | 南郷家 | 岩手 | NULL | NULL | スウィングフィールド | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:20.000Z | 2025-11-16T10:50:20.000Z |
| 202511160731 | 4 | 4 | フジサンワイシーシ | 牡4 | 栗毛 | 21 | 5 | フジサンワイシーシ | アニマルキングダム | アドマイヤムーン | 56.0 | 村上忍 | 岩手 | NULL | NULL | 櫛桁牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:20.000Z | 2025-11-16T10:50:20.000Z |
| 202511160731 | 5 | 5 | ハッシュタグ | 牡11 | 鹿毛 | 14 | 3 | ハッシュタグ | クロフネ | Sunday Silence | 56.0 | 佐々志 | 岩手 | NULL | NULL | ノーザンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:20.000Z | 2025-11-16T10:50:20.000Z |
| 202511160731 | 6 | 6 | キタノフローラ | 牝3 | 鹿毛 | 22 | 3 | キタノフローラ | マクフィ | ゴールドアリュール | 54.0 | 塚本涼 | 岩手 | NULL | NULL | 萩澤泰博 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:20.000Z | 2025-11-16T10:50:20.000Z |
| 202511160731 | 7 | 7 | デフィデリ | 牡6 | 青鹿毛 | 19 | 5 | デフィデリ | ベーカバド | ディクタット | 56.0 | 高橋悠 | 岩手 | NULL | NULL | サンシャイン牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:20.000Z | 2025-11-16T10:50:20.000Z |
| 202511160731 | 8 | 8 | セラトーン | 牡3 | 鹿毛 | 22 | 1 | セラトーン | Saxon Warrior | Rip Van Winkle | 56.0 | 菅原辰 | 岩手 | NULL | NULL | パカパカファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:20.000Z | 2025-11-16T10:50:20.000Z |
| 202511160732 | 1 | 1 | フェズカズマ | 牡6 | 栗毛 | 19 | 1 | フェズカズマ | ドレフォン | ネオユニヴァース | 56.0 | 高松亮 | 岩手 | NULL | NULL | ノーザンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:08.000Z | 2025-11-16T10:52:08.000Z |
| 202511160732 | 2 | 2 | ネコニコタツ | 牝4 | 鹿毛 | 21 | 1 | ネコニコタツ | ディスクリートキャット | タイキシャトル | 54.0 | 小林凌 | 岩手 | NULL | NULL | パカパカファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:08.000Z | 2025-11-16T10:52:08.000Z |
| 202511160732 | 3 | 3 | ローガンマウンテン | 牝6 | 鹿毛 | 19 | 3 | ローガンマウンテン | アポロソニック | Fast Gold | 54.0 | 南郷家 | 岩手 | NULL | NULL | スウィングフィールド | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:08.000Z | 2025-11-16T10:52:08.000Z |
| 202511160732 | 4 | 4 | フジサンワイシーシ | 牡4 | 栗毛 | 21 | 5 | フジサンワイシーシ | アニマルキングダム | アドマイヤムーン | 56.0 | 村上忍 | 岩手 | NULL | NULL | 櫛桁牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:08.000Z | 2025-11-16T10:52:08.000Z |
| 202511160732 | 5 | 5 | ハッシュタグ | 牡11 | 鹿毛 | 14 | 3 | ハッシュタグ | クロフネ | Sunday Silence | 56.0 | 佐々志 | 岩手 | NULL | NULL | ノーザンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:08.000Z | 2025-11-16T10:52:08.000Z |
| 202511160732 | 6 | 6 | キタノフローラ | 牝3 | 鹿毛 | 22 | 3 | キタノフローラ | マクフィ | ゴールドアリュール | 54.0 | 塚本涼 | 岩手 | NULL | NULL | 萩澤泰博 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:08.000Z | 2025-11-16T10:52:08.000Z |
| 202511160732 | 7 | 7 | デフィデリ | 牡6 | 青鹿毛 | 19 | 5 | デフィデリ | ベーカバド | ディクタット | 56.0 | 高橋悠 | 岩手 | NULL | NULL | サンシャイン牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:08.000Z | 2025-11-16T10:52:08.000Z |
| 202511160732 | 8 | 8 | セラトーン | 牡3 | 鹿毛 | 22 | 1 | セラトーン | Saxon Warrior | Rip Van Winkle | 56.0 | 菅原辰 | 岩手 | NULL | NULL | パカパカファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:08.000Z | 2025-11-16T10:52:08.000Z |
| 202511160810 | 1 | 1 | キャビネットバトル | 牡5 | 鹿毛 | 20 | 4 | キャビネットバトル | ホワイトソックス | Scipion | 56.0 | 鈴木祐 | 岩手 | NULL | NULL | チャンピオンズファー | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:11.000Z | 2025-11-16T10:47:11.000Z |
| 202511160810 | 2 | 2 | コヴェナント | 牝3 | 鹿毛 | 22 | 3 | コヴェナント | レッドベルジュール | フサイチコンコルド | 54.0 | 山本政 | 岩手 | NULL | NULL | 鹿戸和幸 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:11.000Z | 2025-11-16T10:47:11.000Z |
| 202511160810 | 3 | 3 | エムティヒビキ | NULL | NULL | 0 | 0 | エムティヒビキ | レガーロ | ゼンノロブロイ | NULL | 小林凌 | 岩手 | NULL | NULL | 市川フアーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:11.000Z | 2025-11-16T10:47:11.000Z |
| 202511160810 | 4 | 4 | キッカケ | 牝5 | 鹿毛 | 20 | 2 | キッカケ | ダノンバラード | キングカメハメハ | 54.0 | 山本紀 | 岩手 | NULL | NULL | 村上欽哉 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:11.000Z | 2025-11-16T10:47:11.000Z |
| 202511160810 | 5 | 5 | エイシンヌチマシヌ | 牝6 | 栗毛 | 19 | 1 | エイシンヌチマシヌ | パイロ | クロフネ | 52.0 | 関本玲 | 岩手 | NULL | NULL | 栄進牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:11.000Z | 2025-11-16T10:47:11.000Z |
| 202511160810 | 6 | 6 | モルデュール | 牡5 | 芦毛 | 20 | 4 | モルデュール | ビッグアーサー | クロフネ | 56.0 | 高橋悠 | 岩手 | NULL | NULL | 高橋フアーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:11.000Z | 2025-11-16T10:47:11.000Z |
| 202511160810 | 6 | 7 | ミリオーレアルバ | 牡4 | 栗毛 | 21 | 4 | ミリオーレアルバ | ニューイヤーズデイ | ハーツクライ | 56.0 | 大坪慎 | 岩手 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:11.000Z | 2025-11-16T10:47:11.000Z |
| 202511160810 | 7 | 8 | ベアビリーブ | 牝6 | 青毛 | 19 | 2 | ベアビリーブ | キタサンブラック | Monsun | 54.0 | 菅原辰 | 岩手 | NULL | NULL | （有）社台コーポレー | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:11.000Z | 2025-11-16T10:47:11.000Z |
| 202511160810 | 7 | 9 | バイオレットモーヴ | 牝8 | 栗毛 | 17 | 4 | バイオレットモーヴ | レッドデセーオ | アグネスタキオン | 54.0 | 阿部英 | 岩手 | NULL | NULL | 下河辺牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:11.000Z | 2025-11-16T10:47:11.000Z |
| 202511160810 | 8 | 10 | ジュンツーポイント | 牡6 | 黒鹿毛 | 19 | 4 | ジュンツーポイント | アドマイヤムーン | ビワタケヒデ | 54.0 | 坂井瑛 | 岩手 | NULL | NULL | 田端牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:11.000Z | 2025-11-16T10:47:11.000Z |
| 202511160810 | 8 | 11 | コルヴィーナ | 牝3 | 鹿毛 | 22 | 3 | コルヴィーナ | シニスターミニスター | ルーラーシップ | 54.0 | 村上忍 | 岩手 | NULL | NULL | 藤原牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:11.000Z | 2025-11-16T10:47:11.000Z |
| 202511160822 | 1 | 1 | キャビネットバトル | 牡5 | 鹿毛 | 20 | 4 | キャビネットバトル | ホワイトソックス | Scipion | 56.0 | 鈴木祐 | 岩手 | NULL | NULL | チャンピオンズファー | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:54.000Z | 2025-11-16T10:48:54.000Z |
| 202511160822 | 2 | 2 | コヴェナント | 牝3 | 鹿毛 | 22 | 3 | コヴェナント | レッドベルジュール | フサイチコンコルド | 54.0 | 山本政 | 岩手 | NULL | NULL | 鹿戸和幸 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:54.000Z | 2025-11-16T10:48:54.000Z |
| 202511160822 | 3 | 3 | エムティヒビキ | NULL | NULL | 0 | 0 | エムティヒビキ | レガーロ | ゼンノロブロイ | NULL | 小林凌 | 岩手 | NULL | NULL | 市川フアーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:54.000Z | 2025-11-16T10:48:54.000Z |
| 202511160822 | 4 | 4 | キッカケ | 牝5 | 鹿毛 | 20 | 2 | キッカケ | ダノンバラード | キングカメハメハ | 54.0 | 山本紀 | 岩手 | NULL | NULL | 村上欽哉 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:54.000Z | 2025-11-16T10:48:54.000Z |
| 202511160822 | 5 | 5 | エイシンヌチマシヌ | 牝6 | 栗毛 | 19 | 1 | エイシンヌチマシヌ | パイロ | クロフネ | 52.0 | 関本玲 | 岩手 | NULL | NULL | 栄進牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:54.000Z | 2025-11-16T10:48:54.000Z |
| 202511160822 | 6 | 6 | モルデュール | 牡5 | 芦毛 | 20 | 4 | モルデュール | ビッグアーサー | クロフネ | 56.0 | 高橋悠 | 岩手 | NULL | NULL | 高橋フアーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:54.000Z | 2025-11-16T10:48:54.000Z |
| 202511160822 | 6 | 7 | ミリオーレアルバ | 牡4 | 栗毛 | 21 | 4 | ミリオーレアルバ | ニューイヤーズデイ | ハーツクライ | 56.0 | 大坪慎 | 岩手 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:54.000Z | 2025-11-16T10:48:54.000Z |
| 202511160822 | 7 | 8 | ベアビリーブ | 牝6 | 青毛 | 19 | 2 | ベアビリーブ | キタサンブラック | Monsun | 54.0 | 菅原辰 | 岩手 | NULL | NULL | （有）社台コーポレー | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:54.000Z | 2025-11-16T10:48:54.000Z |
| 202511160822 | 7 | 9 | バイオレットモーヴ | 牝8 | 栗毛 | 17 | 4 | バイオレットモーヴ | レッドデセーオ | アグネスタキオン | 54.0 | 阿部英 | 岩手 | NULL | NULL | 下河辺牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:54.000Z | 2025-11-16T10:48:54.000Z |
| 202511160822 | 8 | 10 | ジュンツーポイント | 牡6 | 黒鹿毛 | 19 | 4 | ジュンツーポイント | アドマイヤムーン | ビワタケヒデ | 54.0 | 坂井瑛 | 岩手 | NULL | NULL | 田端牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:54.000Z | 2025-11-16T10:48:54.000Z |
| 202511160822 | 8 | 11 | コルヴィーナ | 牝3 | 鹿毛 | 22 | 3 | コルヴィーナ | シニスターミニスター | ルーラーシップ | 54.0 | 村上忍 | 岩手 | NULL | NULL | 藤原牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:48:54.000Z | 2025-11-16T10:48:54.000Z |
| 202511160831 | 1 | 1 | キャビネットバトル | 牡5 | 鹿毛 | 20 | 4 | キャビネットバトル | ホワイトソックス | Scipion | 56.0 | 鈴木祐 | 岩手 | NULL | NULL | チャンピオンズファー | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:20.000Z | 2025-11-16T10:50:20.000Z |
| 202511160831 | 2 | 2 | コヴェナント | 牝3 | 鹿毛 | 22 | 3 | コヴェナント | レッドベルジュール | フサイチコンコルド | 54.0 | 山本政 | 岩手 | NULL | NULL | 鹿戸和幸 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:20.000Z | 2025-11-16T10:50:20.000Z |
| 202511160831 | 3 | 3 | エムティヒビキ | NULL | NULL | 0 | 0 | エムティヒビキ | レガーロ | ゼンノロブロイ | NULL | 小林凌 | 岩手 | NULL | NULL | 市川フアーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:20.000Z | 2025-11-16T10:50:20.000Z |
| 202511160831 | 4 | 4 | キッカケ | 牝5 | 鹿毛 | 20 | 2 | キッカケ | ダノンバラード | キングカメハメハ | 54.0 | 山本紀 | 岩手 | NULL | NULL | 村上欽哉 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:20.000Z | 2025-11-16T10:50:20.000Z |
| 202511160831 | 5 | 5 | エイシンヌチマシヌ | 牝6 | 栗毛 | 19 | 1 | エイシンヌチマシヌ | パイロ | クロフネ | 52.0 | 関本玲 | 岩手 | NULL | NULL | 栄進牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:20.000Z | 2025-11-16T10:50:20.000Z |
| 202511160831 | 6 | 6 | モルデュール | 牡5 | 芦毛 | 20 | 4 | モルデュール | ビッグアーサー | クロフネ | 56.0 | 高橋悠 | 岩手 | NULL | NULL | 高橋フアーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:20.000Z | 2025-11-16T10:50:20.000Z |
| 202511160831 | 6 | 7 | ミリオーレアルバ | 牡4 | 栗毛 | 21 | 4 | ミリオーレアルバ | ニューイヤーズデイ | ハーツクライ | 56.0 | 大坪慎 | 岩手 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:20.000Z | 2025-11-16T10:50:20.000Z |
| 202511160831 | 7 | 8 | ベアビリーブ | 牝6 | 青毛 | 19 | 2 | ベアビリーブ | キタサンブラック | Monsun | 54.0 | 菅原辰 | 岩手 | NULL | NULL | （有）社台コーポレー | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:20.000Z | 2025-11-16T10:50:20.000Z |
| 202511160831 | 7 | 9 | バイオレットモーヴ | 牝8 | 栗毛 | 17 | 4 | バイオレットモーヴ | レッドデセーオ | アグネスタキオン | 54.0 | 阿部英 | 岩手 | NULL | NULL | 下河辺牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:20.000Z | 2025-11-16T10:50:20.000Z |
| 202511160831 | 8 | 10 | ジュンツーポイント | 牡6 | 黒鹿毛 | 19 | 4 | ジュンツーポイント | アドマイヤムーン | ビワタケヒデ | 54.0 | 坂井瑛 | 岩手 | NULL | NULL | 田端牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:20.000Z | 2025-11-16T10:50:20.000Z |
| 202511160831 | 8 | 11 | コルヴィーナ | 牝3 | 鹿毛 | 22 | 3 | コルヴィーナ | シニスターミニスター | ルーラーシップ | 54.0 | 村上忍 | 岩手 | NULL | NULL | 藤原牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:20.000Z | 2025-11-16T10:50:20.000Z |
| 202511160832 | 1 | 1 | キャビネットバトル | 牡5 | 鹿毛 | 20 | 4 | キャビネットバトル | ホワイトソックス | Scipion | 56.0 | 鈴木祐 | 岩手 | NULL | NULL | チャンピオンズファー | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:08.000Z | 2025-11-16T10:52:08.000Z |
| 202511160832 | 2 | 2 | コヴェナント | 牝3 | 鹿毛 | 22 | 3 | コヴェナント | レッドベルジュール | フサイチコンコルド | 54.0 | 山本政 | 岩手 | NULL | NULL | 鹿戸和幸 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:08.000Z | 2025-11-16T10:52:08.000Z |
| 202511160832 | 3 | 3 | エムティヒビキ | NULL | NULL | 0 | 0 | エムティヒビキ | レガーロ | ゼンノロブロイ | NULL | 小林凌 | 岩手 | NULL | NULL | 市川フアーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:08.000Z | 2025-11-16T10:52:08.000Z |
| 202511160832 | 4 | 4 | キッカケ | 牝5 | 鹿毛 | 20 | 2 | キッカケ | ダノンバラード | キングカメハメハ | 54.0 | 山本紀 | 岩手 | NULL | NULL | 村上欽哉 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:08.000Z | 2025-11-16T10:52:08.000Z |
| 202511160832 | 5 | 5 | エイシンヌチマシヌ | 牝6 | 栗毛 | 19 | 1 | エイシンヌチマシヌ | パイロ | クロフネ | 52.0 | 関本玲 | 岩手 | NULL | NULL | 栄進牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:08.000Z | 2025-11-16T10:52:08.000Z |
| 202511160832 | 6 | 6 | モルデュール | 牡5 | 芦毛 | 20 | 4 | モルデュール | ビッグアーサー | クロフネ | 56.0 | 高橋悠 | 岩手 | NULL | NULL | 高橋フアーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:08.000Z | 2025-11-16T10:52:08.000Z |
| 202511160832 | 6 | 7 | ミリオーレアルバ | 牡4 | 栗毛 | 21 | 4 | ミリオーレアルバ | ニューイヤーズデイ | ハーツクライ | 56.0 | 大坪慎 | 岩手 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:08.000Z | 2025-11-16T10:52:08.000Z |
| 202511160832 | 7 | 8 | ベアビリーブ | 牝6 | 青毛 | 19 | 2 | ベアビリーブ | キタサンブラック | Monsun | 54.0 | 菅原辰 | 岩手 | NULL | NULL | （有）社台コーポレー | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:08.000Z | 2025-11-16T10:52:08.000Z |
| 202511160832 | 7 | 9 | バイオレットモーヴ | 牝8 | 栗毛 | 17 | 4 | バイオレットモーヴ | レッドデセーオ | アグネスタキオン | 54.0 | 阿部英 | 岩手 | NULL | NULL | 下河辺牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:08.000Z | 2025-11-16T10:52:08.000Z |
| 202511160832 | 8 | 10 | ジュンツーポイント | 牡6 | 黒鹿毛 | 19 | 4 | ジュンツーポイント | アドマイヤムーン | ビワタケヒデ | 54.0 | 坂井瑛 | 岩手 | NULL | NULL | 田端牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:08.000Z | 2025-11-16T10:52:08.000Z |
| 202511160832 | 8 | 11 | コルヴィーナ | 牝3 | 鹿毛 | 22 | 3 | コルヴィーナ | シニスターミニスター | ルーラーシップ | 54.0 | 村上忍 | 岩手 | NULL | NULL | 藤原牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:08.000Z | 2025-11-16T10:52:08.000Z |
| 202511160910 | 1 | 1 | エースレイジング | 牡8 | 黒鹿毛 | 17 | 3 | エースレイジング | ゴールドアリュール | キングカメハメハ | 56.0 | 村上忍 | 岩手 | NULL | NULL | チャンピオンズファー | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:28.000Z | 2025-11-16T10:47:28.000Z |
| 202511160910 | 2 | 2 | レースラヴェンダー | 牝5 | 鹿毛 | 20 | 4 | レースラヴェンダー | サトノクラウン | キングカメハメハ | 54.0 | 大坪慎 | 岩手 | NULL | NULL | 岡田スタツド | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:28.000Z | 2025-11-16T10:47:28.000Z |
| 202511160910 | 3 | 3 | パワームーブ | 牡4 | 青鹿毛 | 21 | 2 | パワームーブ | トゥザワールド | デヒア | 56.0 | 佐々志 | 岩手 | NULL | NULL | 千代田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:28.000Z | 2025-11-16T10:47:28.000Z |
| 202511160910 | 4 | 4 | ボルドーグリフォン | 牝5 | 黒鹿毛 | 20 | 2 | ボルドーグリフォン | エイシンヒカリ | Street Cry | 54.0 | 岩本怜 | 岩手 | NULL | NULL | 栄進牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:28.000Z | 2025-11-16T10:47:28.000Z |
| 202511160910 | 5 | 5 | ハーイ | 牝8 | 栗毛 | 17 | 4 | ハーイ | スズカコーズウェイ | サンデーサイレンス | 54.0 | 山本政 | 岩手 | NULL | NULL | グランド牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:28.000Z | 2025-11-16T10:47:28.000Z |
| 202511160910 | 5 | 6 | ロコルルハーツ | 牡5 | 黒鹿毛 | 20 | 4 | ロコルルハーツ | ハーツクライ | デヒア | 56.0 | 高橋悠 | 岩手 | NULL | NULL | 千代田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:28.000Z | 2025-11-16T10:47:28.000Z |
| 202511160910 | 6 | 7 | ジュレヴァー | 牝4 | 黒鹿毛 | 21 | 4 | ジュレヴァー | タリスマニック | ジャングルポケット | 54.0 | 高松亮 | 岩手 | NULL | NULL | 坂戸節子 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:28.000Z | 2025-11-16T10:47:28.000Z |
| 202511160910 | 6 | 8 | ハウファアイルゴー | 牝6 | 栗毛 | 19 | 3 | ハウファアイルゴー | トーセンジョーダン | Danehill Dancer | 54.0 | 山本紀 | 岩手 | NULL | NULL | 岡田スタツド | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:28.000Z | 2025-11-16T10:47:28.000Z |
| 202511160910 | 7 | 9 | ヒロシゲウェーブ | NULL | NULL | 0 | 0 | ヒロシゲウェーブ | ダイワメジャー | Giant's Causeway | NULL | 塚本涼 | 岩手 | NULL | NULL | 高橋義浩 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:28.000Z | 2025-11-16T10:47:28.000Z |
| 202511160910 | 7 | 10 | アルシャンティ | 牝3 | 鹿毛 | 22 | 5 | アルシャンティ | バゴ | ディープインパクト | 54.0 | 山本聡 | 岩手 | NULL | NULL | 辻牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:28.000Z | 2025-11-16T10:47:28.000Z |
| 202511160910 | 8 | 11 | エーデルムート | 牝3 | 青鹿毛 | 22 | 4 | エーデルムート | ショコラミーティア | マジェスティックウォリアー | 54.0 | 阿部英 | 岩手 | NULL | NULL | 新井弘幸 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:28.000Z | 2025-11-16T10:47:28.000Z |
| 202511160910 | 8 | 12 | オラフ | 牡6 | 芦毛 | 19 | 4 | オラフ | ダンカーク | フォーティナイナーズサン | 56.0 | 鈴木祐 | 岩手 | NULL | NULL | 丸村村下ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:28.000Z | 2025-11-16T10:47:28.000Z |
| 202511160922 | 1 | 1 | エースレイジング | 牡8 | 黒鹿毛 | 17 | 3 | エースレイジング | ゴールドアリュール | キングカメハメハ | 56.0 | 村上忍 | 岩手 | NULL | NULL | チャンピオンズファー | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:11.000Z | 2025-11-16T10:49:11.000Z |
| 202511160922 | 2 | 2 | レースラヴェンダー | 牝5 | 鹿毛 | 20 | 4 | レースラヴェンダー | サトノクラウン | キングカメハメハ | 54.0 | 大坪慎 | 岩手 | NULL | NULL | 岡田スタツド | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:11.000Z | 2025-11-16T10:49:11.000Z |
| 202511160922 | 3 | 3 | パワームーブ | 牡4 | 青鹿毛 | 21 | 2 | パワームーブ | トゥザワールド | デヒア | 56.0 | 佐々志 | 岩手 | NULL | NULL | 千代田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:11.000Z | 2025-11-16T10:49:11.000Z |
| 202511160922 | 4 | 4 | ボルドーグリフォン | 牝5 | 黒鹿毛 | 20 | 2 | ボルドーグリフォン | エイシンヒカリ | Street Cry | 54.0 | 岩本怜 | 岩手 | NULL | NULL | 栄進牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:11.000Z | 2025-11-16T10:49:11.000Z |
| 202511160922 | 5 | 5 | ハーイ | 牝8 | 栗毛 | 17 | 4 | ハーイ | スズカコーズウェイ | サンデーサイレンス | 54.0 | 山本政 | 岩手 | NULL | NULL | グランド牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:11.000Z | 2025-11-16T10:49:11.000Z |
| 202511160922 | 5 | 6 | ロコルルハーツ | 牡5 | 黒鹿毛 | 20 | 4 | ロコルルハーツ | ハーツクライ | デヒア | 56.0 | 高橋悠 | 岩手 | NULL | NULL | 千代田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:11.000Z | 2025-11-16T10:49:11.000Z |
| 202511160922 | 6 | 7 | ジュレヴァー | 牝4 | 黒鹿毛 | 21 | 4 | ジュレヴァー | タリスマニック | ジャングルポケット | 54.0 | 高松亮 | 岩手 | NULL | NULL | 坂戸節子 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:11.000Z | 2025-11-16T10:49:11.000Z |
| 202511160922 | 6 | 8 | ハウファアイルゴー | 牝6 | 栗毛 | 19 | 3 | ハウファアイルゴー | トーセンジョーダン | Danehill Dancer | 54.0 | 山本紀 | 岩手 | NULL | NULL | 岡田スタツド | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:11.000Z | 2025-11-16T10:49:11.000Z |
| 202511160922 | 7 | 9 | ヒロシゲウェーブ | NULL | NULL | 0 | 0 | ヒロシゲウェーブ | ダイワメジャー | Giant's Causeway | NULL | 塚本涼 | 岩手 | NULL | NULL | 高橋義浩 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:11.000Z | 2025-11-16T10:49:11.000Z |
| 202511160922 | 7 | 10 | アルシャンティ | 牝3 | 鹿毛 | 22 | 5 | アルシャンティ | バゴ | ディープインパクト | 54.0 | 山本聡 | 岩手 | NULL | NULL | 辻牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:11.000Z | 2025-11-16T10:49:11.000Z |
| 202511160922 | 8 | 11 | エーデルムート | 牝3 | 青鹿毛 | 22 | 4 | エーデルムート | ショコラミーティア | マジェスティックウォリアー | 54.0 | 阿部英 | 岩手 | NULL | NULL | 新井弘幸 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:11.000Z | 2025-11-16T10:49:11.000Z |
| 202511160922 | 8 | 12 | オラフ | 牡6 | 芦毛 | 19 | 4 | オラフ | ダンカーク | フォーティナイナーズサン | 56.0 | 鈴木祐 | 岩手 | NULL | NULL | 丸村村下ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:11.000Z | 2025-11-16T10:49:11.000Z |
| 202511160931 | 1 | 1 | エースレイジング | 牡8 | 黒鹿毛 | 17 | 3 | エースレイジング | ゴールドアリュール | キングカメハメハ | 56.0 | 村上忍 | 岩手 | NULL | NULL | チャンピオンズファー | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:37.000Z | 2025-11-16T10:50:37.000Z |
| 202511160931 | 2 | 2 | レースラヴェンダー | 牝5 | 鹿毛 | 20 | 4 | レースラヴェンダー | サトノクラウン | キングカメハメハ | 54.0 | 大坪慎 | 岩手 | NULL | NULL | 岡田スタツド | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:37.000Z | 2025-11-16T10:50:37.000Z |
| 202511160931 | 3 | 3 | パワームーブ | 牡4 | 青鹿毛 | 21 | 2 | パワームーブ | トゥザワールド | デヒア | 56.0 | 佐々志 | 岩手 | NULL | NULL | 千代田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:37.000Z | 2025-11-16T10:50:37.000Z |
| 202511160931 | 4 | 4 | ボルドーグリフォン | 牝5 | 黒鹿毛 | 20 | 2 | ボルドーグリフォン | エイシンヒカリ | Street Cry | 54.0 | 岩本怜 | 岩手 | NULL | NULL | 栄進牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:37.000Z | 2025-11-16T10:50:37.000Z |
| 202511160931 | 5 | 5 | ハーイ | 牝8 | 栗毛 | 17 | 4 | ハーイ | スズカコーズウェイ | サンデーサイレンス | 54.0 | 山本政 | 岩手 | NULL | NULL | グランド牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:37.000Z | 2025-11-16T10:50:37.000Z |
| 202511160931 | 5 | 6 | ロコルルハーツ | 牡5 | 黒鹿毛 | 20 | 4 | ロコルルハーツ | ハーツクライ | デヒア | 56.0 | 高橋悠 | 岩手 | NULL | NULL | 千代田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:37.000Z | 2025-11-16T10:50:37.000Z |
| 202511160931 | 6 | 7 | ジュレヴァー | 牝4 | 黒鹿毛 | 21 | 4 | ジュレヴァー | タリスマニック | ジャングルポケット | 54.0 | 高松亮 | 岩手 | NULL | NULL | 坂戸節子 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:37.000Z | 2025-11-16T10:50:37.000Z |
| 202511160931 | 6 | 8 | ハウファアイルゴー | 牝6 | 栗毛 | 19 | 3 | ハウファアイルゴー | トーセンジョーダン | Danehill Dancer | 54.0 | 山本紀 | 岩手 | NULL | NULL | 岡田スタツド | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:37.000Z | 2025-11-16T10:50:37.000Z |
| 202511160931 | 7 | 9 | ヒロシゲウェーブ | NULL | NULL | 0 | 0 | ヒロシゲウェーブ | ダイワメジャー | Giant's Causeway | NULL | 塚本涼 | 岩手 | NULL | NULL | 高橋義浩 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:37.000Z | 2025-11-16T10:50:37.000Z |
| 202511160931 | 7 | 10 | アルシャンティ | 牝3 | 鹿毛 | 22 | 5 | アルシャンティ | バゴ | ディープインパクト | 54.0 | 山本聡 | 岩手 | NULL | NULL | 辻牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:37.000Z | 2025-11-16T10:50:37.000Z |
| 202511160931 | 8 | 11 | エーデルムート | 牝3 | 青鹿毛 | 22 | 4 | エーデルムート | ショコラミーティア | マジェスティックウォリアー | 54.0 | 阿部英 | 岩手 | NULL | NULL | 新井弘幸 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:37.000Z | 2025-11-16T10:50:37.000Z |
| 202511160931 | 8 | 12 | オラフ | 牡6 | 芦毛 | 19 | 4 | オラフ | ダンカーク | フォーティナイナーズサン | 56.0 | 鈴木祐 | 岩手 | NULL | NULL | 丸村村下ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:37.000Z | 2025-11-16T10:50:37.000Z |
| 202511160932 | 1 | 1 | エースレイジング | 牡8 | 黒鹿毛 | 17 | 3 | エースレイジング | ゴールドアリュール | キングカメハメハ | 56.0 | 村上忍 | 岩手 | NULL | NULL | チャンピオンズファー | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:27.000Z | 2025-11-16T10:52:27.000Z |
| 202511160932 | 2 | 2 | レースラヴェンダー | 牝5 | 鹿毛 | 20 | 4 | レースラヴェンダー | サトノクラウン | キングカメハメハ | 54.0 | 大坪慎 | 岩手 | NULL | NULL | 岡田スタツド | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:27.000Z | 2025-11-16T10:52:27.000Z |
| 202511160932 | 3 | 3 | パワームーブ | 牡4 | 青鹿毛 | 21 | 2 | パワームーブ | トゥザワールド | デヒア | 56.0 | 佐々志 | 岩手 | NULL | NULL | 千代田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:27.000Z | 2025-11-16T10:52:27.000Z |
| 202511160932 | 4 | 4 | ボルドーグリフォン | 牝5 | 黒鹿毛 | 20 | 2 | ボルドーグリフォン | エイシンヒカリ | Street Cry | 54.0 | 岩本怜 | 岩手 | NULL | NULL | 栄進牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:27.000Z | 2025-11-16T10:52:27.000Z |
| 202511160932 | 5 | 5 | ハーイ | 牝8 | 栗毛 | 17 | 4 | ハーイ | スズカコーズウェイ | サンデーサイレンス | 54.0 | 山本政 | 岩手 | NULL | NULL | グランド牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:27.000Z | 2025-11-16T10:52:27.000Z |
| 202511160932 | 5 | 6 | ロコルルハーツ | 牡5 | 黒鹿毛 | 20 | 4 | ロコルルハーツ | ハーツクライ | デヒア | 56.0 | 高橋悠 | 岩手 | NULL | NULL | 千代田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:27.000Z | 2025-11-16T10:52:27.000Z |
| 202511160932 | 6 | 7 | ジュレヴァー | 牝4 | 黒鹿毛 | 21 | 4 | ジュレヴァー | タリスマニック | ジャングルポケット | 54.0 | 高松亮 | 岩手 | NULL | NULL | 坂戸節子 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:27.000Z | 2025-11-16T10:52:27.000Z |
| 202511160932 | 6 | 8 | ハウファアイルゴー | 牝6 | 栗毛 | 19 | 3 | ハウファアイルゴー | トーセンジョーダン | Danehill Dancer | 54.0 | 山本紀 | 岩手 | NULL | NULL | 岡田スタツド | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:27.000Z | 2025-11-16T10:52:27.000Z |
| 202511160932 | 7 | 9 | ヒロシゲウェーブ | NULL | NULL | 0 | 0 | ヒロシゲウェーブ | ダイワメジャー | Giant's Causeway | NULL | 塚本涼 | 岩手 | NULL | NULL | 高橋義浩 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:27.000Z | 2025-11-16T10:52:27.000Z |
| 202511160932 | 7 | 10 | アルシャンティ | 牝3 | 鹿毛 | 22 | 5 | アルシャンティ | バゴ | ディープインパクト | 54.0 | 山本聡 | 岩手 | NULL | NULL | 辻牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:27.000Z | 2025-11-16T10:52:27.000Z |
| 202511160932 | 8 | 11 | エーデルムート | 牝3 | 青鹿毛 | 22 | 4 | エーデルムート | ショコラミーティア | マジェスティックウォリアー | 54.0 | 阿部英 | 岩手 | NULL | NULL | 新井弘幸 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:27.000Z | 2025-11-16T10:52:27.000Z |
| 202511160932 | 8 | 12 | オラフ | 牡6 | 芦毛 | 19 | 4 | オラフ | ダンカーク | フォーティナイナーズサン | 56.0 | 鈴木祐 | 岩手 | NULL | NULL | 丸村村下ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:27.000Z | 2025-11-16T10:52:27.000Z |
| 202511161010 | 1 | 1 | スカーレットクロス | 牝3 | 黒鹿毛 | 22 | 3 | スカーレットクロス | マジェスティックウォリアー | ホワイトマズル | 54.0 | 岩本怜 | 岩手 | NULL | NULL | シンユウフアーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:29.000Z | 2025-11-16T10:47:29.000Z |
| 202511161010 | 2 | 2 | インカノメザメ | 牝3 | 黒鹿毛 | 22 | 4 | インカノメザメ | カレンブラックヒル | Fusaichi Pegasus | 54.0 | 小林凌 | 岩手 | NULL | NULL | 合同会社小泉学 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:29.000Z | 2025-11-16T10:47:29.000Z |
| 202511161010 | 3 | 3 | ビービーアクティブ | 牡7 | 鹿毛 | 18 | 4 | ビービーアクティブ | スピルバーグ | キングカメハメハ | 56.0 | 鈴木祐 | 岩手 | NULL | NULL | 坂東牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:29.000Z | 2025-11-16T10:47:29.000Z |
| 202511161010 | 4 | 4 | ホウオウエーデル | 牡9 | 鹿毛 | 16 | 4 | ホウオウエーデル | ジャスタウェイ | ジェネラス | 56.0 | 塚本涼 | 岩手 | NULL | NULL | 岡田スタツド | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:29.000Z | 2025-11-16T10:47:29.000Z |
| 202511161010 | 5 | 5 | エスカルチャ | 牡4 | 鹿毛 | 21 | 5 | エスカルチャ | ファインニードル | Red Ransom | 56.0 | 山本紀 | 岩手 | NULL | NULL | ダーレー・ジャパン・ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:29.000Z | 2025-11-16T10:47:29.000Z |
| 202511161010 | 6 | 6 | ロッキータイタン | 牡5 | 栗毛 | 20 | 2 | ロッキータイタン | ナムラタイタン | タイムパラドックス | 56.0 | 高松亮 | 岩手 | NULL | NULL | びらとり牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:29.000Z | 2025-11-16T10:47:29.000Z |
| 202511161010 | 6 | 7 | ビッグリュウオー | NULL | NULL | 0 | 0 | ビッグリュウオー | ビッグアーサー | シンボリクリスエス | NULL | 山本政 | 岩手 | NULL | NULL | 千代田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:29.000Z | 2025-11-16T10:47:29.000Z |
| 202511161010 | 7 | 8 | タイキモンストル | NULL | NULL | 0 | 0 | タイキモンストル | ラニ | クロフネ | NULL | 村上忍 | 岩手 | NULL | NULL | 有限会社ビクトリーホ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:29.000Z | 2025-11-16T10:47:29.000Z |
| 202511161010 | 7 | 9 | チェンジオブハート | 牡3 | 鹿毛 | 22 | 2 | チェンジオブハート | ハービンジャー | ハーツクライ | 56.0 | 高橋悠 | 岩手 | NULL | NULL | ダーレー・ジャパン・ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:29.000Z | 2025-11-16T10:47:29.000Z |
| 202511161010 | 8 | 10 | エイシンデュエラー | 牡6 | 鹿毛 | 19 | 4 | エイシンデュエラー | ドゥラメンテ | Pulpit | 56.0 | 佐々志 | 岩手 | NULL | NULL | 栄進牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:29.000Z | 2025-11-16T10:47:29.000Z |
| 202511161010 | 8 | 11 | リリーピンシャー | 牡4 | 鹿毛 | 21 | 4 | リリーピンシャー | アリデッド | ダンスインザダーク | 56.0 | 阿部英 | 岩手 | NULL | NULL | 杵臼牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:29.000Z | 2025-11-16T10:47:29.000Z |
| 202511161022 | 1 | 1 | スカーレットクロス | 牝3 | 黒鹿毛 | 22 | 3 | スカーレットクロス | マジェスティックウォリアー | ホワイトマズル | 54.0 | 岩本怜 | 岩手 | NULL | NULL | シンユウフアーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:11.000Z | 2025-11-16T10:49:11.000Z |
| 202511161022 | 2 | 2 | インカノメザメ | 牝3 | 黒鹿毛 | 22 | 4 | インカノメザメ | カレンブラックヒル | Fusaichi Pegasus | 54.0 | 小林凌 | 岩手 | NULL | NULL | 合同会社小泉学 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:11.000Z | 2025-11-16T10:49:11.000Z |
| 202511161022 | 3 | 3 | ビービーアクティブ | 牡7 | 鹿毛 | 18 | 4 | ビービーアクティブ | スピルバーグ | キングカメハメハ | 56.0 | 鈴木祐 | 岩手 | NULL | NULL | 坂東牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:11.000Z | 2025-11-16T10:49:11.000Z |
| 202511161022 | 4 | 4 | ホウオウエーデル | 牡9 | 鹿毛 | 16 | 4 | ホウオウエーデル | ジャスタウェイ | ジェネラス | 56.0 | 塚本涼 | 岩手 | NULL | NULL | 岡田スタツド | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:11.000Z | 2025-11-16T10:49:11.000Z |
| 202511161022 | 5 | 5 | エスカルチャ | 牡4 | 鹿毛 | 21 | 5 | エスカルチャ | ファインニードル | Red Ransom | 56.0 | 山本紀 | 岩手 | NULL | NULL | ダーレー・ジャパン・ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:11.000Z | 2025-11-16T10:49:11.000Z |
| 202511161022 | 6 | 6 | ロッキータイタン | 牡5 | 栗毛 | 20 | 2 | ロッキータイタン | ナムラタイタン | タイムパラドックス | 56.0 | 高松亮 | 岩手 | NULL | NULL | びらとり牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:11.000Z | 2025-11-16T10:49:11.000Z |
| 202511161022 | 6 | 7 | ビッグリュウオー | NULL | NULL | 0 | 0 | ビッグリュウオー | ビッグアーサー | シンボリクリスエス | NULL | 山本政 | 岩手 | NULL | NULL | 千代田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:11.000Z | 2025-11-16T10:49:11.000Z |
| 202511161022 | 7 | 8 | タイキモンストル | NULL | NULL | 0 | 0 | タイキモンストル | ラニ | クロフネ | NULL | 村上忍 | 岩手 | NULL | NULL | 有限会社ビクトリーホ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:11.000Z | 2025-11-16T10:49:11.000Z |
| 202511161022 | 7 | 9 | チェンジオブハート | 牡3 | 鹿毛 | 22 | 2 | チェンジオブハート | ハービンジャー | ハーツクライ | 56.0 | 高橋悠 | 岩手 | NULL | NULL | ダーレー・ジャパン・ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:11.000Z | 2025-11-16T10:49:11.000Z |
| 202511161022 | 8 | 10 | エイシンデュエラー | 牡6 | 鹿毛 | 19 | 4 | エイシンデュエラー | ドゥラメンテ | Pulpit | 56.0 | 佐々志 | 岩手 | NULL | NULL | 栄進牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:11.000Z | 2025-11-16T10:49:11.000Z |
| 202511161022 | 8 | 11 | リリーピンシャー | 牡4 | 鹿毛 | 21 | 4 | リリーピンシャー | アリデッド | ダンスインザダーク | 56.0 | 阿部英 | 岩手 | NULL | NULL | 杵臼牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:49:11.000Z | 2025-11-16T10:49:11.000Z |
| 202511161031 | 1 | 1 | スカーレットクロス | 牝3 | 黒鹿毛 | 22 | 3 | スカーレットクロス | マジェスティックウォリアー | ホワイトマズル | 54.0 | 岩本怜 | 岩手 | NULL | NULL | シンユウフアーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:37.000Z | 2025-11-16T10:50:37.000Z |
| 202511161031 | 2 | 2 | インカノメザメ | 牝3 | 黒鹿毛 | 22 | 4 | インカノメザメ | カレンブラックヒル | Fusaichi Pegasus | 54.0 | 小林凌 | 岩手 | NULL | NULL | 合同会社小泉学 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:37.000Z | 2025-11-16T10:50:37.000Z |
| 202511161031 | 3 | 3 | ビービーアクティブ | 牡7 | 鹿毛 | 18 | 4 | ビービーアクティブ | スピルバーグ | キングカメハメハ | 56.0 | 鈴木祐 | 岩手 | NULL | NULL | 坂東牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:37.000Z | 2025-11-16T10:50:37.000Z |
| 202511161031 | 4 | 4 | ホウオウエーデル | 牡9 | 鹿毛 | 16 | 4 | ホウオウエーデル | ジャスタウェイ | ジェネラス | 56.0 | 塚本涼 | 岩手 | NULL | NULL | 岡田スタツド | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:37.000Z | 2025-11-16T10:50:37.000Z |
| 202511161031 | 5 | 5 | エスカルチャ | 牡4 | 鹿毛 | 21 | 5 | エスカルチャ | ファインニードル | Red Ransom | 56.0 | 山本紀 | 岩手 | NULL | NULL | ダーレー・ジャパン・ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:37.000Z | 2025-11-16T10:50:37.000Z |
| 202511161031 | 6 | 6 | ロッキータイタン | 牡5 | 栗毛 | 20 | 2 | ロッキータイタン | ナムラタイタン | タイムパラドックス | 56.0 | 高松亮 | 岩手 | NULL | NULL | びらとり牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:37.000Z | 2025-11-16T10:50:37.000Z |
| 202511161031 | 6 | 7 | ビッグリュウオー | NULL | NULL | 0 | 0 | ビッグリュウオー | ビッグアーサー | シンボリクリスエス | NULL | 山本政 | 岩手 | NULL | NULL | 千代田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:37.000Z | 2025-11-16T10:50:37.000Z |
| 202511161031 | 7 | 8 | タイキモンストル | NULL | NULL | 0 | 0 | タイキモンストル | ラニ | クロフネ | NULL | 村上忍 | 岩手 | NULL | NULL | 有限会社ビクトリーホ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:37.000Z | 2025-11-16T10:50:37.000Z |
| 202511161031 | 7 | 9 | チェンジオブハート | 牡3 | 鹿毛 | 22 | 2 | チェンジオブハート | ハービンジャー | ハーツクライ | 56.0 | 高橋悠 | 岩手 | NULL | NULL | ダーレー・ジャパン・ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:37.000Z | 2025-11-16T10:50:37.000Z |
| 202511161031 | 8 | 10 | エイシンデュエラー | 牡6 | 鹿毛 | 19 | 4 | エイシンデュエラー | ドゥラメンテ | Pulpit | 56.0 | 佐々志 | 岩手 | NULL | NULL | 栄進牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:37.000Z | 2025-11-16T10:50:37.000Z |
| 202511161031 | 8 | 11 | リリーピンシャー | 牡4 | 鹿毛 | 21 | 4 | リリーピンシャー | アリデッド | ダンスインザダーク | 56.0 | 阿部英 | 岩手 | NULL | NULL | 杵臼牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:37.000Z | 2025-11-16T10:50:37.000Z |
| 202511161032 | 1 | 1 | スカーレットクロス | 牝3 | 黒鹿毛 | 22 | 3 | スカーレットクロス | マジェスティックウォリアー | ホワイトマズル | 54.0 | 岩本怜 | 岩手 | NULL | NULL | シンユウフアーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:27.000Z | 2025-11-16T10:52:27.000Z |
| 202511161032 | 2 | 2 | インカノメザメ | 牝3 | 黒鹿毛 | 22 | 4 | インカノメザメ | カレンブラックヒル | Fusaichi Pegasus | 54.0 | 小林凌 | 岩手 | NULL | NULL | 合同会社小泉学 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:27.000Z | 2025-11-16T10:52:27.000Z |
| 202511161032 | 3 | 3 | ビービーアクティブ | 牡7 | 鹿毛 | 18 | 4 | ビービーアクティブ | スピルバーグ | キングカメハメハ | 56.0 | 鈴木祐 | 岩手 | NULL | NULL | 坂東牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:27.000Z | 2025-11-16T10:52:27.000Z |
| 202511161032 | 4 | 4 | ホウオウエーデル | 牡9 | 鹿毛 | 16 | 4 | ホウオウエーデル | ジャスタウェイ | ジェネラス | 56.0 | 塚本涼 | 岩手 | NULL | NULL | 岡田スタツド | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:27.000Z | 2025-11-16T10:52:27.000Z |
| 202511161032 | 5 | 5 | エスカルチャ | 牡4 | 鹿毛 | 21 | 5 | エスカルチャ | ファインニードル | Red Ransom | 56.0 | 山本紀 | 岩手 | NULL | NULL | ダーレー・ジャパン・ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:27.000Z | 2025-11-16T10:52:27.000Z |
| 202511161032 | 6 | 6 | ロッキータイタン | 牡5 | 栗毛 | 20 | 2 | ロッキータイタン | ナムラタイタン | タイムパラドックス | 56.0 | 高松亮 | 岩手 | NULL | NULL | びらとり牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:27.000Z | 2025-11-16T10:52:27.000Z |
| 202511161032 | 6 | 7 | ビッグリュウオー | NULL | NULL | 0 | 0 | ビッグリュウオー | ビッグアーサー | シンボリクリスエス | NULL | 山本政 | 岩手 | NULL | NULL | 千代田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:27.000Z | 2025-11-16T10:52:27.000Z |
| 202511161032 | 7 | 8 | タイキモンストル | NULL | NULL | 0 | 0 | タイキモンストル | ラニ | クロフネ | NULL | 村上忍 | 岩手 | NULL | NULL | 有限会社ビクトリーホ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:27.000Z | 2025-11-16T10:52:27.000Z |
| 202511161032 | 7 | 9 | チェンジオブハート | 牡3 | 鹿毛 | 22 | 2 | チェンジオブハート | ハービンジャー | ハーツクライ | 56.0 | 高橋悠 | 岩手 | NULL | NULL | ダーレー・ジャパン・ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:27.000Z | 2025-11-16T10:52:27.000Z |
| 202511161032 | 8 | 10 | エイシンデュエラー | 牡6 | 鹿毛 | 19 | 4 | エイシンデュエラー | ドゥラメンテ | Pulpit | 56.0 | 佐々志 | 岩手 | NULL | NULL | 栄進牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:27.000Z | 2025-11-16T10:52:27.000Z |
| 202511161032 | 8 | 11 | リリーピンシャー | 牡4 | 鹿毛 | 21 | 4 | リリーピンシャー | アリデッド | ダンスインザダーク | 56.0 | 阿部英 | 岩手 | NULL | NULL | 杵臼牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:27.000Z | 2025-11-16T10:52:27.000Z |
| 202511161110 | 1 | 1 | ロードオブザチェコ | 牡7 | 栗毛 | 18 | 4 | ロードオブザチェコ | ストロングリターン | スターリングローズ | 57.0 | 山本政 | 岩手 | NULL | NULL | 織田正敏 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:45.000Z | 2025-11-16T10:47:45.000Z |
| 202511161110 | 2 | 2 | ウラヤ | 牡6 | 栗毛 | 19 | 3 | ウラヤ | New Approach | Pyro | 57.0 | 山本聡 | 岩手 | NULL | NULL | Ｇｏｄｏｌｐｈｉｎ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:45.000Z | 2025-11-16T10:47:45.000Z |
| 202511161110 | 3 | 3 | スプラウティング | NULL | NULL | 0 | 0 | スプラウティング | ダイワメジャー | Seeking the Gold | NULL | 塚本涼 | 岩手 | NULL | NULL | ダーレー・ジャパン・ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:45.000Z | 2025-11-16T10:47:45.000Z |
| 202511161110 | 4 | 4 | ブリスタイム | NULL | NULL | 0 | 0 | ブリスタイム | コパノリッキー | ブライアンズタイム | NULL | 高橋悠 | 岩手 | NULL | NULL | 上水牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:45.000Z | 2025-11-16T10:47:45.000Z |
| 202511161110 | 5 | 5 | レディブラウン | 牝7 | 青鹿毛 | 18 | 5 | レディブラウン | フリオーソ | リンドシェーバー | 55.0 | 鈴木祐 | 岩手 | NULL | NULL | 風ノ丘ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:45.000Z | 2025-11-16T10:47:45.000Z |
| 202511161110 | 5 | 6 | オスカーブレイン | 牡4 | 黒鹿毛 | 21 | 4 | オスカーブレイン | ダノンレジェンド | シニスターミニスター | 57.0 | 菅原辰 | 岩手 | NULL | NULL | 中村雅明 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:45.000Z | 2025-11-16T10:47:45.000Z |
| 202511161110 | 6 | 7 | アップテンペスト | 牝6 | 栗毛 | 19 | 3 | アップテンペスト | エスポワールシチー | Singspiel | 55.0 | 阿部英 | 岩手 | NULL | NULL | 小倉光博 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:45.000Z | 2025-11-16T10:47:45.000Z |
| 202511161110 | 6 | 8 | エイシントルペード | 牡4 | 芦毛 | 21 | 2 | エイシントルペード | エイシンヒカリ | キンシャサノキセキ | 57.0 | 山本紀 | 岩手 | NULL | NULL | 栄進牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:45.000Z | 2025-11-16T10:47:45.000Z |
| 202511161110 | 7 | 9 | グットフォーチュン | 牝6 | 鹿毛 | 19 | 4 | グットフォーチュン | マジェスティックウォリアー | コマンダーインチーフ | 55.0 | 小林凌 | 岩手 | NULL | NULL | 静内フジカワ牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:45.000Z | 2025-11-16T10:47:45.000Z |
| 202511161110 | 7 | 10 | スターシューター | 牡7 | 青鹿毛 | 18 | 4 | スターシューター | トビーズコーナー | フジキセキ | 57.0 | 高松亮 | 岩手 | NULL | NULL | 上山牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:45.000Z | 2025-11-16T10:47:45.000Z |
| 202511161110 | 8 | 11 | ファイナルキング | 牡7 | 栗毛 | 18 | 4 | ファイナルキング | サウスヴィグラス | ゴールドアリュール | 57.0 | 岩本怜 | 岩手 | NULL | NULL | カタオカステーブル | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:45.000Z | 2025-11-16T10:47:45.000Z |
| 202511161110 | 8 | 12 | グアドループ | 牡7 | 栗毛 | 18 | 2 | グアドループ | ヴィクトワールピサ | Aldebaran | 57.0 | 佐々志 | 岩手 | NULL | NULL | ノーザンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:45.000Z | 2025-11-16T10:47:45.000Z |
| 202511161131 | 1 | 1 | ロードオブザチェコ | 牡7 | 栗毛 | 18 | 4 | ロードオブザチェコ | ストロングリターン | スターリングローズ | 57.0 | 山本政 | 岩手 | NULL | NULL | 織田正敏 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:54.000Z | 2025-11-16T10:50:54.000Z |
| 202511161131 | 2 | 2 | ウラヤ | 牡6 | 栗毛 | 19 | 3 | ウラヤ | New Approach | Pyro | 57.0 | 山本聡 | 岩手 | NULL | NULL | Ｇｏｄｏｌｐｈｉｎ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:54.000Z | 2025-11-16T10:50:54.000Z |
| 202511161131 | 3 | 3 | スプラウティング | NULL | NULL | 0 | 0 | スプラウティング | ダイワメジャー | Seeking the Gold | NULL | 塚本涼 | 岩手 | NULL | NULL | ダーレー・ジャパン・ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:54.000Z | 2025-11-16T10:50:54.000Z |
| 202511161131 | 4 | 4 | ブリスタイム | NULL | NULL | 0 | 0 | ブリスタイム | コパノリッキー | ブライアンズタイム | NULL | 高橋悠 | 岩手 | NULL | NULL | 上水牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:54.000Z | 2025-11-16T10:50:54.000Z |
| 202511161131 | 5 | 5 | レディブラウン | 牝7 | 青鹿毛 | 18 | 5 | レディブラウン | フリオーソ | リンドシェーバー | 55.0 | 鈴木祐 | 岩手 | NULL | NULL | 風ノ丘ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:54.000Z | 2025-11-16T10:50:54.000Z |
| 202511161131 | 5 | 6 | オスカーブレイン | 牡4 | 黒鹿毛 | 21 | 4 | オスカーブレイン | ダノンレジェンド | シニスターミニスター | 57.0 | 菅原辰 | 岩手 | NULL | NULL | 中村雅明 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:54.000Z | 2025-11-16T10:50:54.000Z |
| 202511161131 | 6 | 7 | アップテンペスト | 牝6 | 栗毛 | 19 | 3 | アップテンペスト | エスポワールシチー | Singspiel | 55.0 | 阿部英 | 岩手 | NULL | NULL | 小倉光博 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:54.000Z | 2025-11-16T10:50:54.000Z |
| 202511161131 | 6 | 8 | エイシントルペード | 牡4 | 芦毛 | 21 | 2 | エイシントルペード | エイシンヒカリ | キンシャサノキセキ | 57.0 | 山本紀 | 岩手 | NULL | NULL | 栄進牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:54.000Z | 2025-11-16T10:50:54.000Z |
| 202511161131 | 7 | 9 | グットフォーチュン | 牝6 | 鹿毛 | 19 | 4 | グットフォーチュン | マジェスティックウォリアー | コマンダーインチーフ | 55.0 | 小林凌 | 岩手 | NULL | NULL | 静内フジカワ牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:54.000Z | 2025-11-16T10:50:54.000Z |
| 202511161131 | 7 | 10 | スターシューター | 牡7 | 青鹿毛 | 18 | 4 | スターシューター | トビーズコーナー | フジキセキ | 57.0 | 高松亮 | 岩手 | NULL | NULL | 上山牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:54.000Z | 2025-11-16T10:50:54.000Z |
| 202511161131 | 8 | 11 | ファイナルキング | 牡7 | 栗毛 | 18 | 4 | ファイナルキング | サウスヴィグラス | ゴールドアリュール | 57.0 | 岩本怜 | 岩手 | NULL | NULL | カタオカステーブル | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:54.000Z | 2025-11-16T10:50:54.000Z |
| 202511161131 | 8 | 12 | グアドループ | 牡7 | 栗毛 | 18 | 2 | グアドループ | ヴィクトワールピサ | Aldebaran | 57.0 | 佐々志 | 岩手 | NULL | NULL | ノーザンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:54.000Z | 2025-11-16T10:50:54.000Z |
| 202511161132 | 1 | 1 | ロードオブザチェコ | 牡7 | 栗毛 | 18 | 4 | ロードオブザチェコ | ストロングリターン | スターリングローズ | 57.0 | 山本政 | 岩手 | NULL | NULL | 織田正敏 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:45.000Z | 2025-11-16T10:52:45.000Z |
| 202511161132 | 2 | 2 | ウラヤ | 牡6 | 栗毛 | 19 | 3 | ウラヤ | New Approach | Pyro | 57.0 | 山本聡 | 岩手 | NULL | NULL | Ｇｏｄｏｌｐｈｉｎ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:45.000Z | 2025-11-16T10:52:45.000Z |
| 202511161132 | 3 | 3 | スプラウティング | NULL | NULL | 0 | 0 | スプラウティング | ダイワメジャー | Seeking the Gold | NULL | 塚本涼 | 岩手 | NULL | NULL | ダーレー・ジャパン・ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:45.000Z | 2025-11-16T10:52:45.000Z |
| 202511161132 | 4 | 4 | ブリスタイム | NULL | NULL | 0 | 0 | ブリスタイム | コパノリッキー | ブライアンズタイム | NULL | 高橋悠 | 岩手 | NULL | NULL | 上水牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:45.000Z | 2025-11-16T10:52:45.000Z |
| 202511161132 | 5 | 5 | レディブラウン | 牝7 | 青鹿毛 | 18 | 5 | レディブラウン | フリオーソ | リンドシェーバー | 55.0 | 鈴木祐 | 岩手 | NULL | NULL | 風ノ丘ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:45.000Z | 2025-11-16T10:52:45.000Z |
| 202511161132 | 5 | 6 | オスカーブレイン | 牡4 | 黒鹿毛 | 21 | 4 | オスカーブレイン | ダノンレジェンド | シニスターミニスター | 57.0 | 菅原辰 | 岩手 | NULL | NULL | 中村雅明 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:45.000Z | 2025-11-16T10:52:45.000Z |
| 202511161132 | 6 | 7 | アップテンペスト | 牝6 | 栗毛 | 19 | 3 | アップテンペスト | エスポワールシチー | Singspiel | 55.0 | 阿部英 | 岩手 | NULL | NULL | 小倉光博 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:45.000Z | 2025-11-16T10:52:45.000Z |
| 202511161132 | 6 | 8 | エイシントルペード | 牡4 | 芦毛 | 21 | 2 | エイシントルペード | エイシンヒカリ | キンシャサノキセキ | 57.0 | 山本紀 | 岩手 | NULL | NULL | 栄進牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:45.000Z | 2025-11-16T10:52:45.000Z |
| 202511161132 | 7 | 9 | グットフォーチュン | 牝6 | 鹿毛 | 19 | 4 | グットフォーチュン | マジェスティックウォリアー | コマンダーインチーフ | 55.0 | 小林凌 | 岩手 | NULL | NULL | 静内フジカワ牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:45.000Z | 2025-11-16T10:52:45.000Z |
| 202511161132 | 7 | 10 | スターシューター | 牡7 | 青鹿毛 | 18 | 4 | スターシューター | トビーズコーナー | フジキセキ | 57.0 | 高松亮 | 岩手 | NULL | NULL | 上山牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:45.000Z | 2025-11-16T10:52:45.000Z |
| 202511161132 | 8 | 11 | ファイナルキング | 牡7 | 栗毛 | 18 | 4 | ファイナルキング | サウスヴィグラス | ゴールドアリュール | 57.0 | 岩本怜 | 岩手 | NULL | NULL | カタオカステーブル | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:45.000Z | 2025-11-16T10:52:45.000Z |
| 202511161132 | 8 | 12 | グアドループ | 牡7 | 栗毛 | 18 | 2 | グアドループ | ヴィクトワールピサ | Aldebaran | 57.0 | 佐々志 | 岩手 | NULL | NULL | ノーザンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:52:45.000Z | 2025-11-16T10:52:45.000Z |
| 202511161210 | 1 | 1 | マカベウス | 牡7 | 黒鹿毛 | 18 | 4 | マカベウス | ゼンノロブロイ | プリサイスエンド | 56.0 | 佐々志 | 岩手 | NULL | NULL | タイヘイ牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:46.000Z | 2025-11-16T10:47:46.000Z |
| 202511161210 | 2 | 2 | ミツカネトーラス | 牡4 | 鹿毛 | 21 | 3 | ミツカネトーラス | ラブリーデイ | ハービンジャー | 56.0 | 高橋悠 | 岩手 | NULL | NULL | 細川農場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:46.000Z | 2025-11-16T10:47:46.000Z |
| 202511161210 | 3 | 3 | タイガードラゴン | 牡4 | 鹿毛 | 21 | 3 | タイガードラゴン | ミュゼスルタン | ディープインパクト | 56.0 | 村上忍 | 岩手 | NULL | NULL | タツヤファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:46.000Z | 2025-11-16T10:47:46.000Z |
| 202511161210 | 4 | 4 | キタノクーヴェル | 牡5 | 黒鹿毛 | 20 | 4 | キタノクーヴェル | トーセンラー | エンパイアメーカー | 56.0 | 南郷家 | 岩手 | NULL | NULL | 富菜牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:46.000Z | 2025-11-16T10:47:46.000Z |
| 202511161210 | 5 | 5 | ヒナノツルツル | 牡3 | 栗毛 | 22 | 4 | ヒナノツルツル | キタサンミカヅキ | アグネスタキオン | 56.0 | 山本政 | 岩手 | NULL | NULL | レジェンドファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:46.000Z | 2025-11-16T10:47:46.000Z |
| 202511161210 | 6 | 6 | ユウユウスプレマン | NULL | NULL | 0 | 0 | ユウユウスプレマン | ヘンリーバローズ | Dubawi | NULL | 小林凌 | 岩手 | NULL | NULL | グランド牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:46.000Z | 2025-11-16T10:47:46.000Z |
| 202511161210 | 6 | 7 | ショウナンナスカ | 牡3 | 鹿毛 | 22 | 5 | ショウナンナスカ | リアルスティール | エンパイアメーカー | 56.0 | 山本聡 | 岩手 | NULL | NULL | 青藍牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:46.000Z | 2025-11-16T10:47:46.000Z |
| 202511161210 | 7 | 8 | モンサンイルベント | NULL | NULL | 0 | 0 | モンサンイルベント | キズナ | キンググローリアス | NULL | 菅原辰 | 岩手 | NULL | NULL | 川島牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:46.000Z | 2025-11-16T10:47:46.000Z |
| 202511161210 | 7 | 9 | トンヤイビーン | 牡3 | 栗毛 | 22 | 3 | トンヤイビーン | アニマルキングダム | ヘニーヒューズ | 56.0 | 高松亮 | 岩手 | NULL | NULL | 日本中央競馬会日高育 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:46.000Z | 2025-11-16T10:47:46.000Z |
| 202511161210 | 8 | 10 | ジェイルブレイク | 牡3 | 栗毛 | 22 | 4 | ジェイルブレイク | ディスクリートキャット | ダイワメジャー | 54.0 | 坂井瑛 | 岩手 | NULL | NULL | 原口牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:46.000Z | 2025-11-16T10:47:46.000Z |
| 202511161210 | 8 | 11 | ネイビス | 牡3 | 栗毛 | 22 | 4 | ネイビス | アポロケンタッキー | スターリングローズ | 56.0 | 岩本怜 | 岩手 | NULL | NULL | シンカンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:47:46.000Z | 2025-11-16T10:47:46.000Z |
| 202511161231 | 1 | 1 | マカベウス | 牡7 | 黒鹿毛 | 18 | 4 | マカベウス | ゼンノロブロイ | プリサイスエンド | 56.0 | 佐々志 | 岩手 | NULL | NULL | タイヘイ牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:54.000Z | 2025-11-16T10:50:54.000Z |
| 202511161231 | 2 | 2 | ミツカネトーラス | 牡4 | 鹿毛 | 21 | 3 | ミツカネトーラス | ラブリーデイ | ハービンジャー | 56.0 | 高橋悠 | 岩手 | NULL | NULL | 細川農場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:54.000Z | 2025-11-16T10:50:54.000Z |
| 202511161231 | 3 | 3 | タイガードラゴン | 牡4 | 鹿毛 | 21 | 3 | タイガードラゴン | ミュゼスルタン | ディープインパクト | 56.0 | 村上忍 | 岩手 | NULL | NULL | タツヤファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:54.000Z | 2025-11-16T10:50:54.000Z |
| 202511161231 | 4 | 4 | キタノクーヴェル | 牡5 | 黒鹿毛 | 20 | 4 | キタノクーヴェル | トーセンラー | エンパイアメーカー | 56.0 | 南郷家 | 岩手 | NULL | NULL | 富菜牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:54.000Z | 2025-11-16T10:50:54.000Z |
| 202511161231 | 5 | 5 | ヒナノツルツル | 牡3 | 栗毛 | 22 | 4 | ヒナノツルツル | キタサンミカヅキ | アグネスタキオン | 56.0 | 山本政 | 岩手 | NULL | NULL | レジェンドファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:54.000Z | 2025-11-16T10:50:54.000Z |
| 202511161231 | 6 | 6 | ユウユウスプレマン | NULL | NULL | 0 | 0 | ユウユウスプレマン | ヘンリーバローズ | Dubawi | NULL | 小林凌 | 岩手 | NULL | NULL | グランド牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:54.000Z | 2025-11-16T10:50:54.000Z |
| 202511161231 | 6 | 7 | ショウナンナスカ | 牡3 | 鹿毛 | 22 | 5 | ショウナンナスカ | リアルスティール | エンパイアメーカー | 56.0 | 山本聡 | 岩手 | NULL | NULL | 青藍牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:54.000Z | 2025-11-16T10:50:54.000Z |
| 202511161231 | 7 | 8 | モンサンイルベント | NULL | NULL | 0 | 0 | モンサンイルベント | キズナ | キンググローリアス | NULL | 菅原辰 | 岩手 | NULL | NULL | 川島牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:54.000Z | 2025-11-16T10:50:54.000Z |
| 202511161231 | 7 | 9 | トンヤイビーン | 牡3 | 栗毛 | 22 | 3 | トンヤイビーン | アニマルキングダム | ヘニーヒューズ | 56.0 | 高松亮 | 岩手 | NULL | NULL | 日本中央競馬会日高育 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:54.000Z | 2025-11-16T10:50:54.000Z |
| 202511161231 | 8 | 10 | ジェイルブレイク | 牡3 | 栗毛 | 22 | 4 | ジェイルブレイク | ディスクリートキャット | ダイワメジャー | 54.0 | 坂井瑛 | 岩手 | NULL | NULL | 原口牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:54.000Z | 2025-11-16T10:50:54.000Z |
| 202511161231 | 8 | 11 | ネイビス | 牡3 | 栗毛 | 22 | 4 | ネイビス | アポロケンタッキー | スターリングローズ | 56.0 | 岩本怜 | 岩手 | NULL | NULL | シンカンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-11-16T10:50:54.000Z | 2025-11-16T10:50:54.000Z |
| 202512200131 | 1 | 1 | ラッキートリガー | 牝2 | 栗毛 | 23 | 3 | ラッキートリガー | アポロケンタッキー | Ghostzapper | 55.0 | 多田誠 | 高知 | NULL | NULL | 藤沢牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:56:57.000Z | 2025-12-20T06:56:57.000Z |
| 202512200131 | 2 | 2 | タスクディライト | 牝2 | 鹿毛 | 23 | 4 | タスクディライト | アポロケンタッキー | キングカメハメハ | 54.0 | 城野慈 | 高知 | NULL | NULL | 秋田育成牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:56:57.000Z | 2025-12-20T06:56:57.000Z |
| 202512200131 | 3 | 3 | レディアエラ | 牝2 | 黒鹿毛 | 23 | 4 | レディアエラ | コパノリッキー | Smoke Glacken | 55.0 | 佐原秀 | 高知 | NULL | NULL | 北島牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:56:57.000Z | 2025-12-20T06:56:57.000Z |
| 202512200131 | 4 | 4 | チュラリヴァル | 牡2 | 芦毛 | 23 | 4 | チュラリヴァル | ダンカーク | キャプテンスティーヴ | 54.0 | 近藤翔 | 高知 | NULL | NULL | 株式会社ニシケン牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:56:57.000Z | 2025-12-20T06:56:57.000Z |
| 202512200131 | 5 | 5 | テンサラ | NULL | NULL | 0 | 0 | テンサラ | フリオーソ | トランセンド | NULL | 岡村卓 | 高知 | NULL | NULL | 荒谷輝和 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:56:57.000Z | 2025-12-20T06:56:57.000Z |
| 202512200131 | 6 | 6 | コスモラパウィラ | 牡2 | 鹿毛 | 23 | 2 | コスモラパウィラ | フォーウィールドライブ | エイシンフラッシュ | 56.0 | 岩橋勇 | 高知 | NULL | NULL | 中本牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:56:57.000Z | 2025-12-20T06:56:57.000Z |
| 202512200131 | 7 | 7 | シーザソング | 牡2 | 黒鹿毛 | 23 | 3 | シーザソング | サートゥルナーリア | ディープインパクト | 56.0 | 郷間勇 | 高知 | NULL | NULL | いとう牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:56:57.000Z | 2025-12-20T06:56:57.000Z |
| 202512200131 | 8 | 8 | カンタベリービーム | 牡2 | 鹿毛 | 23 | 4 | カンタベリービーム | エポカドーロ | マイネルセレクト | 56.0 | 永森大 | 高知 | NULL | NULL | 前川義則 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:56:57.000Z | 2025-12-20T06:56:57.000Z |
| 202512200131 | 8 | 9 | ランギロア | 牡2 | 栗毛 | 23 | 3 | ランギロア | ミスチヴィアスアレックス | フリオーソ | 56.0 | 宮川実 | 高知 | NULL | NULL | 宮内牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:56:57.000Z | 2025-12-20T06:56:57.000Z |
| 202512200132 | 1 | 1 | ラッキートリガー | 牝2 | 栗毛 | 23 | 3 | ラッキートリガー | アポロケンタッキー | Ghostzapper | 55.0 | 多田誠 | 高知 | NULL | NULL | 藤沢牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:39.000Z | 2025-12-20T06:58:39.000Z |
| 202512200132 | 2 | 2 | タスクディライト | 牝2 | 鹿毛 | 23 | 4 | タスクディライト | アポロケンタッキー | キングカメハメハ | 54.0 | 城野慈 | 高知 | NULL | NULL | 秋田育成牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:39.000Z | 2025-12-20T06:58:39.000Z |
| 202512200132 | 3 | 3 | レディアエラ | 牝2 | 黒鹿毛 | 23 | 4 | レディアエラ | コパノリッキー | Smoke Glacken | 55.0 | 佐原秀 | 高知 | NULL | NULL | 北島牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:39.000Z | 2025-12-20T06:58:39.000Z |
| 202512200132 | 4 | 4 | チュラリヴァル | 牡2 | 芦毛 | 23 | 4 | チュラリヴァル | ダンカーク | キャプテンスティーヴ | 54.0 | 近藤翔 | 高知 | NULL | NULL | 株式会社ニシケン牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:39.000Z | 2025-12-20T06:58:39.000Z |
| 202512200132 | 5 | 5 | テンサラ | NULL | NULL | 0 | 0 | テンサラ | フリオーソ | トランセンド | NULL | 岡村卓 | 高知 | NULL | NULL | 荒谷輝和 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:39.000Z | 2025-12-20T06:58:39.000Z |
| 202512200132 | 6 | 6 | コスモラパウィラ | 牡2 | 鹿毛 | 23 | 2 | コスモラパウィラ | フォーウィールドライブ | エイシンフラッシュ | 56.0 | 岩橋勇 | 高知 | NULL | NULL | 中本牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:39.000Z | 2025-12-20T06:58:39.000Z |
| 202512200132 | 7 | 7 | シーザソング | 牡2 | 黒鹿毛 | 23 | 3 | シーザソング | サートゥルナーリア | ディープインパクト | 56.0 | 郷間勇 | 高知 | NULL | NULL | いとう牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:39.000Z | 2025-12-20T06:58:39.000Z |
| 202512200132 | 8 | 8 | カンタベリービーム | 牡2 | 鹿毛 | 23 | 4 | カンタベリービーム | エポカドーロ | マイネルセレクト | 56.0 | 永森大 | 高知 | NULL | NULL | 前川義則 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:39.000Z | 2025-12-20T06:58:39.000Z |
| 202512200132 | 8 | 9 | ランギロア | 牡2 | 栗毛 | 23 | 3 | ランギロア | ミスチヴィアスアレックス | フリオーソ | 56.0 | 宮川実 | 高知 | NULL | NULL | 宮内牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:39.000Z | 2025-12-20T06:58:39.000Z |
| 202512200231 | 1 | 1 | アピールパワー | 牡2 | 栗毛 | 23 | 3 | アピールパワー | ダンカーク | サクラバクシンオー | 54.0 | 近藤翔 | 高知 | NULL | NULL | 神垣道弘 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:56:57.000Z | 2025-12-20T06:56:57.000Z |
| 202512200231 | 2 | 2 | クレレガール | 牝2 | 鹿毛 | 23 | 3 | クレレガール | ヤングマンパワー | スターリングローズ | 55.0 | 畑中信 | 高知 | NULL | NULL | サンローゼン | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:56:57.000Z | 2025-12-20T06:56:57.000Z |
| 202512200231 | 3 | 3 | オリヴィオリヴィ | 牝2 | 黒鹿毛 | 23 | 5 | オリヴィオリヴィ | ミッキーグローリー | エンパイアメーカー | 55.0 | 西森将 | 高知 | NULL | NULL | 一珍棒牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:56:57.000Z | 2025-12-20T06:56:57.000Z |
| 202512200231 | 4 | 4 | リバージャスミン | 牝2 | 鹿毛 | 23 | 2 | リバージャスミン | サトノジェネシス | シンボリクリスエス | 55.0 | 永森大 | 高知 | NULL | NULL | クラウン日高牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:56:57.000Z | 2025-12-20T06:56:57.000Z |
| 202512200231 | 5 | 5 | カナデルラーケン | 牝2 | 鹿毛 | 23 | 5 | カナデルラーケン | ミスチヴィアスアレックス | エンパイアメーカー | 55.0 | 井上瑛 | 高知 | NULL | NULL | 稲原牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:56:57.000Z | 2025-12-20T06:56:57.000Z |
| 202512200231 | 6 | 6 | キンデアポチャン | 牝2 | 鹿毛 | 23 | 5 | キンデアポチャン | アポロケンタッキー | ロードカナロア | 55.0 | 木村直 | 高知 | NULL | NULL | ヤスナカファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:56:57.000Z | 2025-12-20T06:56:57.000Z |
| 202512200231 | 7 | 7 | スマートターキン | 牡2 | 鹿毛 | 23 | 5 | スマートターキン | スマートファルコン | オジジアン | 56.0 | 郷間勇 | 高知 | NULL | NULL | 南部功 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:56:57.000Z | 2025-12-20T06:56:57.000Z |
| 202512200231 | 7 | 8 | タマールカ | 牡2 | 芦毛 | 23 | 3 | タマールカ | スクリーンヒーロー | ジャングルポケット | 56.0 | 林謙佑 | 高知 | NULL | NULL | 山岡ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:56:57.000Z | 2025-12-20T06:56:57.000Z |
| 202512200231 | 8 | 9 | ホットロッドスター | 牡2 | 芦毛 | 23 | 4 | ホットロッドスター | フィレンツェファイア | クロフネ | 56.0 | 岡村卓 | 高知 | NULL | NULL | ９９．９ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:56:57.000Z | 2025-12-20T06:56:57.000Z |
| 202512200231 | 8 | 10 | ドクターバローズ | 牡2 | 栗毛 | 23 | 3 | ドクターバローズ | ロジャーバローズ | アグネスデジタル | 56.0 | 石本純 | 高知 | NULL | NULL | 神垣道弘 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:56:57.000Z | 2025-12-20T06:56:57.000Z |
| 202512200232 | 1 | 1 | アピールパワー | 牡2 | 栗毛 | 23 | 3 | アピールパワー | ダンカーク | サクラバクシンオー | 54.0 | 近藤翔 | 高知 | NULL | NULL | 神垣道弘 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:39.000Z | 2025-12-20T06:58:39.000Z |
| 202512200232 | 2 | 2 | クレレガール | 牝2 | 鹿毛 | 23 | 3 | クレレガール | ヤングマンパワー | スターリングローズ | 55.0 | 畑中信 | 高知 | NULL | NULL | サンローゼン | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:39.000Z | 2025-12-20T06:58:39.000Z |
| 202512200232 | 3 | 3 | オリヴィオリヴィ | 牝2 | 黒鹿毛 | 23 | 5 | オリヴィオリヴィ | ミッキーグローリー | エンパイアメーカー | 55.0 | 西森将 | 高知 | NULL | NULL | 一珍棒牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:39.000Z | 2025-12-20T06:58:39.000Z |
| 202512200232 | 4 | 4 | リバージャスミン | 牝2 | 鹿毛 | 23 | 2 | リバージャスミン | サトノジェネシス | シンボリクリスエス | 55.0 | 永森大 | 高知 | NULL | NULL | クラウン日高牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:39.000Z | 2025-12-20T06:58:39.000Z |
| 202512200232 | 5 | 5 | カナデルラーケン | 牝2 | 鹿毛 | 23 | 5 | カナデルラーケン | ミスチヴィアスアレックス | エンパイアメーカー | 55.0 | 井上瑛 | 高知 | NULL | NULL | 稲原牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:39.000Z | 2025-12-20T06:58:39.000Z |
| 202512200232 | 6 | 6 | キンデアポチャン | 牝2 | 鹿毛 | 23 | 5 | キンデアポチャン | アポロケンタッキー | ロードカナロア | 55.0 | 木村直 | 高知 | NULL | NULL | ヤスナカファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:39.000Z | 2025-12-20T06:58:39.000Z |
| 202512200232 | 7 | 7 | スマートターキン | 牡2 | 鹿毛 | 23 | 5 | スマートターキン | スマートファルコン | オジジアン | 56.0 | 郷間勇 | 高知 | NULL | NULL | 南部功 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:39.000Z | 2025-12-20T06:58:39.000Z |
| 202512200232 | 7 | 8 | タマールカ | 牡2 | 芦毛 | 23 | 3 | タマールカ | スクリーンヒーロー | ジャングルポケット | 56.0 | 林謙佑 | 高知 | NULL | NULL | 山岡ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:39.000Z | 2025-12-20T06:58:39.000Z |
| 202512200232 | 8 | 9 | ホットロッドスター | 牡2 | 芦毛 | 23 | 4 | ホットロッドスター | フィレンツェファイア | クロフネ | 56.0 | 岡村卓 | 高知 | NULL | NULL | ９９．９ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:39.000Z | 2025-12-20T06:58:39.000Z |
| 202512200232 | 8 | 10 | ドクターバローズ | 牡2 | 栗毛 | 23 | 3 | ドクターバローズ | ロジャーバローズ | アグネスデジタル | 56.0 | 石本純 | 高知 | NULL | NULL | 神垣道弘 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:39.000Z | 2025-12-20T06:58:39.000Z |
| 202512200331 | 1 | 1 | エスケーブラッド | 牡2 | 青鹿毛 | 23 | 2 | エスケーブラッド | ノヴェリスト | スクリーンヒーロー | 56.0 | 多田誠 | 高知 | NULL | NULL | ハクツ牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:14.000Z | 2025-12-20T06:57:14.000Z |
| 202512200331 | 2 | 2 | バリキング | 牡2 | 鹿毛 | 23 | 4 | バリキング | タリスマニック | ディスクリートキャット | 56.0 | 岩橋勇 | 高知 | NULL | NULL | 笹地牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:14.000Z | 2025-12-20T06:57:14.000Z |
| 202512200331 | 3 | 3 | アーユーリアル | 牝2 | 鹿毛 | 23 | 2 | アーユーリアル | モーニン | エンパイアメーカー | 55.0 | 上田将 | 高知 | NULL | NULL | 笹地牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:14.000Z | 2025-12-20T06:57:14.000Z |
| 202512200331 | 4 | 4 | ミアソレイユ | 牝2 | 鹿毛 | 23 | 3 | ミアソレイユ | ベーカバド | ファスリエフ | 55.0 | 佐原秀 | 高知 | NULL | NULL | サンローゼン | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:14.000Z | 2025-12-20T06:57:14.000Z |
| 202512200331 | 5 | 5 | ソレユケカツコ | 牝2 | 芦毛 | 23 | 3 | ソレユケカツコ | サトノアレス | スウェプトオーヴァーボード | 55.0 | 林謙佑 | 高知 | NULL | NULL | 発田文広 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:14.000Z | 2025-12-20T06:57:14.000Z |
| 202512200331 | 6 | 6 | マジックステラ | 牡2 | 栗毛 | 23 | 4 | マジックステラ | グレーターロンドン | トワイニング | 56.0 | 畑中信 | 高知 | NULL | NULL | 石田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:14.000Z | 2025-12-20T06:57:14.000Z |
| 202512200331 | 7 | 7 | メイジョウエナジー | 牝2 | 鹿毛 | 23 | 4 | メイジョウエナジー | マジェスティックウォリアー | ステイゴールド | 55.0 | 木村直 | 高知 | NULL | NULL | 滝本健二 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:14.000Z | 2025-12-20T06:57:14.000Z |
| 202512200331 | 7 | 8 | アカリボーイ | 牡2 | 栗毛 | 23 | 3 | アカリボーイ | コパノリッキー | ラムタラ | 56.0 | 郷間勇 | 高知 | NULL | NULL | 服部牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:14.000Z | 2025-12-20T06:57:14.000Z |
| 202512200331 | 8 | 9 | ルゼンチ | 牡2 | 黒鹿毛 | 23 | 4 | ルゼンチ | タリスマニック | ディープインパクト | 56.0 | 西森将 | 高知 | NULL | NULL | 神垣道弘 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:14.000Z | 2025-12-20T06:57:14.000Z |
| 202512200331 | 8 | 10 | オーシンミリオン | 牡2 | 栗毛 | 23 | 5 | オーシンミリオン | ベストウォーリア | キズナ | 56.0 | 岡遼太 | 高知 | NULL | NULL | 田中春美 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:14.000Z | 2025-12-20T06:57:14.000Z |
| 202512200332 | 1 | 1 | エスケーブラッド | 牡2 | 青鹿毛 | 23 | 2 | エスケーブラッド | ノヴェリスト | スクリーンヒーロー | 56.0 | 多田誠 | 高知 | NULL | NULL | ハクツ牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:55.000Z | 2025-12-20T06:58:55.000Z |
| 202512200332 | 2 | 2 | バリキング | 牡2 | 鹿毛 | 23 | 4 | バリキング | タリスマニック | ディスクリートキャット | 56.0 | 岩橋勇 | 高知 | NULL | NULL | 笹地牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:55.000Z | 2025-12-20T06:58:55.000Z |
| 202512200332 | 3 | 3 | アーユーリアル | 牝2 | 鹿毛 | 23 | 2 | アーユーリアル | モーニン | エンパイアメーカー | 55.0 | 上田将 | 高知 | NULL | NULL | 笹地牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:55.000Z | 2025-12-20T06:58:55.000Z |
| 202512200332 | 4 | 4 | ミアソレイユ | 牝2 | 鹿毛 | 23 | 3 | ミアソレイユ | ベーカバド | ファスリエフ | 55.0 | 佐原秀 | 高知 | NULL | NULL | サンローゼン | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:55.000Z | 2025-12-20T06:58:55.000Z |
| 202512200332 | 5 | 5 | ソレユケカツコ | 牝2 | 芦毛 | 23 | 3 | ソレユケカツコ | サトノアレス | スウェプトオーヴァーボード | 55.0 | 林謙佑 | 高知 | NULL | NULL | 発田文広 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:55.000Z | 2025-12-20T06:58:55.000Z |
| 202512200332 | 6 | 6 | マジックステラ | 牡2 | 栗毛 | 23 | 4 | マジックステラ | グレーターロンドン | トワイニング | 56.0 | 畑中信 | 高知 | NULL | NULL | 石田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:55.000Z | 2025-12-20T06:58:55.000Z |
| 202512200332 | 7 | 7 | メイジョウエナジー | 牝2 | 鹿毛 | 23 | 4 | メイジョウエナジー | マジェスティックウォリアー | ステイゴールド | 55.0 | 木村直 | 高知 | NULL | NULL | 滝本健二 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:55.000Z | 2025-12-20T06:58:55.000Z |
| 202512200332 | 7 | 8 | アカリボーイ | 牡2 | 栗毛 | 23 | 3 | アカリボーイ | コパノリッキー | ラムタラ | 56.0 | 郷間勇 | 高知 | NULL | NULL | 服部牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:55.000Z | 2025-12-20T06:58:55.000Z |
| 202512200332 | 8 | 9 | ルゼンチ | 牡2 | 黒鹿毛 | 23 | 4 | ルゼンチ | タリスマニック | ディープインパクト | 56.0 | 西森将 | 高知 | NULL | NULL | 神垣道弘 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:55.000Z | 2025-12-20T06:58:55.000Z |
| 202512200332 | 8 | 10 | オーシンミリオン | 牡2 | 栗毛 | 23 | 5 | オーシンミリオン | ベストウォーリア | キズナ | 56.0 | 岡遼太 | 高知 | NULL | NULL | 田中春美 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:55.000Z | 2025-12-20T06:58:55.000Z |
| 202512200431 | 1 | 1 | サツマノカゼ | NULL | NULL | 0 | 0 | サツマノカゼ | アレスバローズ | シニスターミニスター | NULL | 林謙佑 | 高知 | NULL | NULL | 上村利幸 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:14.000Z | 2025-12-20T06:57:14.000Z |
| 202512200431 | 2 | 2 | ディヴァージオン | 牝5 | 鹿毛 | 20 | 3 | ディヴァージオン | サトノダイヤモンド | Rock of Gibraltar | 55.0 | 岩橋勇 | 高知 | NULL | NULL | 猿倉牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:14.000Z | 2025-12-20T06:57:14.000Z |
| 202512200431 | 3 | 3 | エースオーディン | 牡3 | 黒鹿毛 | 22 | 4 | エースオーディン | フリオーソ | ゼンノロブロイ | 57.0 | 畑中信 | 高知 | NULL | NULL | 富塚ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:14.000Z | 2025-12-20T06:57:14.000Z |
| 202512200431 | 4 | 4 | ジーティーハッピー | 牡3 | 栗毛 | 22 | 4 | ジーティーハッピー | マインドユアビスケッツ | クロフネ | 57.0 | 岡遼太 | 高知 | NULL | NULL | 前田ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:14.000Z | 2025-12-20T06:57:14.000Z |
| 202512200431 | 5 | 5 | コスモザウル | 牡7 | 鹿毛 | 18 | 9 | コスモザウル | Reliable Man | More Than Ready | 57.0 | 葛山晃 | 高知 | NULL | NULL | ＧＨａｒｖｅｙ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:14.000Z | 2025-12-20T06:57:14.000Z |
| 202512200431 | 6 | 6 | プリンセスダイヤ | 牝3 | 黒鹿毛 | 22 | 5 | プリンセスダイヤ | ニシケンモノノフ | フレンチデピュティ | 53.0 | 近藤翔 | 高知 | NULL | NULL | 的場牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:14.000Z | 2025-12-20T06:57:14.000Z |
| 202512200431 | 7 | 7 | ハンドレインジ | 牝3 | 鹿毛 | 22 | 5 | ハンドレインジ | アメリカンペイトリオット | ディープインパクト | 55.0 | 井上瑛 | 高知 | NULL | NULL | ヤスナカファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:14.000Z | 2025-12-20T06:57:14.000Z |
| 202512200431 | 7 | 8 | スマイル | 牡9 | 鹿毛 | 16 | 2 | スマイル | ダイワメジャー | Mr. Greeley | 57.0 | 大澤誠 | 高知 | NULL | NULL | ノーザンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:14.000Z | 2025-12-20T06:57:14.000Z |
| 202512200431 | 8 | 9 | リワードエレイン | 牝3 | 黒鹿毛 | 22 | 3 | リワードエレイン | バンブーエール | グランシュヴァリエ | 53.0 | 阿部基 | 高知 | NULL | NULL | 有限会社リワード | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:14.000Z | 2025-12-20T06:57:14.000Z |
| 202512200431 | 8 | 10 | ロイヤルジョダーナ | 牡3 | 栗毛 | 22 | 4 | ロイヤルジョダーナ | エスポワールシチー | カジノドライヴ | 57.0 | 山崎雅 | 高知 | NULL | NULL | ヤスナカファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:14.000Z | 2025-12-20T06:57:14.000Z |
| 202512200432 | 1 | 1 | サツマノカゼ | NULL | NULL | 0 | 0 | サツマノカゼ | アレスバローズ | シニスターミニスター | NULL | 林謙佑 | 高知 | NULL | NULL | 上村利幸 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:56.000Z | 2025-12-20T06:58:56.000Z |
| 202512200432 | 2 | 2 | ディヴァージオン | 牝5 | 鹿毛 | 20 | 3 | ディヴァージオン | サトノダイヤモンド | Rock of Gibraltar | 55.0 | 岩橋勇 | 高知 | NULL | NULL | 猿倉牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:56.000Z | 2025-12-20T06:58:56.000Z |
| 202512200432 | 3 | 3 | エースオーディン | 牡3 | 黒鹿毛 | 22 | 4 | エースオーディン | フリオーソ | ゼンノロブロイ | 57.0 | 畑中信 | 高知 | NULL | NULL | 富塚ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:56.000Z | 2025-12-20T06:58:56.000Z |
| 202512200432 | 4 | 4 | ジーティーハッピー | 牡3 | 栗毛 | 22 | 4 | ジーティーハッピー | マインドユアビスケッツ | クロフネ | 57.0 | 岡遼太 | 高知 | NULL | NULL | 前田ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:56.000Z | 2025-12-20T06:58:56.000Z |
| 202512200432 | 5 | 5 | コスモザウル | 牡7 | 鹿毛 | 18 | 9 | コスモザウル | Reliable Man | More Than Ready | 57.0 | 葛山晃 | 高知 | NULL | NULL | ＧＨａｒｖｅｙ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:56.000Z | 2025-12-20T06:58:56.000Z |
| 202512200432 | 6 | 6 | プリンセスダイヤ | 牝3 | 黒鹿毛 | 22 | 5 | プリンセスダイヤ | ニシケンモノノフ | フレンチデピュティ | 53.0 | 近藤翔 | 高知 | NULL | NULL | 的場牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:56.000Z | 2025-12-20T06:58:56.000Z |
| 202512200432 | 7 | 7 | ハンドレインジ | 牝3 | 鹿毛 | 22 | 5 | ハンドレインジ | アメリカンペイトリオット | ディープインパクト | 55.0 | 井上瑛 | 高知 | NULL | NULL | ヤスナカファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:56.000Z | 2025-12-20T06:58:56.000Z |
| 202512200432 | 7 | 8 | スマイル | 牡9 | 鹿毛 | 16 | 2 | スマイル | ダイワメジャー | Mr. Greeley | 57.0 | 大澤誠 | 高知 | NULL | NULL | ノーザンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:56.000Z | 2025-12-20T06:58:56.000Z |
| 202512200432 | 8 | 9 | リワードエレイン | 牝3 | 黒鹿毛 | 22 | 3 | リワードエレイン | バンブーエール | グランシュヴァリエ | 53.0 | 阿部基 | 高知 | NULL | NULL | 有限会社リワード | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:56.000Z | 2025-12-20T06:58:56.000Z |
| 202512200432 | 8 | 10 | ロイヤルジョダーナ | 牡3 | 栗毛 | 22 | 4 | ロイヤルジョダーナ | エスポワールシチー | カジノドライヴ | 57.0 | 山崎雅 | 高知 | NULL | NULL | ヤスナカファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:56.000Z | 2025-12-20T06:58:56.000Z |
| 202512200531 | 1 | 1 | ムサシフウジン | 牡7 | 青鹿毛 | 18 | 4 | ムサシフウジン | フリオーソ | グラスワンダー | 55.0 | 阿部基 | 高知 | NULL | NULL | 田原橋本牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:31.000Z | 2025-12-20T06:57:31.000Z |
| 202512200531 | 2 | 2 | ナムラテディー | 牡5 | 芦毛 | 20 | 3 | ナムラテディー | レッドファルクス | サウスヴィグラス | 57.0 | 山崎雅 | 高知 | NULL | NULL | ナカノファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:31.000Z | 2025-12-20T06:57:31.000Z |
| 202512200531 | 3 | 3 | ウインユアソング | 牡5 | 黒鹿毛 | 20 | 4 | ウインユアソング | ロージズインメイ | ハーツクライ | 57.0 | 岩橋勇 | 高知 | NULL | NULL | コスモヴューファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:31.000Z | 2025-12-20T06:57:31.000Z |
| 202512200531 | 4 | 4 | コスモメイゲツ | 牡5 | 鹿毛 | 20 | 5 | コスモメイゲツ | ダノンバラード | Diesis | 57.0 | 多田誠 | 高知 | NULL | NULL | ビッグレッドファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:31.000Z | 2025-12-20T06:57:31.000Z |
| 202512200531 | 5 | 5 | アルドーレ | 牡10 | 栗毛 | 15 | 4 | アルドーレ | オルフェーヴル | フレンチデピュティ | 57.0 | 赤岡修 | 高知 | NULL | NULL | 辻牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:31.000Z | 2025-12-20T06:57:31.000Z |
| 202512200531 | 5 | 6 | ユラリユラメイテ | 牡3 | 鹿毛 | 22 | 3 | ユラリユラメイテ | トランセンド | スタチューオブリバティ | 57.0 | 岡村卓 | 高知 | NULL | NULL | びらとり牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:31.000Z | 2025-12-20T06:57:31.000Z |
| 202512200531 | 6 | 7 | カムランベイ | 牡5 | 鹿毛 | 20 | 2 | カムランベイ | タリスマニック | ハードスパン | 57.0 | 井上瑛 | 高知 | NULL | NULL | ダーレー・ジャパン・ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:31.000Z | 2025-12-20T06:57:31.000Z |
| 202512200531 | 6 | 8 | ラインメッセージ | 牡6 | 鹿毛 | 19 | 4 | ラインメッセージ | ヴァンセンヌ | サクラバクシンオー | 57.0 | 佐原秀 | 高知 | NULL | NULL | 原田久司 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:31.000Z | 2025-12-20T06:57:31.000Z |
| 202512200531 | 7 | 9 | ヤマイチエスポ | 牝6 | 鹿毛 | 19 | 3 | ヤマイチエスポ | エスポワールシチー | ファスリエフ | 55.0 | 林謙佑 | 高知 | NULL | NULL | 須崎牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:31.000Z | 2025-12-20T06:57:31.000Z |
| 202512200531 | 7 | 10 | ホワイトヘッド | 牡9 | 芦毛 | 16 | 3 | ホワイトヘッド | ダンカーク | ステイゴールド | 57.0 | 永森大 | 高知 | NULL | NULL | 坂東牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:31.000Z | 2025-12-20T06:57:31.000Z |
| 202512200531 | 8 | 11 | カプティフ | 牡6 | 栗毛 | 19 | 4 | カプティフ | ジョーカプチーノ | エルコンドルパサー | 56.0 | 城野慈 | 高知 | NULL | NULL | シンカンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:31.000Z | 2025-12-20T06:57:31.000Z |
| 202512200531 | 8 | 12 | ベルドラゴ | 牡6 | 鹿毛 | 19 | 3 | ベルドラゴ | ヘニーヒューズ | キンシャサノキセキ | 55.0 | 近藤翔 | 高知 | NULL | NULL | アサヒ牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:31.000Z | 2025-12-20T06:57:31.000Z |
| 202512200532 | 1 | 1 | ムサシフウジン | 牡7 | 青鹿毛 | 18 | 4 | ムサシフウジン | フリオーソ | グラスワンダー | 55.0 | 阿部基 | 高知 | NULL | NULL | 田原橋本牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:13.000Z | 2025-12-20T06:59:13.000Z |
| 202512200532 | 2 | 2 | ナムラテディー | 牡5 | 芦毛 | 20 | 3 | ナムラテディー | レッドファルクス | サウスヴィグラス | 57.0 | 山崎雅 | 高知 | NULL | NULL | ナカノファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:13.000Z | 2025-12-20T06:59:13.000Z |
| 202512200532 | 3 | 3 | ウインユアソング | 牡5 | 黒鹿毛 | 20 | 4 | ウインユアソング | ロージズインメイ | ハーツクライ | 57.0 | 岩橋勇 | 高知 | NULL | NULL | コスモヴューファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:13.000Z | 2025-12-20T06:59:13.000Z |
| 202512200532 | 4 | 4 | コスモメイゲツ | 牡5 | 鹿毛 | 20 | 5 | コスモメイゲツ | ダノンバラード | Diesis | 57.0 | 多田誠 | 高知 | NULL | NULL | ビッグレッドファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:13.000Z | 2025-12-20T06:59:13.000Z |
| 202512200532 | 5 | 5 | アルドーレ | 牡10 | 栗毛 | 15 | 4 | アルドーレ | オルフェーヴル | フレンチデピュティ | 57.0 | 赤岡修 | 高知 | NULL | NULL | 辻牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:13.000Z | 2025-12-20T06:59:13.000Z |
| 202512200532 | 5 | 6 | ユラリユラメイテ | 牡3 | 鹿毛 | 22 | 3 | ユラリユラメイテ | トランセンド | スタチューオブリバティ | 57.0 | 岡村卓 | 高知 | NULL | NULL | びらとり牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:13.000Z | 2025-12-20T06:59:13.000Z |
| 202512200532 | 6 | 7 | カムランベイ | 牡5 | 鹿毛 | 20 | 2 | カムランベイ | タリスマニック | ハードスパン | 57.0 | 井上瑛 | 高知 | NULL | NULL | ダーレー・ジャパン・ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:13.000Z | 2025-12-20T06:59:13.000Z |
| 202512200532 | 6 | 8 | ラインメッセージ | 牡6 | 鹿毛 | 19 | 4 | ラインメッセージ | ヴァンセンヌ | サクラバクシンオー | 57.0 | 佐原秀 | 高知 | NULL | NULL | 原田久司 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:13.000Z | 2025-12-20T06:59:13.000Z |
| 202512200532 | 7 | 9 | ヤマイチエスポ | 牝6 | 鹿毛 | 19 | 3 | ヤマイチエスポ | エスポワールシチー | ファスリエフ | 55.0 | 林謙佑 | 高知 | NULL | NULL | 須崎牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:13.000Z | 2025-12-20T06:59:13.000Z |
| 202512200532 | 7 | 10 | ホワイトヘッド | 牡9 | 芦毛 | 16 | 3 | ホワイトヘッド | ダンカーク | ステイゴールド | 57.0 | 永森大 | 高知 | NULL | NULL | 坂東牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:13.000Z | 2025-12-20T06:59:13.000Z |
| 202512200532 | 8 | 11 | カプティフ | 牡6 | 栗毛 | 19 | 4 | カプティフ | ジョーカプチーノ | エルコンドルパサー | 56.0 | 城野慈 | 高知 | NULL | NULL | シンカンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:13.000Z | 2025-12-20T06:59:13.000Z |
| 202512200532 | 8 | 12 | ベルドラゴ | 牡6 | 鹿毛 | 19 | 3 | ベルドラゴ | ヘニーヒューズ | キンシャサノキセキ | 55.0 | 近藤翔 | 高知 | NULL | NULL | アサヒ牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:13.000Z | 2025-12-20T06:59:13.000Z |
| 202512200631 | 1 | 1 | アンダーザブリッジ | NULL | NULL | 0 | 0 | アンダーザブリッジ | カリフォルニアクローム | ダイワメジャー | NULL | 木村直 | 高知 | NULL | NULL | 千明牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:31.000Z | 2025-12-20T06:57:31.000Z |
| 202512200631 | 2 | 2 | クリノバーグマン | 牡3 | 芦毛 | 22 | 1 | クリノバーグマン | マクフィ | ダイワメジャー | 57.0 | 岡遼太 | 高知 | NULL | NULL | 横井哲 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:31.000Z | 2025-12-20T06:57:31.000Z |
| 202512200631 | 3 | 3 | クニノダイヤ | 牡4 | 鹿毛 | 21 | 4 | クニノダイヤ | サトノダイヤモンド | クロフネ | 57.0 | 大澤誠 | 高知 | NULL | NULL | 三木田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:31.000Z | 2025-12-20T06:57:31.000Z |
| 202512200631 | 4 | 4 | パレットキャット | 牝4 | 鹿毛 | 21 | 5 | パレットキャット | タリスマニック | アドマイヤムーン | 55.0 | 西森将 | 高知 | NULL | NULL | 杵臼斉藤牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:31.000Z | 2025-12-20T06:57:31.000Z |
| 202512200631 | 5 | 5 | コールイングミー | 牝3 | 鹿毛 | 22 | 4 | コールイングミー | アジアエクスプレス | ストロングリターン | 55.0 | 山崎雅 | 高知 | NULL | NULL | シンカンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:31.000Z | 2025-12-20T06:57:31.000Z |
| 202512200631 | 6 | 6 | イニシャルティー | 牡4 | 栗毛 | 21 | 4 | イニシャルティー | トビーズコーナー | ジェニュイン | 56.0 | 城野慈 | 高知 | NULL | NULL | 前川義則 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:31.000Z | 2025-12-20T06:57:31.000Z |
| 202512200631 | 7 | 7 | レアルシチー | 牡3 | 鹿毛 | 22 | 1 | レアルシチー | アルアイン | Galileo | 57.0 | 多田誠 | 高知 | NULL | NULL | オリオンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:31.000Z | 2025-12-20T06:57:31.000Z |
| 202512200631 | 7 | 8 | メルヘンライズ | 牝3 | 芦毛 | 22 | 4 | メルヘンライズ | シルバーステート | ルーラーシップ | 55.0 | 上田将 | 高知 | NULL | NULL | 有限会社ＰＲＩＤＥＲ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:31.000Z | 2025-12-20T06:57:31.000Z |
| 202512200631 | 8 | 9 | アルマリカシバ | 牝3 | 栗毛 | 22 | 2 | アルマリカシバ | マクフィ | アドマイヤムーン | 53.0 | 阿部基 | 高知 | NULL | NULL | 木村牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:31.000Z | 2025-12-20T06:57:31.000Z |
| 202512200631 | 8 | 10 | アツィオーネ | 牝3 | 鹿毛 | 22 | 3 | アツィオーネ | サンダースノー | ヨハネスブルグ | 53.0 | 近藤翔 | 高知 | NULL | NULL | 田中スタッド | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:31.000Z | 2025-12-20T06:57:31.000Z |
| 202512200632 | 1 | 1 | アンダーザブリッジ | NULL | NULL | 0 | 0 | アンダーザブリッジ | カリフォルニアクローム | ダイワメジャー | NULL | 木村直 | 高知 | NULL | NULL | 千明牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:13.000Z | 2025-12-20T06:59:13.000Z |
| 202512200632 | 2 | 2 | クリノバーグマン | 牡3 | 芦毛 | 22 | 1 | クリノバーグマン | マクフィ | ダイワメジャー | 57.0 | 岡遼太 | 高知 | NULL | NULL | 横井哲 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:13.000Z | 2025-12-20T06:59:13.000Z |
| 202512200632 | 3 | 3 | クニノダイヤ | 牡4 | 鹿毛 | 21 | 4 | クニノダイヤ | サトノダイヤモンド | クロフネ | 57.0 | 大澤誠 | 高知 | NULL | NULL | 三木田牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:13.000Z | 2025-12-20T06:59:13.000Z |
| 202512200632 | 4 | 4 | パレットキャット | 牝4 | 鹿毛 | 21 | 5 | パレットキャット | タリスマニック | アドマイヤムーン | 55.0 | 西森将 | 高知 | NULL | NULL | 杵臼斉藤牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:13.000Z | 2025-12-20T06:59:13.000Z |
| 202512200632 | 5 | 5 | コールイングミー | 牝3 | 鹿毛 | 22 | 4 | コールイングミー | アジアエクスプレス | ストロングリターン | 55.0 | 山崎雅 | 高知 | NULL | NULL | シンカンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:13.000Z | 2025-12-20T06:59:13.000Z |
| 202512200632 | 6 | 6 | イニシャルティー | 牡4 | 栗毛 | 21 | 4 | イニシャルティー | トビーズコーナー | ジェニュイン | 56.0 | 城野慈 | 高知 | NULL | NULL | 前川義則 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:13.000Z | 2025-12-20T06:59:13.000Z |
| 202512200632 | 7 | 7 | レアルシチー | 牡3 | 鹿毛 | 22 | 1 | レアルシチー | アルアイン | Galileo | 57.0 | 多田誠 | 高知 | NULL | NULL | オリオンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:13.000Z | 2025-12-20T06:59:13.000Z |
| 202512200632 | 7 | 8 | メルヘンライズ | 牝3 | 芦毛 | 22 | 4 | メルヘンライズ | シルバーステート | ルーラーシップ | 55.0 | 上田将 | 高知 | NULL | NULL | 有限会社ＰＲＩＤＥＲ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:13.000Z | 2025-12-20T06:59:13.000Z |
| 202512200632 | 8 | 9 | アルマリカシバ | 牝3 | 栗毛 | 22 | 2 | アルマリカシバ | マクフィ | アドマイヤムーン | 53.0 | 阿部基 | 高知 | NULL | NULL | 木村牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:13.000Z | 2025-12-20T06:59:13.000Z |
| 202512200632 | 8 | 10 | アツィオーネ | 牝3 | 鹿毛 | 22 | 3 | アツィオーネ | サンダースノー | ヨハネスブルグ | 53.0 | 近藤翔 | 高知 | NULL | NULL | 田中スタッド | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:13.000Z | 2025-12-20T06:59:13.000Z |
| 202512200731 | 1 | 1 | ジャガーノート | 牡3 | 鹿毛 | 22 | 4 | ジャガーノート | ゴールドドリーム | メイショウボーラー | 57.0 | 畑中信 | 高知 | NULL | NULL | 神垣道弘 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:48.000Z | 2025-12-20T06:57:48.000Z |
| 202512200731 | 2 | 2 | サクララージャン | 牡9 | 青鹿毛 | 16 | 3 | サクララージャン | サクラプレジデント | サクラローレル | 56.0 | 城野慈 | 高知 | NULL | NULL | 谷岡スタット | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:48.000Z | 2025-12-20T06:57:48.000Z |
| 202512200731 | 3 | 3 | デルマエウロパ | 牡4 | 鹿毛 | 21 | 3 | デルマエウロパ | ブラックタイド | Scat Daddy | 57.0 | 岩橋勇 | 高知 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:48.000Z | 2025-12-20T06:57:48.000Z |
| 202512200731 | 4 | 4 | マサウッドテール | 牡3 | 鹿毛 | 22 | 3 | マサウッドテール | ファインニードル | スタチューオブリバティ | 57.0 | 山崎雅 | 高知 | NULL | NULL | 谷川ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:48.000Z | 2025-12-20T06:57:48.000Z |
| 202512200731 | 5 | 5 | ポジティビティ | 牡3 | 栗毛 | 22 | 3 | ポジティビティ | モーニン | クロフネ | 57.0 | 岡村卓 | 高知 | NULL | NULL | 春木ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:48.000Z | 2025-12-20T06:57:48.000Z |
| 202512200731 | 6 | 6 | エイシンオンタイム | 牝9 | 鹿毛 | 16 | 4 | エイシンオンタイム | ショウナンカンプ | オレハマッテルゼ | 53.0 | 阿部基 | 高知 | NULL | NULL | 栄進牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:48.000Z | 2025-12-20T06:57:48.000Z |
| 202512200731 | 7 | 7 | リバティフレイム | 牡3 | 黒鹿毛 | 22 | 5 | リバティフレイム | アメリカンペイトリオット | Doyen | 57.0 | 郷間勇 | 高知 | NULL | NULL | ダーレー・ジャパン・ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:48.000Z | 2025-12-20T06:57:48.000Z |
| 202512200731 | 8 | 8 | ワイドレッド | 牝3 | 黒鹿毛 | 22 | 4 | ワイドレッド | ホッコータルマエ | フレンチデピュティ | 55.0 | 多田誠 | 高知 | NULL | NULL | 上山牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:48.000Z | 2025-12-20T06:57:48.000Z |
| 202512200731 | 8 | 9 | ラファエーレ | 牡6 | 黒鹿毛 | 19 | 3 | ラファエーレ | ダノンレジェンド | ブラックタイド | 57.0 | 大澤誠 | 高知 | NULL | NULL | 松木加代 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:48.000Z | 2025-12-20T06:57:48.000Z |
| 202512200732 | 1 | 1 | ジャガーノート | 牡3 | 鹿毛 | 22 | 4 | ジャガーノート | ゴールドドリーム | メイショウボーラー | 57.0 | 畑中信 | 高知 | NULL | NULL | 神垣道弘 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:29.000Z | 2025-12-20T06:59:29.000Z |
| 202512200732 | 2 | 2 | サクララージャン | 牡9 | 青鹿毛 | 16 | 3 | サクララージャン | サクラプレジデント | サクラローレル | 56.0 | 城野慈 | 高知 | NULL | NULL | 谷岡スタット | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:29.000Z | 2025-12-20T06:59:29.000Z |
| 202512200732 | 3 | 3 | デルマエウロパ | 牡4 | 鹿毛 | 21 | 3 | デルマエウロパ | ブラックタイド | Scat Daddy | 57.0 | 岩橋勇 | 高知 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:29.000Z | 2025-12-20T06:59:29.000Z |
| 202512200732 | 4 | 4 | マサウッドテール | 牡3 | 鹿毛 | 22 | 3 | マサウッドテール | ファインニードル | スタチューオブリバティ | 57.0 | 山崎雅 | 高知 | NULL | NULL | 谷川ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:29.000Z | 2025-12-20T06:59:29.000Z |
| 202512200732 | 5 | 5 | ポジティビティ | 牡3 | 栗毛 | 22 | 3 | ポジティビティ | モーニン | クロフネ | 57.0 | 岡村卓 | 高知 | NULL | NULL | 春木ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:29.000Z | 2025-12-20T06:59:29.000Z |
| 202512200732 | 6 | 6 | エイシンオンタイム | 牝9 | 鹿毛 | 16 | 4 | エイシンオンタイム | ショウナンカンプ | オレハマッテルゼ | 53.0 | 阿部基 | 高知 | NULL | NULL | 栄進牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:29.000Z | 2025-12-20T06:59:29.000Z |
| 202512200732 | 7 | 7 | リバティフレイム | 牡3 | 黒鹿毛 | 22 | 5 | リバティフレイム | アメリカンペイトリオット | Doyen | 57.0 | 郷間勇 | 高知 | NULL | NULL | ダーレー・ジャパン・ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:29.000Z | 2025-12-20T06:59:29.000Z |
| 202512200732 | 8 | 8 | ワイドレッド | 牝3 | 黒鹿毛 | 22 | 4 | ワイドレッド | ホッコータルマエ | フレンチデピュティ | 55.0 | 多田誠 | 高知 | NULL | NULL | 上山牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:29.000Z | 2025-12-20T06:59:29.000Z |
| 202512200732 | 8 | 9 | ラファエーレ | 牡6 | 黒鹿毛 | 19 | 3 | ラファエーレ | ダノンレジェンド | ブラックタイド | 57.0 | 大澤誠 | 高知 | NULL | NULL | 松木加代 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:29.000Z | 2025-12-20T06:59:29.000Z |
| 202512200831 | 1 | 1 | ベルヴィオレット | 牝3 | 鹿毛 | 22 | 4 | ベルヴィオレット | トランセンド | ディープインパクト | 55.0 | 木村直 | 高知 | NULL | NULL | 土居牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:48.000Z | 2025-12-20T06:57:48.000Z |
| 202512200831 | 2 | 2 | ペイシャキク | 牝4 | 黒鹿毛 | 21 | 5 | ペイシャキク | メイショウボーラー | NULL | 55.0 | 佐原秀 | 高知 | NULL | NULL | NULL | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:48.000Z | 2025-12-20T06:57:48.000Z |
| 202512200831 | 3 | 3 | アメリカンクール | 牡3 | 黒鹿毛 | 22 | 4 | アメリカンクール | War Front | Mineshaft | 57.0 | 妹尾浩 | 高知 | NULL | NULL | Ｉｎｔｅｒｎａｔｉｏ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:48.000Z | 2025-12-20T06:57:48.000Z |
| 202512200831 | 4 | 4 | インテンスフレイム | 牡7 | 黒鹿毛 | 18 | 2 | インテンスフレイム | パイロ | Dubawi | 55.0 | 近藤翔 | 高知 | NULL | NULL | ダーレー・ジャパン・ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:48.000Z | 2025-12-20T06:57:48.000Z |
| 202512200831 | 5 | 5 | カルリーノ | NULL | NULL | 0 | 0 | カルリーノ | マツリダゴッホ | ショウナンカンプ | NULL | 宮川実 | 高知 | NULL | NULL | 松栄牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:48.000Z | 2025-12-20T06:57:48.000Z |
| 202512200831 | 6 | 6 | エヌマエリシュ | 牡3 | 栗毛 | 22 | 3 | エヌマエリシュ | ルヴァンスレーヴ | クロフネ | 56.0 | 城野慈 | 高知 | NULL | NULL | ノーザンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:48.000Z | 2025-12-20T06:57:48.000Z |
| 202512200831 | 6 | 7 | ニューウォーク | 牝3 | 鹿毛 | 22 | 4 | ニューウォーク | ニューイヤーズデイ | アドマイヤコジーン | 55.0 | 井上瑛 | 高知 | NULL | NULL | ウエスタンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:48.000Z | 2025-12-20T06:57:48.000Z |
| 202512200831 | 7 | 8 | オンテンバール | 牝4 | 青鹿毛 | 21 | 3 | オンテンバール | ダノンレジェンド | シンボリクリスエス | 53.0 | 阿部基 | 高知 | NULL | NULL | マリオステーブル | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:48.000Z | 2025-12-20T06:57:48.000Z |
| 202512200831 | 7 | 9 | ウェルマインド | 牝5 | 鹿毛 | 20 | 3 | ウェルマインド | ルーラーシップ | ティンバーカントリー | 55.0 | 大澤誠 | 高知 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:48.000Z | 2025-12-20T06:57:48.000Z |
| 202512200831 | 8 | 10 | サイカク | 牡4 | 鹿毛 | 21 | 4 | サイカク | ストロングリターン | アンライバルド | 57.0 | 畑中信 | 高知 | NULL | NULL | 静内酒井牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:48.000Z | 2025-12-20T06:57:48.000Z |
| 202512200831 | 8 | 11 | ノアプレスリー | 牡3 | 鹿毛 | 22 | 1 | ノアプレスリー | ミスターメロディ | ダンスインザダーク | 57.0 | 岡村卓 | 高知 | NULL | NULL | メイタイファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:57:48.000Z | 2025-12-20T06:57:48.000Z |
| 202512200832 | 1 | 1 | ベルヴィオレット | 牝3 | 鹿毛 | 22 | 4 | ベルヴィオレット | トランセンド | ディープインパクト | 55.0 | 木村直 | 高知 | NULL | NULL | 土居牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:31.000Z | 2025-12-20T06:59:31.000Z |
| 202512200832 | 2 | 2 | ペイシャキク | 牝4 | 黒鹿毛 | 21 | 5 | ペイシャキク | メイショウボーラー | NULL | 55.0 | 佐原秀 | 高知 | NULL | NULL | NULL | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:31.000Z | 2025-12-20T06:59:31.000Z |
| 202512200832 | 3 | 3 | アメリカンクール | 牡3 | 黒鹿毛 | 22 | 4 | アメリカンクール | War Front | Mineshaft | 57.0 | 妹尾浩 | 高知 | NULL | NULL | Ｉｎｔｅｒｎａｔｉｏ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:31.000Z | 2025-12-20T06:59:31.000Z |
| 202512200832 | 4 | 4 | インテンスフレイム | 牡7 | 黒鹿毛 | 18 | 2 | インテンスフレイム | パイロ | Dubawi | 55.0 | 近藤翔 | 高知 | NULL | NULL | ダーレー・ジャパン・ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:31.000Z | 2025-12-20T06:59:31.000Z |
| 202512200832 | 5 | 5 | カルリーノ | NULL | NULL | 0 | 0 | カルリーノ | マツリダゴッホ | ショウナンカンプ | NULL | 宮川実 | 高知 | NULL | NULL | 松栄牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:31.000Z | 2025-12-20T06:59:31.000Z |
| 202512200832 | 6 | 6 | エヌマエリシュ | 牡3 | 栗毛 | 22 | 3 | エヌマエリシュ | ルヴァンスレーヴ | クロフネ | 56.0 | 城野慈 | 高知 | NULL | NULL | ノーザンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:31.000Z | 2025-12-20T06:59:31.000Z |
| 202512200832 | 6 | 7 | ニューウォーク | 牝3 | 鹿毛 | 22 | 4 | ニューウォーク | ニューイヤーズデイ | アドマイヤコジーン | 55.0 | 井上瑛 | 高知 | NULL | NULL | ウエスタンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:31.000Z | 2025-12-20T06:59:31.000Z |
| 202512200832 | 7 | 8 | オンテンバール | 牝4 | 青鹿毛 | 21 | 3 | オンテンバール | ダノンレジェンド | シンボリクリスエス | 53.0 | 阿部基 | 高知 | NULL | NULL | マリオステーブル | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:31.000Z | 2025-12-20T06:59:31.000Z |
| 202512200832 | 7 | 9 | ウェルマインド | 牝5 | 鹿毛 | 20 | 3 | ウェルマインド | ルーラーシップ | ティンバーカントリー | 55.0 | 大澤誠 | 高知 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:31.000Z | 2025-12-20T06:59:31.000Z |
| 202512200832 | 8 | 10 | サイカク | 牡4 | 鹿毛 | 21 | 4 | サイカク | ストロングリターン | アンライバルド | 57.0 | 畑中信 | 高知 | NULL | NULL | 静内酒井牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:31.000Z | 2025-12-20T06:59:31.000Z |
| 202512200832 | 8 | 11 | ノアプレスリー | 牡3 | 鹿毛 | 22 | 1 | ノアプレスリー | ミスターメロディ | ダンスインザダーク | 57.0 | 岡村卓 | 高知 | NULL | NULL | メイタイファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:31.000Z | 2025-12-20T06:59:31.000Z |
| 202512200931 | 1 | 1 | カズラポニアン | 牡6 | 栗毛 | 19 | 3 | カズラポニアン | ヘニーヒューズ | ダイワメジャー | 57.0 | 岡遼太 | 高知 | NULL | NULL | ノーザンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:04.000Z | 2025-12-20T06:58:04.000Z |
| 202512200931 | 2 | 2 | ショウナンラジョア | 牝4 | 鹿毛 | 21 | 3 | ショウナンラジョア | デクラレーションオブウォー | キングカメハメハ | 55.0 | 林謙佑 | 高知 | NULL | NULL | 静内フアーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:04.000Z | 2025-12-20T06:58:04.000Z |
| 202512200931 | 3 | 3 | クエンカ | 牡3 | 鹿毛 | 22 | 5 | クエンカ | トーセンレーヴ | Songandaprayer | 57.0 | 山崎雅 | 高知 | NULL | NULL | 有限会社エスティファ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:04.000Z | 2025-12-20T06:58:04.000Z |
| 202512200931 | 4 | 4 | フーイナム | 牡3 | 鹿毛 | 22 | 2 | フーイナム | モーリス | ハービンジャー | 57.0 | 多田誠 | 高知 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:04.000Z | 2025-12-20T06:58:04.000Z |
| 202512200931 | 5 | 5 | トワキ | 牡5 | 栗毛 | 20 | 3 | トワキ | ヘニーヒューズ | アグネスデジタル | 57.0 | 郷間勇 | 高知 | NULL | NULL | 日高大洋牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:04.000Z | 2025-12-20T06:58:04.000Z |
| 202512200931 | 6 | 6 | マイネルアース | 牡3 | 栗毛 | 22 | 5 | マイネルアース | ブリックスアンドモルタル | Street Cry | 57.0 | 永森大 | 高知 | NULL | NULL | 株式会社那須野 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:04.000Z | 2025-12-20T06:58:04.000Z |
| 202512200931 | 6 | 7 | フューチャーアイ | 牡6 | 鹿毛 | 19 | 3 | フューチャーアイ | シビルウォー | ブライアンズタイム | 57.0 | 木村直 | 高知 | NULL | NULL | 大典牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:04.000Z | 2025-12-20T06:58:04.000Z |
| 202512200931 | 7 | 8 | スピードイエロー | 牡3 | 黒鹿毛 | 22 | 4 | スピードイエロー | ルヴァンスレーヴ | ディープインパクト | 57.0 | 佐原秀 | 高知 | NULL | NULL | 富菜牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:04.000Z | 2025-12-20T06:58:04.000Z |
| 202512200931 | 7 | 9 | ヨシュア | 牡4 | 栗毛 | 21 | 3 | ヨシュア | アジアエクスプレス | クロフネ | 57.0 | 上田将 | 高知 | NULL | NULL | 山田政宏 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:04.000Z | 2025-12-20T06:58:04.000Z |
| 202512200931 | 8 | 10 | ブリックバーン | NULL | NULL | 0 | 0 | ブリックバーン | ブリックスアンドモルタル | スペシャルウィーク | NULL | 畑中信 | 高知 | NULL | NULL | ノーザンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:04.000Z | 2025-12-20T06:58:04.000Z |
| 202512200931 | 8 | 11 | ポジティブガール | 牝6 | 栗毛 | 19 | 3 | ポジティブガール | バトルプラン | カジノドライヴ | 55.0 | 岡村卓 | 高知 | NULL | NULL | 槇本牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:04.000Z | 2025-12-20T06:58:04.000Z |
| 202512200932 | 1 | 1 | カズラポニアン | 牡6 | 栗毛 | 19 | 3 | カズラポニアン | ヘニーヒューズ | ダイワメジャー | 57.0 | 岡遼太 | 高知 | NULL | NULL | ノーザンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:47.000Z | 2025-12-20T06:59:47.000Z |
| 202512200932 | 2 | 2 | ショウナンラジョア | 牝4 | 鹿毛 | 21 | 3 | ショウナンラジョア | デクラレーションオブウォー | キングカメハメハ | 55.0 | 林謙佑 | 高知 | NULL | NULL | 静内フアーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:47.000Z | 2025-12-20T06:59:47.000Z |
| 202512200932 | 3 | 3 | クエンカ | 牡3 | 鹿毛 | 22 | 5 | クエンカ | トーセンレーヴ | Songandaprayer | 57.0 | 山崎雅 | 高知 | NULL | NULL | 有限会社エスティファ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:47.000Z | 2025-12-20T06:59:47.000Z |
| 202512200932 | 4 | 4 | フーイナム | 牡3 | 鹿毛 | 22 | 2 | フーイナム | モーリス | ハービンジャー | 57.0 | 多田誠 | 高知 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:47.000Z | 2025-12-20T06:59:47.000Z |
| 202512200932 | 5 | 5 | トワキ | 牡5 | 栗毛 | 20 | 3 | トワキ | ヘニーヒューズ | アグネスデジタル | 57.0 | 郷間勇 | 高知 | NULL | NULL | 日高大洋牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:47.000Z | 2025-12-20T06:59:47.000Z |
| 202512200932 | 6 | 6 | マイネルアース | 牡3 | 栗毛 | 22 | 5 | マイネルアース | ブリックスアンドモルタル | Street Cry | 57.0 | 永森大 | 高知 | NULL | NULL | 株式会社那須野 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:47.000Z | 2025-12-20T06:59:47.000Z |
| 202512200932 | 6 | 7 | フューチャーアイ | 牡6 | 鹿毛 | 19 | 3 | フューチャーアイ | シビルウォー | ブライアンズタイム | 57.0 | 木村直 | 高知 | NULL | NULL | 大典牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:47.000Z | 2025-12-20T06:59:47.000Z |
| 202512200932 | 7 | 8 | スピードイエロー | 牡3 | 黒鹿毛 | 22 | 4 | スピードイエロー | ルヴァンスレーヴ | ディープインパクト | 57.0 | 佐原秀 | 高知 | NULL | NULL | 富菜牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:47.000Z | 2025-12-20T06:59:47.000Z |
| 202512200932 | 7 | 9 | ヨシュア | 牡4 | 栗毛 | 21 | 3 | ヨシュア | アジアエクスプレス | クロフネ | 57.0 | 上田将 | 高知 | NULL | NULL | 山田政宏 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:47.000Z | 2025-12-20T06:59:47.000Z |
| 202512200932 | 8 | 10 | ブリックバーン | NULL | NULL | 0 | 0 | ブリックバーン | ブリックスアンドモルタル | スペシャルウィーク | NULL | 畑中信 | 高知 | NULL | NULL | ノーザンファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:47.000Z | 2025-12-20T06:59:47.000Z |
| 202512200932 | 8 | 11 | ポジティブガール | 牝6 | 栗毛 | 19 | 3 | ポジティブガール | バトルプラン | カジノドライヴ | 55.0 | 岡村卓 | 高知 | NULL | NULL | 槇本牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:47.000Z | 2025-12-20T06:59:47.000Z |
| 202512201031 | 1 | 1 | サノノスピード | 牡4 | 黒鹿毛 | 21 | 4 | サノノスピード | レッドファルクス | Pulpit | 57.0 | 佐原秀 | 高知 | NULL | NULL | 信岡牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:05.000Z | 2025-12-20T06:58:05.000Z |
| 202512201031 | 2 | 2 | ミステリオーソ | 牡8 | 黒鹿毛 | 17 | 1 | ミステリオーソ | パイロ | シンボリクリスエス | 57.0 | 郷間勇 | 高知 | NULL | NULL | 笹地牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:05.000Z | 2025-12-20T06:58:05.000Z |
| 202512201031 | 3 | 3 | スカイライト | 牡4 | 栗毛 | 21 | 4 | スカイライト | スワーヴリチャード | キングカメハメハ | 57.0 | 永森大 | 高知 | NULL | NULL | 藤本直弘 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:05.000Z | 2025-12-20T06:58:05.000Z |
| 202512201031 | 4 | 4 | サーブルミラージュ | 牡5 | 栗毛 | 20 | 5 | サーブルミラージュ | エスポワールシチー | Giant's Causeway | 57.0 | 妹尾浩 | 高知 | NULL | NULL | 前野牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:05.000Z | 2025-12-20T06:58:05.000Z |
| 202512201031 | 5 | 5 | ハルノサムソン | 牡5 | 鹿毛 | 20 | 4 | ハルノサムソン | メイショウサムソン | クロフネ | 55.0 | 近藤翔 | 高知 | NULL | NULL | 富田恭司 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:05.000Z | 2025-12-20T06:58:05.000Z |
| 202512201031 | 6 | 6 | ショットメーカー | 牡6 | 栗毛 | 19 | 3 | ショットメーカー | シニスターミニスター | エンパイアメーカー | 57.0 | 宮川実 | 高知 | NULL | NULL | 下屋敷牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:05.000Z | 2025-12-20T06:58:05.000Z |
| 202512201031 | 7 | 7 | ヤクモ | 牡7 | 黒鹿毛 | 18 | 5 | ヤクモ | ホッコータルマエ | スパイキュール | 57.0 | 大澤誠 | 高知 | NULL | NULL | ミルファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:05.000Z | 2025-12-20T06:58:05.000Z |
| 202512201031 | 8 | 8 | サノノゴールド | 牡4 | 栗毛 | 21 | 5 | サノノゴールド | クリエイター２ | ネオユニヴァース | 57.0 | 多田誠 | 高知 | NULL | NULL | 豊洋牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:05.000Z | 2025-12-20T06:58:05.000Z |
| 202512201031 | 8 | 9 | フィティアンガ | NULL | NULL | 0 | 0 | フィティアンガ | ラニ | スクリーンヒーロー | NULL | 山崎雅 | 高知 | NULL | NULL | サンシャイン牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:05.000Z | 2025-12-20T06:58:05.000Z |
| 202512201032 | 1 | 1 | サノノスピード | 牡4 | 黒鹿毛 | 21 | 4 | サノノスピード | レッドファルクス | Pulpit | 57.0 | 佐原秀 | 高知 | NULL | NULL | 信岡牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:48.000Z | 2025-12-20T06:59:48.000Z |
| 202512201032 | 2 | 2 | ミステリオーソ | 牡8 | 黒鹿毛 | 17 | 1 | ミステリオーソ | パイロ | シンボリクリスエス | 57.0 | 郷間勇 | 高知 | NULL | NULL | 笹地牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:48.000Z | 2025-12-20T06:59:48.000Z |
| 202512201032 | 3 | 3 | スカイライト | 牡4 | 栗毛 | 21 | 4 | スカイライト | スワーヴリチャード | キングカメハメハ | 57.0 | 永森大 | 高知 | NULL | NULL | 藤本直弘 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:48.000Z | 2025-12-20T06:59:48.000Z |
| 202512201032 | 4 | 4 | サーブルミラージュ | 牡5 | 栗毛 | 20 | 5 | サーブルミラージュ | エスポワールシチー | Giant's Causeway | 57.0 | 妹尾浩 | 高知 | NULL | NULL | 前野牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:48.000Z | 2025-12-20T06:59:48.000Z |
| 202512201032 | 5 | 5 | ハルノサムソン | 牡5 | 鹿毛 | 20 | 4 | ハルノサムソン | メイショウサムソン | クロフネ | 55.0 | 近藤翔 | 高知 | NULL | NULL | 富田恭司 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:48.000Z | 2025-12-20T06:59:48.000Z |
| 202512201032 | 6 | 6 | ショットメーカー | 牡6 | 栗毛 | 19 | 3 | ショットメーカー | シニスターミニスター | エンパイアメーカー | 57.0 | 宮川実 | 高知 | NULL | NULL | 下屋敷牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:48.000Z | 2025-12-20T06:59:48.000Z |
| 202512201032 | 7 | 7 | ヤクモ | 牡7 | 黒鹿毛 | 18 | 5 | ヤクモ | ホッコータルマエ | スパイキュール | 57.0 | 大澤誠 | 高知 | NULL | NULL | ミルファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:48.000Z | 2025-12-20T06:59:48.000Z |
| 202512201032 | 8 | 8 | サノノゴールド | 牡4 | 栗毛 | 21 | 5 | サノノゴールド | クリエイター２ | ネオユニヴァース | 57.0 | 多田誠 | 高知 | NULL | NULL | 豊洋牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:48.000Z | 2025-12-20T06:59:48.000Z |
| 202512201032 | 8 | 9 | フィティアンガ | NULL | NULL | 0 | 0 | フィティアンガ | ラニ | スクリーンヒーロー | NULL | 山崎雅 | 高知 | NULL | NULL | サンシャイン牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:59:48.000Z | 2025-12-20T06:59:48.000Z |
| 202512201131 | 1 | 1 | ゲンパチレオニダス | 牡6 | 黒鹿毛 | 19 | 4 | ゲンパチレオニダス | ロードカナロア | ジャングルポケット | 56.0 | 城野慈 | 高知 | NULL | NULL | 前川勝春 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:22.000Z | 2025-12-20T06:58:22.000Z |
| 202512201131 | 2 | 2 | ウォーターレモン | 牡5 | 栗毛 | 20 | 3 | ウォーターレモン | Lemon Drop Kid | Stormy Atlantic | 57.0 | 林謙佑 | 高知 | NULL | NULL | ＢａｒｒｙＲＯｓｔｒ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:22.000Z | 2025-12-20T06:58:22.000Z |
| 202512201131 | 3 | 3 | エイシンツーリング | 牡6 | 鹿毛 | 19 | 3 | エイシンツーリング | エイシンヒカリ | フレンチデピュティ | 57.0 | 畑中信 | 高知 | NULL | NULL | 栄進牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:22.000Z | 2025-12-20T06:58:22.000Z |
| 202512201131 | 4 | 4 | ポイントフォワード | NULL | NULL | 0 | 0 | ポイントフォワード | ファインニードル | Dansili | NULL | 佐原秀 | 高知 | NULL | NULL | ダーレー・ジャパン・ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:22.000Z | 2025-12-20T06:58:22.000Z |
| 202512201131 | 5 | 5 | グランレザンドール | 牡4 | 芦毛 | 21 | 2 | グランレザンドール | オルフェーヴル | アジュディケーティング | 57.0 | 永森大 | 高知 | NULL | NULL | 大狩部牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:22.000Z | 2025-12-20T06:58:22.000Z |
| 202512201131 | 6 | 6 | カレンルシェルブル | 牡7 | 鹿毛 | 18 | 2 | カレンルシェルブル | ハービンジャー | ハーツクライ | 57.0 | 井上瑛 | 高知 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:22.000Z | 2025-12-20T06:58:22.000Z |
| 202512201131 | 7 | 7 | ディサーニング | NULL | NULL | 0 | 0 | ディサーニング | Street Cry | Discreet Cat | NULL | 宮川実 | 高知 | NULL | NULL | ダーレー・ジャパン・ | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:22.000Z | 2025-12-20T06:58:22.000Z |
| 202512201131 | 8 | 8 | デルマアズラエル | 牡6 | 芦毛 | 19 | 4 | デルマアズラエル | ダンカーク | ジャイアントレッカー | 57.0 | 妹尾浩 | 高知 | NULL | NULL | 辻牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:22.000Z | 2025-12-20T06:58:22.000Z |
| 202512201131 | 8 | 9 | モノノフブルー | 牡5 | 黒鹿毛 | 20 | 4 | モノノフブルー | ニシケンモノノフ | Spinning World | 57.0 | 郷間勇 | 高知 | NULL | NULL | 清水スタッド | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:22.000Z | 2025-12-20T06:58:22.000Z |
| 202512201231 | 1 | 1 | チークタイム | 牝4 | 鹿毛 | 21 | 4 | チークタイム | キンシャサノキセキ | エイシンフラッシュ | 55.0 | 岡遼太 | 高知 | NULL | NULL | 株式会社サンデーヒル | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:22.000Z | 2025-12-20T06:58:22.000Z |
| 202512201231 | 2 | 2 | フライハイ | 牡3 | 黒鹿毛 | 22 | 3 | フライハイ | シルバーステート | ローズキングダム | 57.0 | 永森大 | 高知 | NULL | NULL | 日西牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:22.000Z | 2025-12-20T06:58:22.000Z |
| 202512201231 | 3 | 3 | ノアファラオ | 牡4 | 栗毛 | 21 | 4 | ノアファラオ | ベストウォーリア | ゼンノロブロイ | 57.0 | 井上瑛 | 高知 | NULL | NULL | 福岡駿弥 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:22.000Z | 2025-12-20T06:58:22.000Z |
| 202512201231 | 4 | 4 | ミユキマーベリック | 牡4 | 栗毛 | 21 | 5 | ミユキマーベリック | モーニン | ダイワメジャー | 57.0 | 岡村卓 | 高知 | NULL | NULL | 織田正敏 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:22.000Z | 2025-12-20T06:58:22.000Z |
| 202512201231 | 5 | 5 | マルモルミエール | 牡5 | 芦毛 | 20 | 3 | マルモルミエール | エイシンヒカリ | クロフネ | 57.0 | 多田誠 | 高知 | NULL | NULL | オカモトファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:22.000Z | 2025-12-20T06:58:22.000Z |
| 202512201231 | 5 | 6 | ブラウナイル | 牝8 | 青毛 | 17 | 5 | ブラウナイル | フリオーソ | ダンスインザダーク | 55.0 | 葛山晃 | 高知 | NULL | NULL | 飯岡牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:22.000Z | 2025-12-20T06:58:22.000Z |
| 202512201231 | 6 | 7 | リベラティオ | 牡4 | 鹿毛 | 21 | 4 | リベラティオ | バゴ | NULL | 55.0 | 近藤翔 | 高知 | NULL | NULL | NULL | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:22.000Z | 2025-12-20T06:58:22.000Z |
| 202512201231 | 6 | 8 | ブリスディーシャ | 牝3 | 黒鹿毛 | 22 | 3 | ブリスディーシャ | リオンディーズ | ハーツクライ | 55.0 | 郷間勇 | 高知 | NULL | NULL | 二風谷ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:22.000Z | 2025-12-20T06:58:22.000Z |
| 202512201231 | 7 | 9 | リライトヒストリー | 牡3 | 鹿毛 | 22 | 5 | リライトヒストリー | カリフォルニアクローム | ファルブラヴ | 57.0 | 山崎雅 | 高知 | NULL | NULL | 静内フジカワ牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:22.000Z | 2025-12-20T06:58:22.000Z |
| 202512201231 | 7 | 10 | ナバロン | 牡6 | 鹿毛 | 19 | 4 | ナバロン | ブラックタイド | サクラバクシンオー | 57.0 | 林謙佑 | 高知 | NULL | NULL | 大島牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:22.000Z | 2025-12-20T06:58:22.000Z |
| 202512201231 | 8 | 11 | ダノンテイオー | 牡9 | 黒鹿毛 | 16 | 3 | ダノンテイオー | ディープインパクト | Dr Fong | 56.0 | 城野慈 | 高知 | NULL | NULL | 社台ファーム | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:22.000Z | 2025-12-20T06:58:22.000Z |
| 202512201231 | 8 | 12 | チュウオーハーン | 牡3 | 栗毛 | 22 | 2 | チュウオーハーン | ダンカーク | サクラバクシンオー | 57.0 | 西森将 | 高知 | NULL | NULL | 木村牧場 | NULL | NULL | NULL | NULL | NULL | NULL | 2025-12-20T06:58:22.000Z | 2025-12-20T06:58:22.000Z |

---

## Table: sire_ranking

### Schema

| Field | Type | Null | Key | Default | Extra |
|---|---|---|---|---|---|
| distance_m | int | NO | PRI | null |  |
| sire_id | bigint | NO | PRI | null |  |
| sire_name | varchar(255) | NO |  | null |  |
| score | int | NO |  | null |  |

### Data (1424 rows)

| distance_m | sire_id | sire_name | score |
| --- | --- | --- | --- |
| 800 | 310467 | サウスヴィグラス(USA) | 63 |
| 800 | 325200 | ジャングルポケット | 46 |
| 800 | 325977 | ショウナンカンプ | 7 |
| 800 | 372784 | キングズベスト(USA) | 27 |
| 800 | 375505 | スウェプトオーヴァーボード(USA) | 55 |
| 800 | 701668 | ゼンノロブロイ | 12 |
| 800 | 725485 | ダイワメジャー | 6 |
| 800 | 727032 | メイショウボーラー | 64 |
| 800 | 751334 | ホールウォーカー | 42 |
| 800 | 760877 | アドマイヤムーン | 54 |
| 800 | 761992 | バンブーエール | 71 |
| 800 | 762445 | マツリダゴッホ | 19 |
| 800 | 801447 | スクリーンヒーロー | 43 |
| 800 | 807282 | フリオーソ | 70 |
| 800 | 848478 | ロージズインメイ(USA) | 11 |
| 800 | 853225 | スズカコーズウェイ | 67 |
| 800 | 881793 | スマートファルコン | 73 |
| 800 | 888832 | エスポワールシチー | 100 |
| 800 | 891931 | ディープスカイ | 4 |
| 800 | 901749 | キンシャサノキセキ(AUS) | 85 |
| 800 | 985381 | ディスクリートキャット(USA) | 97 |
| 800 | 989072 | トランセンド | 68 |
| 800 | 990058 | ナムラタイタン | 84 |
| 800 | 991842 | リーチザクラウン | 36 |
| 800 | 995275 | ストロングリターン | 20 |
| 800 | 995651 | ジョーカプチーノ | 28 |
| 800 | 1025279 | シニスターミニスター(USA) | 94 |
| 800 | 1028940 | ヘニーヒューズ(USA) | 56 |
| 800 | 1043835 | タイセイレジェンド | 50 |
| 800 | 1052586 | エイシンフラッシュ | 3 |
| 800 | 1083691 | マジェスティックウォリアー(USA) | 80 |
| 800 | 1085636 | パイロ(USA) | 86 |
| 800 | 1088803 | ウインバリアシオン | 38 |
| 800 | 1089850 | ロードカナロア | 61 |
| 800 | 1090360 | オルフェーヴル | 23 |
| 800 | 1106251 | ジャスタウェイ | 59 |
| 800 | 1107477 | ホッコータルマエ | 92 |
| 800 | 1109433 | ポアゾンブラック | 89 |
| 800 | 1110454 | カレンブラックヒル | 81 |
| 800 | 1110458 | フェノーメノ | 52 |
| 800 | 1110554 | ディープブリランテ | 17 |
| 800 | 1111008 | ワールドエース | 66 |
| 800 | 1121332 | コパノリチャード | 30 |
| 800 | 1122040 | ラブリーデイ | 51 |
| 800 | 1122883 | キタサンミカヅキ | 65 |
| 800 | 1123166 | コパノリッキー | 98 |
| 800 | 1127268 | ヴィットリオドーロ(USA) | 21 |
| 800 | 1127395 | ダンカーク(USA) | 78 |
| 800 | 1128605 | アニマルキングダム(USA) | 5 |
| 800 | 1134576 | トゥザワールド | 58 |
| 800 | 1134867 | レッドファルクス | 82 |
| 800 | 1135217 | ニシケンモノノフ | 87 |
| 800 | 1137087 | シゲルカガ | 44 |
| 800 | 1137511 | エイシンヒカリ | 47 |
| 800 | 1139796 | ネロ | 83 |
| 800 | 1141719 | ミッキーアイル | 90 |
| 800 | 1142398 | イスラボニータ | 10 |
| 800 | 1142673 | ビッグアーサー | 62 |
| 800 | 1149689 | ブルドッグボス | 25 |
| 800 | 1152403 | シュヴァルグラン | 76 |
| 800 | 1153481 | オールブラッシュ | 9 |
| 800 | 1162685 | ダノンレジェンド(USA) | 69 |
| 800 | 1162862 | シャンハイボビー(USA) | 2 |
| 800 | 1163175 | ベストウォーリア(USA) | 99 |
| 800 | 1164976 | トビーズコーナー(USA) | 75 |
| 800 | 1167517 | ディーマジェスティ | 57 |
| 800 | 1170063 | リオンディーズ | 39 |
| 800 | 1170750 | ゴールドドリーム | 72 |
| 800 | 1171845 | シルバーステート | 53 |
| 800 | 1173702 | ファインニードル | 60 |
| 800 | 1175196 | ミッキーロケット | 48 |
| 800 | 1177896 | アジアエクスプレス(USA) | 91 |
| 800 | 1178418 | ノヴェリスト(IRE) | 15 |
| 800 | 1181460 | デクラレーションオブウォー(USA) | 41 |
| 800 | 1186327 | エピカリス | 74 |
| 800 | 1189935 | サトノアレス | 29 |
| 800 | 1190059 | スワーヴリチャード | 31 |
| 800 | 1190850 | キセキ | 34 |
| 800 | 1191607 | アルアイン | 24 |
| 800 | 1193277 | モーニン(USA) | 93 |
| 800 | 1193283 | アポロケンタッキー(USA) | 18 |
| 800 | 1193308 | ルックスザットキル(USA) | 26 |
| 800 | 1195380 | Kantharos(USA) | 34 |
| 800 | 1205475 | ルヴァンスレーヴ | 77 |
| 800 | 1209439 | タワーオブロンドン | 79 |
| 800 | 1211258 | カリフォルニアクローム(USA) | 22 |
| 800 | 1213491 | モズアスコット(USA) | 36 |
| 800 | 1215726 | クリソベリル | 14 |
| 800 | 1224373 | タリスマニック(GB) | 96 |
| 800 | 1225918 | ザファクター(USA) | 49 |
| 800 | 1226963 | サンダースノー(IRE) | 16 |
| 800 | 1240339 | Violence(USA) | 13 |
| 800 | 1241663 | ミスターメロディ(USA) | 40 |
| 800 | 1243519 | ビーチパトロール(USA) | 37 |
| 800 | 1244377 | アメリカンペイトリオット(USA) | 95 |
| 800 | 1292219 | City of Light(USA) | 45 |
| 800 | 1295299 | Audible(USA) | 34 |
| 800 | 1298815 | ニューイヤーズデイ(USA) | 8 |
| 800 | 1302899 | マインドユアビスケッツ(USA) | 1 |
| 800 | 1341999 | フォーウィールドライブ(USA) | 88 |
| 1000 | 310467 | サウスヴィグラス(USA) | 75 |
| 1000 | 615577 | クロフネ(USA) | 67 |
| 1000 | 725485 | ダイワメジャー | 68 |
| 1000 | 727032 | メイショウボーラー | 58 |
| 1000 | 760877 | アドマイヤムーン | 44 |
| 1000 | 761992 | バンブーエール | 60 |
| 1000 | 801447 | スクリーンヒーロー | 32 |
| 1000 | 807282 | フリオーソ | 72 |
| 1000 | 849057 | バゴ(FR) | 21 |
| 1000 | 853225 | スズカコーズウェイ | 12 |
| 1000 | 881793 | スマートファルコン | 79 |
| 1000 | 888832 | エスポワールシチー | 84 |
| 1000 | 900065 | アポロキングダム(USA) | 52 |
| 1000 | 901749 | キンシャサノキセキ(AUS) | 100 |
| 1000 | 985381 | ディスクリートキャット(USA) | 77 |
| 1000 | 990058 | ナムラタイタン | 4 |
| 1000 | 991842 | リーチザクラウン | 39 |
| 1000 | 995275 | ストロングリターン | 61 |
| 1000 | 995651 | ジョーカプチーノ | 36 |
| 1000 | 1025279 | シニスターミニスター(USA) | 93 |
| 1000 | 1028940 | ヘニーヒューズ(USA) | 99 |
| 1000 | 1032639 | Dandy Man(IRE) | 11 |
| 1000 | 1042049 | ルーラーシップ | 27 |
| 1000 | 1043835 | タイセイレジェンド | 38 |
| 1000 | 1044310 | パドトロワ | 25 |
| 1000 | 1046333 | ヴィクトワールピサ | 33 |
| 1000 | 1083691 | マジェスティックウォリアー(USA) | 88 |
| 1000 | 1085636 | パイロ(USA) | 86 |
| 1000 | 1088812 | リアルインパクト | 26 |
| 1000 | 1089850 | ロードカナロア | 98 |
| 1000 | 1090360 | オルフェーヴル | 28 |
| 1000 | 1106251 | ジャスタウェイ | 64 |
| 1000 | 1107477 | ホッコータルマエ | 80 |
| 1000 | 1108175 | ハクサンムーン | 9 |
| 1000 | 1109433 | ポアゾンブラック | 24 |
| 1000 | 1110454 | カレンブラックヒル | 59 |
| 1000 | 1110554 | ディープブリランテ | 47 |
| 1000 | 1121332 | コパノリチャード | 6 |
| 1000 | 1122040 | ラブリーデイ | 42 |
| 1000 | 1122883 | キタサンミカヅキ | 7 |
| 1000 | 1123166 | コパノリッキー | 89 |
| 1000 | 1127395 | ダンカーク(USA) | 50 |
| 1000 | 1128605 | アニマルキングダム(USA) | 1 |
| 1000 | 1128881 | マクフィ(GB) | 69 |
| 1000 | 1134576 | トゥザワールド | 45 |
| 1000 | 1134867 | レッドファルクス | 53 |
| 1000 | 1135217 | ニシケンモノノフ | 41 |
| 1000 | 1135823 | ハッピースプリント | 5 |
| 1000 | 1137087 | シゲルカガ | 51 |
| 1000 | 1137511 | エイシンヒカリ | 16 |
| 1000 | 1137571 | サトノアラジン | 56 |
| 1000 | 1138240 | モーリス | 66 |
| 1000 | 1141719 | ミッキーアイル | 96 |
| 1000 | 1142398 | イスラボニータ | 82 |
| 1000 | 1142673 | ビッグアーサー | 94 |
| 1000 | 1147205 | Dialed In(USA) | 20 |
| 1000 | 1149689 | ブルドッグボス | 30 |
| 1000 | 1151936 | ドゥラメンテ | 3 |
| 1000 | 1152403 | シュヴァルグラン | 35 |
| 1000 | 1157711 | リアルスティール | 65 |
| 1000 | 1162685 | ダノンレジェンド(USA) | 97 |
| 1000 | 1162862 | シャンハイボビー(USA) | 48 |
| 1000 | 1162905 | サトノクラウン | 40 |
| 1000 | 1163175 | ベストウォーリア(USA) | 90 |
| 1000 | 1164976 | トビーズコーナー(USA) | 22 |
| 1000 | 1167517 | ディーマジェスティ | 78 |
| 1000 | 1169928 | レインボーライン | 14 |
| 1000 | 1170063 | リオンディーズ | 91 |
| 1000 | 1170750 | ゴールドドリーム | 55 |
| 1000 | 1173702 | ファインニードル | 49 |
| 1000 | 1176060 | Shackleford(USA) | 8 |
| 1000 | 1177896 | アジアエクスプレス(USA) | 95 |
| 1000 | 1181460 | デクラレーションオブウォー(USA) | 83 |
| 1000 | 1190059 | スワーヴリチャード | 31 |
| 1000 | 1193277 | モーニン(USA) | 92 |
| 1000 | 1193283 | アポロケンタッキー(USA) | 34 |
| 1000 | 1205475 | ルヴァンスレーヴ | 46 |
| 1000 | 1208294 | ダノンプレミアム | 2 |
| 1000 | 1209439 | タワーオブロンドン | 76 |
| 1000 | 1211258 | カリフォルニアクローム(USA) | 62 |
| 1000 | 1213491 | モズアスコット(USA) | 85 |
| 1000 | 1217150 | オーヴァルエース | 57 |
| 1000 | 1222285 | マテラスカイ(USA) | 23 |
| 1000 | 1224373 | タリスマニック(GB) | 87 |
| 1000 | 1225918 | ザファクター(USA) | 17 |
| 1000 | 1226963 | サンダースノー(IRE) | 71 |
| 1000 | 1238289 | American Pharoah(USA) | 70 |
| 1000 | 1240055 | ドレフォン(USA) | 74 |
| 1000 | 1241663 | ミスターメロディ(USA) | 73 |
| 1000 | 1244377 | アメリカンペイトリオット(USA) | 54 |
| 1000 | 1270982 | Nyquist(USA) | 11 |
| 1000 | 1288621 | Gun Runner(USA) | 13 |
| 1000 | 1292219 | City of Light(USA) | 20 |
| 1000 | 1298815 | ニューイヤーズデイ(USA) | 63 |
| 1000 | 1302899 | マインドユアビスケッツ(USA) | 43 |
| 1000 | 1328857 | ナダル(USA) | 15 |
| 1000 | 1341999 | フォーウィールドライブ(USA) | 81 |
| 1000 | 1350527 | ミスチヴィアスアレックス(USA) | 18 |
| 1000 | 1364139 | Tiz the Law(USA) | 29 |
| 1000 | 1383874 | Army Mule(USA) | 37 |
| 1100 | 722797 | ブラックタイド | 28 |
| 1100 | 727032 | メイショウボーラー | 10 |
| 1100 | 761992 | バンブーエール | 47 |
| 1100 | 807282 | フリオーソ | 54 |
| 1100 | 849057 | バゴ(FR) | 32 |
| 1100 | 853225 | スズカコーズウェイ | 15 |
| 1100 | 881793 | スマートファルコン | 89 |
| 1100 | 888832 | エスポワールシチー | 94 |
| 1100 | 901749 | キンシャサノキセキ(AUS) | 73 |
| 1100 | 985381 | ディスクリートキャット(USA) | 3 |
| 1100 | 990058 | ナムラタイタン | 44 |
| 1100 | 995275 | ストロングリターン | 77 |
| 1100 | 1025279 | シニスターミニスター(USA) | 65 |
| 1100 | 1028940 | ヘニーヒューズ(USA) | 95 |
| 1100 | 1043835 | タイセイレジェンド | 27 |
| 1100 | 1044310 | パドトロワ | 67 |
| 1100 | 1049453 | ドリームバレンチノ | 88 |
| 1100 | 1052586 | エイシンフラッシュ | 15 |
| 1100 | 1083691 | マジェスティックウォリアー(USA) | 82 |
| 1100 | 1085636 | パイロ(USA) | 92 |
| 1100 | 1088812 | リアルインパクト | 62 |
| 1100 | 1089850 | ロードカナロア | 40 |
| 1100 | 1103563 | ハタノヴァンクール | 8 |
| 1100 | 1104811 | ゴールドシップ | 12 |
| 1100 | 1107477 | ホッコータルマエ | 99 |
| 1100 | 1110454 | カレンブラックヒル | 78 |
| 1100 | 1110554 | ディープブリランテ | 47 |
| 1100 | 1111008 | ワールドエース | 8 |
| 1100 | 1111834 | バトルプラン(USA) | 3 |
| 1100 | 1117585 | クラグオー | 52 |
| 1100 | 1122040 | ラブリーデイ | 54 |
| 1100 | 1122883 | キタサンミカヅキ | 64 |
| 1100 | 1123166 | コパノリッキー | 85 |
| 1100 | 1124297 | エピファネイア | 5 |
| 1100 | 1126608 | インカンテーション | 56 |
| 1100 | 1127395 | ダンカーク(USA) | 68 |
| 1100 | 1128881 | マクフィ(GB) | 20 |
| 1100 | 1134576 | トゥザワールド | 34 |
| 1100 | 1135217 | ニシケンモノノフ | 66 |
| 1100 | 1135823 | ハッピースプリント | 5 |
| 1100 | 1137087 | シゲルカガ | 27 |
| 1100 | 1137511 | エイシンヒカリ | 93 |
| 1100 | 1137571 | サトノアラジン | 33 |
| 1100 | 1142398 | イスラボニータ | 71 |
| 1100 | 1142673 | ビッグアーサー | 21 |
| 1100 | 1144181 | エーシントップ(USA) | 62 |
| 1100 | 1152403 | シュヴァルグラン | 48 |
| 1100 | 1154658 | ミュゼスルタン | 20 |
| 1100 | 1157711 | リアルスティール | 50 |
| 1100 | 1161937 | ノーブルミッション(GB) | 40 |
| 1100 | 1162685 | ダノンレジェンド(USA) | 98 |
| 1100 | 1162862 | シャンハイボビー(USA) | 42 |
| 1100 | 1163175 | ベストウォーリア(USA) | 84 |
| 1100 | 1164976 | トビーズコーナー(USA) | 58 |
| 1100 | 1167517 | ディーマジェスティ | 80 |
| 1100 | 1168048 | キョウエイギア | 40 |
| 1100 | 1168238 | スマートオーディン | 3 |
| 1100 | 1170750 | ゴールドドリーム | 57 |
| 1100 | 1171845 | シルバーステート | 91 |
| 1100 | 1175196 | ミッキーロケット | 62 |
| 1100 | 1177848 | マスクゾロ(USA) | 52 |
| 1100 | 1177896 | アジアエクスプレス(USA) | 81 |
| 1100 | 1181460 | デクラレーションオブウォー(USA) | 87 |
| 1100 | 1185811 | サングレーザー | 23 |
| 1100 | 1186187 | モンドキャンノ | 25 |
| 1100 | 1186327 | エピカリス | 8 |
| 1100 | 1189721 | レイデオロ | 29 |
| 1100 | 1190850 | キセキ | 20 |
| 1100 | 1193277 | モーニン(USA) | 100 |
| 1100 | 1193283 | アポロケンタッキー(USA) | 55 |
| 1100 | 1203083 | エポカドーロ | 12 |
| 1100 | 1205475 | ルヴァンスレーヴ | 59 |
| 1100 | 1206175 | インディチャンプ | 70 |
| 1100 | 1209439 | タワーオブロンドン | 32 |
| 1100 | 1211258 | カリフォルニアクローム(USA) | 96 |
| 1100 | 1213491 | モズアスコット(USA) | 63 |
| 1100 | 1215724 | サートゥルナーリア | 22 |
| 1100 | 1215726 | クリソベリル | 49 |
| 1100 | 1217103 | ステッペンウルフ | 72 |
| 1100 | 1219361 | ゴルトマイスター | 25 |
| 1100 | 1221464 | ロジャーバローズ | 75 |
| 1100 | 1222203 | ユアーズトゥルーリ | 16 |
| 1100 | 1222285 | マテラスカイ(USA) | 86 |
| 1100 | 1224373 | タリスマニック(GB) | 83 |
| 1100 | 1226963 | サンダースノー(IRE) | 97 |
| 1100 | 1227898 | クリエイター２(USA) | 42 |
| 1100 | 1241663 | ミスターメロディ(USA) | 40 |
| 1100 | 1243519 | ビーチパトロール(USA) | 13 |
| 1100 | 1244377 | アメリカンペイトリオット(USA) | 90 |
| 1100 | 1252338 | フィレンツェファイア(USA) | 74 |
| 1100 | 1289896 | ホークビル(USA) | 36 |
| 1100 | 1293348 | ブリックスアンドモルタル(USA) | 45 |
| 1100 | 1293778 | ベンバトル(GB) | 10 |
| 1100 | 1298815 | ニューイヤーズデイ(USA) | 79 |
| 1100 | 1302899 | マインドユアビスケッツ(USA) | 69 |
| 1100 | 1328857 | ナダル(USA) | 20 |
| 1100 | 1330729 | シスキン(USA) | 43 |
| 1100 | 1341999 | フォーウィールドライブ(USA) | 76 |
| 1100 | 1346357 | ヴァンゴッホ(USA) | 32 |
| 1100 | 1350527 | ミスチヴィアスアレックス(USA) | 35 |
| 1200 | 310467 | サウスヴィグラス(USA) | 21 |
| 1200 | 321265 | ノボジャック(USA) | 26 |
| 1200 | 619768 | ゴールドアリュール | 3 |
| 1200 | 719250 | Speightstown(USA) | 62 |
| 1200 | 725485 | ダイワメジャー | 77 |
| 1200 | 761992 | バンブーエール | 17 |
| 1200 | 801447 | スクリーンヒーロー | 20 |
| 1200 | 807282 | フリオーソ | 88 |
| 1200 | 848478 | ロージズインメイ(USA) | 58 |
| 1200 | 849057 | バゴ(FR) | 36 |
| 1200 | 853225 | スズカコーズウェイ | 38 |
| 1200 | 881793 | スマートファルコン | 50 |
| 1200 | 888832 | エスポワールシチー | 94 |
| 1200 | 900065 | アポロキングダム(USA) | 53 |
| 1200 | 901749 | キンシャサノキセキ(AUS) | 87 |
| 1200 | 978108 | Ghostzapper(USA) | 1 |
| 1200 | 985381 | ディスクリートキャット(USA) | 92 |
| 1200 | 989072 | トランセンド | 47 |
| 1200 | 995275 | ストロングリターン | 32 |
| 1200 | 995651 | ジョーカプチーノ | 64 |
| 1200 | 1025279 | シニスターミニスター(USA) | 96 |
| 1200 | 1028940 | ヘニーヒューズ(USA) | 100 |
| 1200 | 1042049 | ルーラーシップ | 24 |
| 1200 | 1043835 | タイセイレジェンド | 4 |
| 1200 | 1044310 | パドトロワ | 15 |
| 1200 | 1046333 | ヴィクトワールピサ | 25 |
| 1200 | 1052586 | エイシンフラッシュ | 1 |
| 1200 | 1083691 | マジェスティックウォリアー(USA) | 85 |
| 1200 | 1084779 | Into Mischief(USA) | 73 |
| 1200 | 1085636 | パイロ(USA) | 89 |
| 1200 | 1088812 | リアルインパクト | 43 |
| 1200 | 1089850 | ロードカナロア | 99 |
| 1200 | 1090360 | オルフェーヴル | 41 |
| 1200 | 1106251 | ジャスタウェイ | 54 |
| 1200 | 1107477 | ホッコータルマエ | 93 |
| 1200 | 1110454 | カレンブラックヒル | 79 |
| 1200 | 1110554 | ディープブリランテ | 49 |
| 1200 | 1111008 | ワールドエース | 7 |
| 1200 | 1111834 | バトルプラン(USA) | 10 |
| 1200 | 1120570 | キズナ | 45 |
| 1200 | 1122040 | ラブリーデイ | 8 |
| 1200 | 1123166 | コパノリッキー | 91 |
| 1200 | 1124297 | エピファネイア | 60 |
| 1200 | 1124405 | ロゴタイプ | 16 |
| 1200 | 1127395 | ダンカーク(USA) | 34 |
| 1200 | 1128605 | アニマルキングダム(USA) | 22 |
| 1200 | 1128881 | マクフィ(GB) | 74 |
| 1200 | 1134576 | トゥザワールド | 37 |
| 1200 | 1134867 | レッドファルクス | 67 |
| 1200 | 1135217 | ニシケンモノノフ | 12 |
| 1200 | 1137511 | エイシンヒカリ | 29 |
| 1200 | 1137571 | サトノアラジン | 70 |
| 1200 | 1138240 | モーリス | 81 |
| 1200 | 1141719 | ミッキーアイル | 71 |
| 1200 | 1142398 | イスラボニータ | 86 |
| 1200 | 1142673 | ビッグアーサー | 75 |
| 1200 | 1149061 | グレーターロンドン | 55 |
| 1200 | 1151936 | ドゥラメンテ | 65 |
| 1200 | 1152403 | シュヴァルグラン | 30 |
| 1200 | 1157711 | リアルスティール | 83 |
| 1200 | 1162685 | ダノンレジェンド(USA) | 95 |
| 1200 | 1162862 | シャンハイボビー(USA) | 68 |
| 1200 | 1163175 | ベストウォーリア(USA) | 80 |
| 1200 | 1164410 | Twirling Candy(USA) | 6 |
| 1200 | 1164976 | トビーズコーナー(USA) | 44 |
| 1200 | 1167517 | ディーマジェスティ | 51 |
| 1200 | 1170063 | リオンディーズ | 78 |
| 1200 | 1170750 | ゴールドドリーム | 66 |
| 1200 | 1171845 | シルバーステート | 52 |
| 1200 | 1173702 | ファインニードル | 39 |
| 1200 | 1175221 | サトノダイヤモンド | 46 |
| 1200 | 1177896 | アジアエクスプレス(USA) | 98 |
| 1200 | 1181460 | デクラレーションオブウォー(USA) | 72 |
| 1200 | 1186327 | エピカリス | 11 |
| 1200 | 1191607 | アルアイン | 9 |
| 1200 | 1193277 | モーニン(USA) | 90 |
| 1200 | 1193308 | ルックスザットキル(USA) | 27 |
| 1200 | 1193574 | パレスマリス(USA) | 19 |
| 1200 | 1194505 | ラニ(USA) | 48 |
| 1200 | 1197426 | Frosted(USA) | 35 |
| 1200 | 1205475 | ルヴァンスレーヴ | 59 |
| 1200 | 1209439 | タワーオブロンドン | 23 |
| 1200 | 1211037 | Shalaa(IRE) | 14 |
| 1200 | 1211258 | カリフォルニアクローム(USA) | 69 |
| 1200 | 1213491 | モズアスコット(USA) | 63 |
| 1200 | 1221464 | ロジャーバローズ | 3 |
| 1200 | 1222285 | マテラスカイ(USA) | 18 |
| 1200 | 1224373 | タリスマニック(GB) | 40 |
| 1200 | 1225918 | ザファクター(USA) | 28 |
| 1200 | 1226963 | サンダースノー(IRE) | 76 |
| 1200 | 1238289 | American Pharoah(USA) | 33 |
| 1200 | 1240055 | ドレフォン(USA) | 97 |
| 1200 | 1241663 | ミスターメロディ(USA) | 61 |
| 1200 | 1244377 | アメリカンペイトリオット(USA) | 57 |
| 1200 | 1288621 | Gun Runner(USA) | 4 |
| 1200 | 1293348 | ブリックスアンドモルタル(USA) | 5 |
| 1200 | 1298815 | ニューイヤーズデイ(USA) | 84 |
| 1200 | 1302899 | マインドユアビスケッツ(USA) | 31 |
| 1200 | 1313451 | Justify(USA) | 13 |
| 1200 | 1328857 | ナダル(USA) | 56 |
| 1200 | 1341999 | フォーウィールドライブ(USA) | 82 |
| 1200 | 1349210 | Shancelot(USA) | 2 |
| 1200 | 1383193 | Volatile(USA) | 42 |
| 1300 | 310467 | サウスヴィグラス(USA) | 72 |
| 1300 | 372825 | プリサイスエンド(USA) | 19 |
| 1300 | 714411 | ケイムホーム(USA) | 33 |
| 1300 | 722158 | ハーツクライ | 45 |
| 1300 | 725485 | ダイワメジャー | 74 |
| 1300 | 727032 | メイショウボーラー | 32 |
| 1300 | 729458 | キングカメハメハ | 8 |
| 1300 | 761992 | バンブーエール | 58 |
| 1300 | 762445 | マツリダゴッホ | 5 |
| 1300 | 801447 | スクリーンヒーロー | 63 |
| 1300 | 807282 | フリオーソ | 82 |
| 1300 | 848478 | ロージズインメイ(USA) | 87 |
| 1300 | 849057 | バゴ(FR) | 23 |
| 1300 | 853225 | スズカコーズウェイ | 17 |
| 1300 | 881793 | スマートファルコン | 69 |
| 1300 | 888832 | エスポワールシチー | 94 |
| 1300 | 901749 | キンシャサノキセキ(AUS) | 90 |
| 1300 | 985381 | ディスクリートキャット(USA) | 79 |
| 1300 | 989072 | トランセンド | 16 |
| 1300 | 991842 | リーチザクラウン | 27 |
| 1300 | 991898 | トーセンジョーダン | 56 |
| 1300 | 995275 | ストロングリターン | 73 |
| 1300 | 995651 | ジョーカプチーノ | 28 |
| 1300 | 1025279 | シニスターミニスター(USA) | 86 |
| 1300 | 1028940 | ヘニーヒューズ(USA) | 99 |
| 1300 | 1040066 | カジノドライヴ(USA) | 36 |
| 1300 | 1042049 | ルーラーシップ | 55 |
| 1300 | 1043831 | トゥザグローリー | 22 |
| 1300 | 1044310 | パドトロワ | 29 |
| 1300 | 1046333 | ヴィクトワールピサ | 13 |
| 1300 | 1052586 | エイシンフラッシュ | 34 |
| 1300 | 1083691 | マジェスティックウォリアー(USA) | 98 |
| 1300 | 1085636 | パイロ(USA) | 93 |
| 1300 | 1088812 | リアルインパクト | 41 |
| 1300 | 1089850 | ロードカナロア | 96 |
| 1300 | 1090360 | オルフェーヴル | 47 |
| 1300 | 1090394 | グランプリボス | 21 |
| 1300 | 1090769 | ダノンバラード | 4 |
| 1300 | 1101689 | ヴァンセンヌ | 35 |
| 1300 | 1104811 | ゴールドシップ | 53 |
| 1300 | 1106251 | ジャスタウェイ | 40 |
| 1300 | 1107477 | ホッコータルマエ | 83 |
| 1300 | 1110454 | カレンブラックヒル | 95 |
| 1300 | 1110554 | ディープブリランテ | 43 |
| 1300 | 1111008 | ワールドエース | 6 |
| 1300 | 1120570 | キズナ | 3 |
| 1300 | 1122040 | ラブリーデイ | 11 |
| 1300 | 1123166 | コパノリッキー | 92 |
| 1300 | 1124297 | エピファネイア | 51 |
| 1300 | 1124405 | ロゴタイプ | 49 |
| 1300 | 1127395 | ダンカーク(USA) | 68 |
| 1300 | 1128605 | アニマルキングダム(USA) | 3 |
| 1300 | 1128881 | マクフィ(GB) | 84 |
| 1300 | 1134576 | トゥザワールド | 1 |
| 1300 | 1134867 | レッドファルクス | 59 |
| 1300 | 1135217 | ニシケンモノノフ | 67 |
| 1300 | 1137511 | エイシンヒカリ | 39 |
| 1300 | 1137571 | サトノアラジン | 65 |
| 1300 | 1138240 | モーリス | 24 |
| 1300 | 1141719 | ミッキーアイル | 77 |
| 1300 | 1142398 | イスラボニータ | 44 |
| 1300 | 1142673 | ビッグアーサー | 57 |
| 1300 | 1148419 | ベーカバド(FR) | 13 |
| 1300 | 1149061 | グレーターロンドン | 37 |
| 1300 | 1151936 | ドゥラメンテ | 85 |
| 1300 | 1152403 | シュヴァルグラン | 7 |
| 1300 | 1157711 | リアルスティール | 88 |
| 1300 | 1162685 | ダノンレジェンド(USA) | 97 |
| 1300 | 1162862 | シャンハイボビー(USA) | 70 |
| 1300 | 1162905 | サトノクラウン | 64 |
| 1300 | 1163175 | ベストウォーリア(USA) | 78 |
| 1300 | 1164976 | トビーズコーナー(USA) | 48 |
| 1300 | 1167517 | ディーマジェスティ | 10 |
| 1300 | 1170063 | リオンディーズ | 80 |
| 1300 | 1170750 | ゴールドドリーム | 71 |
| 1300 | 1171845 | シルバーステート | 42 |
| 1300 | 1173702 | ファインニードル | 52 |
| 1300 | 1175221 | サトノダイヤモンド | 12 |
| 1300 | 1177347 | ウィルテイクチャージ(USA) | 62 |
| 1300 | 1177896 | アジアエクスプレス(USA) | 81 |
| 1300 | 1178418 | ノヴェリスト(IRE) | 5 |
| 1300 | 1181460 | デクラレーションオブウォー(USA) | 50 |
| 1300 | 1190059 | スワーヴリチャード | 4 |
| 1300 | 1191607 | アルアイン | 54 |
| 1300 | 1192958 | モンテロッソ(GB) | 14 |
| 1300 | 1193277 | モーニン(USA) | 66 |
| 1300 | 1203083 | エポカドーロ | 26 |
| 1300 | 1205475 | ルヴァンスレーヴ | 2 |
| 1300 | 1208483 | ヘンリーバローズ | 25 |
| 1300 | 1211258 | カリフォルニアクローム(USA) | 18 |
| 1300 | 1213491 | モズアスコット(USA) | 20 |
| 1300 | 1221956 | アドマイヤマーズ | 30 |
| 1300 | 1224373 | タリスマニック(GB) | 91 |
| 1300 | 1226963 | サンダースノー(IRE) | 76 |
| 1300 | 1227898 | クリエイター２(USA) | 15 |
| 1300 | 1240055 | ドレフォン(USA) | 100 |
| 1300 | 1243519 | ビーチパトロール(USA) | 60 |
| 1300 | 1244377 | アメリカンペイトリオット(USA) | 89 |
| 1300 | 1288621 | Gun Runner(USA) | 31 |
| 1300 | 1293348 | ブリックスアンドモルタル(USA) | 9 |
| 1300 | 1298815 | ニューイヤーズデイ(USA) | 38 |
| 1300 | 1302899 | マインドユアビスケッツ(USA) | 75 |
| 1300 | 1328857 | ナダル(USA) | 14 |
| 1300 | 1341999 | フォーウィールドライブ(USA) | 61 |
| 1300 | 1349210 | Shancelot(USA) | 46 |
| 1400 | 310467 | サウスヴィグラス(USA) | 8 |
| 1400 | 369832 | Lemon Drop Kid(USA) | 14 |
| 1400 | 701668 | ゼンノロブロイ | 1 |
| 1400 | 722158 | ハーツクライ | 61 |
| 1400 | 722797 | ブラックタイド | 38 |
| 1400 | 725485 | ダイワメジャー | 69 |
| 1400 | 727032 | メイショウボーラー | 32 |
| 1400 | 729458 | キングカメハメハ | 21 |
| 1400 | 761992 | バンブーエール | 30 |
| 1400 | 801447 | スクリーンヒーロー | 12 |
| 1400 | 807282 | フリオーソ | 57 |
| 1400 | 848478 | ロージズインメイ(USA) | 46 |
| 1400 | 849057 | バゴ(FR) | 4 |
| 1400 | 853225 | スズカコーズウェイ | 15 |
| 1400 | 881793 | スマートファルコン | 79 |
| 1400 | 888832 | エスポワールシチー | 90 |
| 1400 | 901749 | キンシャサノキセキ(AUS) | 77 |
| 1400 | 985381 | ディスクリートキャット(USA) | 76 |
| 1400 | 989072 | トランセンド | 27 |
| 1400 | 995275 | ストロングリターン | 60 |
| 1400 | 995651 | ジョーカプチーノ | 28 |
| 1400 | 1025279 | シニスターミニスター(USA) | 97 |
| 1400 | 1028940 | ヘニーヒューズ(USA) | 95 |
| 1400 | 1042049 | ルーラーシップ | 80 |
| 1400 | 1043831 | トゥザグローリー | 20 |
| 1400 | 1046333 | ヴィクトワールピサ | 10 |
| 1400 | 1052586 | エイシンフラッシュ | 29 |
| 1400 | 1083691 | マジェスティックウォリアー(USA) | 96 |
| 1400 | 1084779 | Into Mischief(USA) | 59 |
| 1400 | 1085636 | パイロ(USA) | 92 |
| 1400 | 1088812 | リアルインパクト | 43 |
| 1400 | 1089850 | ロードカナロア | 99 |
| 1400 | 1090360 | オルフェーヴル | 55 |
| 1400 | 1090394 | グランプリボス | 24 |
| 1400 | 1090769 | ダノンバラード | 53 |
| 1400 | 1101689 | ヴァンセンヌ | 9 |
| 1400 | 1104811 | ゴールドシップ | 14 |
| 1400 | 1106251 | ジャスタウェイ | 72 |
| 1400 | 1107477 | ホッコータルマエ | 94 |
| 1400 | 1110454 | カレンブラックヒル | 74 |
| 1400 | 1110554 | ディープブリランテ | 11 |
| 1400 | 1111008 | ワールドエース | 41 |
| 1400 | 1111834 | バトルプラン(USA) | 2 |
| 1400 | 1115148 | ハービンジャー(GB) | 26 |
| 1400 | 1120570 | キズナ | 84 |
| 1400 | 1122040 | ラブリーデイ | 33 |
| 1400 | 1123166 | コパノリッキー | 93 |
| 1400 | 1124297 | エピファネイア | 56 |
| 1400 | 1124405 | ロゴタイプ | 18 |
| 1400 | 1126608 | インカンテーション | 5 |
| 1400 | 1127395 | ダンカーク(USA) | 51 |
| 1400 | 1128605 | アニマルキングダム(USA) | 19 |
| 1400 | 1128881 | マクフィ(GB) | 73 |
| 1400 | 1134576 | トゥザワールド | 37 |
| 1400 | 1134867 | レッドファルクス | 50 |
| 1400 | 1137511 | エイシンヒカリ | 39 |
| 1400 | 1137571 | サトノアラジン | 58 |
| 1400 | 1138240 | モーリス | 85 |
| 1400 | 1141719 | ミッキーアイル | 86 |
| 1400 | 1142398 | イスラボニータ | 63 |
| 1400 | 1142673 | ビッグアーサー | 35 |
| 1400 | 1149061 | グレーターロンドン | 4 |
| 1400 | 1151936 | ドゥラメンテ | 82 |
| 1400 | 1152403 | シュヴァルグラン | 36 |
| 1400 | 1155349 | キタサンブラック | 31 |
| 1400 | 1157711 | リアルスティール | 88 |
| 1400 | 1162685 | ダノンレジェンド(USA) | 98 |
| 1400 | 1162862 | シャンハイボビー(USA) | 62 |
| 1400 | 1162905 | サトノクラウン | 34 |
| 1400 | 1163175 | ベストウォーリア(USA) | 81 |
| 1400 | 1164976 | トビーズコーナー(USA) | 16 |
| 1400 | 1167517 | ディーマジェスティ | 47 |
| 1400 | 1170063 | リオンディーズ | 78 |
| 1400 | 1170750 | ゴールドドリーム | 65 |
| 1400 | 1171845 | シルバーステート | 40 |
| 1400 | 1173702 | ファインニードル | 44 |
| 1400 | 1175221 | サトノダイヤモンド | 25 |
| 1400 | 1177896 | アジアエクスプレス(USA) | 91 |
| 1400 | 1181460 | デクラレーションオブウォー(USA) | 66 |
| 1400 | 1189721 | レイデオロ | 2 |
| 1400 | 1190059 | スワーヴリチャード | 13 |
| 1400 | 1191607 | アルアイン | 22 |
| 1400 | 1192958 | モンテロッソ(GB) | 7 |
| 1400 | 1193277 | モーニン(USA) | 89 |
| 1400 | 1193283 | アポロケンタッキー(USA) | 5 |
| 1400 | 1193574 | パレスマリス(USA) | 6 |
| 1400 | 1194505 | ラニ(USA) | 48 |
| 1400 | 1205475 | ルヴァンスレーヴ | 64 |
| 1400 | 1209439 | タワーオブロンドン | 17 |
| 1400 | 1211258 | カリフォルニアクローム(USA) | 54 |
| 1400 | 1213491 | モズアスコット(USA) | 70 |
| 1400 | 1224373 | タリスマニック(GB) | 49 |
| 1400 | 1225918 | ザファクター(USA) | 23 |
| 1400 | 1226963 | サンダースノー(IRE) | 75 |
| 1400 | 1238289 | American Pharoah(USA) | 45 |
| 1400 | 1240055 | ドレフォン(USA) | 100 |
| 1400 | 1241663 | ミスターメロディ(USA) | 3 |
| 1400 | 1243519 | ビーチパトロール(USA) | 67 |
| 1400 | 1244377 | アメリカンペイトリオット(USA) | 71 |
| 1400 | 1293348 | ブリックスアンドモルタル(USA) | 42 |
| 1400 | 1298815 | ニューイヤーズデイ(USA) | 87 |
| 1400 | 1302899 | マインドユアビスケッツ(USA) | 83 |
| 1400 | 1313451 | Justify(USA) | 1 |
| 1400 | 1328857 | ナダル(USA) | 68 |
| 1400 | 1341999 | フォーウィールドライブ(USA) | 52 |
| 1500 | 372825 | プリサイスエンド(USA) | 5 |
| 1500 | 701577 | ネオユニヴァース | 5 |
| 1500 | 722158 | ハーツクライ | 11 |
| 1500 | 722797 | ブラックタイド | 16 |
| 1500 | 725485 | ダイワメジャー | 37 |
| 1500 | 727032 | メイショウボーラー | 47 |
| 1500 | 760877 | アドマイヤムーン | 7 |
| 1500 | 761992 | バンブーエール | 31 |
| 1500 | 801447 | スクリーンヒーロー | 41 |
| 1500 | 807282 | フリオーソ | 82 |
| 1500 | 848478 | ロージズインメイ(USA) | 17 |
| 1500 | 849057 | バゴ(FR) | 35 |
| 1500 | 881793 | スマートファルコン | 76 |
| 1500 | 888832 | エスポワールシチー | 96 |
| 1500 | 901749 | キンシャサノキセキ(AUS) | 70 |
| 1500 | 985381 | ディスクリートキャット(USA) | 92 |
| 1500 | 989072 | トランセンド | 32 |
| 1500 | 991898 | トーセンジョーダン | 8 |
| 1500 | 995275 | ストロングリターン | 48 |
| 1500 | 995651 | ジョーカプチーノ | 42 |
| 1500 | 1025279 | シニスターミニスター(USA) | 84 |
| 1500 | 1028940 | ヘニーヒューズ(USA) | 91 |
| 1500 | 1042049 | ルーラーシップ | 85 |
| 1500 | 1043831 | トゥザグローリー | 23 |
| 1500 | 1046333 | ヴィクトワールピサ | 19 |
| 1500 | 1052586 | エイシンフラッシュ | 36 |
| 1500 | 1083691 | マジェスティックウォリアー(USA) | 99 |
| 1500 | 1085636 | パイロ(USA) | 93 |
| 1500 | 1088812 | リアルインパクト | 14 |
| 1500 | 1089850 | ロードカナロア | 94 |
| 1500 | 1089854 | ベルシャザール | 46 |
| 1500 | 1090360 | オルフェーヴル | 78 |
| 1500 | 1090769 | ダノンバラード | 45 |
| 1500 | 1091384 | スノードラゴン | 3 |
| 1500 | 1096885 | トーセンラー | 30 |
| 1500 | 1104811 | ゴールドシップ | 56 |
| 1500 | 1106251 | ジャスタウェイ | 74 |
| 1500 | 1107477 | ホッコータルマエ | 100 |
| 1500 | 1108175 | ハクサンムーン | 21 |
| 1500 | 1110454 | カレンブラックヒル | 79 |
| 1500 | 1110554 | ディープブリランテ | 12 |
| 1500 | 1111008 | ワールドエース | 59 |
| 1500 | 1111834 | バトルプラン(USA) | 53 |
| 1500 | 1115148 | ハービンジャー(GB) | 24 |
| 1500 | 1120570 | キズナ | 87 |
| 1500 | 1122040 | ラブリーデイ | 39 |
| 1500 | 1123166 | コパノリッキー | 95 |
| 1500 | 1124297 | エピファネイア | 64 |
| 1500 | 1124405 | ロゴタイプ | 55 |
| 1500 | 1127395 | ダンカーク(USA) | 65 |
| 1500 | 1128881 | マクフィ(GB) | 63 |
| 1500 | 1129173 | エスケンデレヤ(USA) | 61 |
| 1500 | 1134576 | トゥザワールド | 62 |
| 1500 | 1134867 | レッドファルクス | 75 |
| 1500 | 1136428 | ゴールドアクター | 27 |
| 1500 | 1137511 | エイシンヒカリ | 44 |
| 1500 | 1137571 | サトノアラジン | 22 |
| 1500 | 1138240 | モーリス | 60 |
| 1500 | 1141719 | ミッキーアイル | 13 |
| 1500 | 1142398 | イスラボニータ | 67 |
| 1500 | 1142673 | ビッグアーサー | 54 |
| 1500 | 1149061 | グレーターロンドン | 7 |
| 1500 | 1151314 | レーヴミストラル | 6 |
| 1500 | 1151936 | ドゥラメンテ | 57 |
| 1500 | 1152403 | シュヴァルグラン | 58 |
| 1500 | 1155349 | キタサンブラック | 34 |
| 1500 | 1157711 | リアルスティール | 86 |
| 1500 | 1162685 | ダノンレジェンド(USA) | 98 |
| 1500 | 1162862 | シャンハイボビー(USA) | 26 |
| 1500 | 1162905 | サトノクラウン | 69 |
| 1500 | 1163175 | ベストウォーリア(USA) | 51 |
| 1500 | 1163245 | アイルハヴアナザー(USA) | 3 |
| 1500 | 1164976 | トビーズコーナー(USA) | 49 |
| 1500 | 1167517 | ディーマジェスティ | 40 |
| 1500 | 1169928 | レインボーライン | 10 |
| 1500 | 1170063 | リオンディーズ | 88 |
| 1500 | 1170750 | ゴールドドリーム | 15 |
| 1500 | 1171845 | シルバーステート | 66 |
| 1500 | 1173702 | ファインニードル | 38 |
| 1500 | 1175196 | ミッキーロケット | 4 |
| 1500 | 1175221 | サトノダイヤモンド | 9 |
| 1500 | 1177896 | アジアエクスプレス(USA) | 89 |
| 1500 | 1181460 | デクラレーションオブウォー(USA) | 43 |
| 1500 | 1186327 | エピカリス | 2 |
| 1500 | 1189721 | レイデオロ | 33 |
| 1500 | 1191607 | アルアイン | 25 |
| 1500 | 1192958 | モンテロッソ(GB) | 28 |
| 1500 | 1193277 | モーニン(USA) | 80 |
| 1500 | 1193283 | アポロケンタッキー(USA) | 20 |
| 1500 | 1194505 | ラニ(USA) | 77 |
| 1500 | 1205475 | ルヴァンスレーヴ | 52 |
| 1500 | 1211258 | カリフォルニアクローム(USA) | 68 |
| 1500 | 1213491 | モズアスコット(USA) | 18 |
| 1500 | 1224373 | タリスマニック(GB) | 72 |
| 1500 | 1225918 | ザファクター(USA) | 1 |
| 1500 | 1226963 | サンダースノー(IRE) | 50 |
| 1500 | 1227898 | クリエイター２(USA) | 8 |
| 1500 | 1240055 | ドレフォン(USA) | 97 |
| 1500 | 1243519 | ビーチパトロール(USA) | 71 |
| 1500 | 1244377 | アメリカンペイトリオット(USA) | 73 |
| 1500 | 1293348 | ブリックスアンドモルタル(USA) | 83 |
| 1500 | 1298815 | ニューイヤーズデイ(USA) | 90 |
| 1500 | 1302899 | マインドユアビスケッツ(USA) | 81 |
| 1500 | 1328857 | ナダル(USA) | 29 |
| 1600 | 294840 | キングヘイロー | 6 |
| 1600 | 325098 | タイムパラドックス | 18 |
| 1600 | 369832 | Lemon Drop Kid(USA) | 60 |
| 1600 | 619768 | ゴールドアリュール | 43 |
| 1600 | 722158 | ハーツクライ | 58 |
| 1600 | 722797 | ブラックタイド | 59 |
| 1600 | 725485 | ダイワメジャー | 49 |
| 1600 | 727032 | メイショウボーラー | 19 |
| 1600 | 729458 | キングカメハメハ | 91 |
| 1600 | 761992 | バンブーエール | 23 |
| 1600 | 801447 | スクリーンヒーロー | 67 |
| 1600 | 807282 | フリオーソ | 74 |
| 1600 | 848478 | ロージズインメイ(USA) | 69 |
| 1600 | 881793 | スマートファルコン | 94 |
| 1600 | 888832 | エスポワールシチー | 88 |
| 1600 | 901749 | キンシャサノキセキ(AUS) | 78 |
| 1600 | 985381 | ディスクリートキャット(USA) | 75 |
| 1600 | 989072 | トランセンド | 47 |
| 1600 | 991842 | リーチザクラウン | 52 |
| 1600 | 995275 | ストロングリターン | 64 |
| 1600 | 995651 | ジョーカプチーノ | 15 |
| 1600 | 1025279 | シニスターミニスター(USA) | 96 |
| 1600 | 1028940 | ヘニーヒューズ(USA) | 99 |
| 1600 | 1042049 | ルーラーシップ | 71 |
| 1600 | 1043831 | トゥザグローリー | 1 |
| 1600 | 1046333 | ヴィクトワールピサ | 5 |
| 1600 | 1083691 | マジェスティックウォリアー(USA) | 83 |
| 1600 | 1084779 | Into Mischief(USA) | 70 |
| 1600 | 1085636 | パイロ(USA) | 93 |
| 1600 | 1088812 | リアルインパクト | 54 |
| 1600 | 1089850 | ロードカナロア | 100 |
| 1600 | 1089854 | ベルシャザール | 30 |
| 1600 | 1090360 | オルフェーヴル | 61 |
| 1600 | 1090769 | ダノンバラード | 37 |
| 1600 | 1104811 | ゴールドシップ | 13 |
| 1600 | 1106251 | ジャスタウェイ | 87 |
| 1600 | 1107477 | ホッコータルマエ | 95 |
| 1600 | 1110454 | カレンブラックヒル | 73 |
| 1600 | 1111008 | ワールドエース | 22 |
| 1600 | 1111834 | バトルプラン(USA) | 2 |
| 1600 | 1115148 | ハービンジャー(GB) | 9 |
| 1600 | 1120570 | キズナ | 97 |
| 1600 | 1122040 | ラブリーデイ | 68 |
| 1600 | 1123166 | コパノリッキー | 81 |
| 1600 | 1124297 | エピファネイア | 25 |
| 1600 | 1124405 | ロゴタイプ | 44 |
| 1600 | 1126608 | インカンテーション | 63 |
| 1600 | 1127395 | ダンカーク(USA) | 21 |
| 1600 | 1128605 | アニマルキングダム(USA) | 17 |
| 1600 | 1128881 | マクフィ(GB) | 50 |
| 1600 | 1129173 | エスケンデレヤ(USA) | 48 |
| 1600 | 1134576 | トゥザワールド | 8 |
| 1600 | 1134867 | レッドファルクス | 31 |
| 1600 | 1135217 | ニシケンモノノフ | 20 |
| 1600 | 1137511 | エイシンヒカリ | 11 |
| 1600 | 1137571 | サトノアラジン | 16 |
| 1600 | 1138240 | モーリス | 55 |
| 1600 | 1141719 | ミッキーアイル | 45 |
| 1600 | 1142398 | イスラボニータ | 42 |
| 1600 | 1151936 | ドゥラメンテ | 90 |
| 1600 | 1152403 | シュヴァルグラン | 4 |
| 1600 | 1155349 | キタサンブラック | 92 |
| 1600 | 1157711 | リアルスティール | 85 |
| 1600 | 1162685 | ダノンレジェンド(USA) | 82 |
| 1600 | 1162704 | アポロソニック(USA) | 1 |
| 1600 | 1162862 | シャンハイボビー(USA) | 32 |
| 1600 | 1162905 | サトノクラウン | 40 |
| 1600 | 1163175 | ベストウォーリア(USA) | 28 |
| 1600 | 1163245 | アイルハヴアナザー(USA) | 46 |
| 1600 | 1164976 | トビーズコーナー(USA) | 41 |
| 1600 | 1167517 | ディーマジェスティ | 51 |
| 1600 | 1170063 | リオンディーズ | 65 |
| 1600 | 1170750 | ゴールドドリーム | 36 |
| 1600 | 1171845 | シルバーステート | 27 |
| 1600 | 1173702 | ファインニードル | 10 |
| 1600 | 1175221 | サトノダイヤモンド | 12 |
| 1600 | 1177896 | アジアエクスプレス(USA) | 89 |
| 1600 | 1178418 | ノヴェリスト(IRE) | 6 |
| 1600 | 1181460 | デクラレーションオブウォー(USA) | 80 |
| 1600 | 1189721 | レイデオロ | 24 |
| 1600 | 1192958 | モンテロッソ(GB) | 57 |
| 1600 | 1193277 | モーニン(USA) | 62 |
| 1600 | 1194505 | ラニ(USA) | 56 |
| 1600 | 1205475 | ルヴァンスレーヴ | 79 |
| 1600 | 1211258 | カリフォルニアクローム(USA) | 66 |
| 1600 | 1213491 | モズアスコット(USA) | 34 |
| 1600 | 1221464 | ロジャーバローズ | 2 |
| 1600 | 1224373 | タリスマニック(GB) | 38 |
| 1600 | 1226463 | Maclean's Music(USA) | 33 |
| 1600 | 1226963 | サンダースノー(IRE) | 77 |
| 1600 | 1227898 | クリエイター２(USA) | 4 |
| 1600 | 1238289 | American Pharoah(USA) | 76 |
| 1600 | 1240055 | ドレフォン(USA) | 98 |
| 1600 | 1241663 | ミスターメロディ(USA) | 3 |
| 1600 | 1243519 | ビーチパトロール(USA) | 14 |
| 1600 | 1244377 | アメリカンペイトリオット(USA) | 29 |
| 1600 | 1244581 | Arrogate(USA) | 35 |
| 1600 | 1250287 | Mendelssohn(USA) | 53 |
| 1600 | 1293348 | ブリックスアンドモルタル(USA) | 26 |
| 1600 | 1298815 | ニューイヤーズデイ(USA) | 86 |
| 1600 | 1302899 | マインドユアビスケッツ(USA) | 84 |
| 1600 | 1313451 | Justify(USA) | 39 |
| 1600 | 1328857 | ナダル(USA) | 72 |
| 1600 | 1341999 | フォーウィールドライブ(USA) | 7 |
| 1700 | 372825 | プリサイスエンド(USA) | 5 |
| 1700 | 722158 | ハーツクライ | 73 |
| 1700 | 722797 | ブラックタイド | 61 |
| 1700 | 725485 | ダイワメジャー | 48 |
| 1700 | 729458 | キングカメハメハ | 68 |
| 1700 | 761992 | バンブーエール | 7 |
| 1700 | 801447 | スクリーンヒーロー | 65 |
| 1700 | 807282 | フリオーソ | 57 |
| 1700 | 848478 | ロージズインメイ(USA) | 44 |
| 1700 | 849057 | バゴ(FR) | 9 |
| 1700 | 881793 | スマートファルコン | 12 |
| 1700 | 888832 | エスポワールシチー | 82 |
| 1700 | 888992 | シルポート | 6 |
| 1700 | 901749 | キンシャサノキセキ(AUS) | 63 |
| 1700 | 985381 | ディスクリートキャット(USA) | 62 |
| 1700 | 989072 | トランセンド | 26 |
| 1700 | 995275 | ストロングリターン | 32 |
| 1700 | 1025279 | シニスターミニスター(USA) | 99 |
| 1700 | 1028940 | ヘニーヒューズ(USA) | 95 |
| 1700 | 1042049 | ルーラーシップ | 86 |
| 1700 | 1043831 | トゥザグローリー | 13 |
| 1700 | 1049689 | ニホンピロアワーズ | 19 |
| 1700 | 1052586 | エイシンフラッシュ | 20 |
| 1700 | 1083691 | マジェスティックウォリアー(USA) | 92 |
| 1700 | 1085636 | パイロ(USA) | 97 |
| 1700 | 1088812 | リアルインパクト | 38 |
| 1700 | 1089850 | ロードカナロア | 89 |
| 1700 | 1089854 | ベルシャザール | 11 |
| 1700 | 1090360 | オルフェーヴル | 69 |
| 1700 | 1090769 | ダノンバラード | 58 |
| 1700 | 1094329 | アイファーソング | 56 |
| 1700 | 1104811 | ゴールドシップ | 40 |
| 1700 | 1106251 | ジャスタウェイ | 78 |
| 1700 | 1107477 | ホッコータルマエ | 98 |
| 1700 | 1110454 | カレンブラックヒル | 41 |
| 1700 | 1111008 | ワールドエース | 42 |
| 1700 | 1115148 | ハービンジャー(GB) | 36 |
| 1700 | 1120570 | キズナ | 96 |
| 1700 | 1122040 | ラブリーデイ | 53 |
| 1700 | 1123166 | コパノリッキー | 74 |
| 1700 | 1124297 | エピファネイア | 54 |
| 1700 | 1124405 | ロゴタイプ | 70 |
| 1700 | 1127395 | ダンカーク(USA) | 59 |
| 1700 | 1128605 | アニマルキングダム(USA) | 27 |
| 1700 | 1128881 | マクフィ(GB) | 71 |
| 1700 | 1129173 | エスケンデレヤ(USA) | 47 |
| 1700 | 1134576 | トゥザワールド | 17 |
| 1700 | 1134867 | レッドファルクス | 28 |
| 1700 | 1136428 | ゴールドアクター | 3 |
| 1700 | 1137511 | エイシンヒカリ | 18 |
| 1700 | 1137571 | サトノアラジン | 34 |
| 1700 | 1138240 | モーリス | 77 |
| 1700 | 1141719 | ミッキーアイル | 51 |
| 1700 | 1142398 | イスラボニータ | 16 |
| 1700 | 1148419 | ベーカバド(FR) | 8 |
| 1700 | 1151936 | ドゥラメンテ | 93 |
| 1700 | 1152403 | シュヴァルグラン | 24 |
| 1700 | 1155349 | キタサンブラック | 79 |
| 1700 | 1157711 | リアルスティール | 84 |
| 1700 | 1162685 | ダノンレジェンド(USA) | 81 |
| 1700 | 1162862 | シャンハイボビー(USA) | 66 |
| 1700 | 1162905 | サトノクラウン | 33 |
| 1700 | 1163175 | ベストウォーリア(USA) | 30 |
| 1700 | 1163245 | アイルハヴアナザー(USA) | 31 |
| 1700 | 1164976 | トビーズコーナー(USA) | 14 |
| 1700 | 1167517 | ディーマジェスティ | 43 |
| 1700 | 1169928 | レインボーライン | 29 |
| 1700 | 1170063 | リオンディーズ | 91 |
| 1700 | 1170750 | ゴールドドリーム | 50 |
| 1700 | 1171845 | シルバーステート | 45 |
| 1700 | 1173702 | ファインニードル | 15 |
| 1700 | 1175221 | サトノダイヤモンド | 60 |
| 1700 | 1177896 | アジアエクスプレス(USA) | 75 |
| 1700 | 1181460 | デクラレーションオブウォー(USA) | 52 |
| 1700 | 1186327 | エピカリス | 39 |
| 1700 | 1189721 | レイデオロ | 80 |
| 1700 | 1190059 | スワーヴリチャード | 35 |
| 1700 | 1193256 | Bayern(USA) | 10 |
| 1700 | 1193277 | モーニン(USA) | 76 |
| 1700 | 1194505 | ラニ(USA) | 72 |
| 1700 | 1205475 | ルヴァンスレーヴ | 90 |
| 1700 | 1209439 | タワーオブロンドン | 4 |
| 1700 | 1211258 | カリフォルニアクローム(USA) | 85 |
| 1700 | 1213491 | モズアスコット(USA) | 64 |
| 1700 | 1215724 | サートゥルナーリア | 1 |
| 1700 | 1221956 | アドマイヤマーズ | 25 |
| 1700 | 1224373 | タリスマニック(GB) | 21 |
| 1700 | 1225918 | ザファクター(USA) | 49 |
| 1700 | 1226963 | サンダースノー(IRE) | 88 |
| 1700 | 1238286 | Liam's Map(USA) | 37 |
| 1700 | 1238289 | American Pharoah(USA) | 55 |
| 1700 | 1240055 | ドレフォン(USA) | 100 |
| 1700 | 1243519 | ビーチパトロール(USA) | 23 |
| 1700 | 1244377 | アメリカンペイトリオット(USA) | 67 |
| 1700 | 1287720 | Khozan(USA) | 22 |
| 1700 | 1288621 | Gun Runner(USA) | 2 |
| 1700 | 1293348 | ブリックスアンドモルタル(USA) | 46 |
| 1700 | 1298815 | ニューイヤーズデイ(USA) | 87 |
| 1700 | 1302899 | マインドユアビスケッツ(USA) | 94 |
| 1700 | 1328857 | ナダル(USA) | 83 |
| 1800 | 369832 | Lemon Drop Kid(USA) | 55 |
| 1800 | 372825 | プリサイスエンド(USA) | 8 |
| 1800 | 722158 | ハーツクライ | 82 |
| 1800 | 725485 | ダイワメジャー | 50 |
| 1800 | 727032 | メイショウボーラー | 35 |
| 1800 | 729458 | キングカメハメハ | 54 |
| 1800 | 761992 | バンブーエール | 17 |
| 1800 | 801447 | スクリーンヒーロー | 33 |
| 1800 | 807282 | フリオーソ | 45 |
| 1800 | 848478 | ロージズインメイ(USA) | 28 |
| 1800 | 849057 | バゴ(FR) | 14 |
| 1800 | 853225 | スズカコーズウェイ | 62 |
| 1800 | 888832 | エスポワールシチー | 42 |
| 1800 | 901749 | キンシャサノキセキ(AUS) | 52 |
| 1800 | 905163 | タートルボウル(IRE) | 12 |
| 1800 | 985381 | ディスクリートキャット(USA) | 22 |
| 1800 | 989072 | トランセンド | 13 |
| 1800 | 991842 | リーチザクラウン | 27 |
| 1800 | 991898 | トーセンジョーダン | 3 |
| 1800 | 995275 | ストロングリターン | 16 |
| 1800 | 1025279 | シニスターミニスター(USA) | 98 |
| 1800 | 1028940 | ヘニーヒューズ(USA) | 96 |
| 1800 | 1042049 | ルーラーシップ | 79 |
| 1800 | 1052586 | エイシンフラッシュ | 3 |
| 1800 | 1083691 | マジェスティックウォリアー(USA) | 92 |
| 1800 | 1085636 | パイロ(USA) | 93 |
| 1800 | 1088812 | リアルインパクト | 81 |
| 1800 | 1089850 | ロードカナロア | 76 |
| 1800 | 1090360 | オルフェーヴル | 69 |
| 1800 | 1090769 | ダノンバラード | 20 |
| 1800 | 1104811 | ゴールドシップ | 65 |
| 1800 | 1106251 | ジャスタウェイ | 83 |
| 1800 | 1107477 | ホッコータルマエ | 97 |
| 1800 | 1110454 | カレンブラックヒル | 53 |
| 1800 | 1110458 | フェノーメノ | 2 |
| 1800 | 1111008 | ワールドエース | 44 |
| 1800 | 1115148 | ハービンジャー(GB) | 60 |
| 1800 | 1120570 | キズナ | 100 |
| 1800 | 1122040 | ラブリーデイ | 26 |
| 1800 | 1123166 | コパノリッキー | 73 |
| 1800 | 1124297 | エピファネイア | 67 |
| 1800 | 1124405 | ロゴタイプ | 64 |
| 1800 | 1126608 | インカンテーション | 2 |
| 1800 | 1127395 | ダンカーク(USA) | 46 |
| 1800 | 1128605 | アニマルキングダム(USA) | 30 |
| 1800 | 1128881 | マクフィ(GB) | 74 |
| 1800 | 1129173 | エスケンデレヤ(USA) | 41 |
| 1800 | 1134867 | レッドファルクス | 51 |
| 1800 | 1137571 | サトノアラジン | 59 |
| 1800 | 1138240 | モーリス | 63 |
| 1800 | 1141719 | ミッキーアイル | 84 |
| 1800 | 1142398 | イスラボニータ | 70 |
| 1800 | 1142460 | バンドワゴン | 7 |
| 1800 | 1144053 | ケープブランコ(IRE) | 25 |
| 1800 | 1151936 | ドゥラメンテ | 94 |
| 1800 | 1152403 | シュヴァルグラン | 40 |
| 1800 | 1155349 | キタサンブラック | 87 |
| 1800 | 1157711 | リアルスティール | 90 |
| 1800 | 1162685 | ダノンレジェンド(USA) | 80 |
| 1800 | 1162862 | シャンハイボビー(USA) | 32 |
| 1800 | 1162905 | サトノクラウン | 24 |
| 1800 | 1163175 | ベストウォーリア(USA) | 19 |
| 1800 | 1163245 | アイルハヴアナザー(USA) | 18 |
| 1800 | 1164976 | トビーズコーナー(USA) | 15 |
| 1800 | 1167517 | ディーマジェスティ | 37 |
| 1800 | 1170063 | リオンディーズ | 86 |
| 1800 | 1170750 | ゴールドドリーム | 66 |
| 1800 | 1171105 | ミッキーグローリー | 1 |
| 1800 | 1171845 | シルバーステート | 43 |
| 1800 | 1175221 | サトノダイヤモンド | 78 |
| 1800 | 1177896 | アジアエクスプレス(USA) | 88 |
| 1800 | 1178407 | レガーロ | 36 |
| 1800 | 1181460 | デクラレーションオブウォー(USA) | 71 |
| 1800 | 1186327 | エピカリス | 31 |
| 1800 | 1189721 | レイデオロ | 72 |
| 1800 | 1190059 | スワーヴリチャード | 11 |
| 1800 | 1193277 | モーニン(USA) | 56 |
| 1800 | 1194505 | ラニ(USA) | 39 |
| 1800 | 1205475 | ルヴァンスレーヴ | 95 |
| 1800 | 1211258 | カリフォルニアクローム(USA) | 68 |
| 1800 | 1213491 | モズアスコット(USA) | 58 |
| 1800 | 1215724 | サートゥルナーリア | 21 |
| 1800 | 1215726 | クリソベリル | 38 |
| 1800 | 1221464 | ロジャーバローズ | 1 |
| 1800 | 1221956 | アドマイヤマーズ | 10 |
| 1800 | 1224373 | タリスマニック(GB) | 57 |
| 1800 | 1226631 | Cloud Computing(USA) | 6 |
| 1800 | 1226963 | サンダースノー(IRE) | 89 |
| 1800 | 1227898 | クリエイター２(USA) | 5 |
| 1800 | 1238289 | American Pharoah(USA) | 48 |
| 1800 | 1240055 | ドレフォン(USA) | 99 |
| 1800 | 1243519 | ビーチパトロール(USA) | 34 |
| 1800 | 1244377 | アメリカンペイトリオット(USA) | 61 |
| 1800 | 1244581 | Arrogate(USA) | 29 |
| 1800 | 1270982 | Nyquist(USA) | 4 |
| 1800 | 1287720 | Khozan(USA) | 23 |
| 1800 | 1288621 | Gun Runner(USA) | 47 |
| 1800 | 1293152 | Practical Joke(USA) | 9 |
| 1800 | 1293348 | ブリックスアンドモルタル(USA) | 75 |
| 1800 | 1298815 | ニューイヤーズデイ(USA) | 85 |
| 1800 | 1302899 | マインドユアビスケッツ(USA) | 77 |
| 1800 | 1313451 | Justify(USA) | 49 |
| 1800 | 1328857 | ナダル(USA) | 91 |
| 1900 | 325098 | タイムパラドックス | 27 |
| 1900 | 619817 | ローエングリン | 37 |
| 1900 | 700008 | シンボリクリスエス(USA) | 3 |
| 1900 | 722158 | ハーツクライ | 89 |
| 1900 | 727032 | メイショウボーラー | 72 |
| 1900 | 729458 | キングカメハメハ | 11 |
| 1900 | 742976 | ディープインパクト | 2 |
| 1900 | 760084 | メイショウサムソン | 6 |
| 1900 | 761992 | バンブーエール | 37 |
| 1900 | 807282 | フリオーソ | 51 |
| 1900 | 848478 | ロージズインメイ(USA) | 69 |
| 1900 | 849057 | バゴ(FR) | 33 |
| 1900 | 881793 | スマートファルコン | 44 |
| 1900 | 901749 | キンシャサノキセキ(AUS) | 66 |
| 1900 | 989072 | トランセンド | 43 |
| 1900 | 991898 | トーセンジョーダン | 55 |
| 1900 | 995275 | ストロングリターン | 76 |
| 1900 | 1025279 | シニスターミニスター(USA) | 96 |
| 1900 | 1028940 | ヘニーヒューズ(USA) | 93 |
| 1900 | 1042049 | ルーラーシップ | 65 |
| 1900 | 1043988 | ガルボ | 54 |
| 1900 | 1049689 | ニホンピロアワーズ | 16 |
| 1900 | 1051353 | Curlin(USA) | 8 |
| 1900 | 1083691 | マジェスティックウォリアー(USA) | 94 |
| 1900 | 1084779 | Into Mischief(USA) | 19 |
| 1900 | 1085636 | パイロ(USA) | 73 |
| 1900 | 1089850 | ロードカナロア | 87 |
| 1900 | 1090360 | オルフェーヴル | 59 |
| 1900 | 1094558 | クレスコグランド | 32 |
| 1900 | 1104811 | ゴールドシップ | 58 |
| 1900 | 1106251 | ジャスタウェイ | 95 |
| 1900 | 1107477 | ホッコータルマエ | 99 |
| 1900 | 1110454 | カレンブラックヒル | 18 |
| 1900 | 1110458 | フェノーメノ | 14 |
| 1900 | 1111008 | ワールドエース | 20 |
| 1900 | 1111834 | バトルプラン(USA) | 68 |
| 1900 | 1113706 | Sea The Stars(IRE) | 23 |
| 1900 | 1115148 | ハービンジャー(GB) | 25 |
| 1900 | 1120570 | キズナ | 100 |
| 1900 | 1123166 | コパノリッキー | 91 |
| 1900 | 1124297 | エピファネイア | 79 |
| 1900 | 1124405 | ロゴタイプ | 90 |
| 1900 | 1127395 | ダンカーク(USA) | 50 |
| 1900 | 1127396 | Pioneerof the Nile(USA) | 71 |
| 1900 | 1128605 | アニマルキングダム(USA) | 80 |
| 1900 | 1128881 | マクフィ(GB) | 14 |
| 1900 | 1134867 | レッドファルクス | 63 |
| 1900 | 1135217 | ニシケンモノノフ | 56 |
| 1900 | 1136428 | ゴールドアクター | 45 |
| 1900 | 1137511 | エイシンヒカリ | 60 |
| 1900 | 1137571 | サトノアラジン | 48 |
| 1900 | 1138240 | モーリス | 86 |
| 1900 | 1138783 | ワンアンドオンリー | 7 |
| 1900 | 1141719 | ミッキーアイル | 4 |
| 1900 | 1142398 | イスラボニータ | 39 |
| 1900 | 1142460 | バンドワゴン | 37 |
| 1900 | 1151936 | ドゥラメンテ | 57 |
| 1900 | 1152403 | シュヴァルグラン | 26 |
| 1900 | 1155349 | キタサンブラック | 64 |
| 1900 | 1157711 | リアルスティール | 97 |
| 1900 | 1162685 | ダノンレジェンド(USA) | 38 |
| 1900 | 1162905 | サトノクラウン | 24 |
| 1900 | 1163245 | アイルハヴアナザー(USA) | 5 |
| 1900 | 1164976 | トビーズコーナー(USA) | 52 |
| 1900 | 1167517 | ディーマジェスティ | 28 |
| 1900 | 1170063 | リオンディーズ | 82 |
| 1900 | 1170750 | ゴールドドリーム | 53 |
| 1900 | 1171845 | シルバーステート | 1 |
| 1900 | 1175221 | サトノダイヤモンド | 92 |
| 1900 | 1177896 | アジアエクスプレス(USA) | 62 |
| 1900 | 1178407 | レガーロ | 81 |
| 1900 | 1178418 | ノヴェリスト(IRE) | 15 |
| 1900 | 1181460 | デクラレーションオブウォー(USA) | 47 |
| 1900 | 1186327 | エピカリス | 49 |
| 1900 | 1189721 | レイデオロ | 88 |
| 1900 | 1190059 | スワーヴリチャード | 12 |
| 1900 | 1191607 | アルアイン | 17 |
| 1900 | 1193283 | アポロケンタッキー(USA) | 10 |
| 1900 | 1194505 | ラニ(USA) | 84 |
| 1900 | 1195380 | Kantharos(USA) | 9 |
| 1900 | 1203083 | エポカドーロ | 46 |
| 1900 | 1211258 | カリフォルニアクローム(USA) | 70 |
| 1900 | 1215724 | サートゥルナーリア | 22 |
| 1900 | 1221464 | ロジャーバローズ | 42 |
| 1900 | 1221956 | アドマイヤマーズ | 41 |
| 1900 | 1226963 | サンダースノー(IRE) | 40 |
| 1900 | 1238287 | Constitution(USA) | 30 |
| 1900 | 1240055 | ドレフォン(USA) | 98 |
| 1900 | 1243519 | ビーチパトロール(USA) | 67 |
| 1900 | 1244377 | アメリカンペイトリオット(USA) | 61 |
| 1900 | 1244581 | Arrogate(USA) | 75 |
| 1900 | 1270982 | Nyquist(USA) | 37 |
| 1900 | 1288621 | Gun Runner(USA) | 31 |
| 1900 | 1291349 | マスタリー(USA) | 29 |
| 1900 | 1293348 | ブリックスアンドモルタル(USA) | 74 |
| 1900 | 1298815 | ニューイヤーズデイ(USA) | 78 |
| 1900 | 1302899 | マインドユアビスケッツ(USA) | 85 |
| 1900 | 1313451 | Justify(USA) | 83 |
| 1900 | 1328857 | ナダル(USA) | 77 |
| 1900 | 1386393 | Global Campaign(USA) | 22 |
| 2000 | 325200 | ジャングルポケット | 49 |
| 2000 | 611525 | タニノギムレット | 3 |
| 2000 | 615577 | クロフネ(USA) | 4 |
| 2000 | 619768 | ゴールドアリュール | 10 |
| 2000 | 722158 | ハーツクライ | 90 |
| 2000 | 722261 | トーセンブライト | 31 |
| 2000 | 725485 | ダイワメジャー | 2 |
| 2000 | 729458 | キングカメハメハ | 91 |
| 2000 | 742976 | ディープインパクト | 53 |
| 2000 | 761992 | バンブーエール | 39 |
| 2000 | 801447 | スクリーンヒーロー | 33 |
| 2000 | 807282 | フリオーソ | 76 |
| 2000 | 848478 | ロージズインメイ(USA) | 88 |
| 2000 | 849057 | バゴ(FR) | 21 |
| 2000 | 881793 | スマートファルコン | 15 |
| 2000 | 888832 | エスポワールシチー | 41 |
| 2000 | 888992 | シルポート | 1 |
| 2000 | 901749 | キンシャサノキセキ(AUS) | 55 |
| 2000 | 989072 | トランセンド | 81 |
| 2000 | 990058 | ナムラタイタン | 12 |
| 2000 | 991842 | リーチザクラウン | 87 |
| 2000 | 991898 | トーセンジョーダン | 46 |
| 2000 | 995275 | ストロングリターン | 57 |
| 2000 | 1025279 | シニスターミニスター(USA) | 98 |
| 2000 | 1028940 | ヘニーヒューズ(USA) | 79 |
| 2000 | 1037129 | Daaher(CAN) | 53 |
| 2000 | 1040066 | カジノドライヴ(USA) | 50 |
| 2000 | 1042049 | ルーラーシップ | 80 |
| 2000 | 1049689 | ニホンピロアワーズ | 20 |
| 2000 | 1051353 | Curlin(USA) | 32 |
| 2000 | 1083691 | マジェスティックウォリアー(USA) | 99 |
| 2000 | 1085636 | パイロ(USA) | 93 |
| 2000 | 1088812 | リアルインパクト | 24 |
| 2000 | 1089850 | ロードカナロア | 59 |
| 2000 | 1089854 | ベルシャザール | 60 |
| 2000 | 1090360 | オルフェーヴル | 69 |
| 2000 | 1090769 | ダノンバラード | 30 |
| 2000 | 1104811 | ゴールドシップ | 65 |
| 2000 | 1106251 | ジャスタウェイ | 74 |
| 2000 | 1107477 | ホッコータルマエ | 94 |
| 2000 | 1110454 | カレンブラックヒル | 73 |
| 2000 | 1111008 | ワールドエース | 71 |
| 2000 | 1111834 | バトルプラン(USA) | 17 |
| 2000 | 1115148 | ハービンジャー(GB) | 36 |
| 2000 | 1120570 | キズナ | 100 |
| 2000 | 1122040 | ラブリーデイ | 44 |
| 2000 | 1123166 | コパノリッキー | 89 |
| 2000 | 1124297 | エピファネイア | 68 |
| 2000 | 1126608 | インカンテーション | 6 |
| 2000 | 1128881 | マクフィ(GB) | 43 |
| 2000 | 1129173 | エスケンデレヤ(USA) | 62 |
| 2000 | 1129435 | エーシンスピーダー(USA) | 14 |
| 2000 | 1134576 | トゥザワールド | 2 |
| 2000 | 1134867 | レッドファルクス | 25 |
| 2000 | 1136428 | ゴールドアクター | 13 |
| 2000 | 1137511 | エイシンヒカリ | 7 |
| 2000 | 1137571 | サトノアラジン | 56 |
| 2000 | 1138240 | モーリス | 51 |
| 2000 | 1139796 | ネロ | 7 |
| 2000 | 1141719 | ミッキーアイル | 35 |
| 2000 | 1142398 | イスラボニータ | 58 |
| 2000 | 1142460 | バンドワゴン | 42 |
| 2000 | 1149061 | グレーターロンドン | 9 |
| 2000 | 1151936 | ドゥラメンテ | 78 |
| 2000 | 1152403 | シュヴァルグラン | 29 |
| 2000 | 1154998 | ヤマカツエース | 19 |
| 2000 | 1155349 | キタサンブラック | 97 |
| 2000 | 1157711 | リアルスティール | 95 |
| 2000 | 1162685 | ダノンレジェンド(USA) | 84 |
| 2000 | 1162862 | シャンハイボビー(USA) | 26 |
| 2000 | 1162905 | サトノクラウン | 45 |
| 2000 | 1163175 | ベストウォーリア(USA) | 5 |
| 2000 | 1163245 | アイルハヴアナザー(USA) | 72 |
| 2000 | 1164976 | トビーズコーナー(USA) | 63 |
| 2000 | 1167517 | ディーマジェスティ | 37 |
| 2000 | 1170063 | リオンディーズ | 64 |
| 2000 | 1171845 | シルバーステート | 22 |
| 2000 | 1175168 | ヴァンキッシュラン | 8 |
| 2000 | 1175196 | ミッキーロケット | 16 |
| 2000 | 1175221 | サトノダイヤモンド | 27 |
| 2000 | 1177896 | アジアエクスプレス(USA) | 82 |
| 2000 | 1178407 | レガーロ | 86 |
| 2000 | 1189721 | レイデオロ | 28 |
| 2000 | 1192958 | モンテロッソ(GB) | 47 |
| 2000 | 1193277 | モーニン(USA) | 38 |
| 2000 | 1193283 | アポロケンタッキー(USA) | 23 |
| 2000 | 1193371 | ゴールデンバローズ(USA) | 54 |
| 2000 | 1194505 | ラニ(USA) | 67 |
| 2000 | 1205475 | ルヴァンスレーヴ | 61 |
| 2000 | 1209824 | Race Day(USA) | 6 |
| 2000 | 1224373 | タリスマニック(GB) | 34 |
| 2000 | 1226963 | サンダースノー(IRE) | 92 |
| 2000 | 1227898 | クリエイター２(USA) | 18 |
| 2000 | 1238289 | American Pharoah(USA) | 40 |
| 2000 | 1240055 | ドレフォン(USA) | 96 |
| 2000 | 1243519 | ビーチパトロール(USA) | 66 |
| 2000 | 1244377 | アメリカンペイトリオット(USA) | 48 |
| 2000 | 1288621 | Gun Runner(USA) | 11 |
| 2000 | 1293348 | ブリックスアンドモルタル(USA) | 75 |
| 2000 | 1298815 | ニューイヤーズデイ(USA) | 83 |
| 2000 | 1302899 | マインドユアビスケッツ(USA) | 70 |
| 2000 | 1313451 | Justify(USA) | 85 |
| 2000 | 1328857 | ナダル(USA) | 77 |
| 2100 | 325200 | ジャングルポケット | 65 |
| 2100 | 372825 | プリサイスエンド(USA) | 11 |
| 2100 | 722158 | ハーツクライ | 93 |
| 2100 | 722797 | ブラックタイド | 11 |
| 2100 | 729458 | キングカメハメハ | 100 |
| 2100 | 742976 | ディープインパクト | 58 |
| 2100 | 761992 | バンブーエール | 16 |
| 2100 | 801447 | スクリーンヒーロー | 65 |
| 2100 | 805347 | ローレルゲレイロ | 22 |
| 2100 | 807282 | フリオーソ | 47 |
| 2100 | 848478 | ロージズインメイ(USA) | 54 |
| 2100 | 849372 | Tapit(USA) | 8 |
| 2100 | 888832 | エスポワールシチー | 61 |
| 2100 | 888992 | シルポート | 55 |
| 2100 | 891931 | ディープスカイ | 4 |
| 2100 | 900065 | アポロキングダム(USA) | 68 |
| 2100 | 989072 | トランセンド | 17 |
| 2100 | 991842 | リーチザクラウン | 40 |
| 2100 | 991898 | トーセンジョーダン | 44 |
| 2100 | 995275 | ストロングリターン | 50 |
| 2100 | 995651 | ジョーカプチーノ | 62 |
| 2100 | 1025279 | シニスターミニスター(USA) | 92 |
| 2100 | 1028940 | ヘニーヒューズ(USA) | 51 |
| 2100 | 1037129 | Daaher(CAN) | 38 |
| 2100 | 1040066 | カジノドライヴ(USA) | 30 |
| 2100 | 1042049 | ルーラーシップ | 67 |
| 2100 | 1046333 | ヴィクトワールピサ | 23 |
| 2100 | 1083691 | マジェスティックウォリアー(USA) | 99 |
| 2100 | 1085636 | パイロ(USA) | 96 |
| 2100 | 1088803 | ウインバリアシオン | 15 |
| 2100 | 1088812 | リアルインパクト | 2 |
| 2100 | 1089850 | ロードカナロア | 85 |
| 2100 | 1090360 | オルフェーヴル | 88 |
| 2100 | 1094329 | アイファーソング | 53 |
| 2100 | 1106251 | ジャスタウェイ | 74 |
| 2100 | 1107477 | ホッコータルマエ | 98 |
| 2100 | 1110458 | フェノーメノ | 42 |
| 2100 | 1111008 | ワールドエース | 69 |
| 2100 | 1115148 | ハービンジャー(GB) | 63 |
| 2100 | 1120570 | キズナ | 95 |
| 2100 | 1122040 | ラブリーデイ | 41 |
| 2100 | 1123166 | コパノリッキー | 79 |
| 2100 | 1124297 | エピファネイア | 81 |
| 2100 | 1124405 | ロゴタイプ | 43 |
| 2100 | 1126608 | インカンテーション | 50 |
| 2100 | 1129173 | エスケンデレヤ(USA) | 14 |
| 2100 | 1134576 | トゥザワールド | 38 |
| 2100 | 1134867 | レッドファルクス | 30 |
| 2100 | 1136428 | ゴールドアクター | 14 |
| 2100 | 1137511 | エイシンヒカリ | 20 |
| 2100 | 1137571 | サトノアラジン | 7 |
| 2100 | 1138240 | モーリス | 60 |
| 2100 | 1138783 | ワンアンドオンリー | 24 |
| 2100 | 1142398 | イスラボニータ | 7 |
| 2100 | 1142460 | バンドワゴン | 1 |
| 2100 | 1151936 | ドゥラメンテ | 83 |
| 2100 | 1152403 | シュヴァルグラン | 52 |
| 2100 | 1155349 | キタサンブラック | 70 |
| 2100 | 1157711 | リアルスティール | 94 |
| 2100 | 1162685 | ダノンレジェンド(USA) | 7 |
| 2100 | 1162704 | アポロソニック(USA) | 31 |
| 2100 | 1162862 | シャンハイボビー(USA) | 12 |
| 2100 | 1162905 | サトノクラウン | 72 |
| 2100 | 1163175 | ベストウォーリア(USA) | 57 |
| 2100 | 1163245 | アイルハヴアナザー(USA) | 73 |
| 2100 | 1164976 | トビーズコーナー(USA) | 20 |
| 2100 | 1167517 | ディーマジェスティ | 25 |
| 2100 | 1169928 | レインボーライン | 36 |
| 2100 | 1170063 | リオンディーズ | 87 |
| 2100 | 1170750 | ゴールドドリーム | 9 |
| 2100 | 1171105 | ミッキーグローリー | 66 |
| 2100 | 1171845 | シルバーステート | 21 |
| 2100 | 1175221 | サトノダイヤモンド | 71 |
| 2100 | 1177848 | マスクゾロ(USA) | 30 |
| 2100 | 1177896 | アジアエクスプレス(USA) | 75 |
| 2100 | 1181460 | デクラレーションオブウォー(USA) | 59 |
| 2100 | 1186327 | エピカリス | 80 |
| 2100 | 1189721 | レイデオロ | 34 |
| 2100 | 1193277 | モーニン(USA) | 56 |
| 2100 | 1194505 | ラニ(USA) | 84 |
| 2100 | 1204307 | フィエールマン | 18 |
| 2100 | 1205475 | ルヴァンスレーヴ | 76 |
| 2100 | 1213545 | Mor Spirit(USA) | 33 |
| 2100 | 1224373 | タリスマニック(GB) | 39 |
| 2100 | 1226963 | サンダースノー(IRE) | 90 |
| 2100 | 1227898 | クリエイター２(USA) | 27 |
| 2100 | 1238289 | American Pharoah(USA) | 46 |
| 2100 | 1240055 | ドレフォン(USA) | 97 |
| 2100 | 1243519 | ビーチパトロール(USA) | 48 |
| 2100 | 1244377 | アメリカンペイトリオット(USA) | 45 |
| 2100 | 1244581 | Arrogate(USA) | 35 |
| 2100 | 1287720 | Khozan(USA) | 77 |
| 2100 | 1288621 | Gun Runner(USA) | 33 |
| 2100 | 1293348 | ブリックスアンドモルタル(USA) | 82 |
| 2100 | 1295610 | Good Magic(USA) | 3 |
| 2100 | 1298815 | ニューイヤーズデイ(USA) | 78 |
| 2100 | 1302899 | マインドユアビスケッツ(USA) | 91 |
| 2100 | 1313451 | Justify(USA) | 89 |
| 2100 | 1317293 | Omaha Beach(USA) | 26 |
| 2100 | 1328857 | ナダル(USA) | 86 |
| 2200 | 237704 | ホワイトマズル(GB) | 39 |
| 2200 | 310467 | サウスヴィグラス(USA) | 39 |
| 2200 | 313435 | アッミラーレ | 39 |
| 2200 | 321265 | ノボジャック(USA) | 39 |
| 2200 | 325200 | ジャングルポケット | 45 |
| 2200 | 615577 | クロフネ(USA) | 39 |
| 2200 | 619768 | ゴールドアリュール | 39 |
| 2200 | 701577 | ネオユニヴァース | 39 |
| 2200 | 722158 | ハーツクライ | 39 |
| 2200 | 722261 | トーセンブライト | 72 |
| 2200 | 722797 | ブラックタイド | 39 |
| 2200 | 725485 | ダイワメジャー | 88 |
| 2200 | 727032 | メイショウボーラー | 89 |
| 2200 | 729458 | キングカメハメハ | 96 |
| 2200 | 742946 | カネヒキリ | 39 |
| 2200 | 760877 | アドマイヤムーン | 39 |
| 2200 | 801447 | スクリーンヒーロー | 39 |
| 2200 | 807282 | フリオーソ | 95 |
| 2200 | 848478 | ロージズインメイ(USA) | 68 |
| 2200 | 849057 | バゴ(FR) | 39 |
| 2200 | 881793 | スマートファルコン | 61 |
| 2200 | 888832 | エスポワールシチー | 86 |
| 2200 | 891710 | シビルウォー | 45 |
| 2200 | 891752 | セレン | 80 |
| 2200 | 901749 | キンシャサノキセキ(AUS) | 39 |
| 2200 | 985381 | ディスクリートキャット(USA) | 50 |
| 2200 | 989072 | トランセンド | 84 |
| 2200 | 991842 | リーチザクラウン | 65 |
| 2200 | 993502 | アンライバルド | 39 |
| 2200 | 995275 | ストロングリターン | 39 |
| 2200 | 1028940 | ヘニーヒューズ(USA) | 39 |
| 2200 | 1040066 | カジノドライヴ(USA) | 39 |
| 2200 | 1042049 | ルーラーシップ | 91 |
| 2200 | 1043831 | トゥザグローリー | 39 |
| 2200 | 1043835 | タイセイレジェンド | 77 |
| 2200 | 1043988 | ガルボ | 39 |
| 2200 | 1051353 | Curlin(USA) | 49 |
| 2200 | 1085636 | パイロ(USA) | 83 |
| 2200 | 1088803 | ウインバリアシオン | 39 |
| 2200 | 1089854 | ベルシャザール | 93 |
| 2200 | 1090360 | オルフェーヴル | 79 |
| 2200 | 1094278 | オーシャンブルー | 41 |
| 2200 | 1101689 | ヴァンセンヌ | 72 |
| 2200 | 1106251 | ジャスタウェイ | 75 |
| 2200 | 1107477 | ホッコータルマエ | 63 |
| 2200 | 1109418 | プレティオラス | 85 |
| 2200 | 1110454 | カレンブラックヒル | 39 |
| 2200 | 1110810 | グランデッツァ | 63 |
| 2200 | 1111008 | ワールドエース | 74 |
| 2200 | 1111834 | バトルプラン(USA) | 39 |
| 2200 | 1115148 | ハービンジャー(GB) | 83 |
| 2200 | 1120570 | キズナ | 100 |
| 2200 | 1122040 | ラブリーデイ | 39 |
| 2200 | 1123166 | コパノリッキー | 98 |
| 2200 | 1124297 | エピファネイア | 42 |
| 2200 | 1124405 | ロゴタイプ | 39 |
| 2200 | 1126608 | インカンテーション | 90 |
| 2200 | 1127395 | ダンカーク(USA) | 61 |
| 2200 | 1128792 | ヘニーハウンド(USA) | 39 |
| 2200 | 1128881 | マクフィ(GB) | 78 |
| 2200 | 1129173 | エスケンデレヤ(USA) | 39 |
| 2200 | 1134576 | トゥザワールド | 61 |
| 2200 | 1136428 | ゴールドアクター | 39 |
| 2200 | 1139796 | ネロ | 39 |
| 2200 | 1141719 | ミッキーアイル | 39 |
| 2200 | 1142398 | イスラボニータ | 39 |
| 2200 | 1142673 | ビッグアーサー | 54 |
| 2200 | 1144053 | ケープブランコ(IRE) | 54 |
| 2200 | 1146082 | Dark Angel(IRE) | 99 |
| 2200 | 1151314 | レーヴミストラル | 65 |
| 2200 | 1155349 | キタサンブラック | 97 |
| 2200 | 1157711 | リアルスティール | 76 |
| 2200 | 1162862 | シャンハイボビー(USA) | 43 |
| 2200 | 1162905 | サトノクラウン | 72 |
| 2200 | 1163175 | ベストウォーリア(USA) | 55 |
| 2200 | 1163245 | アイルハヴアナザー(USA) | 94 |
| 2200 | 1170063 | リオンディーズ | 66 |
| 2200 | 1171845 | シルバーステート | 72 |
| 2200 | 1173652 | サウンドスカイ | 61 |
| 2200 | 1175196 | ミッキーロケット | 67 |
| 2200 | 1177896 | アジアエクスプレス(USA) | 49 |
| 2200 | 1178407 | レガーロ | 54 |
| 2200 | 1178418 | ノヴェリスト(IRE) | 61 |
| 2200 | 1181460 | デクラレーションオブウォー(USA) | 49 |
| 2200 | 1191607 | アルアイン | 92 |
| 2200 | 1192958 | モンテロッソ(GB) | 87 |
| 2200 | 1193277 | モーニン(USA) | 39 |
| 2200 | 1193283 | アポロケンタッキー(USA) | 39 |
| 2200 | 1197660 | Upstart(USA) | 61 |
| 2200 | 1224373 | タリスマニック(GB) | 73 |
| 2200 | 1227898 | クリエイター２(USA) | 39 |
| 2200 | 1228789 | Camelot(GB) | 39 |
| 2200 | 1240333 | Emcee(USA) | 39 |
| 2200 | 1243519 | ビーチパトロール(USA) | 49 |
| 2200 | 1293348 | ブリックスアンドモルタル(USA) | 40 |
| 2200 | 1302899 | マインドユアビスケッツ(USA) | 81 |
| 2200 | 1313978 | マクマホン(ITY) | 54 |

---

## Table: venue_master

### Schema

| Field | Type | Null | Key | Default | Extra |
|---|---|---|---|---|---|
| baba_code | int | NO | PRI | null |  |
| rakuten_baba_code | varchar(16) | NO | UNI | null |  |
| venue | varchar(32) | NO |  | null |  |

### Data (15 rows)

| baba_code | rakuten_baba_code | venue |
| --- | --- | --- |
| 3 | 03041503 | 帯広ば |
| 10 | 10061006 | 盛岡 |
| 11 | 11060605 | 水沢 |
| 18 | 18131203 | 浦和 |
| 19 | 19140801 | 船橋 |
| 20 | 20151205 | 大井 |
| 21 | 21350805 | 川崎 |
| 22 | 22181501 | 金沢 |
| 23 | 23201204 | 笠松 |
| 24 | 24332203 | 名古屋 |
| 27 | 27261706 | 園田 |
| 28 | 28260102 | 姫路 |
| 31 | 31291106 | 高知 |
| 32 | 32302205 | 佐賀 |
| 36 | 36011504 | 門別 |

---

