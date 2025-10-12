/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.5.27-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: localkeiba
-- ------------------------------------------------------
-- Server version	10.5.27-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `baba` (
  `baba_code` tinyint(4) NOT NULL DEFAULT 0,
  `baba_name` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `baba`
--

LOCK TABLES `baba` WRITE;
/*!40000 ALTER TABLE `baba` DISABLE KEYS */;
INSERT INTO `baba` VALUES (1,'北見ば'),(2,'岩見ば'),(3,'帯広ば'),(4,'旭川ば'),(7,'旭川'),(8,'札幌'),(10,'盛岡'),(11,'水沢'),(12,'上山'),(15,'足利'),(16,'宇都宮'),(17,'高崎'),(18,'浦和'),(19,'船橋'),(20,'大井'),(21,'川崎'),(22,'金沢'),(23,'笠松'),(24,'名古屋'),(25,'中京'),(27,'園田'),(28,'姫路'),(30,'福山'),(31,'高知'),(32,'佐賀'),(33,'荒尾'),(36,'門別'),(41,'ばんえ'),(42,'北海道'),(43,'岩手'),(44,'新潟'),(45,'北関東'),(46,'南関東'),(47,'栃木'),(48,'東海'),(49,'愛知'),(50,'兵庫'),(61,'九州'),(80,'全国');
/*!40000 ALTER TABLE `baba` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `race_cnt`
--

DROP TABLE IF EXISTS `race_cnt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `race_cnt` (
  `id` varchar(10) NOT NULL,
  `cnt` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `race_cnt`
--

LOCK TABLES `race_cnt` WRITE;
/*!40000 ALTER TABLE `race_cnt` DISABLE KEYS */;
/*!40000 ALTER TABLE `race_cnt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `race_results`
--

DROP TABLE IF EXISTS `race_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `race_results` (
  `race_result_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `race_id` bigint(20) NOT NULL,
  `frame_number` int(11) NOT NULL,
  `horse_number` int(11) NOT NULL,
  `horse_name` varchar(64) NOT NULL,
  `official_finish_position` int(11) NOT NULL,
  `dead_heat_group` int(11) DEFAULT NULL,
  `dead_heat_order_in_group` int(11) DEFAULT NULL,
  `finish_time_str` varchar(16) DEFAULT NULL,
  `margin` varchar(16) DEFAULT NULL,
  `odds_win` decimal(8,1) DEFAULT NULL,
  `popularity` int(11) DEFAULT NULL,
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
-- Table structure for table `racing_form`
--

DROP TABLE IF EXISTS `racing_form`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `racing_form` (
  `race_id` char(12) NOT NULL,
  `frame_number` int(11) NOT NULL DEFAULT 0,
  `horse_number` int(11) NOT NULL DEFAULT 0,
  `horse_name` text DEFAULT NULL,
  `sex_age` text DEFAULT NULL,
  `hair` text DEFAULT NULL,
  `birthyear` tinyint(4) DEFAULT 0,
  `birthymonth` tinyint(4) DEFAULT 0,
  `sire` text DEFAULT NULL,
  `dam` text DEFAULT NULL,
  `broodmare_sire` text DEFAULT NULL,
  `jockey` text DEFAULT NULL,
  `affiliation` text DEFAULT NULL,
  `burden_weight` varchar(16) DEFAULT NULL,
  `trainer` text DEFAULT NULL,
  `owner` text DEFAULT NULL,
  `breeder` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`race_id`,`horse_number`),
  KEY `idx_racing_form_race_frame` (`race_id`,`frame_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `racing_form`
--

LOCK TABLES `racing_form` WRITE;
/*!40000 ALTER TABLE `racing_form` DISABLE KEYS */;
/*!40000 ALTER TABLE `racing_form` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venue_master`
--

DROP TABLE IF EXISTS `venue_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `venue_master` (
  `baba_code` int(11) NOT NULL,
  `rakuten_baba_code` varchar(16) NOT NULL,
  `venue` varchar(32) NOT NULL,
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

-- Dump completed on 2025-09-16 18:19:03



CREATE TABLE sire_ranking (
  distance_m INT NOT NULL,
  sire_id    BIGINT NOT NULL,
  sire_name  VARCHAR(255) NOT NULL,
  score      INT NOT NULL,
  PRIMARY KEY (distance_m, sire_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS racing_form;

CREATE TABLE racing_form (
  race_id        CHAR(12)        NOT NULL,                         -- YYYYMMDDRRBB
  frame_number   TINYINT UNSIGNED NOT NULL,                        -- 枠番(1..8)
  horse_number   TINYINT UNSIGNED NOT NULL,                        -- 馬番(1..18)
  horse_name     VARCHAR(255)    NOT NULL,
  sex_age        VARCHAR(8)      NULL,                             -- 例: 牡5
  hair           VARCHAR(16)     NULL,                             -- 栗毛 等
  birthyear      TINYINT UNSIGNED NOT NULL DEFAULT 0,              -- 西暦下2桁
  birthymonth    TINYINT UNSIGNED NOT NULL DEFAULT 0,              -- 1..12
  sire           VARCHAR(255)    NULL,
  dam            VARCHAR(255)    NULL,
  broodmare_sire VARCHAR(255)    NULL,
  jockey         VARCHAR(255)    NULL,
  affiliation    VARCHAR(32)     NULL,                             -- 所属(岩手/大井 等)
  burden_weight  VARCHAR(8)      NULL,                             -- "▲ 51.0" など記号込みで保持
  trainer        VARCHAR(255)    NULL,
  owner          VARCHAR(255)    NULL,
  breeder        VARCHAR(255)    NULL,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (race_id, horse_number),
  KEY idx_race_id (race_id),
  KEY idx_jockey (jockey),
  KEY idx_trainer (trainer),
  KEY idx_owner (owner)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS racing_form;
CREATE TABLE IF NOT EXISTS prediction (
  race_id      CHAR(12)         NOT NULL,                 -- YYYYMMDDRRBB
  horse_number TINYINT UNSIGNED NOT NULL,                 -- 推奨馬の馬番(1～18想定)
  score        INT UNSIGNED     NULL,                     -- ①+②+③ の合算
  memo         JSON             NULL,                     -- 馬番とスコアの配列/内訳(見やすくJSON推奨)
  created_at   TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (race_id),
  KEY idx_score (score),
  KEY idx_horse (horse_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;