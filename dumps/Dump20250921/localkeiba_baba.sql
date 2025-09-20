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
-- Table structure for table `baba`
--

DROP TABLE IF EXISTS `baba`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `baba` (
  `baba_code` tinyint NOT NULL DEFAULT '0',
  `baba_name` text COLLATE utf8mb3_unicode_ci,
  PRIMARY KEY (`baba_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `baba`
--

LOCK TABLES `baba` WRITE;
/*!40000 ALTER TABLE `baba` DISABLE KEYS */;
INSERT INTO `baba` VALUES (1,'北見ば'),(2,'岩見ば'),(3,'帯広ば'),(4,'旭川ば'),(7,'旭川'),(8,'札幌'),(10,'盛岡'),(11,'水沢'),(12,'上山'),(15,'足利'),(16,'宇都宮'),(17,'高崎'),(18,'浦和'),(19,'船橋'),(20,'大井'),(21,'川崎'),(22,'金沢'),(23,'笠松'),(24,'名古屋'),(25,'中京'),(27,'園田'),(28,'姫路'),(30,'福山'),(31,'高知'),(32,'佐賀'),(33,'荒尾'),(36,'門別'),(41,'ばんえ'),(42,'北海道'),(43,'岩手'),(44,'新潟'),(45,'北関東'),(46,'南関東'),(47,'栃木'),(48,'東海'),(49,'愛知'),(50,'兵庫'),(61,'九州'),(80,'全国');
/*!40000 ALTER TABLE `baba` ENABLE KEYS */;
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
