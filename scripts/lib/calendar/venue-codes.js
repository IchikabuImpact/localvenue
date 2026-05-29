'use strict';

/**
 * NARサラブレッド競馬の場コード → 正式venue名。
 * 帯広ばんえい（babaCode=3）はサラブレッド競走でないため除外する。
 */
const THOROUGHBRED_VENUE_NAME_BY_BABA_CODE = Object.freeze({
  10: '盛岡',
  11: '水沢',
  18: '浦和',
  19: '船橋',
  20: '大井',
  21: '川崎',
  22: '金沢',
  23: '笠松',
  24: '名古屋',
  27: '園田',
  28: '姫路',
  31: '高知',
  32: '佐賀',
  36: '門別',
});

/** 楽天競馬カレンダーの会場名 → NAR babaCode + 正式会場名。 */
const RAKUTEN_VENUE_BY_NAME = Object.freeze({
  '盛岡':   { babaCode: 10, venue: '盛岡'   },
  '水沢':   { babaCode: 11, venue: '水沢'   },
  '浦和':   { babaCode: 18, venue: '浦和'   },
  '船橋':   { babaCode: 19, venue: '船橋'   },
  '大井':   { babaCode: 20, venue: '大井'   },
  '川崎':   { babaCode: 21, venue: '川崎'   },
  '金沢':   { babaCode: 22, venue: '金沢'   },
  '笠松':   { babaCode: 23, venue: '笠松'   },
  '名古屋': { babaCode: 24, venue: '名古屋' },
  '園田':   { babaCode: 27, venue: '園田'   },
  '姫路':   { babaCode: 28, venue: '姫路'   },
  '高知':   { babaCode: 31, venue: '高知'   },
  '佐賀':   { babaCode: 32, venue: '佐賀'   },
  '門別':   { babaCode: 36, venue: '門別'   },
});

module.exports = {
  THOROUGHBRED_VENUE_NAME_BY_BABA_CODE,
  RAKUTEN_VENUE_BY_NAME,
};
