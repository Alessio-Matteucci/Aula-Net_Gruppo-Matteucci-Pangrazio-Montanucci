-- MySQL dump 10.13  Distrib 8.0.43, for macos15 (arm64)
--
-- Host: localhost    Database: scuola
-- ------------------------------------------------------
-- Server version	8.4.6

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
-- Table structure for table `aule`
--

DROP TABLE IF EXISTS `aule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero` int NOT NULL,
  `nome_aula` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero` (`numero`),
  CONSTRAINT `aule_chk_1` CHECK ((`numero` between 1 and 119))
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aule`
--

LOCK TABLES `aule` WRITE;
/*!40000 ALTER TABLE `aule` DISABLE KEYS */;
INSERT INTO `aule` VALUES (1,1,NULL),(2,2,NULL),(3,3,NULL),(4,4,NULL),(5,5,NULL),(6,6,NULL),(7,7,NULL),(8,8,NULL),(9,9,NULL),(10,10,NULL),(11,11,NULL),(12,12,NULL),(13,13,NULL),(14,14,NULL),(15,15,NULL),(16,16,'Charlse Marc Hervé Perceval Leclerc'),(17,17,NULL),(18,18,NULL),(19,19,NULL),(20,20,NULL),(21,21,NULL),(22,22,NULL),(23,23,NULL),(24,24,NULL),(25,25,NULL),(26,26,NULL),(27,27,NULL),(28,28,NULL),(29,29,NULL),(30,30,NULL),(31,31,NULL),(32,32,NULL),(33,33,NULL),(34,34,NULL),(35,35,NULL),(36,36,NULL),(37,37,NULL),(38,38,NULL),(39,39,NULL),(40,40,NULL),(41,41,NULL),(42,42,NULL),(43,43,NULL),(44,44,'Sir Lewis Hamilton'),(45,45,NULL),(46,46,NULL),(47,47,NULL),(48,48,NULL),(49,49,NULL),(50,50,NULL),(51,51,NULL),(52,52,NULL),(53,53,NULL),(54,54,NULL),(55,55,NULL),(56,56,NULL),(57,57,NULL),(58,58,NULL),(59,59,NULL),(60,60,NULL),(61,61,NULL),(62,62,NULL),(63,63,NULL),(64,64,NULL),(65,65,NULL),(66,66,NULL),(67,67,NULL),(68,68,NULL),(69,69,NULL),(70,70,NULL),(71,71,NULL),(72,72,NULL),(73,73,NULL),(74,74,NULL),(75,75,NULL),(76,76,NULL),(77,77,NULL),(78,78,NULL),(79,79,NULL),(80,80,NULL),(81,81,NULL),(82,82,NULL),(83,83,NULL),(84,84,NULL),(85,85,NULL),(86,86,NULL),(87,87,NULL),(88,88,NULL),(89,89,NULL),(90,90,NULL),(91,91,NULL),(92,92,NULL),(93,93,NULL),(94,94,NULL),(95,95,NULL),(96,96,NULL),(97,97,NULL),(98,98,NULL),(99,99,NULL),(100,100,NULL),(101,101,NULL),(102,102,NULL),(103,103,NULL),(104,104,NULL),(105,105,NULL),(106,106,NULL),(107,107,NULL),(108,108,NULL),(109,109,NULL),(110,110,NULL),(111,111,NULL),(112,112,NULL),(113,113,NULL),(114,114,NULL),(115,115,NULL),(116,116,NULL),(117,117,NULL),(118,118,NULL),(119,119,NULL);
/*!40000 ALTER TABLE `aule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classi`
--

DROP TABLE IF EXISTS `classi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `indirizzo` varchar(100) DEFAULT NULL,
  `anno` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `classi_chk_1` CHECK ((`anno` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=131 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classi`
--

LOCK TABLES `classi` WRITE;
/*!40000 ALTER TABLE `classi` DISABLE KEYS */;
INSERT INTO `classi` VALUES (1,'1ACA','Chimica',1),(2,'1ACM','Chimica e Materiali',1),(3,'1AEE','Elettronica',1),(4,'1AIT','Informatica e Telecomunicazioni',1),(5,'1AMM','Meccanica e Meccatronica',1),(6,'1ATL','Altro',1),(7,'1BEE','Elettronica',1),(8,'1BIT','Informatica e Telecomunicazioni',1),(9,'1BMM','Meccanica e Meccatronica',1),(10,'1CIT','Informatica e Telecomunicazioni',1),(11,'1CMM','Meccanica e Meccatronica',1),(12,'1DIT','Informatica e Telecomunicazioni',1),(13,'2ACM','Chimica e Materiali',2),(14,'2AE','Elettronica',2),(15,'2AIT','Informatica e Telecomunicazioni',2),(16,'2AMM','Meccanica e Meccatronica',2),(17,'2BCM','Chimica e Materiali',2),(18,'2BEE','Elettronica',2),(19,'2BIT','Informatica e Telecomunicazioni',2),(20,'2BMM','Meccanica e Meccatronica',2),(21,'2CA','Chimica',2),(22,'2CEE','Elettronica',2),(23,'2CIT','Informatica e Telecomunicazioni',2),(24,'2CMM','Meccanica e Meccatronica',2),(25,'2DIT','Informatica e Telecomunicazioni',2),(26,'2EIT','Informatica e Telecomunicazioni',2),(27,'3ABS','Altro',3),(28,'3AC','Chimica',3),(29,'3ACA','Chimica',3),(30,'3AEC','Elettronica',3),(31,'3AET','Elettronica',3),(32,'3AIA','Informatica e Telecomunicazioni',3),(33,'3AMM','Meccanica e Meccatronica',3),(34,'3BBS','Altro',3),(35,'3BIA','Informatica e Telecomunicazioni',3),(36,'3BMM','Meccanica e Meccatronica',3),(37,'3CIA','Informatica e Telecomunicazioni',3),(38,'3CS','Costruzioni del Mezzo',3),(39,'4AAT','Altro',4),(40,'4ABS','Altro',4),(41,'4AC','Chimica',4),(42,'4ACA','Chimica',4),(43,'4AET','Elettronica',4),(44,'4AIA','Informatica e Telecomunicazioni',4),(45,'4AMM','Meccanica e Meccatronica',4),(46,'4BBS','Altro',4),(47,'4BIA','Informatica e Telecomunicazioni',4),(48,'4BMM','Meccanica e Meccatronica',4),(49,'4CIA','Informatica e Telecomunicazioni',4),(50,'4DIA','Informatica e Telecomunicazioni',4),(51,'4EC','Elettronica',4),(52,'5ABS','Altro',5),(53,'5ACA','Chimica',5),(54,'5ACM','Chimica e Materiali',5),(55,'5ACS','Costruzioni del Mezzo',5),(56,'5AET','Elettronica',5),(57,'5AIA','Informatica e Telecomunicazioni',5),(58,'5AMM','Meccanica e Meccatronica',5),(59,'5AT','Altro',5),(60,'5BCM','Chimica e Materiali',5),(61,'5BIA','Informatica e Telecomunicazioni',5),(62,'5BMM','Meccanica e Meccatronica',5),(63,'5CIA','Informatica e Telecomunicazioni',5),(64,'5DIA','Informatica e Telecomunicazioni',5),(65,'5EC','Elettronica',5);
/*!40000 ALTER TABLE `classi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prenotazione_classi`
--

DROP TABLE IF EXISTS `prenotazione_classi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prenotazione_classi` (
  `prenotazione_id` int NOT NULL,
  `classe_id` int NOT NULL,
  PRIMARY KEY (`prenotazione_id`,`classe_id`),
  KEY `classe_id` (`classe_id`),
  CONSTRAINT `prenotazione_classi_ibfk_1` FOREIGN KEY (`prenotazione_id`) REFERENCES `prenotazioni` (`id`) ON DELETE CASCADE,
  CONSTRAINT `prenotazione_classi_ibfk_2` FOREIGN KEY (`classe_id`) REFERENCES `classi` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prenotazione_classi`
--

LOCK TABLES `prenotazione_classi` WRITE;
/*!40000 ALTER TABLE `prenotazione_classi` DISABLE KEYS */;
/*!40000 ALTER TABLE `prenotazione_classi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prenotazioni`
--

DROP TABLE IF EXISTS `prenotazioni`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prenotazioni` (
  `id` int NOT NULL AUTO_INCREMENT,
  `aula_id` int NOT NULL,
  `utente_id` int NOT NULL,
  `data` date NOT NULL,
  `ora_inizio` time NOT NULL,
  `ora_fine` time NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_aula` (`aula_id`),
  KEY `fk_utente` (`utente_id`),
  CONSTRAINT `fk_aula` FOREIGN KEY (`aula_id`) REFERENCES `aule` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_utente` FOREIGN KEY (`utente_id`) REFERENCES `utenti` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_orari` CHECK ((`ora_fine` > `ora_inizio`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prenotazioni`
--

LOCK TABLES `prenotazioni` WRITE;
/*!40000 ALTER TABLE `prenotazioni` DISABLE KEYS */;
/*!40000 ALTER TABLE `prenotazioni` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utenti`
--

DROP TABLE IF EXISTS `utenti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utenti` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `cogome` varchar(150) NOT NULL,
  `ruolo` enum('studente','docente','ATA','admin') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utenti`
--

LOCK TABLES `utenti` WRITE;
/*!40000 ALTER TABLE `utenti` DISABLE KEYS */;
INSERT INTO `utenti` VALUES (1,'alessio','aessiom2007@gmail.com','matteucci','admin','2026-04-10 07:39:04'),(2,'alessio','alessio.matteucci@ittterni.org ','matteucci','studente','2026-04-10 07:40:07');
/*!40000 ALTER TABLE `utenti` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-10 11:15:05
