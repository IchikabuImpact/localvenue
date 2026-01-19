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

-- Dump completed on 2025-09-21  6:04:19
