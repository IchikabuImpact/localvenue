CREATE DATABASE  IF NOT EXISTS `localkeiba` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `localkeiba`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: localkeiba
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `racing_form`
--

DROP TABLE IF EXISTS `racing_form`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `racing_form` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `racing_form`
--

LOCK TABLES `racing_form` WRITE;
/*!40000 ALTER TABLE `racing_form` DISABLE KEYS */;
INSERT INTO `racing_form` VALUES ('202509141131',1,1,'マイネルアース','牡3','栗毛',22,5,'ブリックスアンドモルタル','マイネルアース','Street Cry','近藤翔','高知','▲ 54.0','宮川浩','近藤翔（高知）','株式会社那須野','2025-09-15 12:43:49','2025-09-15 12:43:49'),('202509141131',2,2,'カンプウ','牡3','鹿毛',22,3,'イスラボニータ','カンプウ','Fastnet Rock','赤岡修','高知','57.0','田中守','赤岡修（高知）','坂本智広','2025-09-15 12:43:49','2025-09-15 12:43:49'),('202509141131',3,3,'アルデココ','牝3','黒鹿毛',22,2,'スワーヴリチャード','アルデココ','The Leopard','吉原寛','金沢','55.0','那俄哲','吉原寛（金沢）','中尾由香','2025-09-15 12:43:49','2025-09-15 12:43:49'),('202509141131',4,4,'ハッスルアニキ','牡3','黒鹿毛',22,3,'ミッキーロケット','ハッスルアニキ','アドマイヤベガ','永森大','高知','57.0','雑賀正','永森大（高知）','幌村牧場','2025-09-15 12:43:49','2025-09-15 12:43:49'),('202509141131',5,5,'カゼヨウビ','牝3','鹿毛',22,4,'マジェスティックウォリアー','カゼヨウビ','ハードスパン','阿部基','高知','△ 53.0','田中譲','阿部基（高知）','富田恭司','2025-09-15 12:43:49','2025-09-15 12:43:49'),('202509141131',5,6,'ポジティビティ','牡3','栗毛',22,3,'モーニン','ポジティビティ','クロフネ','妹尾浩','高知','57.0','工藤真','妹尾浩（高知）','春木ファーム','2025-09-15 12:43:49','2025-09-15 12:43:49'),('202509141131',6,7,'プルプレア','牝3','青鹿毛',22,4,'ゴールドドリーム','プルプレア','ネオユニヴァース','郷間勇','高知','55.0','別府真','郷間勇（高知）','赤石牧場','2025-09-15 12:43:49','2025-09-15 12:43:49'),('202509141131',6,8,'マシェリアムール','牝3','青鹿毛',22,4,'リアルインパクト','マシェリアムール','アサクサデンエン','塚本征','愛知','55.0','宮川浩','塚本征（愛知）','ミルファーム','2025-09-15 12:43:49','2025-09-15 12:43:49'),('202509141131',7,9,'ユールビーバック','牡3','栗毛',22,5,'モーニン','ユールビーバック','ゼンノロブロイ','多田誠','高知','57.0','工藤真','多田誠（高知）','上井農場','2025-09-15 12:43:49','2025-09-15 12:43:49'),('202509141131',7,10,'アルデヤーノ','牡3','黒鹿毛',22,4,'イスラボニータ','アルデヤーノ','Sharp Humor','佐原秀','高知','57.0','那俄哲','佐原秀（高知）','社台ファーム','2025-09-15 12:43:49','2025-09-15 12:43:49'),('202509141131',8,11,'スマートアリスター','牝3','栗毛',22,3,'カリフォルニアクローム','スマートアリスター','フォーティナイナー','林謙佑','高知','55.0','中西達','林謙佑（高知）','桑田牧場','2025-09-15 12:43:49','2025-09-15 12:43:49'),('202509141131',8,12,'ユリオプスイエロー','牝3','鹿毛',22,3,'オーヴァルエース','ユリオプスイエロー','キングカメハメハ','大澤誠','高知','55.0','倉兼育','大澤誠（高知）','山春牧場','2025-09-15 12:43:49','2025-09-15 12:43:49');
/*!40000 ALTER TABLE `racing_form` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-21  6:04:19
