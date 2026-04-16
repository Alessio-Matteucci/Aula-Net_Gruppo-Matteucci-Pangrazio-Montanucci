CREATE DATABASE  IF NOT EXISTS `aula-net` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `aula-net`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: aula-net
-- ------------------------------------------------------
-- Server version	8.0.44

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
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aule`
--

LOCK TABLES `aule` WRITE;
/*!40000 ALTER TABLE `aule` DISABLE KEYS */;
INSERT INTO `aule` VALUES (1,1,NULL),(2,2,NULL),(3,3,NULL),(4,4,NULL),(5,5,NULL),(6,6,NULL),(7,7,NULL),(8,8,NULL),(9,9,NULL),(10,10,NULL),(11,11,NULL),(12,12,NULL),(13,13,NULL),(14,14,NULL),(15,15,NULL),(16,16,NULL),(17,17,NULL),(18,18,NULL),(19,19,NULL),(20,20,NULL),(21,21,NULL),(22,22,NULL),(23,23,NULL),(24,24,NULL),(25,25,NULL),(26,26,NULL),(27,27,NULL),(28,28,NULL),(29,29,NULL),(30,30,NULL),(31,31,NULL),(32,32,NULL),(33,33,NULL),(34,34,NULL),(35,35,NULL),(36,36,NULL),(37,37,NULL),(38,38,NULL),(39,39,NULL),(40,40,NULL),(41,41,NULL),(42,42,NULL),(43,43,NULL),(44,44,NULL),(45,45,NULL),(46,46,NULL),(47,47,NULL),(48,48,NULL),(49,49,NULL),(50,50,NULL),(51,51,NULL),(52,52,NULL),(53,53,NULL),(54,54,NULL),(55,55,NULL),(56,56,NULL),(57,57,NULL),(58,58,NULL),(59,59,NULL),(60,60,NULL),(61,61,NULL),(62,62,NULL),(63,63,NULL),(64,64,NULL),(65,65,NULL),(66,66,NULL),(67,67,NULL),(68,68,NULL),(69,69,NULL),(70,70,NULL),(71,71,NULL),(72,72,NULL),(73,73,NULL),(74,74,NULL),(75,75,NULL),(76,76,NULL),(77,77,NULL),(78,78,NULL),(79,79,NULL),(80,80,NULL),(81,81,NULL),(82,82,NULL),(83,83,NULL),(84,84,NULL),(85,85,NULL),(86,86,NULL),(87,87,NULL),(88,88,NULL),(89,89,NULL),(90,90,NULL),(91,91,NULL),(92,92,NULL),(93,93,NULL),(94,94,NULL),(95,95,NULL),(96,96,NULL),(97,97,NULL),(98,98,NULL),(99,99,NULL),(100,100,NULL),(101,101,NULL),(102,102,NULL),(103,103,NULL),(104,104,NULL),(105,105,NULL),(106,106,NULL),(107,107,NULL),(108,108,NULL),(109,109,NULL),(110,110,NULL),(111,111,NULL),(112,112,NULL),(113,113,NULL),(114,114,NULL),(115,115,NULL),(116,116,NULL),(117,117,NULL),(118,118,NULL),(119,119,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classi`
--

LOCK TABLES `classi` WRITE;
/*!40000 ALTER TABLE `classi` DISABLE KEYS */;
INSERT INTO classi (nome, indirizzo, anno) VALUES
('1ACA', 'Chimica', 1),
('1ACM', 'Chimica e Materiali', 1),
('1AEE', 'Elettronica', 1),
('1AIT', 'Informatica e Telecomunicazioni', 1),
('1AMM', 'Meccanica e Meccatronica', 1),
('1ATL', 'Altro', 1),
('1BEE', 'Elettronica', 1),
('1BIT', 'Informatica e Telecomunicazioni', 1),
('1BMM', 'Meccanica e Meccatronica', 1),
('1CIT', 'Informatica e Telecomunicazioni', 1),
('1CMM', 'Meccanica e Meccatronica', 1),
('1DIT', 'Informatica e Telecomunicazioni', 1),

('2ACM', 'Chimica e Materiali', 2),
('2AE', 'Elettronica', 2),
('2AIT', 'Informatica e Telecomunicazioni', 2),
('2AMM', 'Meccanica e Meccatronica', 2),
('2BCM', 'Chimica e Materiali', 2),
('2BEE', 'Elettronica', 2),
('2BIT', 'Informatica e Telecomunicazioni', 2),
('2BMM', 'Meccanica e Meccatronica', 2),
('2CA', 'Chimica', 2),
('2CEE', 'Elettronica', 2),
('2CIT', 'Informatica e Telecomunicazioni', 2),
('2CMM', 'Meccanica e Meccatronica', 2),
('2DIT', 'Informatica e Telecomunicazioni', 2),
('2EIT', 'Informatica e Telecomunicazioni', 2),

('3ABS', 'Altro', 3),
('3AC', 'Chimica', 3),
('3ACA', 'Chimica', 3),
('3AEC', 'Elettronica', 3),
('3AET', 'Elettronica', 3),
('3AIA', 'Informatica e Telecomunicazioni', 3),
('3AMM', 'Meccanica e Meccatronica', 3),
('3BBS', 'Altro', 3),
('3BIA', 'Informatica e Telecomunicazioni', 3),
('3BMM', 'Meccanica e Meccatronica', 3),
('3CIA', 'Informatica e Telecomunicazioni', 3),
('3CS', 'Costruzioni del Mezzo', 3),

('4AAT', 'Altro', 4),
('4ABS', 'Altro', 4),
('4AC', 'Chimica', 4),
('4ACA', 'Chimica', 4),
('4AET', 'Elettronica', 4),
('4AIA', 'Informatica e Telecomunicazioni', 4),
('4AMM', 'Meccanica e Meccatronica', 4),
('4BBS', 'Altro', 4),
('4BIA', 'Informatica e Telecomunicazioni', 4),
('4BMM', 'Meccanica e Meccatronica', 4),
('4CIA', 'Informatica e Telecomunicazioni', 4),
('4DIA', 'Informatica e Telecomunicazioni', 4),
('4EC', 'Elettronica', 4),

('5ABS', 'Altro', 5),
('5ACA', 'Chimica', 5),
('5ACM', 'Chimica e Materiali', 5),
('5ACS', 'Costruzioni del Mezzo', 5),
('5AET', 'Elettronica', 5),
('5AIA', 'Informatica e Telecomunicazioni', 5),
('5AMM', 'Meccanica e Meccatronica', 5),
('5AT', 'Altro', 5),
('5BCM', 'Chimica e Materiali', 5),
('5BIA', 'Informatica e Telecomunicazioni', 5),
('5BMM', 'Meccanica e Meccatronica', 5),
('5CIA', 'Informatica e Telecomunicazioni', 5),
('5DIA', 'Informatica e Telecomunicazioni', 5),
('5EC', 'Elettronica', 5);
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
INSERT INTO `prenotazione_classi` VALUES (11,1),(13,1),(19,1),(24,1),(43,1),(53,1),(32,2),(47,2),(9,3),(15,3),(34,3),(46,3),(50,3),(18,4),(37,4),(38,4),(40,4),(8,5),(20,5),(22,5),(28,5),(2,6),(4,6),(5,6),(21,6),(49,6),(3,7),(16,7),(30,7),(31,7),(33,7),(52,7),(1,8),(25,8),(35,8),(41,8),(45,8),(6,9),(7,9),(12,9),(17,9),(26,9),(27,9),(48,9),(10,10),(14,10),(23,10),(29,10),(36,10),(39,10),(42,10),(44,10),(51,10);
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
  UNIQUE KEY `aula_id` (`aula_id`,`data`,`ora_inizio`),
  KEY `utente_id` (`utente_id`),
  CONSTRAINT `prenotazioni_ibfk_1` FOREIGN KEY (`aula_id`) REFERENCES `aule` (`id`) ON DELETE CASCADE,
  CONSTRAINT `prenotazioni_ibfk_2` FOREIGN KEY (`utente_id`) REFERENCES `utenti` (`id`) ON DELETE CASCADE,
  CONSTRAINT `prenotazioni_chk_1` CHECK ((`ora_fine` > `ora_inizio`))
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prenotazioni`
--

LOCK TABLES `prenotazioni` WRITE;
/*!40000 ALTER TABLE `prenotazioni` DISABLE KEYS */;
INSERT INTO `prenotazioni` VALUES (1,4,5,'2026-05-13','10:00:00','11:00:00','2026-04-16 13:30:25'),(2,5,3,'2026-05-02','09:00:00','10:00:00','2026-04-16 13:30:25'),(3,9,3,'2026-05-07','10:00:00','11:00:00','2026-04-16 13:30:25'),(4,10,3,'2026-05-02','10:00:00','11:00:00','2026-04-16 13:30:25'),(5,12,2,'2026-05-10','11:00:00','12:00:00','2026-04-16 13:30:25'),(6,18,1,'2026-05-10','11:00:00','12:00:00','2026-04-16 13:30:25'),(7,19,6,'2026-05-10','09:00:00','10:00:00','2026-04-16 13:30:25'),(8,20,1,'2026-05-14','11:00:00','12:00:00','2026-04-16 13:30:25'),(9,20,3,'2026-05-02','10:00:00','11:00:00','2026-04-16 13:30:25'),(10,21,4,'2026-05-02','11:00:00','12:00:00','2026-04-16 13:30:25'),(11,21,3,'2026-05-11','10:00:00','11:00:00','2026-04-16 13:30:25'),(12,23,2,'2026-05-10','10:00:00','11:00:00','2026-04-16 13:30:25'),(13,25,1,'2026-05-03','11:00:00','12:00:00','2026-04-16 13:30:25'),(14,32,2,'2026-05-05','08:00:00','09:00:00','2026-04-16 13:30:25'),(15,34,5,'2026-05-05','11:00:00','12:00:00','2026-04-16 13:30:25'),(16,34,4,'2026-05-02','08:00:00','09:00:00','2026-04-16 13:30:25'),(17,36,3,'2026-05-11','10:00:00','11:00:00','2026-04-16 13:30:25'),(18,38,2,'2026-05-10','11:00:00','12:00:00','2026-04-16 13:30:25'),(19,40,4,'2026-05-01','11:00:00','12:00:00','2026-04-16 13:30:25'),(20,40,5,'2026-05-03','08:00:00','09:00:00','2026-04-16 13:30:25'),(21,41,5,'2026-05-03','11:00:00','12:00:00','2026-04-16 13:30:25'),(22,42,4,'2026-05-13','09:00:00','10:00:00','2026-04-16 13:30:25'),(23,44,1,'2026-05-10','08:00:00','09:00:00','2026-04-16 13:30:25'),(24,47,2,'2026-05-02','11:00:00','12:00:00','2026-04-16 13:30:25'),(25,51,2,'2026-05-13','09:00:00','10:00:00','2026-04-16 13:30:25'),(26,55,6,'2026-05-06','08:00:00','09:00:00','2026-04-16 13:30:25'),(27,58,4,'2026-05-02','08:00:00','09:00:00','2026-04-16 13:30:25'),(28,62,1,'2026-05-05','08:00:00','09:00:00','2026-04-16 13:30:25'),(29,65,2,'2026-05-03','10:00:00','11:00:00','2026-04-16 13:30:25'),(30,67,2,'2026-05-08','10:00:00','11:00:00','2026-04-16 13:30:25'),(31,70,2,'2026-05-09','11:00:00','12:00:00','2026-04-16 13:30:25'),(32,71,4,'2026-05-08','09:00:00','10:00:00','2026-04-16 13:30:25'),(33,75,5,'2026-05-05','08:00:00','09:00:00','2026-04-16 13:30:25'),(34,76,4,'2026-05-10','09:00:00','10:00:00','2026-04-16 13:30:25'),(35,77,1,'2026-05-13','10:00:00','11:00:00','2026-04-16 13:30:25'),(36,77,2,'2026-05-02','08:00:00','09:00:00','2026-04-16 13:30:25'),(37,84,6,'2026-05-07','11:00:00','12:00:00','2026-04-16 13:30:25'),(38,84,2,'2026-05-06','09:00:00','10:00:00','2026-04-16 13:30:25'),(39,85,6,'2026-05-02','10:00:00','11:00:00','2026-04-16 13:30:25'),(40,96,4,'2026-05-02','11:00:00','12:00:00','2026-04-16 13:30:25'),(41,98,2,'2026-05-08','11:00:00','12:00:00','2026-04-16 13:30:25'),(42,99,5,'2026-05-06','11:00:00','12:00:00','2026-04-16 13:30:25'),(43,100,3,'2026-05-07','10:00:00','11:00:00','2026-04-16 13:30:25'),(44,101,4,'2026-05-01','10:00:00','11:00:00','2026-04-16 13:30:25'),(45,104,5,'2026-05-08','09:00:00','10:00:00','2026-04-16 13:30:25'),(46,105,2,'2026-05-13','10:00:00','11:00:00','2026-04-16 13:30:25'),(47,107,4,'2026-05-01','09:00:00','10:00:00','2026-04-16 13:30:25'),(48,107,2,'2026-05-10','08:00:00','09:00:00','2026-04-16 13:30:25'),(49,108,2,'2026-05-13','08:00:00','09:00:00','2026-04-16 13:30:25'),(50,109,6,'2026-05-05','09:00:00','10:00:00','2026-04-16 13:30:25'),(51,112,3,'2026-05-14','09:00:00','10:00:00','2026-04-16 13:30:25'),(52,119,2,'2026-05-14','11:00:00','12:00:00','2026-04-16 13:30:25'),(53,119,2,'2026-05-10','09:00:00','10:00:00','2026-04-16 13:30:25');
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
  `cognome` varchar(150) NOT NULL,
  `ruolo` enum('studente','docente','ATA','admin') NOT NULL,
  `classe_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `classe_id` (`classe_id`),
  CONSTRAINT `utenti_ibfk_1` FOREIGN KEY (`classe_id`) REFERENCES `classi` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utenti`
--

LOCK TABLES `utenti` WRITE;
/*!40000 ALTER TABLE `utenti` DISABLE KEYS */;
INSERT INTO `utenti` VALUES (1,'Alessio','aessiom2007@gmail.com','Matteucci','admin',NULL,'2026-04-16 13:30:25'),(2,'Alessio','alessio.matteucci@ittterni.org','Matteucci','docente',NULL,'2026-04-16 13:30:25'),(3,'Mario','mario@mail.com','Rossi','studente',1,'2026-04-16 13:30:25'),(4,'Luca','luca@mail.com','Bianchi','studente',1,'2026-04-16 13:30:25'),(5,'Anna','anna@mail.com','Verdi','docente',NULL,'2026-04-16 13:30:25'),(6,'Sara','sara@mail.com','Blu','studente',6,'2026-04-16 13:30:25'),(7,'Alessio','alessiom2007@gmail.com','Matteucci','studente',4,'2026-04-16 13:30:25');
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

-- Dump completed on 2026-04-16 15:32:07
