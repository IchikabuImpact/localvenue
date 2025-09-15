
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `baba` (
  `baba_code` tinyint(4) NOT NULL DEFAULT 0,
  `baba_name` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

REPLACE INTO `baba` (`baba_code`, `baba_name`) VALUES
(1, '北見ば'),
(2, '岩見ば'),
(3, '帯広ば'),
(4, '旭川ば'),
(7, '旭川'),
(8, '札幌'),
(10, '盛岡'),
(11, '水沢'),
(12, '上山'),
(15, '足利'),
(16, '宇都宮'),
(17, '高崎'),
(18, '浦和'),
(19, '船橋'),
(20, '大井'),
(21, '川崎'),
(22, '金沢'),
(23, '笠松'),
(24, '名古屋'),
(25, '中京'),
(27, '園田'),
(28, '姫路'),
(30, '福山'),
(31, '高知'),
(32, '佐賀'),
(33, '荒尾'),
(36, '門別'),
(41, 'ばんえ'),
(42, '北海道'),
(43, '岩手'),
(44, '新潟'),
(45, '北関東'),
(46, '南関東'),
(47, '栃木'),
(48, '東海'),
(49, '愛知'),
(50, '兵庫'),
(61, '九州'),
(80, '全国');


INSERT INTO venue_master (baba_code, rakuten_baba_code, venue) VALUES
(3 , '03041503', '帯広ば'),
(36, '36011504', '門別'),
(10, '10061006', '盛岡'),
(11, '11060605', '水沢'),
(18, '18131203', '浦和'),
(19, '19140801', '船橋'),
(20, '20151205', '大井'),
(21, '21350805', '川崎'),
(23, '23201204', '笠松'),
(27, '27261706', '園田'),
(28, '28260102', '姫路'),
(22, '22181501', '金沢'),
(24, '24332203', '名古屋'),
(31, '31291106', '高知'),
(32, '32302205', '佐賀');


Create Table: CREATE TABLE `calendar` (
  `race_date` date NOT NULL,
  `venucode` int NOT NULL,
  `venue` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`race_date`,`venucode`),
  UNIQUE KEY `race_date` (`race_date`,`venucode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
Create Table: CREATE TABLE `race_cnt` (
  `id` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `cnt` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

Create Table: CREATE TABLE `race_results` (
  `race_result_id` bigint NOT NULL AUTO_INCREMENT,
  `race_id` bigint NOT NULL,
  `frame_number` int NOT NULL,
  `horse_number` int NOT NULL,
  `horse_name` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `official_finish_position` int NOT NULL,
  `dead_heat_group` int DEFAULT NULL,
  `dead_heat_order_in_group` int DEFAULT NULL,
  `finish_time_str` varchar(16) COLLATE utf8mb4_bin DEFAULT NULL,
  `margin` varchar(16) COLLATE utf8mb4_bin DEFAULT NULL,
  `odds_win` decimal(8,1) DEFAULT NULL,
  `popularity` int DEFAULT NULL,
  PRIMARY KEY (`race_result_id`),
  UNIQUE KEY `uk_race_horse` (`race_id`,`horse_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

Create Table: CREATE TABLE `racing_form` (
  `race_id` char(12) COLLATE utf8mb4_general_ci NOT NULL,
  `frame_number` int NOT NULL DEFAULT '0',
  `horse_number` int NOT NULL DEFAULT '0',
  `horse_name` text COLLATE utf8mb4_general_ci,
  `sex_age` text COLLATE utf8mb4_general_ci,
  `hair` text COLLATE utf8mb4_general_ci,
  `birthyear` tinyint DEFAULT '0',
  `birthymonth` tinyint DEFAULT '0',
  `sire` text COLLATE utf8mb4_general_ci,
  `dam` text COLLATE utf8mb4_general_ci,
  `broodmare_sire` text COLLATE utf8mb4_general_ci,
  `jockey` text COLLATE utf8mb4_general_ci,
  `affiliation` text COLLATE utf8mb4_general_ci,
  `burden_weight` varchar(16) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `trainer` text COLLATE utf8mb4_general_ci,
  `owner` text COLLATE utf8mb4_general_ci,
  `breeder` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`race_id`,`horse_number`),
  KEY `idx_racing_form_race_frame` (`race_id`,`frame_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE venue_master (
  baba_code          INT NOT NULL,                     -- 自前の競馬場コード
  rakuten_baba_code  VARCHAR(16) NOT NULL,             -- 楽天競馬用コード
  venue              VARCHAR(32) NOT NULL,             -- 会場名
  PRIMARY KEY (baba_code),
  UNIQUE KEY uk_rakuten_baba_code (rakuten_baba_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

