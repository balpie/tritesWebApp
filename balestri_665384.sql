-- Progettazione Web
DROP DATABASE if exists balestri_665384;
CREATE DATABASE  balestri_665384;
USE  balestri_665384;
-- MariaDB dump 10.19  Distrib 10.4.21-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: balestri_665384
-- ------------------------------------------------------
-- Server version	10.4.21-MariaDB

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
-- Table structure for table `Partite`
--

DROP TABLE IF EXISTS `Partite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Partite` (
  `IdPartita` int(11) NOT NULL AUTO_INCREMENT,
  `NomeUtente` varchar(30) NOT NULL,
  `LineeRipulite` int(11) NOT NULL,
  `Punti` int(11) NOT NULL,
  `DataPartita` datetime NOT NULL,
  PRIMARY KEY (`IdPartita`),
  KEY `NomeUtente` (`NomeUtente`),
  CONSTRAINT `Partite_ibfk_1` FOREIGN KEY (`NomeUtente`) REFERENCES `Utenti` (`NomeUtente`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Partite`
--

LOCK TABLES `Partite` WRITE;
/*!40000 ALTER TABLE `Partite` DISABLE KEYS */;
INSERT INTO `Partite` VALUES (6,'pit4real',47,44550,'2025-11-11 21:25:41'),(7,'pit4real',70,87410,'2025-11-11 22:50:11'),(8,'pit4real',71,95590,'2025-11-11 22:57:02'),(9,'rotix3000',38,22630,'2025-11-12 17:10:49'),(10,'nuovo',11,3380,'2025-11-12 21:31:53'),(11,'bjarneStroustrup',8,2010,'2025-11-13 09:45:34'),(12,'pit4real',0,230,'2025-11-13 11:54:06'),(13,'rotix3000',52,42560,'2025-11-13 15:39:22'),(25,'FluxZeero',11,2965,'2025-11-14 11:47:40'),(32,'antirondella',30,16965,'2025-11-14 13:35:06'),(33,'TORUK_MAKTO',54,50180,'2025-11-14 14:08:34'),(34,'TORUK_MAKTO',46,38050,'2025-11-14 14:26:01'),(37,'miacetta',1,300,'2025-11-14 17:16:17'),(39,'rotix3000',38,22490,'2025-11-14 21:37:20'),(40,'rotix3000',50,39480,'2025-11-14 21:47:51'),(41,'rotix3000',62,71940,'2025-11-14 21:55:12'),(42,'gemmys13',2,345,'2025-11-14 22:00:44'),(46,'miacetta',10,2490,'2025-11-15 19:09:15'),(47,'pit4real',67,86470,'2025-11-15 19:41:01'),(50,'pit4real',41,30190,'2025-11-15 22:28:59'),(51,'pit4real',70,86860,'2025-11-15 22:38:30'),(52,'pit4real',69,88800,'2025-11-15 22:45:50'),(53,'yakilas',0,105,'2025-11-16 19:12:40'),(54,'sardosauro',11,2610,'2025-11-16 19:18:21'),(55,'sardosauro',12,3765,'2025-11-16 19:21:33'),(56,'FluxZeero',31,19050,'2025-11-16 19:25:43'),(57,'FluxZeero',21,9375,'2025-11-16 19:30:09'),(58,'rotix3000',69,59365,'2025-11-16 12:00:03');
/*!40000 ALTER TABLE `Partite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Utenti`
--

DROP TABLE IF EXISTS `Utenti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Utenti` (
  `NomeUtente` varchar(30) NOT NULL,
  `PasswordUtente` varchar(128) NOT NULL,
  `DataIscrizione` date NOT NULL,
  PRIMARY KEY (`NomeUtente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Utenti`
--

LOCK TABLES `Utenti` WRITE;
/*!40000 ALTER TABLE `Utenti` DISABLE KEYS */;
INSERT INTO `Utenti` VALUES ('account_nogames','$2y$10$ZHRHdo8bI2he.Ol3r7K2JOrKguPclDZpkOqubNx2sbzZkpQxJwVD2','2025-11-15'),('antirondella','$2y$10$UL71YnbuzGaJ/zHJ8dZEYOPc/oa4aZzx/driNC2acTlC3rCguCqPG','2025-11-13'),('bjarneStroustrup','$2y$10$NLyP7ReE9Sd03BXP.mGg2OM65zuZbmfmCiPMlKVU4rBGaWZDIXsvG','2025-11-12'),('FluxZeero','$2y$10$2Mxv9T.nKPEAActwCEGApeLzbxsaxUIe94WKHOpW5lclbyDakEyHa','2025-11-11'),('gemmys13','$2y$10$kkvUbvDP7BdLqo1/BxuFluciFAoggjqwCxzB2X3a.qas7MtXBAC/y','2025-11-14'),('miacetta','$2y$10$6fRJ//o6zmTtmsANqcTBDO3PG36te264aj3y6BtXa3cBBIfILS7JG','2025-11-14'),('murry','$2y$10$WRHU/UOLYWlkJjz8UFOwfuMgUdp2NTRFBHHDuFGGtfRau8/BsptxW','2025-11-14'),('nuovo','$2y$10$nKeSxJ4QIXlGQFvaH1UjlOCJdvfbJ7jESkuR6S9kr9xhZLTkZDyZy','2025-11-12'),('PELLE','$2y$10$X/RMdmhRj13xy0V9tikpp.Zgvai2bEZNGsaD6G1JqVAsbW1bg/4Qi','2025-11-14'),('pit4real','$2y$10$84D1d/7szWk1R6MBRFBcnOU8BQPFUijLqIQp5aj4TWFKFnoj9SLci','2025-11-11'),('rotix3000','$2y$10$d2kWjNp605xyealrJYyM.ueSm91U7FWlHI2xRQIVZoDljxYAezroC','2025-11-12'),('sardosauro','$2y$10$tV1jx/sj9zNumtVvb/.1Mu0xRdteW4Oe2kpCKR745UME02K9Lpp9a','2025-11-16'),('TORUK_MAKTO','$2y$10$uNCTaYIWDsIKftBlyZE8MO/sletiemmUwVusfIqVbxEY0kvsArjG.','2025-11-14'),('yakilas','$2y$10$ukzD.J4632Ng6Fsz6K6z6.bXmVN3l9w20LM8b.gAgpjUYm.kPAbiC','2025-11-16');
/*!40000 ALTER TABLE `Utenti` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-22 11:01:09
