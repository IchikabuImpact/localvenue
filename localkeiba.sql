-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: localkeiba
-- ------------------------------------------------------
-- Server version       8.0.43-0ubuntu0.24.04.2

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
-- Dumping data for table `baba`
--

LOCK TABLES `baba` WRITE;
/*!40000 ALTER TABLE `baba` DISABLE KEYS */;
INSERT INTO `baba` VALUES (1,'北見ば',NULL),(2,'岩見ば',NULL),(3,'帯広ば','0304'),(4,'旭川ば',NULL),(7,'旭川',NULL),(8,'札幌',NULL),(10,'盛岡','1006'),(11,'水沢','1106'),(12,'上山',NULL),(15,'足利',NULL),(16,'宇都宮',NULL),(17,'高崎',NULL),(18,'浦和','1800'),(19,'船橋','1914'),(20,'大井','2015'),(21,'川崎','2135'),(22,'金沢','2218'),(23,'笠松','2300'),(24,'名古屋','2400'),(25,'中京',NULL),(27,'園田','2726'),(28,'姫路','2800'),(30,'福山',NULL),(31,'高知','3129'),(32,'佐賀','3230'),(33,'荒尾',NULL),(36,'門別','3600'),(41,'ばんえ',NULL),(42,'北海道',NULL),(43,'岩手',NULL),(44,'新潟',NULL),(45,'北関東',NULL),(46,'南関東',NULL),(47,'栃木',NULL),(48,'東海',NULL),(49,'愛知',NULL),(50,'兵庫',NULL),(61,'九州',NULL),(80,'全国',NULL);
/*!40000 ALTER TABLE `baba` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `calendar`
--

LOCK TABLES `calendar` WRITE;
/*!40000 ALTER TABLE `calendar` DISABLE KEYS */;
INSERT INTO `calendar` VALUES ('2025-10-01',19,'船橋'),('2025-10-01',24,'名古屋'),('2025-10-01',27,'園田'),('2025-10-01',36,'門別'),('2025-10-02',19,'船橋'),('2025-10-02',24,'名古屋'),('2025-10-02',27,'園田'),('2025-10-02',36,'門別'),('2025-10-03',19,'船橋'),('2025-10-03',24,'名古屋'),('2025-10-03',27,'園田'),('2025-10-04',31,'高知'),('2025-10-04',32,'佐賀'),('2025-10-05',11,'水沢'),('2025-10-05',20,'大井'),('2025-10-05',31,'高知'),('2025-10-05',32,'佐賀'),('2025-10-06',11,'水沢'),('2025-10-06',20,'大井'),('2025-10-06',22,'金沢'),('2025-10-07',11,'水沢'),('2025-10-07',20,'大井'),('2025-10-07',22,'金沢'),('2025-10-07',23,'笠松'),('2025-10-07',36,'門別'),('2025-10-08',20,'大井'),('2025-10-08',23,'笠松'),('2025-10-08',27,'園田'),('2025-10-08',36,'門別'),('2025-10-09',20,'大井'),('2025-10-09',23,'笠松'),('2025-10-09',27,'園田'),('2025-10-09',36,'門別'),('2025-10-10',20,'大井'),('2025-10-10',23,'笠松'),('2025-10-10',27,'園田'),('2025-10-11',22,'金沢'),('2025-10-11',31,'高知'),('2025-10-11',32,'佐賀'),('2025-10-12',10,'盛岡'),('2025-10-12',22,'金沢'),('2025-10-12',31,'高知'),('2025-10-12',32,'佐賀'),('2025-10-13',10,'盛岡'),('2025-10-13',21,'川崎'),('2025-10-13',32,'佐賀'),('2025-10-14',10,'盛岡'),('2025-10-14',21,'川崎'),('2025-10-14',22,'金沢'),('2025-10-14',24,'名古屋'),('2025-10-14',36,'門別'),('2025-10-15',21,'川崎'),('2025-10-15',24,'名古屋'),('2025-10-15',27,'園田'),('2025-10-15',36,'門別'),('2025-10-16',21,'川崎'),('2025-10-16',24,'名古屋'),('2025-10-16',27,'園田'),('2025-10-16',36,'門別'),('2025-10-17',21,'川崎'),('2025-10-17',24,'名古屋'),('2025-10-17',27,'園田'),('2025-10-18',31,'高知'),('2025-10-18',32,'佐賀'),('2025-10-19',10,'盛岡'),('2025-10-19',22,'金沢'),('2025-10-19',31,'高知'),('2025-10-19',32,'佐賀'),('2025-10-20',10,'盛岡'),('2025-10-20',20,'大井'),('2025-10-21',10,'盛岡'),('2025-10-21',20,'大井'),('2025-10-21',22,'金沢'),('2025-10-21',23,'笠松'),('2025-10-21',36,'門別'),('2025-10-22',20,'大井'),('2025-10-22',23,'笠松'),('2025-10-22',27,'園田'),('2025-10-22',36,'門別'),('2025-10-23',20,'大井'),('2025-10-23',23,'笠松'),('2025-10-23',27,'園田'),('2025-10-23',36,'門別'),('2025-10-24',20,'大井'),('2025-10-24',23,'笠松'),('2025-10-24',27,'園田'),('2025-10-25',22,'金沢'),('2025-10-25',31,'高知'),('2025-10-25',32,'佐賀'),('2025-10-26',10,'盛岡'),('2025-10-26',31,'高知'),('2025-10-26',32,'佐賀'),('2025-10-27',10,'盛岡'),('2025-10-27',18,'浦和'),('2025-10-27',22,'金沢'),('2025-10-27',32,'佐賀'),('2025-10-28',10,'盛岡'),('2025-10-28',18,'浦和'),('2025-10-28',22,'金沢'),('2025-10-28',24,'名古屋'),('2025-10-28',27,'園田'),('2025-10-28',36,'門別'),('2025-10-29',18,'浦和'),('2025-10-29',24,'名古屋'),('2025-10-29',27,'園田'),('2025-10-29',36,'門別'),('2025-10-30',18,'浦和'),('2025-10-30',24,'名古屋'),('2025-10-30',27,'園田'),('2025-10-30',36,'門別'),('2025-10-31',18,'浦和'),('2025-10-31',24,'名古屋');
/*!40000 ALTER TABLE `calendar` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jockey_ranking`
--

LOCK TABLES `jockey_ranking` WRITE;
/*!40000 ALTER TABLE `jockey_ranking` DISABLE KEYS */;
/*!40000 ALTER TABLE `jockey_ranking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prediction`
--

DROP TABLE IF EXISTS `prediction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prediction` (
  `race_id` char(12) NOT NULL,
  `horse_number` tinyint unsigned NOT NULL,
  `score` int unsigned DEFAULT NULL,
  `memo` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`race_id`),
  KEY `idx_score` (`score`),
  KEY `idx_horse` (`horse_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prediction`
--

LOCK TABLES `prediction` WRITE;
/*!40000 ALTER TABLE `prediction` DISABLE KEYS */;
/*!40000 ALTER TABLE `prediction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `race_cnt`
--

DROP TABLE IF EXISTS `race_cnt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `race_cnt` (
  `id` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `cnt` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `race_cnt`
--

LOCK TABLES `race_cnt` WRITE;
/*!40000 ALTER TABLE `race_cnt` DISABLE KEYS */;
INSERT INTO `race_cnt` VALUES ('2025101310',12,'2025-10-12 13:57:21'),('2025101321',12,'2025-10-12 13:57:22'),('2025101332',11,'2025-10-12 13:57:22');
/*!40000 ALTER TABLE `race_cnt` ENABLE KEYS */;
UNLOCK TABLES;

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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `race_results`
--

LOCK TABLES `race_results` WRITE;
/*!40000 ALTER TABLE `race_results` DISABLE KEYS */;
/*!40000 ALTER TABLE `race_results` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sire_ranking`
--

LOCK TABLES `sire_ranking` WRITE;
/*!40000 ALTER TABLE `sire_ranking` DISABLE KEYS */;
/*!40000 ALTER TABLE `sire_ranking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venue_master`
--

DROP TABLE IF EXISTS `venue_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venue_master` (
  `baba_code` int NOT NULL,
  `rakuten_baba_code` varchar(16) COLLATE utf8mb4_general_ci NOT NULL,
  `venue` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`baba_code`),
  UNIQUE KEY `uk_rakuten_baba_code` (`rakuten_baba_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venue_master`
--

LOCK TABLES `venue_master` WRITE;
/*!40000 ALTER TABLE `venue_master` DISABLE KEYS */;
INSERT INTO `venue_master` VALUES (3,'03041503','帯広ば'),(10,'10061006','盛岡'),(11,'11060605','水沢'),(18,'18131203','浦和'),(19,'19140801','船橋'),(20,'20151205','大井'),(21,'21350805','川崎'),(22,'22181501','金沢'),(23,'23201204','笠松'),(24,'24332203','名古屋'),(27,'27261706','園田'),(28,'28260102','姫路'),(31,'31291106','高知'),(32,'32302205','佐賀'),(36,'36011504','門別');
/*!40000 ALTER TABLE `venue_master` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-12 23:09:14


-- 1) 出走表: racing_form（★今回のエラーの本命）
DROP TABLE IF EXISTS racing_form;
CREATE TABLE racing_form (
  race_id            BIGINT      NOT NULL,                     -- 例: 202510130131
  frame_number       INT         NOT NULL,                     -- 枠番
  horse_number       INT         NOT NULL,                     -- 馬番
  horse_name         VARCHAR(64) NOT NULL,
  sex_age            VARCHAR(8)  NULL,                         -- 例: 牡4 / 牝3
  carried_weight     DECIMAL(4,1) NULL,                        -- 斤量 (kg)
  jockey_name        VARCHAR(64) NULL,
  trainer_name       VARCHAR(64) NULL,
  odds_morning       DECIMAL(8,2) NULL,                        -- 前日/直前オッズ等（任意）
  horse_weight       INT NULL,                                 -- 馬体重
  horse_weight_diff  INT NULL,                                 -- 増減
  draw_number        INT NULL,                                 -- ゲート番（必要なら）
  remarks            VARCHAR(255) NULL,                        -- 備考
  raw_json           JSON NULL,                                -- 取得元のRaw（任意）
  created_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (race_id, horse_number),
  KEY idx_racing_form_race (race_id),
  KEY idx_racing_form_jockey (jockey_name),
  KEY idx_racing_form_trainer (trainer_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;