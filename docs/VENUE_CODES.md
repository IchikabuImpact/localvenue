# Venue Codes Reference

This document explains the relationship between NAR (National Association of Racing) venue codes and Rakuten Keiba venue codes used in this system.

## Overview

The system handles two types of venue identifiers because they come from different data sources:

1.  **NAR Code (`baba_code`)**: Used by [keiba.go.jp](https://www.keiba.go.jp/) (National Association of Racing). This is the primary identifier in the `baba` table.
2.  **Rakuten Code (`rakuten_baba_code`)**: Used by Rakuten Keiba. Stored in `venue_master` and `baba` tables for cross-referencing.

## Code Correspondence Table

The following table lists the venues managed in `venue_master` and their corresponding codes.

| Venue Name (会場名) | NAR Code (`baba`) | Rakuten Code (`venue_master`) |
| :--- | :---: | :---: |
| **Obihiro** (帯広ば) | 3 | 03041503 |
| **Morioka** (盛岡) | 10 | 10060902 |
| **Mizusawa** (水沢) | 11 | 11060605 |
| **Urawa** (浦和) | 18 | 18131203 |
| **Funabashi** (船橋) | 19 | 19140801 |
| **Oi** (大井) | 20 | 20151205 |
| **Kawasaki** (川崎) | 21 | 21350805 |
| **Kanazawa** (金沢) | 22 | 22181501 |
| **Kasamatsu** (笠松) | 23 | 23201204 |
| **Nagoya** (名古屋) | 24 | 24332203 |
| **Sonoda** (園田) | 27 | 27261706 |
| **Himeji** (姫路) | 28 | 28260102 |
| **Kochi** (高知) | 31 | 31291106 |
| **Saga** (佐賀) | 32 | 32302205 |
| **Mombetsu** (門別) | 36 | 36011504 |

## Database Schema Context

*   **`baba` table**: Contains the master list of NAR venues.
*   **`venue_master` table**: A mapping table specifically for Rakuten Keiba integration. It links the NAR `baba_code` to the Rakuten-specific 8-digit code.

For complete data initialization, please refer to `data/seed-master.sql`.

## Where the Codes Are Used

The Rakuten codes above are the ones used for result fetching. The batch scripts do not read Rakuten codes from the database:

*   **Result fetching (`101`)** uses its own table, `RAKUTEN_BABA_CODE` in `scripts/lib/result/rakuten-race-code.js`.
*   **Page generation** reads only `baba_code` and `venue` from `venue_master`, then overrides them with a hardcoded name map in `scripts/lib/pagegen/page-query-service.js`.

## Note on Morioka (as of 2026-11-03)

`10060902` in `scripts/lib/result/rakuten-race-code.js` is the code in operation. Morioka results have been saved with it continuously since 2026-05-24.

`venue_master` and `data/seed-master.sql` still hold `10061006` for Morioka. No script reads this value, so it does not affect operation.
