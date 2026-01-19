-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: localkeiba
-- ------------------------------------------------------
-- Server version	8.0.44-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `baba`
--

DROP TABLE IF EXISTS `baba`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `baba` (
  `baba_code` tinyint NOT NULL DEFAULT '0',
  `baba_name` text COLLATE utf8mb3_unicode_ci,
  `rakuten_baba_code` char(4) COLLATE utf8mb3_unicode_ci DEFAULT NULL COMMENT '楽天競馬のトラック4桁（例：盛岡=1006、金沢=2218、高知=3129）'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `calendar`
--

DROP TABLE IF EXISTS `calendar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calendar` (
  `race_date` date NOT NULL,
  `venucode` int NOT NULL,
  `venue` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`race_date`,`venucode`),
  KEY `idx_calendar_race_date` (`race_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jockey_ranking`
--

DROP TABLE IF EXISTS `jockey_ranking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jockey_ranking` (
  `year` int NOT NULL,
  `jockey_name` varchar(255) NOT NULL,
  `score` int NOT NULL,
  PRIMARY KEY (`year`,`jockey_name`),
  KEY `idx_year` (`year`),
  KEY `idx_score` (`score`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `prediction`
--

DROP TABLE IF EXISTS `prediction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prediction` (
  `prediction_id` bigint NOT NULL AUTO_INCREMENT,
  `race_id` bigint NOT NULL,
  `model_version` varchar(32) DEFAULT NULL,
  `memo` json NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`prediction_id`),
  UNIQUE KEY `uq_prediction_race_model` (`race_id`,`model_version`),
  KEY `idx_prediction_race` (`race_id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `prediction_eval`
--

DROP TABLE IF EXISTS `prediction_eval`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prediction_eval` (
  `race_id` char(12) NOT NULL,
  `model_version` varchar(64) NOT NULL,
  `predicted_horse_number` tinyint DEFAULT NULL,
  `win_hit` tinyint(1) NOT NULL DEFAULT '0',
  `win_payout` int DEFAULT NULL,
  `place_hit` tinyint(1) NOT NULL DEFAULT '0',
  `place_payout` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`race_id`,`model_version`),
  KEY `idx_prediction_eval_model` (`model_version`,`race_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `prediction_roi`
--

DROP TABLE IF EXISTS `prediction_roi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prediction_roi` (
  `race_id` char(12) NOT NULL,
  `model_version` varchar(64) NOT NULL,
  `strategy` varchar(32) NOT NULL,
  `stake` int NOT NULL,
  `returned` int NOT NULL,
  `roi_pct` decimal(8,4) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`race_id`,`model_version`,`strategy`),
  KEY `idx_prediction_roi_model` (`model_version`,`race_id`,`strategy`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `prediction_roi_daily`
--

DROP TABLE IF EXISTS `prediction_roi_daily`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prediction_roi_daily` (
  `ymd` date NOT NULL,
  `model_version` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `strategy` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `races` int NOT NULL,
  `invest_yen` int NOT NULL,
  `return_yen` int NOT NULL,
  `roi_percent` decimal(7,2) NOT NULL,
  PRIMARY KEY (`ymd`,`model_version`,`strategy`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `race_cnt`
--

DROP TABLE IF EXISTS `race_cnt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `race_cnt` (
  `id` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cnt` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `race_count_by_date`
--

DROP TABLE IF EXISTS `race_count_by_date`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `race_count_by_date` (
  `ymd` char(8) NOT NULL,
  `venue_code` varchar(4) NOT NULL,
  `total_races` int NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ymd`,`venue_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `race_payouts`
--

DROP TABLE IF EXISTS `race_payouts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `race_payouts` (
  `race_id` bigint NOT NULL,
  `bet_type` enum('WIN','PLACE') NOT NULL,
  `horse_number` int NOT NULL,
  `payout` int DEFAULT NULL,
  `popularity` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`race_id`,`bet_type`,`horse_number`),
  KEY `idx_race_payouts_race` (`race_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `race_results`
--

DROP TABLE IF EXISTS `race_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `race_results` (
  `race_result_id` bigint NOT NULL AUTO_INCREMENT,
  `race_id` bigint NOT NULL,
  `frame_number` int NOT NULL,
  `horse_number` int NOT NULL,
  `horse_name` varchar(64) NOT NULL,
  `official_finish_position` int NOT NULL,
  `dead_heat_group` int DEFAULT NULL,
  `dead_heat_order_in_group` int DEFAULT NULL,
  `finish_time` varchar(16) DEFAULT NULL,
  `margin` varchar(16) DEFAULT NULL,
  `jockey_name` varchar(64) DEFAULT NULL,
  `odds_final` decimal(8,2) DEFAULT NULL,
  `prize` int DEFAULT NULL,
  `disqualified` tinyint(1) NOT NULL DEFAULT '0',
  `notes` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`race_result_id`),
  UNIQUE KEY `uq_race_results` (`race_id`,`horse_number`),
  KEY `idx_race_results_race` (`race_id`),
  KEY `idx_race_results_jockey` (`jockey_name`)
) ENGINE=InnoDB AUTO_INCREMENT=222 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `racing_form`
--

DROP TABLE IF EXISTS `racing_form`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `racing_form` (
  `race_id` bigint NOT NULL,
  `frame_number` int NOT NULL,
  `horse_number` int NOT NULL,
  `horse_name` varchar(64) NOT NULL,
  `sex_age` varchar(8) DEFAULT NULL,
  `hair` varchar(8) DEFAULT NULL,
  `birthyear` tinyint unsigned DEFAULT NULL,
  `birthymonth` tinyint unsigned DEFAULT NULL,
  `sire` varchar(64) DEFAULT NULL,
  `dam` varchar(64) DEFAULT NULL,
  `broodmare_sire` varchar(64) DEFAULT NULL,
  `carried_weight` decimal(4,1) DEFAULT NULL,
  `jockey_name` varchar(64) DEFAULT NULL,
  `affiliation` varchar(16) DEFAULT NULL,
  `trainer_name` varchar(64) DEFAULT NULL,
  `owner` varchar(64) DEFAULT NULL,
  `breeder` varchar(64) DEFAULT NULL,
  `odds_morning` decimal(8,2) DEFAULT NULL,
  `horse_weight` int DEFAULT NULL,
  `horse_weight_diff` int DEFAULT NULL,
  `draw_number` int DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `raw_json` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`race_id`,`horse_number`),
  KEY `idx_racing_form_race` (`race_id`),
  KEY `idx_racing_form_jockey` (`jockey_name`),
  KEY `idx_racing_form_trainer` (`trainer_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sire_ranking`
--

DROP TABLE IF EXISTS `sire_ranking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sire_ranking` (
  `distance_m` int NOT NULL,
  `sire_id` bigint NOT NULL,
  `sire_name` varchar(255) NOT NULL,
  `score` int NOT NULL,
  PRIMARY KEY (`distance_m`,`sire_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `venue_master`
--

DROP TABLE IF EXISTS `venue_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venue_master` (
  `baba_code` int NOT NULL,
  `rakuten_baba_code` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `venue` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`baba_code`),
  UNIQUE KEY `uk_rakuten_baba_code` (`rakuten_baba_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'localkeiba'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed
