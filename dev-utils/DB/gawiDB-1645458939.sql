-- MySQL dump 10.13  Distrib 8.0.28, for macos12.0 (arm64)
--
-- Host: localhost    Database: apiDB
-- ------------------------------------------------------
-- Server version	8.0.28

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
-- Current Database: `apiDB`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `apiDB` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `apiDB`;

--
-- Table structure for table `agendas`
--

DROP TABLE IF EXISTS `agendas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agendas` (
  `idAgenda` int NOT NULL AUTO_INCREMENT,
  `idOrganization` int NOT NULL,
  `idUser` int NOT NULL,
  `idDevice` int NOT NULL,
  `comment` varchar(1000) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `type` int NOT NULL,
  `status` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `viewDate` datetime DEFAULT NULL,
  PRIMARY KEY (`idAgenda`),
  UNIQUE KEY `driversAgenda_UN` (`idAgenda`),
  KEY `driversAgenda_FK` (`idDevice`),
  KEY `driversAgenda_FK_1` (`idOrganization`),
  KEY `driversAgenda_FK_2` (`idUser`),
  CONSTRAINT `driversAgenda_FK` FOREIGN KEY (`idDevice`) REFERENCES `devices` (`idDevice`),
  CONSTRAINT `driversAgenda_FK_1` FOREIGN KEY (`idOrganization`) REFERENCES `organizations` (`idOrganization`),
  CONSTRAINT `driversAgenda_FK_2` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agendas`
--

LOCK TABLES `agendas` WRITE;
/*!40000 ALTER TABLE `agendas` DISABLE KEYS */;
/*!40000 ALTER TABLE `agendas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `apns`
--

DROP TABLE IF EXISTS `apns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `apns` (
  `idApn` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `companyName` varchar(100) NOT NULL,
  `apn` varchar(32) NOT NULL,
  `user` varchar(100) DEFAULT '',
  `password` varchar(100) DEFAULT '',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apns`
--

LOCK TABLES `apns` WRITE;
/*!40000 ALTER TABLE `apns` DISABLE KEYS */;
INSERT INTO `apns` VALUES (1,'AT&T','AT&T','ott.iot.attmex.mx','','','2021-12-03 16:59:52','2021-12-03 16:59:52');
/*!40000 ALTER TABLE `apns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingInformation`
--

DROP TABLE IF EXISTS `billingInformation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingInformation` (
  `idBillingInformation` int NOT NULL AUTO_INCREMENT,
  `idUser` int NOT NULL,
  `businessName` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `rfc` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `phone` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `state` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `city` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `zipCode` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `suburb` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `street` varchar(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `addressNumber` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `facturapiClientToken` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`idBillingInformation`),
  UNIQUE KEY `billingInformation_UN` (`idBillingInformation`),
  KEY `billingInformation_FK` (`idUser`),
  CONSTRAINT `billingInformation_FK` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingInformation`
--

LOCK TABLES `billingInformation` WRITE;
/*!40000 ALTER TABLE `billingInformation` DISABLE KEYS */;
/*!40000 ALTER TABLE `billingInformation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cards`
--

DROP TABLE IF EXISTS `cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cards` (
  `idCard` int NOT NULL AUTO_INCREMENT,
  `idUser` int NOT NULL,
  `conektaCardToken` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `printedName` varchar(150) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `last4Digits` int NOT NULL,
  `month` int NOT NULL,
  `year` int NOT NULL,
  `brand` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `activePaymentMethod` tinyint(1) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`idCard`),
  UNIQUE KEY `cards_UN` (`idCard`),
  KEY `cards_FK` (`idUser`),
  CONSTRAINT `cards_FK` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cards`
--

LOCK TABLES `cards` WRITE;
/*!40000 ALTER TABLE `cards` DISABLE KEYS */;
/*!40000 ALTER TABLE `cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departureOrders`
--

DROP TABLE IF EXISTS `departureOrders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departureOrders` (
  `idDepartureOrder` int NOT NULL AUTO_INCREMENT,
  `idUser` int NOT NULL,
  `idOrganization` int NOT NULL,
  `status` int NOT NULL DEFAULT '1' COMMENT '0 - cancelada, 1 - sin iniciar, 2 - en proceso, 3 - completada, 4 - cerrada',
  `deviceType` int NOT NULL DEFAULT '1' COMMENT '0 - dispositivo de gas, 1 - dispositivo de agua',
  `deviceQuantity` int DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  `deliveredAt` datetime DEFAULT NULL,
  PRIMARY KEY (`idDepartureOrder`),
  UNIQUE KEY `idDepartureOrder` (`idDepartureOrder`),
  KEY `idUser` (`idUser`),
  KEY `idOrganization` (`idOrganization`),
  CONSTRAINT `departureorders_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`) ON UPDATE CASCADE,
  CONSTRAINT `departureorders_ibfk_2` FOREIGN KEY (`idOrganization`) REFERENCES `organizations` (`idOrganization`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departureOrders`
--

LOCK TABLES `departureOrders` WRITE;
/*!40000 ALTER TABLE `departureOrders` DISABLE KEYS */;
/*!40000 ALTER TABLE `departureOrders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `devices`
--

DROP TABLE IF EXISTS `devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `devices` (
  `idDevice` int NOT NULL AUTO_INCREMENT,
  `idApn` int NOT NULL DEFAULT '1',
  `idUser` int NOT NULL,
  `idTown` int NOT NULL,
  `isActive` tinyint(1) NOT NULL,
  `type` int NOT NULL,
  `version` int DEFAULT NULL,
  `idOrganization` int NOT NULL,
  `imei` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `serialNumber` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `boardVersion` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `firmwareVersion` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `name` varchar(150) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `latitude` double(15,8) NOT NULL,
  `longitude` double(15,8) NOT NULL,
  `address` varchar(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `extNumber` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `intNumber` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `suburb` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `zipCode` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `tankCapacity` double(10,2) NOT NULL,
  `batteryDate` datetime NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`idDevice`),
  UNIQUE KEY `idDevice` (`idDevice`),
  KEY `devices_FK` (`idOrganization`),
  KEY `devices_FK_1` (`idUser`),
  KEY `devices_FK_2` (`idTown`),
  KEY `idApn` (`idApn`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devices`
--

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
INSERT INTO `devices` VALUES (1,1,8,164,0,1,0,1,'$2b$10$F9hrWg.LcWLXYi6e9B2np.OieVJw1D7HwRPnT/FO6xN0b47HCU6uK','87654321','5.0','6.0','Medidor Testing',28.68071063,-106.11008714,'Pedro Vargas','7515','','Col. Lourdes','31120',0.00,'2021-12-30 14:57:32','2021-12-30 14:57:32','2021-12-30 14:57:32'),(2,1,9,164,0,1,0,1,'$2b$10$vwBJWUglEQXdffYlp/3.S.J5UotlivN1bWGzFQe/wTI6dbNeO7xAi','27011994','5.0','6.0','API',28.68071063,-106.11008714,'Pedro Vargas','7515','','Col. Lourdes','31120',0.00,'2022-02-01 12:30:44','2022-02-01 12:30:44','2022-02-01 12:30:44'),(3,1,8,164,0,0,0,1,'$2b$10$jw06VBZXY.DFmv7UdXFKR.KG1sc.sABei35DpSJrIN9ugTz7hebz.','35303045','4.0','2.0','Prueba Concepto',28.68071063,-106.11008714,'Pedro Vargas','7515','','Col. Lourdes','31120',500.00,'2022-02-01 12:30:44','2022-02-01 12:30:44','2022-02-01 12:30:44');
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gasHistory`
--

DROP TABLE IF EXISTS `gasHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gasHistory` (
  `idGasHistory` int NOT NULL AUTO_INCREMENT,
  `idDevice` int NOT NULL,
  `dateTime` datetime NOT NULL,
  `measure` double(10,2) NOT NULL,
  `bateryLevel` int NOT NULL,
  `meanConsumption` double(10,2) NOT NULL,
  `temperature` double(10,2) NOT NULL,
  `intervalAlert` tinyint(1) NOT NULL,
  `fillingAlert` tinyint(1) NOT NULL,
  `resetAlert` tinyint(1) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `accumulatedConsumption` double(10,2) DEFAULT NULL,
  `signalQuality` int DEFAULT NULL,
  PRIMARY KEY (`idGasHistory`),
  UNIQUE KEY `gasHistory_UN` (`idGasHistory`),
  KEY `gasHistory_FK` (`idDevice`),
  CONSTRAINT `gasHistory_FK` FOREIGN KEY (`idDevice`) REFERENCES `devices` (`idDevice`)
) ENGINE=InnoDB AUTO_INCREMENT=15832 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gasHistory`
--

LOCK TABLES `gasHistory` WRITE;
/*!40000 ALTER TABLE `gasHistory` DISABLE KEYS */;
INSERT INTO `gasHistory` VALUES (10980,3,'2021-11-18 12:58:00',34.90,100,-35.60,25.00,1,0,0,'2021-11-18 12:58:31',0.00,28),(11030,3,'2021-11-18 23:59:00',34.30,100,0.00,1.00,0,0,0,'2021-11-18 23:59:27',0.30,29),(11033,3,'2021-11-19 23:59:00',34.30,100,0.00,5.00,0,0,0,'2021-11-19 23:59:19',1.00,30),(11036,3,'2021-11-20 23:59:00',34.30,100,0.00,8.00,0,0,0,'2021-11-20 23:59:11',0.00,30),(11040,3,'2021-11-21 23:59:00',33.90,100,0.00,7.00,0,0,0,'2021-11-21 23:59:03',1.30,30),(11856,3,'2021-11-22 23:59:00',33.40,100,0.00,3.00,0,0,0,'2021-11-22 23:58:54',0.70,30),(12687,3,'2021-11-24 23:58:00',31.80,100,0.10,7.00,0,0,0,'2021-11-24 23:58:42',0.00,29),(12689,3,'2021-11-24 23:59:00',31.70,100,0.10,7.00,0,0,0,'2021-11-24 23:59:38',0.00,29),(12710,3,'2021-11-25 23:59:00',31.20,100,0.00,5.00,0,0,0,'2021-11-25 23:59:31',0.00,30),(12718,3,'2021-11-26 23:59:00',30.60,100,0.00,1.00,0,0,0,'2021-11-26 23:59:22',0.00,28),(12720,3,'2021-11-27 23:59:00',30.10,100,0.00,-1.00,0,0,0,'2021-11-27 23:59:14',-0.80,28),(12722,3,'2021-11-28 13:53:00',29.90,100,0.10,18.00,1,0,0,'2021-11-28 13:53:10',0.90,29),(12723,3,'2021-11-28 23:59:00',29.90,100,0.10,1.00,0,0,0,'2021-11-28 23:59:06',0.40,29),(13473,3,'2021-11-29 23:59:00',29.50,100,0.00,4.00,0,0,0,'2021-11-29 23:58:58',0.70,29),(14119,3,'2021-11-30 23:59:00',27.80,100,0.00,6.00,0,0,0,'2021-11-30 23:58:50',0.60,29),(14203,3,'2021-12-01 23:58:00',26.60,100,0.00,6.00,0,0,0,'2021-12-01 23:58:42',-0.10,29),(14204,3,'2021-12-01 23:59:00',26.50,100,0.00,6.00,0,0,0,'2021-12-01 23:59:42',-0.10,29),(14219,3,'2021-12-02 23:59:00',25.90,100,0.00,6.00,0,0,0,'2021-12-02 23:59:34',1.00,29),(14242,3,'2021-12-03 16:09:00',24.90,100,0.10,20.00,1,0,0,'2021-12-03 16:09:29',-0.30,30),(14243,3,'2021-12-03 23:59:00',24.80,100,0.10,5.00,0,0,0,'2021-12-03 23:59:26',0.30,30),(14245,3,'2021-12-04 23:59:00',24.10,100,0.00,5.00,0,0,0,'2021-12-04 23:59:18',-0.20,30),(14247,3,'2021-12-05 23:59:00',23.90,100,0.00,2.00,0,0,0,'2021-12-05 23:59:09',0.20,30),(14259,3,'2021-12-06 23:59:00',23.40,100,0.10,3.00,0,0,0,'2021-12-06 23:59:01',1.30,29),(14261,3,'2021-12-07 23:59:00',22.10,100,0.10,2.00,0,0,0,'2021-12-07 23:58:53',0.40,30),(14280,3,'2021-12-08 23:59:00',20.30,100,0.00,8.00,0,0,0,'2021-12-08 23:58:45',-0.10,29),(14282,3,'2021-12-09 07:42:00',19.90,100,0.30,8.00,1,0,0,'2021-12-09 07:41:43',1.80,29),(14311,3,'2021-12-09 23:59:00',18.70,100,0.00,11.00,0,0,0,'2021-12-09 23:58:37',-0.90,29),(14351,3,'2021-12-10 23:59:00',17.80,100,0.00,4.00,0,0,0,'2021-12-10 23:58:29',0.00,29),(14353,3,'2021-12-11 23:59:00',17.50,100,0.00,-1.00,0,0,0,'2021-12-11 23:58:21',-0.40,29),(14355,3,'2021-12-12 23:59:00',16.80,100,0.00,3.00,0,0,0,'2021-12-12 23:58:13',0.70,29),(14401,3,'2021-12-13 23:59:00',15.90,100,0.00,3.00,0,0,0,'2021-12-13 23:58:05',-1.40,29),(14443,3,'2021-12-14 23:59:00',15.40,100,0.00,7.00,0,0,0,'2021-12-14 23:57:57',0.00,31),(14444,3,'2021-12-15 23:57:00',14.90,100,0.00,5.00,0,0,0,'2021-12-15 23:57:53',-0.10,29),(14445,3,'2021-12-15 23:59:00',15.00,100,0.00,5.00,0,0,0,'2021-12-15 23:59:49',-0.10,30),(14448,3,'2021-12-16 23:59:00',14.10,100,0.00,7.00,0,0,0,'2021-12-16 23:59:40',0.00,30),(14450,3,'2021-12-17 23:59:00',13.50,100,0.00,6.00,0,0,0,'2021-12-17 23:59:33',0.30,29),(14452,3,'2021-12-18 23:59:00',13.20,100,0.00,2.00,0,0,0,'2021-12-18 23:59:25',0.10,29),(14453,3,'2021-12-19 23:59:00',12.80,100,0.00,-3.00,0,0,0,'2021-12-19 23:59:17',0.20,30),(14456,3,'2021-12-20 23:59:00',11.90,100,0.00,-2.00,0,0,0,'2021-12-20 23:59:09',0.60,29),(14465,3,'2021-12-21 23:59:00',10.70,100,0.00,5.00,0,0,0,'2021-12-21 23:59:01',0.00,29),(14469,3,'2021-12-22 12:25:00',9.90,100,0.40,23.00,1,0,0,'2021-12-22 12:24:57',1.50,29),(14473,3,'2021-12-22 23:59:00',8.50,100,0.00,2.00,0,0,0,'2021-12-22 23:58:53',0.20,29),(14486,3,'2021-12-27 23:59:00',2.80,100,0.00,10.00,0,0,0,'2021-12-27 23:59:16',-0.20,29),(14491,3,'2021-12-28 23:59:00',3.00,100,-0.10,7.00,0,0,0,'2021-12-28 23:59:04',-0.30,29),(14494,3,'2021-12-29 23:59:00',0.60,100,0.00,3.00,0,0,0,'2021-12-29 23:58:56',-0.80,29),(14522,3,'2022-01-06 23:58:00',0.00,100,0.00,-2.00,0,0,0,'2022-01-06 23:58:56',0.00,30),(14530,3,'2022-01-07 23:59:00',0.00,100,0.00,3.00,0,0,0,'2022-01-07 23:59:49',0.00,31),(14538,3,'2022-01-08 23:59:00',0.00,100,0.00,8.00,0,0,0,'2022-01-08 23:59:37',0.00,30),(14546,3,'2022-01-09 23:59:00',0.00,100,0.00,4.00,0,0,0,'2022-01-09 23:59:29',0.00,30),(14662,3,'2022-01-11 23:59:00',0.00,100,0.00,1.00,0,0,0,'2022-01-11 23:59:17',0.00,30),(14741,3,'2022-01-12 23:59:00',0.00,100,0.00,-3.00,0,0,0,'2022-01-12 23:59:05',0.00,30),(14950,3,'2022-01-13 16:38:00',39.50,100,-32.70,16.00,0,1,0,'2022-01-13 16:38:00',0.00,28),(15338,3,'2022-01-13 23:59:00',39.70,100,0.10,0.00,0,0,0,'2022-01-13 23:58:58',0.00,30),(15743,3,'2022-01-14 23:59:00',39.50,100,0.00,10.00,0,0,0,'2022-01-14 23:58:51',-1.30,29),(15754,3,'2022-01-17 23:59:00',38.50,100,0.00,7.00,0,0,0,'2022-01-17 23:59:29',1.60,29),(15756,3,'2022-01-18 23:59:00',38.20,100,0.00,3.00,0,0,0,'2022-01-18 23:59:18',-0.10,29),(15758,3,'2022-01-19 23:59:00',35.40,100,0.30,1.00,0,0,0,'2022-01-19 23:59:10',-0.10,30),(15760,3,'2022-01-20 03:45:00',34.90,100,0.10,0.00,1,0,0,'2022-01-20 03:45:08',0.90,29),(15761,3,'2022-01-20 23:59:00',31.20,100,0.00,-5.00,0,0,0,'2022-01-20 23:59:03',0.00,29),(15763,3,'2022-01-21 23:58:00',28.40,100,0.10,-3.00,0,0,0,'2022-01-21 23:59:00',-0.10,30),(15764,3,'2022-01-21 23:59:00',28.30,100,0.10,-2.00,0,0,0,'2022-01-21 23:59:54',-0.10,30),(15766,3,'2022-01-22 09:59:00',24.90,100,0.30,12.00,1,0,0,'2022-01-22 09:59:52',-0.20,30),(15767,3,'2022-01-22 20:43:00',19.90,100,1.00,3.00,1,0,0,'2022-01-22 20:43:48',1.80,30),(15769,3,'2022-01-24 11:06:00',9.90,100,0.50,14.00,1,0,0,'2022-01-24 11:06:39',1.20,29),(15770,3,'2022-01-24 23:05:00',4.90,100,0.40,-3.00,1,0,0,'2022-01-24 23:05:31',0.10,30),(15771,3,'2022-01-24 23:59:00',4.30,100,0.60,-4.00,0,0,0,'2022-01-24 23:59:31',1.30,30),(15774,3,'2022-01-25 23:59:00',0.00,100,0.00,-1.00,0,0,0,'2022-01-25 23:59:24',0.00,29),(15776,3,'2022-01-26 23:59:00',0.00,100,0.00,-3.00,0,0,0,'2022-01-26 23:59:16',0.00,30),(15778,3,'2022-01-27 23:59:00',45.80,100,0.10,3.00,0,0,0,'2022-01-27 23:59:11',0.00,29),(15780,3,'2022-01-28 05:18:00',44.90,100,0.10,-2.00,1,0,0,'2022-01-28 05:18:07',-0.80,28),(15781,3,'2022-01-28 21:28:00',39.90,100,0.20,1.00,1,0,0,'2022-01-28 21:28:01',0.00,29),(15782,3,'2022-01-28 23:59:00',39.50,100,0.10,-1.00,0,0,0,'2022-01-28 23:59:01',0.40,28),(15784,3,'2022-01-29 23:59:00',36.20,100,0.00,-1.00,0,0,0,'2022-01-29 23:58:53',0.20,28),(15786,3,'2022-01-30 23:59:00',35.70,100,0.00,3.00,0,0,0,'2022-01-30 23:58:45',0.70,29),(15788,3,'2022-01-31 09:42:00',34.90,100,0.20,13.00,1,0,0,'2022-01-31 09:41:42',0.40,29),(15791,3,'2022-02-01 14:09:00',29.90,100,0.20,23.00,1,0,0,'2022-02-01 14:09:36',0.30,28),(15792,3,'2022-02-01 23:59:00',28.70,100,0.00,9.00,0,0,0,'2022-02-01 23:59:28',-0.40,29),(15794,3,'2022-02-02 23:59:00',26.50,100,0.00,1.00,0,0,0,'2022-02-02 23:59:21',0.70,29),(15796,3,'2022-02-03 09:49:00',24.90,100,0.10,10.00,1,0,0,'2022-02-03 09:49:17',2.20,29),(15797,3,'2022-02-03 23:59:00',20.50,100,0.00,-3.00,0,0,0,'2022-02-03 23:59:13',0.30,29),(15799,3,'2022-02-04 02:52:00',19.90,100,0.30,-4.00,1,0,0,'2022-02-04 02:52:12',0.60,29),(15800,3,'2022-02-04 16:17:00',14.90,100,0.10,5.00,1,0,0,'2022-02-04 16:17:08',0.00,28),(15802,3,'2022-02-05 12:11:00',49.10,100,-32.70,12.00,0,1,0,'2022-02-05 12:12:06',0.00,29),(15803,3,'2022-02-05 23:59:00',47.30,100,0.20,-5.00,0,0,0,'2022-02-05 23:59:58',0.00,29),(15805,3,'2022-02-06 20:14:00',44.90,100,0.20,4.00,1,0,0,'2022-02-06 20:14:51',0.60,30),(15806,3,'2022-02-06 23:59:00',43.90,100,0.30,2.00,0,0,0,'2022-02-06 23:59:51',-0.80,30),(15809,3,'2022-02-09 17:58:00',29.90,100,0.20,8.00,1,0,0,'2022-02-09 17:58:33',1.60,29),(15810,3,'2022-02-09 23:59:00',29.20,100,0.10,-3.00,0,0,0,'2022-02-09 23:59:27',0.40,30),(15813,3,'2022-02-10 16:41:00',24.90,100,0.40,13.00,1,0,0,'2022-02-10 16:41:22',1.90,28),(15814,3,'2022-02-10 23:59:00',24.00,100,0.00,-2.00,0,0,0,'2022-02-10 23:59:20',-1.00,30),(15816,3,'2022-02-11 16:15:00',19.60,100,0.60,20.00,1,0,0,'2022-02-11 16:15:14',2.20,29),(15817,3,'2022-02-11 23:59:00',19.20,100,0.00,1.00,0,0,0,'2022-02-11 23:59:12',0.00,30),(15819,3,'2022-02-14 11:59:00',14.90,100,0.70,20.00,1,0,0,'2022-02-14 11:59:56',0.90,28),(15820,3,'2022-02-14 23:59:00',12.50,100,0.00,-2.00,0,0,0,'2022-02-14 23:59:49',0.40,29),(15822,3,'2022-02-15 12:20:00',9.80,100,0.90,23.00,1,0,0,'2022-02-15 12:20:45',2.10,28),(15823,3,'2022-02-15 19:45:00',4.90,100,0.40,13.00,1,0,0,'2022-02-15 19:45:42',2.20,29),(15824,3,'2022-02-15 23:59:00',4.60,100,0.00,9.00,0,0,0,'2022-02-15 23:59:41',-0.60,29),(15826,3,'2022-02-17 23:59:00',0.00,100,0.00,-1.00,0,0,0,'2022-02-17 23:59:28',0.00,29),(15829,3,'2022-02-18 23:59:00',0.00,100,0.00,-3.00,0,0,0,'2022-02-18 23:59:17',0.00,31),(15831,3,'2022-02-19 23:59:00',0.00,100,0.00,2.00,0,0,0,'2022-02-19 23:59:09',0.00,30);
/*!40000 ALTER TABLE `gasHistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gasSettings`
--

DROP TABLE IF EXISTS `gasSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gasSettings` (
  `idGasSettings` int NOT NULL AUTO_INCREMENT,
  `idDevice` int NOT NULL,
  `destUrl` varchar(150) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `interval` int NOT NULL,
  `closingHour` varchar(5) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `consumptionUnits` varchar(4) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `minFillingPercentage` int NOT NULL,
  `wereApplied` tinyint(1) DEFAULT '0',
  `firmwareVersion` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `consumptionPeriod` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `minsBetweenMeasurements` int DEFAULT '10',
  `travelMode` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`idGasSettings`),
  UNIQUE KEY `garSettings_UN` (`idGasSettings`),
  UNIQUE KEY `garSettings_UN_device` (`idDevice`),
  CONSTRAINT `garSettings_FK` FOREIGN KEY (`idDevice`) REFERENCES `devices` (`idDevice`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gasSettings`
--

LOCK TABLES `gasSettings` WRITE;
/*!40000 ALTER TABLE `gasSettings` DISABLE KEYS */;
INSERT INTO `gasSettings` VALUES (1,3,'http://ingmulti.dyndns.org:3002',10,'23:59','0060',5,0,'2.0','10',10,0,'2022-02-01 15:16:05','2022-02-01 15:16:05');
/*!40000 ALTER TABLE `gasSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historyPayments`
--

DROP TABLE IF EXISTS `historyPayments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historyPayments` (
  `idHistoryPayments` int NOT NULL AUTO_INCREMENT,
  `idOrganization` int NOT NULL,
  `idUser` int NOT NULL,
  `idDevice` int NOT NULL,
  `type` int NOT NULL,
  `paymentToken` varchar(1255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `product` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `currency` varchar(3) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `status` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `commentForUser` varchar(1000) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `amount` float NOT NULL,
  `facturapiInvoiceId` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `verificationUrl` varchar(500) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `conektaOrderId` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `object` varchar(5000) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `invoiced` tinyint(1) NOT NULL,
  `needInvoice` tinyint(1) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`idHistoryPayments`),
  UNIQUE KEY `historyPayments_UN` (`idHistoryPayments`),
  KEY `historyPayments_FK` (`idDevice`),
  KEY `historyPayments_FK_1` (`idOrganization`),
  KEY `historyPayments_FK_2` (`idUser`),
  CONSTRAINT `historyPayments_FK` FOREIGN KEY (`idDevice`) REFERENCES `devices` (`idDevice`),
  CONSTRAINT `historyPayments_FK_1` FOREIGN KEY (`idOrganization`) REFERENCES `organizations` (`idOrganization`),
  CONSTRAINT `historyPayments_FK_2` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historyPayments`
--

LOCK TABLES `historyPayments` WRITE;
/*!40000 ALTER TABLE `historyPayments` DISABLE KEYS */;
/*!40000 ALTER TABLE `historyPayments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organizations`
--

DROP TABLE IF EXISTS `organizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organizations` (
  `idOrganization` int NOT NULL AUTO_INCREMENT,
  `comercialName` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `fiscalName` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `rfc` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `phone` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `state` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `city` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `zipCode` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `suburb` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `street` varchar(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `addressNumber` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `facturapiToken` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `fiscalAddress` varchar(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `contactPhone` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `contactEmail` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `logoUrl` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `primaryColor` varchar(15) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `secondaryColor` varchar(15) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `validUntil` datetime DEFAULT NULL,
  `type` int NOT NULL,
  PRIMARY KEY (`idOrganization`),
  UNIQUE KEY `organizations_UN` (`idOrganization`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organizations`
--

LOCK TABLES `organizations` WRITE;
/*!40000 ALTER TABLE `organizations` DISABLE KEYS */;
INSERT INTO `organizations` VALUES (1,'IMTECH','IMTECH Desarrollo','IDE190408B99','6145047361','admin@ingmulti.com','Chihuahua','Chihuahua','31120','Col. Lourdes','Pedro Vargas','7515',' ','C. Pedro Vargas 7515 Col. Lourdes','6145047361','admin@ingmulti.com','logo-images-uploads/logo-organization-image/1','#040449','#040449','2021-10-01 11:34:14','2021-10-01 11:34:14','2021-10-01 11:34:14',0);
/*!40000 ALTER TABLE `organizations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `idRole` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(150) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`idRole`),
  UNIQUE KEY `roles_UN` (`idRole`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'super administrador','Administrador general del sistema'),(2,'organización','Administrador de la organización'),(3,'Almacén','Encargado de almacén'),(4,'contador','Encargado de contabilidad'),(5,'Repartidor','Encargado de suplir el producto'),(6,'Técnico','Técnico de instalación y mantenimiento'),(7,'Cliente','Usuario final del sistema'),(8,'Producción','Encargado de producción');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `states`
--

DROP TABLE IF EXISTS `states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `states` (
  `idState` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`idState`),
  UNIQUE KEY `states_UN` (`idState`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `states`
--

LOCK TABLES `states` WRITE;
/*!40000 ALTER TABLE `states` DISABLE KEYS */;
INSERT INTO `states` VALUES (1,'Aguascalientes'),(2,'Baja California'),(3,'Baja California Sur'),(4,'Campeche'),(5,'Chiapas'),(6,'Chihuahua'),(7,'Coahuila'),(8,'Colima'),(9,'Ciudad de México'),(10,'Durango'),(11,'Guanajuato'),(12,'Guerrero'),(13,'Hidalgo'),(14,'Jalisco'),(15,'México'),(16,'Michoacán'),(17,'Morelos'),(18,'Nayarit'),(19,'Nuevo León'),(20,'Oaxaca'),(21,'Puebla'),(22,'Querétaro'),(23,'Quintana Roo'),(24,'San Luis Potosí'),(25,'Sinaloa'),(26,'Sonora'),(27,'Tabasco'),(28,'Tamaulipas'),(29,'Tlaxcala'),(30,'Veracruz'),(31,'Yucatán'),(32,'Zacatecas');
/*!40000 ALTER TABLE `states` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `towns`
--

DROP TABLE IF EXISTS `towns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `towns` (
  `idTown` int NOT NULL AUTO_INCREMENT,
  `idState` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`idTown`),
  UNIQUE KEY `towns_UN` (`idTown`),
  KEY `towns_FK` (`idState`),
  CONSTRAINT `towns_FK` FOREIGN KEY (`idState`) REFERENCES `states` (`idState`)
) ENGINE=InnoDB AUTO_INCREMENT=2455 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `towns`
--

LOCK TABLES `towns` WRITE;
/*!40000 ALTER TABLE `towns` DISABLE KEYS */;
INSERT INTO `towns` VALUES (1,1,'Aguascalientes'),(2,1,'Asientos'),(3,1,'Calvillo'),(4,1,'Cosio'),(5,1,'El Llano'),(6,1,'Jesús María'),(7,1,'Pabellón de Arteaga'),(8,1,'Rincón de Romos'),(9,1,'San Francisco de Los Romo'),(10,1,'San José de Gracia'),(11,1,'Tepezalá'),(12,2,'Ensenada'),(13,2,'Mexicali'),(14,2,'Playas de Rosarito'),(15,2,'Tecate'),(16,2,'Tijuana'),(17,3,'Comondú'),(18,3,'La Paz'),(19,3,'Loreto'),(20,3,'Los Cabos'),(21,3,'Mulegé'),(22,4,'Calakmul'),(23,4,'Calkiní'),(24,4,'Campeche'),(25,4,'Candelaria'),(26,4,'Carmen'),(27,4,'Champotón'),(28,4,'Escárcega'),(29,4,'Hecelchakán'),(30,4,'Hopelchén'),(31,4,'Palizada'),(32,4,'Tenabo'),(33,5,'Acacoyagua'),(34,5,'Acala'),(35,5,'Acapetahua'),(36,5,'Aldama'),(37,5,'Altamirano'),(38,5,'Amatán'),(39,5,'Amatenango de la Frontera'),(40,5,'Amatenango del Valle'),(41,5,'Ángel Albino Corzo'),(42,5,'Arriaga'),(43,5,'Bejucal de Ocampo'),(44,5,'Bella Vista'),(45,5,'Benemérito de las Américas'),(46,5,'Berriozábal'),(47,5,'Bochil'),(48,5,'Cacahoatán'),(49,5,'Chalchihuitán'),(50,5,'Chamula'),(51,5,'Chanal'),(52,5,'Chapultenango'),(53,5,'Catazajá'),(54,5,'Chenalhó'),(55,5,'Chiapa de Corzo'),(56,5,'Chiapilla'),(57,5,'Chicoasén'),(58,5,'Chicomosuelo'),(59,5,'Cintalpa'),(60,5,'Chilón'),(61,5,'Coapilla'),(62,5,'Comitán de Domínguez'),(63,5,'Copainalá'),(64,5,'El Bosque'),(65,5,'El Porvenir'),(66,5,'Escuintla'),(67,5,'Francisco León'),(68,5,'Frontera Comalapa'),(69,5,'Frontera Hidalgo'),(70,5,'Huehuetán'),(71,5,'Huitiupán'),(72,5,'Huixtán'),(73,5,'Huixtla'),(74,5,'Ixhuatán'),(75,5,'Ixtacomitán'),(76,5,'Ixtapa'),(77,5,'Ixtapangajoya'),(78,5,'Jiquipilas'),(79,5,'Jitotol'),(80,5,'Juárez'),(81,5,'La Concordia'),(82,5,'La Grandeza'),(83,5,'La Independencia'),(84,5,'La Libertad'),(85,5,'La Trinitaria'),(86,5,'Larráinzar'),(87,5,'Las Margaritas'),(88,5,'Las Rosas'),(89,5,'Mapastepec'),(90,5,'Maravilla Tenejapa'),(91,5,'Marqués de Comillas'),(92,5,'Mazapa de Madero'),(93,5,'Mazatán'),(94,5,'Metapa'),(95,5,'Mitontic'),(96,5,'Montecristo de Guerrero'),(97,5,'Motozintla'),(98,5,'Nicolás Ruíz'),(99,5,'Ocosingo'),(100,5,'Ocotepec'),(101,5,'Ocozocoautla de Espinosa'),(102,5,'Ostuacán'),(103,5,'Osumacinta'),(104,5,'Oxchuc'),(105,5,'Palenque'),(106,5,'Pantelhó'),(107,5,'Pantepec'),(108,5,'Pichucalco'),(109,5,'Pijijiapan'),(110,5,'Pueblo Nuevo Solistahuacán'),(111,5,'Rayón'),(112,5,'Reforma'),(113,5,'Sabanilla'),(114,5,'Salto de Agua'),(115,5,'San Andrés Duraznal'),(116,5,'San Cristóbal de las Casas'),(117,5,'San Fernando'),(118,5,'San Juan Cancuc'),(119,5,'San Lucas'),(120,5,'Santiago el Pinar'),(121,5,'Siltepec'),(122,5,'Simojovel'),(123,5,'Sitalá'),(124,5,'Socoltenango'),(125,5,'Solosuchiapa'),(126,5,'Soyaló'),(127,5,'Suchiapa'),(128,5,'Suchiate'),(129,5,'Sunuapa'),(130,5,'Tapachula'),(131,5,'Tapalapa'),(132,5,'Tapilula'),(133,5,'Tecpatán'),(134,5,'Tenejapa'),(135,5,'Teopisca'),(136,5,'Tila'),(137,5,'Tonalá'),(138,5,'Totolapa'),(139,5,'Tumbalá'),(140,5,'Tuxtla Chico'),(141,5,'Tuxtla Gutiérrez'),(142,5,'Tuzantán'),(143,5,'Tzimol'),(144,5,'Unión Juárez'),(145,5,'Venustiano Carranza'),(146,5,'Villa Comaltitlán'),(147,5,'Villa Corzo'),(148,5,'Villaflores'),(149,5,'Yajalón'),(150,5,'Zinacantán'),(151,6,'Ahumada'),(152,6,'Aldama'),(153,6,'Allende'),(154,6,'Aquiles Serdán'),(155,6,'Ascensión'),(156,6,'Bachíniva'),(157,6,'Balleza'),(158,6,'Batopilas'),(159,6,'Bocoyna'),(160,6,'Buenaventura'),(161,6,'Camargo'),(162,6,'Carichí'),(163,6,'Casas Grandes'),(164,6,'Chihuahua'),(165,6,'Chínipas'),(166,6,'Coronado'),(167,6,'Coyame del Sotol'),(168,6,'Cuauhtémoc'),(169,6,'Cusihuiriachi'),(170,6,'Delicias'),(171,6,'Dr. Belisario Domínguez'),(172,6,'El Tule'),(173,6,'Galeana'),(174,6,'Gómez Farías'),(175,6,'Gran Morelos'),(176,6,'Guachochi'),(177,6,'Guadalupe D.B.'),(178,6,'Guadalupe y Calvo'),(179,6,'Guazapares'),(180,6,'Guerrero'),(181,6,'Hidalgo del Parral'),(182,6,'Huejoitán'),(183,6,'Ignacio Zaragoza'),(184,6,'Janos'),(185,6,'Jiménez'),(186,6,'Juárez'),(187,6,'Julimes'),(188,6,'La Cruz'),(189,6,'López'),(190,6,'Madera'),(191,6,'Maguarichi'),(192,6,'Manuel Benavides'),(193,6,'Matachí'),(194,6,'Matamoros'),(195,6,'Meoqui'),(196,6,'Morelos'),(197,6,'Moris'),(198,6,'Namiquipa'),(199,6,'Nonoava'),(200,6,'Nuevo Casas Grandes'),(201,6,'Ocampo'),(202,6,'Ojinaga'),(203,6,'Praxedis G. Guerrero'),(204,6,'Riva Palacio'),(205,6,'Rosales'),(206,6,'Rosario'),(207,6,'San Francisco de Borja'),(208,6,'San Francisco de Conchos'),(209,6,'San Francisco del Oro'),(210,6,'Santa Bárabara'),(211,6,'Santa Isabel'),(212,6,'Satevó'),(213,6,'Saucillo'),(214,6,'Temósachi'),(215,6,'Urique'),(216,6,'Uriachi'),(217,6,'Valle de Zaragoza'),(218,7,'Abasolo'),(219,7,'Acuña'),(220,7,'Allende'),(221,7,'Arteaga'),(222,7,'Candela'),(223,7,'Castaños'),(224,7,'Cuatrociénegas'),(225,7,'Escobedo'),(226,7,'Francisco I. Madero'),(227,7,'Frontera'),(228,7,'General Cepeda'),(229,7,'Guerrero'),(230,7,'Hidalgo'),(231,7,'Jiménez'),(232,7,'Juárez'),(233,7,'Lamadrid'),(234,7,'Matamoros'),(235,7,'Monclova'),(236,7,'Morelos'),(237,7,'Múzquiz'),(238,7,'Nadadores'),(239,7,'Nava'),(240,7,'Ocampo'),(241,7,'Parras'),(242,7,'Piedras Negras'),(243,7,'Progreso'),(244,7,'Ramos Arizpe'),(245,7,'Sabinas'),(246,7,'Sacramento'),(247,7,'Saltillo'),(248,7,'San Buenaventura'),(249,7,'San Juan de Sabinas'),(250,7,'San Pedro'),(251,7,'Sierra Mojada'),(252,7,'Torreón'),(253,7,'Viesca'),(254,7,'Villa Unión'),(255,7,'Zaragoza'),(256,8,'Armería'),(257,8,'Colima'),(258,8,'Comala'),(259,8,'Coquimatlán'),(260,8,'Cuauhtémoc'),(261,8,'Ixtlahuacán'),(262,8,'Manzanillo'),(263,8,'Minatitlán'),(264,8,'Tecomán'),(265,8,'Villa de Álvarez'),(266,9,'Álvaro Obregón'),(267,9,'Azcapotzalco'),(268,9,'Benito Juárez'),(269,9,'Coyoacán'),(270,9,'Cuajimalpa de Morelos'),(271,9,'Cuauhtémoc'),(272,9,'Gustavo A. Madero'),(273,9,'Iztacalco'),(274,9,'Iztapalapa'),(275,9,'Magdalena Contreras'),(276,9,'Miguel Hidalgo'),(277,9,'Milpa Alta'),(278,9,'Tláhuac'),(279,9,'Tlalpan'),(280,9,'Venustiano Carranza'),(281,9,'Xochimilco'),(282,10,'Canatlán'),(283,10,'Canelas'),(284,10,'Coneto de Comonfort'),(285,10,'Cuencamé'),(286,10,'Durango'),(287,10,'El Oro'),(288,10,'Gómez Palacio'),(289,10,'Gral. Simón Bolívar'),(290,10,'Guadalupe Victoria'),(291,10,'Guanaceví'),(292,10,'Hidalgo'),(293,10,'Indé'),(294,10,'Lerdo'),(295,10,'Mapimí'),(296,10,'Mezquital'),(297,10,'Nazas'),(298,10,'Nombre de Dios'),(299,10,'Nuevo Ideal'),(300,10,'Ocampo'),(301,10,'Otáez'),(302,10,'Pánuco de Coronado'),(303,10,'Peñón Blanco'),(304,10,'Poanas'),(305,10,'Pueblo Nuevo'),(306,10,'Rodeo'),(307,10,'San Bernardo'),(308,10,'San Dimas'),(309,10,'San Juan de Guadalupe'),(310,10,'San Juan del Río'),(311,10,'San Luis del Cordero'),(312,10,'San Pedro del Gallo'),(313,10,'Santa Clara'),(314,10,'Santiago Papasquiaro'),(315,10,'Súchil'),(316,10,'Tamazula'),(317,10,'Tepehuanes'),(318,10,'Tlahualilo'),(319,10,'Topia'),(320,10,'Vicente Guerrero'),(321,11,'Abasolo'),(322,11,'Acámbaro'),(323,11,'Apaseo el Alto'),(324,11,'Apaseo el Grande'),(325,11,'Atarjea'),(326,11,'Celaya'),(327,11,'Comonfort'),(328,11,'Coroneo'),(329,11,'Cortazar'),(330,11,'Cuerámaro'),(331,11,'Doctor Mora'),(332,11,'Dolores Hidalgo'),(333,11,'Guanajuato'),(334,11,'Huanímaro'),(335,11,'Irapuato'),(336,11,'Jaral del Progreso'),(337,11,'Jerécuaro'),(338,11,'León'),(339,11,'Manuel Doblado'),(340,11,'Moroleón'),(341,11,'Ocampo'),(342,11,'Pénjamo'),(343,11,'Pueblo Nuevo'),(344,11,'Purísima del Rincón'),(345,11,'Romita'),(346,11,'Salamanca'),(347,11,'Salvatierra'),(348,11,'San Diego de la Unión'),(349,11,'San Felipe'),(350,11,'San Francisco del Rincón'),(351,11,'San José Iturbide'),(352,11,'San Luis de la Paz'),(353,11,'San Miguel de Allende'),(354,11,'Santa Catarina'),(355,11,'Santa Cruz de Juventino'),(356,11,'Santiago Maravatío'),(357,11,'Silao'),(358,11,'Tarandacuao'),(359,11,'Tarimoro'),(360,11,'Tierra Blanca'),(361,11,'Uruangato'),(362,11,'Valle de Santiago'),(363,11,'Victoria'),(364,11,'Villagrán'),(365,11,'Xichú'),(366,11,'Yuriria'),(367,12,'Acapulco de Juárez'),(368,12,'Acatepec'),(369,12,'Ahuacuotzingo'),(370,12,'Ajuchitlán del Progreso'),(371,12,'Alcozauca de Guerrero'),(372,12,'Alpoyeca'),(373,12,'Apaxtla de Castrejón'),(374,12,'Arcelia'),(375,12,'Atenango del Río'),(376,12,'Atlamajalcingo del Monte'),(377,12,'Atlixtac'),(378,12,'Atoyac de Álvarez'),(379,12,'Ayutla de los Libres'),(380,12,'Azoyú'),(381,12,'Benito Juárez'),(382,12,'Buenavista de Cuéllar'),(383,12,'Chilapa de Álvarez'),(384,12,'Chilpancingo de los Bravo'),(385,12,'Coahuayutla de José María Izazaga'),(386,12,'Cochoapa el Grande'),(387,12,'Cocula'),(388,12,'Copala'),(389,12,'Copalillo'),(390,12,'Copanatoyac'),(391,12,'Coyuca de Benítez'),(392,12,'Coyuca de Catalán'),(393,12,'Cuajinicuilapa'),(394,12,'Cualác'),(395,12,'Cuautepec'),(396,12,'Cuetzala del Progreso'),(397,12,'Cutzamala de Pinzón'),(398,12,'Eduardo Neri'),(399,12,'Florencio Villarreal'),(400,12,'General Canuto A. Neri'),(401,12,'General Heliodoro Castillo'),(402,12,'Huamuxtitlán'),(403,12,'Huitzuco de los Figueroa'),(404,12,'Iguala de la Independencia'),(405,12,'Igualapa'),(406,12,'Iliatenco'),(407,12,'Ixcateopan de Cuauhtémoc'),(408,12,'José Joaquín de Herrera'),(409,12,'Juan R. Escudero'),(410,12,'Juchitán'),(411,12,'La Unión de Isidoro Montes de Oca'),(412,12,'Leonardo Bravo'),(413,12,'Malinaltepec'),(414,12,'Marquelia'),(415,12,'Mártir de Cuilapan'),(416,12,'Metlatónoc'),(417,12,'Mochitlán'),(418,12,'Olinalá'),(419,12,'Ometepec'),(420,12,'Pedro Ascencio Alquisiras'),(421,12,'Petatlán'),(422,12,'Pilcaya'),(423,12,'Pungarabato'),(424,12,'Quechultenango'),(425,12,'San Luis Acatlán'),(426,12,'San Marcos'),(427,12,'San Miguel Totolapan'),(428,12,'Taxco de Alarcón'),(429,12,'Tecoanapa'),(430,12,'Técpan de Galeana'),(431,12,'Teloloapan'),(432,12,'Tepecoacuilco de Trujano'),(433,12,'Tetipac'),(434,12,'Tixtla de Guerrero'),(435,12,'Tlacoachistlahuaca'),(436,12,'Tlacoapa'),(437,12,'Tlalchapa'),(438,12,'Tlalixtlaquilla de Maldanado'),(439,12,'Tlapa de Comonfort'),(440,12,'Tlapehuala'),(441,12,'Xalpatláhuac'),(442,12,'Xochihuehuetlán'),(443,12,'Xochistlahuaca'),(444,12,'Zapotitlán Tablas'),(445,12,'Zihuatanejo de Azueta'),(446,12,'Zirándaro de los Chávez'),(447,12,'Zitlala'),(448,13,'Acatlán'),(449,13,'Acaxochitlán'),(450,13,'Actopan'),(451,13,'Agua Blanca de Iturbide'),(452,13,'Ajacuba'),(453,13,'Alfajayucan'),(454,13,'Almoloya'),(455,13,'Apan'),(456,13,'Atitalaquia'),(457,13,'Atlapexco'),(458,13,'Atotonilco de Tula'),(459,13,'Atotonilco el Grande'),(460,13,'Calnali'),(461,13,'Chapantongo'),(462,13,'Chapulhuacán'),(463,13,'Cardonal'),(464,13,'Chilcuautla'),(465,13,'Cuautepec de Hinojosa'),(466,13,'El Arenal'),(467,13,'Eloxochitlán'),(468,13,'Emiliano Zapata'),(469,13,'Epazoyucan'),(470,13,'Francisco I. Madero'),(471,13,'Huasca de Ocampo'),(472,13,'Huautla'),(473,13,'Huazalingo'),(474,13,'Huejutla de Reyes'),(475,13,'Huehuetla  '),(476,13,'Huichapan'),(477,13,'Ixmiquilpan'),(478,13,'Jacala de Ledezma'),(479,13,'Jaltocán'),(480,13,'Juárez Hidalgo'),(481,13,'La Misión'),(482,13,'Lolotla'),(483,13,'Metepec'),(484,13,'Metztitlán'),(485,13,'Mineral de la Reforma'),(486,13,'Mineral del Chico'),(487,13,'Mineral del Monte'),(488,13,'Mixquiahuala de Juárez'),(489,13,'Molango de Escamilla'),(490,13,'Nicolás Flores'),(491,13,'Nopala de Villagrán'),(492,13,'Omitlán de Juárez'),(493,13,'Pachuca de Soto'),(494,13,'Pacula'),(495,13,'Pisaflores'),(496,13,'Progreso de Obregón'),(497,13,'San Agustín Metzquititlán'),(498,13,'San Agustín Tlaxiaca'),(499,13,'San Bartolo Tutotepec'),(500,13,'San Felipe Orizatlán'),(501,13,'San Salvador'),(502,13,'Santiago de Anaya'),(503,13,'Santiago Tulantepec de Lugo Guerrero'),(504,13,'Singuilucan'),(505,13,'Tasquillo'),(506,13,'Tecozautla'),(507,13,'Tenango de Doria'),(508,13,'Tepeapulco'),(509,13,'Tepehuacán de Guerrero'),(510,13,'Tepeji del Río de Ocampo'),(511,13,'Tepetitlán'),(512,13,'Tetepango'),(513,13,'Tezontepec de Aldama'),(514,13,'Tianguistengo'),(515,13,'Tizayuca'),(516,13,'Tlahuelilpan'),(517,13,'Tlahuiltepa'),(518,13,'Tlanalapa'),(519,13,'Tlanchinol'),(520,13,'Tlaxcoapan'),(521,13,'Tolcayuca'),(522,13,'Tula de Allende'),(523,13,'Tulancingo de Bravo'),(524,13,'Villa de Tezontepec'),(525,13,'Xochiatipan'),(526,13,'Xochicoatlán'),(527,13,'Yahualica'),(528,13,'Zacualtipán de Ángeles'),(529,13,'Zapotlán de Juárez'),(530,13,'Zempoala'),(531,13,'Zimapán'),(532,14,'Acatic'),(533,14,'Acatlán de Juárez'),(534,14,'Ahualulco de Mercado'),(535,14,'Amacueca'),(536,14,'Amatitán'),(537,14,'Ameca'),(538,14,'Arandas'),(539,14,'Atemajac de Brizuela'),(540,14,'Atengo'),(541,14,'Atenguillo'),(542,14,'Atotonilco el Alto'),(543,14,'Atoyac'),(544,14,'Autlán de Navarro'),(545,14,'Ayotlán'),(546,14,'Ayutla'),(547,14,'Bolaños'),(548,14,'Cabo Corrientes'),(549,14,'Cañadas de Obregón'),(550,14,'Casimiro Castillo'),(551,14,'Chapala'),(552,14,'Chimaltitán'),(553,14,'Chiquilistlán'),(554,14,'Cihuatlán'),(555,14,'Cocula'),(556,14,'Colotlán'),(557,14,'Concepción de Buenos Aires'),(558,14,'Cuauitlán de García Barragán'),(559,14,'Cuautla'),(560,14,'Cuquío'),(561,14,'Degollado'),(562,14,'Ejutla'),(563,14,'El Arenal'),(564,14,'El Grullo'),(565,14,'El Limón'),(566,14,'El Salto'),(567,14,'Encarnación de Díaz'),(568,14,'Etzatlán'),(569,14,'Gómez Farías'),(570,14,'Guachinango'),(571,14,'Guadalajara'),(572,14,'Hostotipaquillo'),(573,14,'Huejúcar'),(574,14,'Huejuquilla el Alto'),(575,14,'Ixtlahuacán de los Membrillos'),(576,14,'Ixtlahuacán del Río'),(577,14,'Jalostotitlán'),(578,14,'Jamay'),(579,14,'Jesús María'),(580,14,'Jilotlán de los Dolores'),(581,14,'Jocotepec'),(582,14,'Juanacatlán'),(583,14,'Juchitlán'),(584,14,'La Barca'),(585,14,'Lagos de Moreno'),(586,14,'La Manzanilla de la Paz'),(587,14,'La Huerta'),(588,14,'Magdalena'),(589,14,'Mascota'),(590,14,'Mazamitla'),(591,14,'Mexticacán'),(592,14,'Mezquitic'),(593,14,'Mixtlán'),(594,14,'Ojuelos de Jalisco'),(595,14,'Ocotlán '),(596,14,'Pihuamo'),(597,14,'Poncitlán'),(598,14,'Puerto Vallarta'),(599,14,'Quitupan'),(600,14,'San Cristóbal de la Barranca'),(601,14,'San Diego de Alejandría'),(602,14,'San Gabriel'),(603,14,'San Ignacio Cerro Gordo '),(604,14,'San Juan de los Lagos'),(605,14,'San Juanito de Escobedo'),(606,14,'San Julián'),(607,14,'San Marcos'),(608,14,'San Martín de Bolaños'),(609,14,'San Martín Hidalgo'),(610,14,'San Miguel el Alto'),(611,14,'San Sebastián del Oeste'),(612,14,'Santa María de los Ángeles'),(613,14,'Santa María del Oro'),(614,14,'Sayula'),(615,14,'Tala'),(616,14,'Talpa de Allende'),(617,14,'Tamazula de Gordiano'),(618,14,'Tapalpa'),(619,14,'Tecalitlán'),(620,14,'Techaluta de Montenegro'),(621,14,'Tecolotlán'),(622,14,'Tenamaxtlán'),(623,14,'Teocaltiche'),(624,14,'Teocuitatlán de Corona'),(625,14,'Tepatitlán de Morelos'),(626,14,'Tequila'),(627,14,'Teuchitlán'),(628,14,'Tizapán el Alto'),(629,14,'Tlajomulco de Zúñiga'),(630,14,'Tlaquepaque'),(631,14,'Tolimán'),(632,14,'Tomatlán'),(633,14,'Tonalá'),(634,14,'Tonaya'),(635,14,'Tonila'),(636,14,'Totatiche'),(637,14,'Tototlán'),(638,14,'Tuxcacuesco'),(639,14,'Tuxcueca'),(640,14,'Tuxpan'),(641,14,'Unión de San Antonio'),(642,14,'Unión de Tula'),(643,14,'Valle de Guadalupe'),(644,14,'Valle de Juárez'),(645,14,'Villa Corona'),(646,14,'Villa Guerrero'),(647,14,'Villa Hidalgo'),(648,14,'Villa Purificación'),(649,14,'Yahualica de González Gallo'),(650,14,'Zacoalco de Torres'),(651,14,'Zapopan'),(652,14,'Zapotiltic'),(653,14,'Zapotitlán de Vadillo'),(654,14,'Zapotlán del Rey'),(655,14,'Zapotlanejo '),(656,14,'Zapotlán el Grande '),(657,15,'Acambay'),(658,15,'Acolman'),(659,15,'Aculco'),(660,15,'Almoloya de Alquisiras'),(661,15,'Almoloya de Juárez'),(662,15,'Almoloya del Río'),(663,15,'Amanalco'),(664,15,'Amatepec'),(665,15,'Amecameca'),(666,15,'Apaxco'),(667,15,'Atenco'),(668,15,'Atizapán'),(669,15,'Atizapán de Zaragoza'),(670,15,'Atlacomulco'),(671,15,'Atlautla'),(672,15,'Axapusco'),(673,15,'Ayapango'),(674,15,'Calimaya'),(675,15,'Capulhuac'),(676,15,'Chalco'),(677,15,'Chapa de Mota'),(678,15,'Chapultepec'),(679,15,'Chiautla'),(680,15,'Chicoloapan'),(681,15,'Chiconcuac'),(682,15,'Chimalhuacán'),(683,15,'Coacalco de Berriozábal'),(684,15,'Coatepec Harinas'),(685,15,'Cocotitlán'),(686,15,'Coyotepec'),(687,15,'Cuautitlán'),(688,15,'Cuautitlán Izcalli'),(689,15,'Donato Guerra'),(690,15,'Ecatepec de Morelos'),(691,15,'Ecatzingo'),(692,15,'El Oro'),(693,15,'Huehuetoca'),(694,15,'Hueypoxtla'),(695,15,'Huixquilucan'),(696,15,'Isidro Fabela'),(697,15,'Ixtapaluca'),(698,15,'Ixtapan de la Sal'),(699,15,'Ixtapan del Oro'),(700,15,'Ixtlahuaca'),(701,15,'Jaltenco'),(702,15,'Jilotepec'),(703,15,'Jilotzingo'),(704,15,'Jiquipilco'),(705,15,'Jocotitlán'),(706,15,'Joquicingo'),(707,15,'Juchitepec'),(708,15,'La Paz'),(709,15,'Lerma'),(710,15,'Luvianos'),(711,15,'Malinalco'),(712,15,'Melchor Ocampo'),(713,15,'Metepec'),(714,15,'Mexicaltzingo'),(715,15,'Morelos'),(716,15,'Naucalpan de Juárez'),(717,15,'Nextlalpan'),(718,15,'Nezahualcoyotl'),(719,15,'Nicolás Romero'),(720,15,'Nopaltepec'),(721,15,'Ocoyoacac'),(722,15,'Ocuilan'),(723,15,'Otumba'),(724,15,'Otzoloapan'),(725,15,'Otzolotepec'),(726,15,'Ozumba'),(727,15,'Papalotla'),(728,15,'Polotitlán'),(729,15,'Rayón'),(730,15,'San Antonio la Isla'),(731,15,'San Felipe del Progreso'),(732,15,'San José del Rincón'),(733,15,'San Martín de las Pirámides'),(734,15,'San Mateo Atenco'),(735,15,'San Simón de Guerrero'),(736,15,'Santo Tomás'),(737,15,'Soyaniquilpan de Juárez'),(738,15,'Sultepec'),(739,15,'Tecámac'),(740,15,'Tejupilco'),(741,15,'Temamatla'),(742,15,'Temascalapa'),(743,15,'Temascalcingo'),(744,15,'Temascaltepec'),(745,15,'Temoaya'),(746,15,'Tenancingo'),(747,15,'Tenango del Aire'),(748,15,'Tenango del Valle'),(749,15,'Teoloyucán'),(750,15,'Teotihuacán'),(751,15,'Tepetlaoxtoc'),(752,15,'Tepetlixpa'),(753,15,'Tepotzotlán'),(754,15,'Tequixquiac'),(755,15,'Texcaltitlán'),(756,15,'Texcalyacac'),(757,15,'Texcoco'),(758,15,'Tezoyuca'),(759,15,'Tianguistenco'),(760,15,'Timilpan'),(761,15,'Tlalmanalco'),(762,15,'Tlalnepantla de Baz'),(763,15,'Tlatlaya'),(764,15,'Toluca'),(765,15,'Tonanitla'),(766,15,'Tonatico'),(767,15,'Tultepec'),(768,15,'Tultitlán'),(769,15,'Valle de Bravo'),(770,15,'Valle de Chalco Solidaridad'),(771,15,'Villa de Allende'),(772,15,'Villa del Carbón'),(773,15,'Villa Guerrero'),(774,15,'Villa Victoria'),(775,15,'Xalatlaco'),(776,15,'Xonacatlán'),(777,15,'Zacazonapan'),(778,15,'Zacualpan'),(779,15,'Zinacantepec'),(780,15,'Zumpahuacán'),(781,15,'Zumpango'),(782,16,'Acuitzio'),(783,16,'Aguililla'),(784,16,'Álvaro Obregón'),(785,16,'Angamacutiro'),(786,16,'Angangueo'),(787,16,'Apatzingán'),(788,16,'Aporo'),(789,16,'Aquila'),(790,16,'Ario de Rosales'),(791,16,'Arteaga Riseñas'),(792,16,'Briseñas'),(793,16,'Buenavista'),(794,16,'Carácuaro'),(795,16,'Charapan'),(796,16,'Charo'),(797,16,'Chavinda'),(798,16,'Cherán'),(799,16,'Chilchota'),(800,16,'Chuinicuila'),(801,16,'Chucándiro'),(802,16,'Churintzio'),(803,16,'Churumuco'),(804,16,'Coahuayana'),(805,16,'Coalcomán de Vázquez Pallares'),(806,16,'Coeneo'),(807,16,'Cojumatlán de Régules'),(808,16,'Contepec'),(809,16,'Copándaro'),(810,16,'Cotija'),(811,16,'Cuitzeo'),(812,16,'Escuandureo'),(813,16,'Epitacio Huerta'),(814,16,'Erongarícuaro'),(815,16,'Gabriel Zamora'),(816,16,'Hidalgo'),(817,16,'Huandacareo'),(818,16,'Huaniqueo'),(819,16,'Huetamo'),(820,16,'Huiramba'),(821,16,'Indaparapeo'),(822,16,'Irimbo'),(823,16,'Ixtlán'),(824,16,'Jacona'),(825,16,'Jiménez'),(826,16,'Jiquilpan'),(827,16,'José Sixto Verduzco'),(828,16,'Juárez'),(829,16,'Jungapeo'),(830,16,'La Huacana'),(831,16,'La Piedad'),(832,16,'Lagunillas'),(833,16,'Lázaro Cárdenas'),(834,16,'Los Reyes'),(835,16,'Madero'),(836,16,'Maravatío'),(837,16,'Marcos Castellanos'),(838,16,'Morelia'),(839,16,'Morelos'),(840,16,'Múgica'),(841,16,'Nahuatzen'),(842,16,'Nocupétaro'),(843,16,'Nuevo Parangaricutiro'),(844,16,'Nuevo Urecho'),(845,16,'Numarán'),(846,16,'Ocampo'),(847,16,'Pajacuarán'),(848,16,'Panindícuaro'),(849,16,'Paracho'),(850,16,'Parácuaro'),(851,16,'Pátzcuaro'),(852,16,'Penjamillo'),(853,16,'Peribán'),(854,16,'Purépero'),(855,16,'Puruándiro'),(856,16,'Queréndaro'),(857,16,'Quiroga'),(858,16,'Sahuayo'),(859,16,'Salvador Escalante'),(860,16,'San Lucas'),(861,16,'Santa Ana Maya'),(862,16,'Senguio'),(863,16,'Susupuato'),(864,16,'Tancítaro'),(865,16,'Tangamandapio'),(866,16,'Tangancícuaro'),(867,16,'Tanhuato'),(868,16,'Taretan'),(869,16,'Tarímbaro'),(870,16,'Tepalcatepec'),(871,16,'Tingüindín'),(872,16,'Tingambato'),(873,16,'Tiquicheo de Nicolás Romero'),(874,16,'Tlalpujahua'),(875,16,'Tlazazalca'),(876,16,'Tocumbo'),(877,16,'Tumbiscatío'),(878,16,'Turicato'),(879,16,'Tuxpan'),(880,16,'Tuzantla'),(881,16,'Tzintzuntzan'),(882,16,'Tzitzio'),(883,16,'Uruapan'),(884,16,'Venustiano Carranza'),(885,16,'Villamar'),(886,16,'Vista Hermosa'),(887,16,'Yurécuaro'),(888,16,'Zacapu'),(889,16,'Zamora'),(890,16,'Zináparo'),(891,16,'Zinapécuaro'),(892,16,'Ziracuaretiro'),(893,16,'Zitácuaro'),(894,17,'Amacuzac'),(895,17,'Atlatlahucan'),(896,17,'Axochiapan'),(897,17,'Ayala'),(898,17,'Coatlán del Río'),(899,17,'Cuautla'),(900,17,'Cuernavaca'),(901,17,'Emiliano Zapata'),(902,17,'Huitzilac'),(903,17,'Jantetelco'),(904,17,'Jiutepec'),(905,17,'Jojutla'),(906,17,'Jonacatepec'),(907,17,'Mazatepec'),(908,17,'Miacatlán'),(909,17,'Ocuituco'),(910,17,'Puente de Ixtla'),(911,17,'Temixco'),(912,17,'Temoac'),(913,17,'Tepalcingo'),(914,17,'Tepoztlán'),(915,17,'Tetecala'),(916,17,'Tetela del Volcán'),(917,17,'Tlalnepantla'),(918,17,'Tlaltizapán de Zapata'),(919,17,'Tlaquiltenango'),(920,17,'Tlayacapan'),(921,17,'Totolapan'),(922,17,'Xochitepec'),(923,17,'Yautepec de Zaragoza'),(924,17,'Yecapixtla'),(925,17,'Zacatepec de Hidalgo'),(926,17,'Zacualpan de Amilpas'),(927,18,'Acaponeta'),(928,18,'Ahuacatlán'),(929,18,'Amatlán de Cañas'),(930,18,'Bahía de Banderas'),(931,18,'Compostela'),(932,18,'El Nayar'),(933,18,'Huajicori'),(934,18,'Ixtlán del Río'),(935,18,'Jala'),(936,18,'La Yesca'),(937,18,'Rosamorada'),(938,18,'Ruíz'),(939,18,'San Blas'),(940,18,'San Pedro Lagunillas'),(941,18,'Santa María del Oro'),(942,18,'Santiago Ixcuintla'),(943,18,'Tecuala'),(944,18,'Tepic'),(945,18,'Tuxpan'),(946,18,'Xalisco'),(947,19,'Abasolo'),(948,19,'Agualeguas'),(949,19,'Allende'),(950,19,'Anáhuac'),(951,19,'Apodaca'),(952,19,'Aramberri'),(953,19,'Bustamante'),(954,19,'Cadereyta Jiménez'),(955,19,'Cerralvo'),(956,19,'China'),(957,19,'Ciénega de Flores'),(958,19,'Doctor Arroyo'),(959,19,'Doctor Coss'),(960,19,'Doctor González'),(961,19,'El Carmen'),(962,19,'Galeana'),(963,19,'García'),(964,19,'General Bravo'),(965,19,'General Escobedo'),(966,19,'General Terán'),(967,19,'General Treviño'),(968,19,'General Zaragoza'),(969,19,'General Zuazua'),(970,19,'Guadalupe'),(971,19,'Hidalgo'),(972,19,'Higueras'),(973,19,'Hualahuises'),(974,19,'Iturbide'),(975,19,'Juárez'),(976,19,'Lampazos de Naranjo'),(977,19,'Linares'),(978,19,'Los Aldamas'),(979,19,'Los Herreras'),(980,19,'Los Ramones'),(981,19,'Marín'),(982,19,'Melchor Ocampo'),(983,19,'Mier y Noriega'),(984,19,'Mina'),(985,19,'Montemorelos'),(986,19,'Monterrey'),(987,19,'Parás'),(988,19,'Pesquería'),(989,19,'Rayones'),(990,19,'Sabinas Hidalgo'),(991,19,'Salinas Victoria'),(992,19,'San Nicolás de los Garza'),(993,19,'San Pedro Garza García'),(994,19,'Santa Catarina'),(995,19,'Santiago'),(996,19,'Vallecillo'),(997,19,'Villaldama'),(998,20,'Abejones'),(999,20,'Acatlán de Pérez Figueroa'),(1000,20,'Ánimas Trujano'),(1001,20,'Asunción Cacalotepec'),(1002,20,'Asunción Cuyotepeji'),(1003,20,'Asunción Ixtaltepec'),(1004,20,'Asunción Nochixtlán'),(1005,20,'Asunción Ocotlán'),(1006,20,'Asunción Tlacolulita'),(1007,20,'Ayoquezco de Aldama'),(1008,20,'Ayotzintepec'),(1009,20,'Calihualá'),(1010,20,'Candelaria Loxicha'),(1011,20,'Capulalpam de Méndez'),(1012,20,'Chahuites'),(1013,20,'Chalcatongo de Hidalgo'),(1014,20,'Chiquihuitlán de Benito Juárez'),(1015,20,'Ciénega de Zimatlán'),(1016,20,'Ciudad Ixtepec'),(1017,20,'Coatecas Altas'),(1018,20,'Coicoyán de las Flores'),(1019,20,'Concepción Buenavista'),(1020,20,'Concepción Pápalo'),(1021,20,'Constancia del Rosario'),(1022,20,'Cosolapa'),(1023,20,'Cosoltepec'),(1024,20,'Cuilapam de Guerrero'),(1025,20,'Cuyamecalco Villa de Zaragoza'),(1026,20,'El Barrio de la Soledad'),(1027,20,'El Espinal'),(1028,20,'Eloxochitlán de Flores Magón'),(1029,20,'Fresnillo de Trujano'),(1030,20,'Guadalupe de Ramírez'),(1031,20,'Guadalupe Etla'),(1032,20,'Guelatao de Juárez'),(1033,20,'Guevea de Humboldt'),(1034,20,'Heróica Ciudad de Ejutla de Crespo'),(1035,20,'Heróica Ciudad de Huajuapan de León'),(1036,20,'Heróica Ciudad de Tlaxiaco'),(1037,20,'Huautepec'),(1038,20,'Huautla de Jiménez'),(1039,20,'Ixpantepec Nieves'),(1040,20,'Ixtlán de Juárez'),(1041,20,'Juchitán de Zaragoza'),(1042,20,'La Compañía'),(1043,20,'La Pe'),(1044,20,'La Reforma'),(1045,20,'La Trinidad Vista Hermosa'),(1046,20,'Loma Bonita'),(1047,20,'Magdalena Apasco'),(1048,20,'Magdalena Jaltepec'),(1049,20,'Magdalena Mixtepec'),(1050,20,'Magdalena Ocotlán'),(1051,20,'Magdalena Peñasco'),(1052,20,'Magdalena Teitipac'),(1053,20,'Magdalena Tequisistlán'),(1054,20,'Magdalena Tlacotepec'),(1055,20,'Magdalena Yodocono de Porfirio Díaz'),(1056,20,'Magdalena Zahuatlán'),(1057,20,'Mariscala de Juárez'),(1058,20,'Mártires de Tacubaya'),(1059,20,'Matías Romero Avendaño'),(1060,20,'Mazatlán Villa de Flores'),(1061,20,'Mesones Hidalgo'),(1062,20,'Miahuatlán de Porfirio Díaz'),(1063,20,'Mixistlán de la Reforma'),(1064,20,'Monjas'),(1065,20,'Natividad'),(1066,20,'Nazareno Etla'),(1067,20,'Nejapa de Madero'),(1068,20,'Nuevo Zoquiapam'),(1069,20,'Oaxaca de Juárez'),(1070,20,'Ocotlán de Morelos'),(1071,20,'Pinotepa de Don Luis'),(1072,20,'Pluma Hidalgo'),(1073,20,'Putla Villa de Guerrero'),(1074,20,'Reforma de Pineda'),(1075,20,'Reyes Etla'),(1076,20,'Rojas de Cuauhtémoc'),(1077,20,'Salina Cruz'),(1078,20,'San Agustín Amatengo'),(1079,20,'San Agustín Atenango'),(1080,20,'San Agustín Chayuco'),(1081,20,'San Agustín de las Juntas'),(1082,20,'San Agustín Etla'),(1083,20,'San Agustín Loxicha'),(1084,20,'San Agustín Tlacotepec'),(1085,20,'San Agustín Yatareni'),(1086,20,'San Andrés Cabecera Nueva'),(1087,20,'San Andrés Dinicuiti'),(1088,20,'San Andrés Huaxpaltepec'),(1089,20,'San Andrés Huayapam'),(1090,20,'San Andrés Ixtlahuaca'),(1091,20,'San Andrés Lagunas'),(1092,20,'San Andrés Nuxiño'),(1093,20,'San Andrés Paxtlán'),(1094,20,'San Andrés Sinaxtla'),(1095,20,'San Andrés Solaga'),(1096,20,'San Andrés Teotilalpam'),(1097,20,'San Andrés Tepetlapa'),(1098,20,'San Andrés Yaa'),(1099,20,'San Andrés Zabache'),(1100,20,'San Andrés Zautla'),(1101,20,'San Antonino Castillo Velasco'),(1102,20,'San Antonino el Alto'),(1103,20,'San Antonino Monteverde'),(1104,20,'San Antonio Acutla'),(1105,20,'San Antonio de la Cal'),(1106,20,'San Antonio Huitepec'),(1107,20,'San Antonio Nanahuatipam'),(1108,20,'San Antonio Sinicahua'),(1109,20,'San Antonio Tepetlapa'),(1110,20,'San Baltazar Chichicápam'),(1111,20,'San Baltazar Loxicha'),(1112,20,'San Baltazar Yatzachi el Bajo'),(1113,20,'San Bartolo Coyotepec'),(1114,20,'San Bartolo Soyaltepec'),(1115,20,'San Bartolo Yautepec'),(1116,20,'San Bartolomé Ayautla'),(1117,20,'San Bartolomé Loxicha'),(1118,20,'San Bartolomé Quialana'),(1119,20,'San Bartolomé Yucuañe'),(1120,20,'San Bartolomé Zoogocho'),(1121,20,'San Bernardo Mixtepec'),(1122,20,'San Blas Atempa'),(1123,20,'San Carlos Yautepec'),(1124,20,'San Cristóbal Amatlán'),(1125,20,'San Cristóbal Amoltepec'),(1126,20,'San Cristóbal Lachirioag'),(1127,20,'San Cristóbal Suchixtlahuaca'),(1128,20,'San Dionisio del Mar'),(1129,20,'San Dionisio Ocotepec'),(1130,20,'San Dionisio Ocotlán'),(1131,20,'San Esteban Atatlahuca'),(1132,20,'San Felipe Jalapa de Díaz'),(1133,20,'San Felipe Tejalapam'),(1134,20,'San Felipe Usila'),(1135,20,'San Francisco Cahuacuá'),(1136,20,'San Francisco Cajonos'),(1137,20,'San Francisco Chapulapa'),(1138,20,'San Francisco Chindua'),(1139,20,'San Francisco del Mar'),(1140,20,'San Francisco Huehuetlán'),(1141,20,'San Francisco Ixhuatán'),(1142,20,'San Francisco Jaltepetongo'),(1143,20,'San Francisco Lachigoló'),(1144,20,'San Francisco Logueche'),(1145,20,'San Francisco Nuxaño'),(1146,20,'San Francisco Ozolotepec'),(1147,20,'San Francisco Sola'),(1148,20,'San Francisco Telixtlahuaca'),(1149,20,'San Francisco Teopan'),(1150,20,'San Francisco Tlapancingo'),(1151,20,'San Gabriel Mixtepec'),(1152,20,'San Ildefonso Amatlán'),(1153,20,'San Ildefonso Sola'),(1154,20,'San Ildefonso Villa Alta'),(1155,20,'San Jacinto Amilpas'),(1156,20,'San Jacinto Tlacotepec'),(1157,20,'San Jerónimo Coatlán'),(1158,20,'San Jerónimo Silacayoapilla'),(1159,20,'San Jerónimo Sosola'),(1160,20,'San Jerónimo Taviche'),(1161,20,'San Jerónimo Tecoatl'),(1162,20,'San Jerónimo Tlacochahuaya'),(1163,20,'San Jorge Nuchita'),(1164,20,'San José Ayuquila'),(1165,20,'San José Chiltepec'),(1166,20,'San José del Peñasco'),(1167,20,'San José del Progreso'),(1168,20,'San José Estancia Grande'),(1169,20,'San José Independencia'),(1170,20,'San José Lachiguiri'),(1171,20,'San José Tenango'),(1172,20,'San Juan Achiutla'),(1173,20,'San Juan Atepec'),(1174,20,'San Juan Bautista Atatlahuca'),(1175,20,'San Juan Bautista Coixtlahuaca'),(1176,20,'San Juan Bautista Cuicatlán'),(1177,20,'San Juan Bautista Guelache'),(1178,20,'San Juan Bautista Jayacatlán'),(1179,20,'San Juan Bautista Lo de Soto'),(1180,20,'San Juan Bautista Suchitepec'),(1181,20,'San Juan Bautista Tlacoatzintepec'),(1182,20,'San Juan Bautista Tlachichilco'),(1183,20,'San Juan Bautista Tuxtepec'),(1184,20,'San Juan Bautista Valle Nacional'),(1185,20,'San Juan Cacahuatepec'),(1186,20,'San Juan Chicomezúchil'),(1187,20,'San Juan Chilateca'),(1188,20,'San Juan Cieneguilla'),(1189,20,'San Juan Coatzóspam'),(1190,20,'San Juan Colorado'),(1191,20,'San Juan Comaltepec'),(1192,20,'San Juan Cotzocón'),(1193,20,'San Juan del Estado'),(1194,20,'San Juan de los Cués'),(1195,20,'San Juan del Río'),(1196,20,'San Juan Diuxi'),(1197,20,'San Juan Evangelista Analco'),(1198,20,'San Juan Guelavia'),(1199,20,'San Juan Guichicovi'),(1200,20,'San Juan Ihualtepec'),(1201,20,'San Juan Juquila Mixes'),(1202,20,'San Juan Juquila Vijanos'),(1203,20,'San Juan Lachao'),(1204,20,'San Juan Lachigalla'),(1205,20,'San Juan Lajarcia'),(1206,20,'San Juan Lalana'),(1207,20,'San Juan Mazatlán'),(1208,20,'San Juan Mixtepec, distrito 08'),(1209,20,'San Juan Mixtepec, distrito 26'),(1210,20,'San Juan Ñumi'),(1211,20,'San Juan Ozolotepec'),(1212,20,'San Juan Petlapa'),(1213,20,'San Juan Quiahije'),(1214,20,'San Juan Quiotepec'),(1215,20,'San Juan Sayultepec'),(1216,20,'San Juan Tabaá'),(1217,20,'San Juan Tamazola'),(1218,20,'San Juan Teita'),(1219,20,'San Juan Teitipac'),(1220,20,'San Juan Tepeuxila'),(1221,20,'San Juan Teposcolula'),(1222,20,'San Juan Yaeé'),(1223,20,'San Juan Yatzona'),(1224,20,'San Juan Yucuita'),(1225,20,'San Lorenzo'),(1226,20,'San Lorenzo Albarradas'),(1227,20,'San Lorenzo Cacaotepec'),(1228,20,'San Lorenzo Cuaunecuiltitla'),(1229,20,'San Lorenzo Texmelucan'),(1230,20,'San Lorenzo Victoria'),(1231,20,'San Lucas Camotlán'),(1232,20,'San Lucas Ojitlán'),(1233,20,'San Lucas Quiaviní'),(1234,20,'San Lucas Zoquiápam'),(1235,20,'San Luis Amatlán'),(1236,20,'San Marcial Ozolotepec'),(1237,20,'San Marcos Arteaga'),(1238,20,'San Martín de los Cansecos'),(1239,20,'San Martín Huamelúlpam'),(1240,20,'San Martín Itunyoso'),(1241,20,'San Martín Lachilá'),(1242,20,'San Martín Peras'),(1243,20,'San Martín Tilcajete'),(1244,20,'San Martín Toxpalan'),(1245,20,'San Martín Zacatepec'),(1246,20,'San Mateo Cajonos'),(1247,20,'San Mateo del Mar'),(1248,20,'San Mateo Etlatongo'),(1249,20,'San Mateo Nejápam'),(1250,20,'San Mateo Peñasco'),(1251,20,'San Mateo Piñas'),(1252,20,'San Mateo Río Hondo'),(1253,20,'San Mateo Sindihui'),(1254,20,'San Mateo Tlapiltepec'),(1255,20,'San Mateo Yoloxochitlán'),(1256,20,'San Melchor Betaza'),(1257,20,'San Miguel Achiutla'),(1258,20,'San Miguel Ahuehuetitlán'),(1259,20,'San Miguel Aloápam'),(1260,20,'San Miguel Amatitlán'),(1261,20,'San Miguel Amatlán'),(1262,20,'San Miguel Coatlán'),(1263,20,'San Miguel Chicahua'),(1264,20,'San Miguel Chimalapa'),(1265,20,'San Miguel del Puerto'),(1266,20,'San Miguel del Río'),(1267,20,'San Miguel Ejutla'),(1268,20,'San Miguel el Grande'),(1269,20,'San Miguel Huautla'),(1270,20,'San Miguel Mixtepec'),(1271,20,'San Miguel Panixtlahuaca'),(1272,20,'San Miguel Peras'),(1273,20,'San Miguel Piedras'),(1274,20,'San Miguel Quetzaltepec'),(1275,20,'San Miguel Santa Flor'),(1276,20,'San Miguel Soyaltepec'),(1277,20,'San Miguel Suchixtepec'),(1278,20,'San Miguel Tecomatlán'),(1279,20,'San Miguel Tenango'),(1280,20,'San Miguel Tequixtepec'),(1281,20,'San Miguel Tilquiápam'),(1282,20,'San Miguel Tlacamama'),(1283,20,'San Miguel Tlacotepec'),(1284,20,'San Miguel Tulancingo'),(1285,20,'San Miguel Yotao'),(1286,20,'San Nicolás'),(1287,20,'San Nicolás Hidalgo'),(1288,20,'San Pablo Coatlán'),(1289,20,'San Pablo Cuatro Venados'),(1290,20,'San Pablo Etla'),(1291,20,'San Pablo Huitzo'),(1292,20,'San Pablo Huixtepec'),(1293,20,'San Pablo Macuiltianguis'),(1294,20,'San Pablo Tijaltepec'),(1295,20,'San Pablo Villa de Mitla'),(1296,20,'San Pablo Yaganiza'),(1297,20,'San Pedro Amuzgos'),(1298,20,'San Pedro Apóstol'),(1299,20,'San Pedro Atoyac'),(1300,20,'San Pedro Cajonos'),(1301,20,'San Pedro Comitancillo'),(1302,20,'San Pedro Cocaltepec Cántaros'),(1303,20,'San Pedro el Alto'),(1304,20,'San Pedro Huamelula'),(1305,20,'San Pedro Huilotepec'),(1306,20,'San Pedro Ixcatlán'),(1307,20,'San Pedro Ixtlahuaca'),(1308,20,'San Pedro Jaltepetongo'),(1309,20,'San Pedro Jicayán'),(1310,20,'San Pedro Jocotipac'),(1311,20,'San Pedro Juchatengo'),(1312,20,'San Pedro Mártir'),(1313,20,'San Pedro Mártir Quiechapa'),(1314,20,'San Pedro Mártir Yucuxaco'),(1315,20,'San Pedro Mixtepec, distrito 22'),(1316,20,'San Pedro Mixtepec, distrito 26'),(1317,20,'San Pedro Molinos'),(1318,20,'San Pedro Nopala'),(1319,20,'San Pedro Ocopetatillo'),(1320,20,'San Pedro Ocotepec'),(1321,20,'San Pedro Pochutla'),(1322,20,'San Pedro Quiatoni'),(1323,20,'San Pedro Sochiápam'),(1324,20,'San Pedro Tapanatepec'),(1325,20,'San Pedro Taviche'),(1326,20,'San Pedro Teozacoalco'),(1327,20,'San Pedro Teutila'),(1328,20,'San Pedro Tidaá'),(1329,20,'San Pedro Topiltepec'),(1330,20,'San Pedro Totolápam'),(1331,20,'San Pedro y San Pablo Ayutla'),(1332,20,'San Pedro y San Pablo Teposcolula'),(1333,20,'San Pedro y San Pablo Tequixtepec'),(1334,20,'San Pedro Yaneri'),(1335,20,'San Pedro Yólox'),(1336,20,'San Pedro Yucunama'),(1337,20,'San Raymundo Jalpan'),(1338,20,'San Sebastián Abasolo'),(1339,20,'San Sebastián Coatlán'),(1340,20,'San Sebastián Ixcapa'),(1341,20,'San Sebastián Nicananduta'),(1342,20,'San Sebastián Río Hondo'),(1343,20,'San Sebastián Tecomaxtlahuaca'),(1344,20,'San Sebastián Teitipac'),(1345,20,'San Sebastián Tutla'),(1346,20,'San Simón Almolongas'),(1347,20,'San Simón Zahuatlán  '),(1348,20,'Santa Ana'),(1349,20,'Santa Ana Ateixtlahuaca'),(1350,20,'Santa Ana Cuauhtémoc'),(1351,20,'Santa Ana del Valle'),(1352,20,'Santa Ana Tavela'),(1353,20,'Santa Ana Tlapacoyan'),(1354,20,'Santa Ana Yareni'),(1355,20,'Santa Ana Zegache'),(1356,20,'Santa Catalina Quieri'),(1357,20,'Santa Catarina Cuixtla'),(1358,20,'Santa Catarina Ixtepeji'),(1359,20,'Santa Catarina Juquila'),(1360,20,'Santa Catarina Lachatao'),(1361,20,'Santa Catarina Loxicha'),(1362,20,'Santa Catarina Mechoacán'),(1363,20,'Santa Catarina Minas'),(1364,20,'Santa Catarina Quiané'),(1365,20,'Santa Catarina Quioquitani'),(1366,20,'Santa CatarinaTayata'),(1367,20,'Santa Catarina Ticuá'),(1368,20,'Santa Catarina Yosonotú'),(1369,20,'Santa Catarina Zapoquila'),(1370,20,'Santa Cruz Acatepec'),(1371,20,'Santa Cruz Amilpas'),(1372,20,'Santa Cruz de Bravo'),(1373,20,'Santa Cruz Itundujia'),(1374,20,'Santa Cruz Mixtepec'),(1375,20,'Santa Cruz Nundaco'),(1376,20,'Santa Cruz Papalutla'),(1377,20,'Santa Cruz Tacache de Mina'),(1378,20,'Santa Cruz Tacahua'),(1379,20,'Santa Cruz Tayata'),(1380,20,'Santa Cruz Xitla'),(1381,20,'Santa Cruz Xoxocotlán'),(1382,20,'Santa Cruz Zenzontepec'),(1383,20,'Santa Gertrudis'),(1384,20,'Santa Inés del Monte'),(1385,20,'Santa Inés de Zaragoza'),(1386,20,'Santa Inés Yatzeche'),(1387,20,'Santa Lucía del Camino'),(1388,20,'Santa Lucía Miahuatlán'),(1389,20,'Santa Lucía Monteverde'),(1390,20,'Santa Lucía Ocotlán'),(1391,20,'Santa Magdalena Jicotlán'),(1392,20,'Santa María Alotepec'),(1393,20,'Santa María Apazco'),(1394,20,'Santa María Atzompa'),(1395,20,'Santa María Camotlán'),(1396,20,'Santa María Chachoápam'),(1397,20,'Santa María Chilchotla'),(1398,20,'Santa María Chimalapa'),(1399,20,'Santa María Colotepec'),(1400,20,'Santa María Cortijo'),(1401,20,'Santa María Coyotepec'),(1402,20,'Santa María del Rosario'),(1403,20,'Santa María del Tule'),(1404,20,'Santa María Ecatepec'),(1405,20,'Santa María Guelacé'),(1406,20,'Santa María Guienagati'),(1407,20,'Santa María Huatulco'),(1408,20,'Santa María Huazolotitlán'),(1409,20,'Santa María Ipalapa'),(1410,20,'Santa María Ixcatlán'),(1411,20,'Santa María Jacatepec'),(1412,20,'Santa María Jalapa del Marqués'),(1413,20,'Santa María Jaltianguis'),(1414,20,'Santa María la Asunción'),(1415,20,'Santa María Lachixío'),(1416,20,'Santa María Mixtequilla'),(1417,20,'Santa María Nativitas'),(1418,20,'Santa María Nduayaco'),(1419,20,'Santa María Ozolotepec'),(1420,20,'Santa María Pápalo'),(1421,20,'Santa María Peñoles'),(1422,20,'Santa María Petapa'),(1423,20,'Santa María Quiegolani'),(1424,20,'Santa María Sola'),(1425,20,'Santa María Tataltepec'),(1426,20,'Santa María Tecomavaca'),(1427,20,'Santa María Temaxcalapa'),(1428,20,'Santa María Temaxcaltepec'),(1429,20,'Santa María Teopoxco'),(1430,20,'Santa María Tepantlali'),(1431,20,'Santa María Texcatitlán'),(1432,20,'Santa María Tlahuitoltepec'),(1433,20,'Santa María Tlalixtac'),(1434,20,'Santa María Tonameca'),(1435,20,'Santa María Totolapilla'),(1436,20,'Santa María Xadani'),(1437,20,'Santa María Yalina'),(1438,20,'Santa María Yavesía'),(1439,20,'Santa María Yolotepec'),(1440,20,'Santa María Yosoyua'),(1441,20,'Santa María Yucuhiti'),(1442,20,'Santa María Zacatepec'),(1443,20,'Santa María Zaniza'),(1444,20,'Santa María Zoquitlán'),(1445,20,'Santiago Amoltepec'),(1446,20,'Santiago Apoala'),(1447,20,'Santiago Apóstol'),(1448,20,'Santiago Astata'),(1449,20,'Santiago Atitlán'),(1450,20,'Santiago Ayuquililla'),(1451,20,'Santiago Cacaloxtepec'),(1452,20,'Santiago Camotlán'),(1453,20,'Santiago Chazumba'),(1454,20,'Santiago Choápam'),(1455,20,'Santiago Comaltepec'),(1456,20,'Santiago del Río'),(1457,20,'Santiago Huajolotitlán'),(1458,20,'Santiago Huauclilla'),(1459,20,'Santiago Ihuitlán Plumas'),(1460,20,'Santiago Ixcuintepec'),(1461,20,'Santiago Ixtayutla'),(1462,20,'Santiago Jamiltepec'),(1463,20,'Santiago Jocotepec'),(1464,20,'Santiago Juxtlahuaca'),(1465,20,'Santiago Lachiguiri'),(1466,20,'Santiago Lalopa'),(1467,20,'Santiago Laollaga'),(1468,20,'Santiago Laxopa'),(1469,20,'Santiago Llano Grande'),(1470,20,'Santiago Matatlán'),(1471,20,'Santiago Miltepec'),(1472,20,'Santiago Minas'),(1473,20,'Santiago Nacaltepec'),(1474,20,'Santiago Nejapilla'),(1475,20,'Santiago Niltepec'),(1476,20,'Santiago Nundiche'),(1477,20,'Santiago Nuyoó'),(1478,20,'Santiago Pinotepa Nacional'),(1479,20,'Santiago Suchilquitongo'),(1480,20,'Santiago Tamazola'),(1481,20,'Santiago Tapextla'),(1482,20,'Santiago Tenango'),(1483,20,'Santiago Tepetlapa'),(1484,20,'Santiago Tetepec'),(1485,20,'Santiago Texcalcingo'),(1486,20,'Santiago Textitlán'),(1487,20,'Santiago Tilantongo'),(1488,20,'Santiago Tillo'),(1489,20,'Santiago Tlazoyaltepec'),(1490,20,'Santiago Xanica'),(1491,20,'Santiago Xiacuí'),(1492,20,'Santiago Yaitepec'),(1493,20,'Santiago Yaveo'),(1494,20,'Santiago Yolomécatl'),(1495,20,'Santiago Yosondúa'),(1496,20,'Santiago Yucuyachi'),(1497,20,'Santiago Zacatepec'),(1498,20,'Santiago Zoochila'),(1499,20,'Santo Domingo Albarradas'),(1500,20,'Santo Domingo Armenta'),(1501,20,'Santo Domingo Chihuitán'),(1502,20,'Santo Domingo de Morelos'),(1503,20,'Santo Domingo Ingenio'),(1504,20,'Santo Domingo Ixcatlán'),(1505,20,'Santo Domingo Nuxaá'),(1506,20,'Santo Domingo Ozolotepec'),(1507,20,'Santo Domingo Petapa'),(1508,20,'Santo Domingo Roayaga'),(1509,20,'Santo Domingo Tehuantepec'),(1510,20,'Santo Domingo Teojomulco'),(1511,20,'Santo Domingo Tepuxtepec'),(1512,20,'Santo Domingo Tlatayapam'),(1513,20,'Santo Domingo Tomaltepec'),(1514,20,'Santo Domingo Tonalá'),(1515,20,'Santo Domingo Tonaltepec'),(1516,20,'Santo Domingo Xagacía'),(1517,20,'Santo Domingo Yanhuitlán'),(1518,20,'Santo Domingo Yodohino'),(1519,20,'Santo Domingo Zanatepec'),(1520,20,'Santo Tomás Jalieza'),(1521,20,'Santo Tomás Mazaltepec'),(1522,20,'Santo Tomás Ocotepec'),(1523,20,'Santo Tomás Tamazulapan'),(1524,20,'Santos Reyes Nopala'),(1525,20,'Santos Reyes Pápalo'),(1526,20,'Santos Reyes Tepejillo'),(1527,20,'Santos Reyes Yucuná'),(1528,20,'San Vicente Coatlán'),(1529,20,'San Vicente Lachixío'),(1530,20,'San Vicente Nuñú'),(1531,20,'Silacayoápam'),(1532,20,'Sitio de Xitlapehua'),(1533,20,'Soledad Etla'),(1534,20,'Tamazulápam del Espíritu Santo'),(1535,20,'Tanetze de Zaragoza'),(1536,20,'Taniche'),(1537,20,'Tataltepec de Valdés'),(1538,20,'Teococuilco de Marcos Pérez'),(1539,20,'Teotitlán de Flores Magón'),(1540,20,'Teotitlán del Valle'),(1541,20,'Teotongo'),(1542,20,'Tepelmeme Villa de Morelos'),(1543,20,'Tezoatlán de Segura y Luna'),(1544,20,'Tlacolula de Matamoros'),(1545,20,'Tlacotepec Plumas'),(1546,20,'Tlalixtac de Cabrera'),(1547,20,'Totontepec Villa de Morelos'),(1548,20,'Trinidad Zaáchila'),(1549,20,'Unión Hidalgo'),(1550,20,'Valerio Trujano'),(1551,20,'Villa de Chilapa de Díaz'),(1552,20,'Villa de Etla'),(1553,20,'Villa de Tamazulápam del Progreso'),(1554,20,'Villa de Tututepec de Melchor Ocampo'),(1555,20,'Villa de Zaáchila'),(1556,20,'Villa Díaz Ordaz'),(1557,20,'Villa Hidalgo'),(1558,20,'Villa Sola de Vega'),(1559,20,'Villa Talea de Castro'),(1560,20,'Villa Tejupam de la Unión'),(1561,20,'Yaxe'),(1562,20,'Yogana'),(1563,20,'Yutanduchi de Guerrero'),(1564,20,'Zapotitlán del Río'),(1565,20,'Zapotitlán Lagunas'),(1566,20,'Zapotitlán Palmas'),(1567,20,'Zimatlán de Álvarez'),(1568,21,'Acajete'),(1569,21,'Acateno'),(1570,21,'Acatlán'),(1571,21,'Acatzingo'),(1572,21,'Acteopan'),(1573,21,'Ahuacatlán'),(1574,21,'Ahuatlán'),(1575,21,'Ahuazotepec'),(1576,21,'Ahuehuetitla'),(1577,21,'Ajalpan'),(1578,21,'Albino Zertuche'),(1579,21,'Aljojuca'),(1580,21,'Altepexi'),(1581,21,'Amixtlán'),(1582,21,'Amozoc'),(1583,21,'Aquixtla'),(1584,21,'Atempan'),(1585,21,'Atexcal'),(1586,21,'Atlequizayan'),(1587,21,'Atlixco'),(1588,21,'Atoyatempan'),(1589,21,'Atzala'),(1590,21,'Atzitzihuacán'),(1591,21,'Atzitzintla'),(1592,21,'Axutla'),(1593,21,'Ayotoxco de Guerrero'),(1594,21,'Calpan'),(1595,21,'Caltepec'),(1596,21,'Camocuautla'),(1597,21,'Cañada Morelos'),(1598,21,'Caxhuacan'),(1599,21,'Chalchicomula de Sesma'),(1600,21,'Chapulco'),(1601,21,'Chiautla'),(1602,21,'Chiautzingo'),(1603,21,'Chichiquila'),(1604,21,'Chiconcuautla'),(1605,21,'Chietla'),(1606,21,'Chigmecatitlán'),(1607,21,'Chignahuapan'),(1608,21,'Chignautla'),(1609,21,'Chila'),(1610,21,'Chila de la Sal'),(1611,21,'Chilchotla'),(1612,21,'Chinantla'),(1613,21,'Coatepec'),(1614,21,'Coatzingo'),(1615,21,'Cohetzala'),(1616,21,'Cohuecan'),(1617,21,'Coronango'),(1618,21,'Coxcatlán'),(1619,21,'Coyomeapan'),(1620,21,'Coyotepec'),(1621,21,'Cuapiaxtla de Madero'),(1622,21,'Cuautempan'),(1623,21,'Cuautinchán'),(1624,21,'Cuautlancingo'),(1625,21,'Cuayuca de Andradre'),(1626,21,'Cuetzalan del Progreso'),(1627,21,'Cuyoaco'),(1628,21,'Domingo Arenas'),(1629,21,'Eloxochitlán'),(1630,21,'Epatlán'),(1631,21,'Esperanza'),(1632,21,'Francisco Z. Mena'),(1633,21,'General Felipe Ángeles'),(1634,21,'Guadalupe'),(1635,21,'Guadalupe Victoria'),(1636,21,'Hermenegildo Galeana'),(1637,21,'Honey'),(1638,21,'Huaquechula'),(1639,21,'Huatlatlauca'),(1640,21,'Huauchinango'),(1641,21,'Huehuetla'),(1642,21,'Huehuetlán el Chico'),(1643,21,'Huehuetlán el Grande'),(1644,21,'Huejotzingo'),(1645,21,'Hueyapan'),(1646,21,'Hueytamalco'),(1647,21,'Hueytlalpan'),(1648,21,'Huitzilán de Serdán'),(1649,21,'Huitziltepec'),(1650,21,'Ixcamilpa de Guerrero'),(1651,21,'Ixcaquixtla'),(1652,21,'Ixtacamaxtitlán'),(1653,21,'Ixtepec'),(1654,21,'Izúcar de Matamoros'),(1655,21,'Jalpan'),(1656,21,'Jolalpan'),(1657,21,'Jonotla'),(1658,21,'Jopala'),(1659,21,'Juan C. Bonilla'),(1660,21,'Juan Galindo'),(1661,21,'Juan N. Méndez'),(1662,21,'Lafragua'),(1663,21,'Libres'),(1664,21,'Los Reyes de Juárez'),(1665,21,'Magdalena Tlatlauquitepec'),(1666,21,'Mazapiltepec de Juárez'),(1667,21,'Mixtla'),(1668,21,'Molcaxac'),(1669,21,'Naupan'),(1670,21,'Nauzontla'),(1671,21,'Nealtican'),(1672,21,'Nicolás Bravo'),(1673,21,'Nopalucan'),(1674,21,'Ocotepec'),(1675,21,'Ocoyucan'),(1676,21,'Olintla'),(1677,21,'Oriental'),(1678,21,'Pahuatlán'),(1679,21,'Palmar de Bravo'),(1680,21,'Pantepec'),(1681,21,'Petlalcingo'),(1682,21,'Piaxtla'),(1683,21,'Puebla de Zaragoza'),(1684,21,'Quecholac'),(1685,21,'Quimixtlán'),(1686,21,'Rafael Lara Grajales'),(1687,21,'San Andrés Cholula'),(1688,21,'San Antonio Cañada'),(1689,21,'San Diego La Meza Tochimiltzingo'),(1690,21,'San Felipe Teotlalcingo'),(1691,21,'San Felipe Tepatlán'),(1692,21,'San Gabriel Chilac'),(1693,21,'San Gregorio Atzompa'),(1694,21,'San Jerónimo Tecuanipan'),(1695,21,'San Jerónimo Xayacatlán'),(1696,21,'San José Chiapa'),(1697,21,'San José Miahuatlán'),(1698,21,'San Juan Atenco'),(1699,21,'San Juan Atzompa'),(1700,21,'San Martín Texmelucan'),(1701,21,'San Martín Totoltepec'),(1702,21,'San Matías Tlalancaleca'),(1703,21,'San Miguel Ixtitlán'),(1704,21,'San Miguel Xoxtla'),(1705,21,'San Nicolás Buenos Aires'),(1706,21,'San Nicolás de los Ranchos'),(1707,21,'San Pablo Anicano'),(1708,21,'San Pedro Cholula'),(1709,21,'San Pedro Yeloixtlahuaca'),(1710,21,'San Salvador el Seco'),(1711,21,'San Salvador el Verde'),(1712,21,'San Salvador Huixcolotla'),(1713,21,'San Sebastián Tlacotepec'),(1714,21,'Santa Catarina Tlaltempan'),(1715,21,'San Inés Ahuatempan'),(1716,21,'Santa Isabel Cholula'),(1717,21,'Santiago Miahuatlán '),(1718,21,'Santo Tomás Hueyotlipan'),(1719,21,'Soltepec'),(1720,21,'Tecali de Herrera'),(1721,21,'Tecamachalco'),(1722,21,'Tecomatlán'),(1723,21,'Tehuacán'),(1724,21,'Tehuitzingo'),(1725,21,'Tenampulco'),(1726,21,'Teopantlán'),(1727,21,'Teotlalco'),(1728,21,'Tepanco de López'),(1729,21,'Tepango de Rodríguez'),(1730,21,'Tepatlaxco de Hidalgo'),(1731,21,'Tepeaca'),(1732,21,'Tepemaxalco'),(1733,21,'Tepeojuma'),(1734,21,'Tepetzintla'),(1735,21,'Tepexco'),(1736,21,'Tepexi de Rodríguez'),(1737,21,'Tepeyahualco'),(1738,21,'Tepeyahualco de Cuauhtémoc'),(1739,21,'Tetela de Ocampo'),(1740,21,'Teteles de Ávila Castillo'),(1741,21,'Teziutlán'),(1742,21,'Tianguismanalco'),(1743,21,'Tilapa'),(1744,21,'Tlacotepec de Benito Juárez'),(1745,21,'Tlacuilotepec'),(1746,21,'Tlachichuca'),(1747,21,'Tlahuapan'),(1748,21,'Tlaltenango'),(1749,21,'Tlanepantla'),(1750,21,'Tlaola'),(1751,21,'Tlapacoya'),(1752,21,'Tlapanalá'),(1753,21,'Tlatlauquitepec'),(1754,21,'Tlaxco'),(1755,21,'Tochimilco'),(1756,21,'Tochtepec'),(1757,21,'Totoltepec de Guerrero'),(1758,21,'Tulcingo'),(1759,21,'Tuzamapan de Galeana'),(1760,21,'Tzicatlacoyan'),(1761,21,'Venustiano Carranza'),(1762,21,'Vicente Guerrero'),(1763,21,'Xayacatlán de Bravo'),(1764,21,'Xicotepec'),(1765,21,'Xicotlán'),(1766,21,'Xiutetelco'),(1767,21,'Xochiapulco'),(1768,21,'Xochiltepec'),(1769,21,'Xochitlán de Vicente Suárez'),(1770,21,'Xochitlán Todos Santos'),(1771,21,'Yaonahuac'),(1772,21,'Yehualtepec'),(1773,21,'Zacapala'),(1774,21,'Zacapoaxtla'),(1775,21,'Zacatlán'),(1776,21,'Zapotitlán'),(1777,21,'Zapotitlán de Méndez'),(1778,21,'Zaragoza'),(1779,21,'Zautla'),(1780,21,'Zihuateutla'),(1781,21,'Zinacatepec'),(1782,21,'Zongozotla'),(1783,21,'Zoquiapan'),(1784,21,'Zoquitlán'),(1785,22,'Amealco de Bonfil'),(1786,22,'Arroyo Seco'),(1787,22,'Cadereyta de Montes'),(1788,22,'Colón'),(1789,22,'Corregidora'),(1790,22,'El Marqués'),(1791,22,'Ezequiel Montes'),(1792,22,'Huimilpan'),(1793,22,'Jalpan de Serra'),(1794,22,'Landa de Matamoros'),(1795,22,'Pedro Escobedo'),(1796,22,'Peñamiller'),(1797,22,'Pinal de Amoles'),(1798,22,'Querétaro'),(1799,22,'San Joaquín'),(1800,22,'San Juan del Río'),(1801,22,'Tequisquiapan'),(1802,22,'Tolimán'),(1803,23,'Benito Juárez'),(1804,23,'Cozumel'),(1805,23,'Felipe Carrillo Puerto'),(1806,23,'Isla Mujeres'),(1807,23,'José María Morelos'),(1808,23,'Lázaro Cárdenas'),(1809,23,'Othon P. Blanco'),(1810,23,'Solidaridad'),(1811,23,'Tulum'),(1812,24,'Ahualulco'),(1813,24,'Alaquines'),(1814,24,'Aquismón'),(1815,24,'Armadillo de los Infante'),(1816,24,'Axtla de Terrazas'),(1817,24,'Cárdenas'),(1818,24,'Catorce'),(1819,24,'Cedral'),(1820,24,'Cerritos'),(1821,24,'Cerro de San Pedro'),(1822,24,'Charcas'),(1823,24,'Ciudad del Maíz'),(1824,24,'Ciudad Fernández'),(1825,24,'Ciudad Valles'),(1826,24,'Coxcatlán'),(1827,24,'Ebano'),(1828,24,'El Naranjo'),(1829,24,'Guadalcázar'),(1830,24,'Huehuetlán'),(1831,24,'Lagunillas'),(1832,24,'Matehuala'),(1833,24,'Matlapa'),(1834,24,'Mexquitic de Carmona'),(1835,24,'Moctezuma'),(1836,24,'Rayón'),(1837,24,'Rioverde'),(1838,24,'Salinas'),(1839,24,'San Antonio'),(1840,24,'San Ciro de Acosta'),(1841,24,'San Luis Potosí'),(1842,24,'San Martín Chalchicuautla'),(1843,24,'San Nicolás Tolentino'),(1844,24,'Santa Catarina'),(1845,24,'Santa María del Río'),(1846,24,'Santo Domingo'),(1847,24,'San Vicente Tancuayalab'),(1848,24,'Soledad de Graciano Sánchez'),(1849,24,'Tamasopo'),(1850,24,'Tamazunchale'),(1851,24,'Tampacán'),(1852,24,'Tampamolón Corona'),(1853,24,'Tamuín'),(1854,24,'Tancanhuitz de Santos'),(1855,24,'Tanlajás'),(1856,24,'Tanquián de Escobedo'),(1857,24,'Tierra Nueva'),(1858,24,'Vanegas'),(1859,24,'Venado'),(1860,24,'Villa de Arriaga'),(1861,24,'Villa de Arista'),(1862,24,'Villa de Guadalupe'),(1863,24,'Villa de la Paz'),(1864,24,'Villa de Ramos'),(1865,24,'Villa de Reyes'),(1866,24,'Villa Hidalgo'),(1867,24,'Villa Juárez'),(1868,24,'Xilitla'),(1869,24,'Zaragoza'),(1870,25,'Ahome'),(1871,25,'Angostura'),(1872,25,'Badiraguato'),(1873,25,'Choix'),(1874,25,'Concordia'),(1875,25,'Cosalá'),(1876,25,'Culiacán'),(1877,25,'El Fuerte'),(1878,25,'Elota'),(1879,25,'El Rosario'),(1880,25,'Escuinapa'),(1881,25,'Guasave'),(1882,25,'Mazatlán'),(1883,25,'Mocorito'),(1884,25,'Navolato'),(1885,25,'Salvador Alvarado'),(1886,25,'San Ignacio'),(1887,25,'Sinaloa de Leyva'),(1888,26,'Aconchi'),(1889,26,'Agua Prieta'),(1890,26,'Alamos'),(1891,26,'Altar'),(1892,26,'Arivechi'),(1893,26,'Arizpe'),(1894,26,'Atil'),(1895,26,'Bacadéhuachi'),(1896,26,'Bacanora'),(1897,26,'Bacerac'),(1898,26,'Bacoachi'),(1899,26,'Bácum'),(1900,26,'Banámichi'),(1901,26,'Baviácora'),(1902,26,'Bavíspe'),(1903,26,'Benito Juárez'),(1904,26,'Benjamín Hill'),(1905,26,'Caborca'),(1906,26,'Cajeme'),(1907,26,'Cananea'),(1908,26,'Carbó'),(1909,26,'Cocurpe'),(1910,26,'Cumpas'),(1911,26,'Divisaderos'),(1912,26,'Empalme'),(1913,26,'Etchojoa'),(1914,26,'Fronteras'),(1915,26,'General Plutarco Elías Calles'),(1916,26,'Granados'),(1917,26,'Guaymas'),(1918,26,'Hermosillo'),(1919,26,'Huachinera'),(1920,26,'Huásabas'),(1921,26,'Huatabampo'),(1922,26,'Huépac'),(1923,26,'Imuris'),(1924,26,'La Colorada'),(1925,26,'Magdalena'),(1926,26,'Mazatán'),(1927,26,'Moctezuma'),(1928,26,'Naco'),(1929,26,'Nácori Chico'),(1930,26,'Nacozari de García'),(1931,26,'Navojoa'),(1932,26,'Nogales'),(1933,26,'Onavas'),(1934,26,'Opodepe'),(1935,26,'Oquitoa'),(1936,26,'Pitiquito'),(1937,26,'Puerto Peñasco'),(1938,26,'Quiriego'),(1939,26,'Rayón'),(1940,26,'Rosario'),(1941,26,'Sahuaripa'),(1942,26,'San Felipe de Jesús'),(1943,26,'San Ignacio Río Muerto'),(1944,26,'San Javier'),(1945,26,'San Luis Río Colorado'),(1946,26,'San Miguel de Horcasitas'),(1947,26,'San Pedro de la Cueva'),(1948,26,'Santa Ana'),(1949,26,'Santa Cruz'),(1950,26,'Sáric'),(1951,26,'Soyopa'),(1952,26,'Suaqui Grande'),(1953,26,'Tepache'),(1954,26,'Trincheras'),(1955,26,'Tubutama'),(1956,26,'Ures'),(1957,26,'Villa Hidalgo'),(1958,26,'Villa Pesqueira'),(1959,26,'Yécora'),(1960,27,'Balancán'),(1961,27,'Cárdenas'),(1962,27,'Centla'),(1963,27,'Centro'),(1964,27,'Comalcalco'),(1965,27,'Cunduacán'),(1966,27,'Emiliano Zapata'),(1967,27,'Huimanguillo'),(1968,27,'Jalapa'),(1969,27,'Jalpa de Méndez'),(1970,27,'Jonuta'),(1971,27,'Macuspana'),(1972,27,'Nacajuca'),(1973,27,'Paraíso'),(1974,27,'Tacotalpa'),(1975,27,'Teapa'),(1976,27,'Tenosique'),(1977,28,'Abasolo'),(1978,28,'Aldama'),(1979,28,'Altamira'),(1980,28,'Antiguo Morelos'),(1981,28,'Burgos'),(1982,28,'Bustamante'),(1983,28,'Camargo'),(1984,28,'Casas'),(1985,28,'Ciudad Madero'),(1986,28,'Cruillas'),(1987,28,'Gómez Farías'),(1988,28,'González'),(1989,28,'Güemez'),(1990,28,'Guerrero'),(1991,28,'Gustavo Díaz Ordaz'),(1992,28,'Hidalgo'),(1993,28,'Jaumave'),(1994,28,'Jiménez'),(1995,28,'Llera'),(1996,28,'Mainero'),(1997,28,'Mante'),(1998,28,'Matamoros'),(1999,28,'Méndez'),(2000,28,'Mier'),(2001,28,'Miguel Alemán'),(2002,28,'Miquihuana'),(2003,28,'Nuevo Laredo'),(2004,28,'Nuevo Morelos'),(2005,28,'Ocampo'),(2006,28,'Padilla'),(2007,28,'Palmillas'),(2008,28,'Reynosa'),(2009,28,'Río Bravo'),(2010,28,'San Carlos'),(2011,28,'San Fernando'),(2012,28,'San Nicolás'),(2013,28,'Soto La Marina'),(2014,28,'Tampico'),(2015,28,'Tula'),(2016,28,'Valle Hermoso'),(2017,28,'Victoria'),(2018,28,'Villagrán'),(2019,28,'Xicotencatl'),(2020,29,'Acuamanala de Miguel Hidalgo'),(2021,29,'Altzayanca'),(2022,29,'Amaxac de Guerrero'),(2023,29,'Apetatitlán de Antonio Carvajal'),(2024,29,'Atlangatepec'),(2025,29,'Apizaco'),(2026,29,'Benito Juárez'),(2027,29,'Calpulalpan'),(2028,29,'Chiautempan'),(2029,29,'Contla de Juan Cuamatzi'),(2030,29,'Cuapiaxtla'),(2031,29,'Cuaxomulco'),(2032,29,'El Carmen Tequexquitla'),(2033,29,'Emiliano Zapata'),(2034,29,'Españita'),(2035,29,'Huamantla'),(2036,29,'Hueyotlipan'),(2037,29,'Ixtacuixtla de Mariano Matamoros'),(2038,29,'Ixtenco'),(2039,29,'La Magdalena Tlaltelulco'),(2040,29,'Lázaro Cárdenas'),(2041,29,'Mazatecochco de José María Morelos'),(2042,29,'Muñoz de Domingo Arenas'),(2043,29,'Nanacamilpa de Mariano Arista'),(2044,29,'Nativitas'),(2045,29,'Panotla'),(2046,29,'Papalotla de Xicohténcatl'),(2047,29,'Sanctorum de Lázaro Cárdenas'),(2048,29,'San Damián Texoloc'),(2049,29,'San Francisco Tetlanohcan'),(2050,29,'San Jerónimo Zacualpan'),(2051,29,'San José Teacalco'),(2052,29,'San Juan Huactzinco'),(2053,29,'San Lorenzo Axocomanitla'),(2054,29,'San Lucas Tecopilco'),(2055,29,'San Pablo del Monte'),(2056,29,'Santa Ana Nopalucan'),(2057,29,'Santa Apolonia Teacalco'),(2058,29,'Santa Catarina Ayometla'),(2059,29,'Santa Cruz Quilehtla'),(2060,29,'Santa Cruz Tlaxcala'),(2061,29,'Santa Isabel Xiloxoxtla'),(2062,29,'Tenancingo'),(2063,29,'Teolocholco'),(2064,29,'Tepetitla de Lardizábal'),(2065,29,'Tepeyanco'),(2066,29,'Terrenate'),(2067,29,'Tetla de la Solidaridad'),(2068,29,'Tetlatlahuca'),(2069,29,'Tlaxcala'),(2070,29,'Tlaxco'),(2071,29,'Tocatlán'),(2072,29,'Totolac'),(2073,29,'Tzompantepec'),(2074,29,'Xaloztoc'),(2075,29,'Xaltocan'),(2076,29,'Xicohtzinco'),(2077,29,'Yauhquemecan'),(2078,29,'Zacatelco'),(2079,29,'Zitlaltepec de Trinidad Sánchez Santos'),(2080,30,'Acajete'),(2081,30,'Acatlán'),(2082,30,'Acayucan'),(2083,30,'Actopan'),(2084,30,'Acula'),(2085,30,'Acultzingo'),(2086,30,'Agua Dulce'),(2087,30,'Álamo Temapache'),(2088,30,'Alpatláhuac'),(2089,30,'Alto Lucero de Gutiérrez Barrios'),(2090,30,'Altotonga'),(2091,30,'Alvarado'),(2092,30,'Amatitlán'),(2093,30,'Amatlán de los Reyes'),(2094,30,'Ángel R. Cabada'),(2095,30,'Apazapan'),(2096,30,'Aquila'),(2097,30,'Astacinga'),(2098,30,'Atlahuilco'),(2099,30,'Atoyac'),(2100,30,'Atzacan'),(2101,30,'Atzalan'),(2102,30,'Ayahualulco'),(2103,30,'Banderilla'),(2104,30,'Benito Juárez'),(2105,30,'Boca del Río'),(2106,30,'Calcahualco'),(2107,30,'Camarón de Tejeda'),(2108,30,'Camerino Z. Mendoza'),(2109,30,'Carlos A. Carrillo'),(2110,30,'Carrillo Puerto'),(2111,30,'Castillo de Teayo'),(2112,30,'Catemaco'),(2113,30,'Cazones de Herrera'),(2114,30,'Cerro Azul'),(2115,30,'Chacaltianguis'),(2116,30,'Chalma'),(2117,30,'Chiconamel'),(2118,30,'Chiconquiaco'),(2119,30,'Chicontepec'),(2120,30,'Chinameca'),(2121,30,'Chinampa de Gorostiza'),(2122,30,'Chocamán'),(2123,30,'Chontla'),(2124,30,'Chumatlán'),(2125,30,'Citlaltépetl'),(2126,30,'Coacoatzintla'),(2127,30,'Coahuitlán'),(2128,30,'Coatepec'),(2129,30,'Coatzacoalcos'),(2130,30,'Coatzintla'),(2131,30,'Coetzala'),(2132,30,'Colipa'),(2133,30,'Comapa'),(2134,30,'Córdoba'),(2135,30,'Cosamaloapan de Carpio'),(2136,30,'Consautlán de Carvajal'),(2137,30,'Coscomatepec'),(2138,30,'Cosoleacaque'),(2139,30,'Cotaxtla'),(2140,30,'Coxquihui'),(2141,30,'Coyutla'),(2142,30,'Cuichapa'),(2143,30,'Cuitláhuac'),(2144,30,'El Higo'),(2145,30,'Emiliano Zapata'),(2146,30,'Espinal'),(2147,30,'Filomeno Mata'),(2148,30,'Fortín'),(2149,30,'Gutiérrez Zamora'),(2150,30,'Hidalgotitlán'),(2151,30,'Huayacocotla'),(2152,30,'Hueyapan de Ocampo'),(2153,30,'Huiloapan de Cuauhtémoc'),(2154,30,'Ignacio de la Llave'),(2155,30,'Ilamatlán'),(2156,30,'Isla'),(2157,30,'Ixcatepec'),(2158,30,'Ixhuacán de los Reyes'),(2159,30,'Ixhuatlancillo'),(2160,30,'Ixhuatlán del Café'),(2161,30,'Ixhuatlán de Madero'),(2162,30,'Ixhuatlán del Sureste'),(2163,30,'Ixmatlahuacan'),(2164,30,'Ixtaczoquitlán'),(2165,30,'Jalacingo'),(2166,30,'Jalcomulco'),(2167,30,'Jáltipan'),(2168,30,'Jamapa'),(2169,30,'Jesús Carranza'),(2170,30,'Jilotepec'),(2171,30,'José Azueta'),(2172,30,'Juan Rodríguez Clara'),(2173,30,'Juchique de Ferrer'),(2174,30,'La Antigua'),(2175,30,'Landero y Coss'),(2176,30,'La Perla'),(2177,30,'Las Choapas'),(2178,30,'Las Minas'),(2179,30,'Las Vigas de Ramírez'),(2180,30,'Lerdo de Tejada'),(2181,30,'Los Reyes'),(2182,30,'Magdalena'),(2183,30,'Maltrata'),(2184,30,'Manlio Fabio Altamirano'),(2185,30,'Mariano Escobedo'),(2186,30,'Martínez de la Torre'),(2187,30,'Mecatlán'),(2188,30,'Mecayapan'),(2189,30,'Medellín'),(2190,30,'Miahuatlán'),(2191,30,'Minatitlán'),(2192,30,'Misantla'),(2193,30,'Mixtla de Altamirano'),(2194,30,'Moloacán'),(2195,30,'Nanchital de Lázaro Cárdenas del Río'),(2196,30,'Naolinco'),(2197,30,'Naranjal'),(2198,30,'Naranjos Amatlán'),(2199,30,'Nautla'),(2200,30,'Nogales'),(2201,30,'Oluta'),(2202,30,'Omealca'),(2203,30,'Orizaba'),(2204,30,'Otatitlán'),(2205,30,'Oteapan'),(2206,30,'Ozuluama de Mascañeras'),(2207,30,'Pajapan'),(2208,30,'Pánuco'),(2209,30,'Papantla'),(2210,30,'Paso del Macho'),(2211,30,'Paso de Ovejas'),(2212,30,'Perote'),(2213,30,'Platón Sánchez'),(2214,30,'Playa Vicente'),(2215,30,'Poza Rica de Hidalgo'),(2216,30,'Pueblo Viejo'),(2217,30,'Puente Nacional'),(2218,30,'Rafael Delgado'),(2219,30,'Rafael Lucio'),(2220,30,'Río Blanco'),(2221,30,'Saltabarranca'),(2222,30,'San Andrés Tenejapan'),(2223,30,'San Andrés Tuxtla'),(2224,30,'San Juan Evangelista'),(2225,30,'San Rafael'),(2226,30,'Santiago Sochiapan'),(2227,30,'Santiago Tuxtla'),(2228,30,'Sayula de Alemán'),(2229,30,'Soconusco'),(2230,30,'Sochiapa'),(2231,30,'Soledad Atzompa'),(2232,30,'Soledad de Doblado'),(2233,30,'Soteapan'),(2234,30,'Tamalín'),(2235,30,'Tamiahua'),(2236,30,'Tampico Alto'),(2237,30,'Tancoco'),(2238,30,'Tantima'),(2239,30,'Tantoyuca'),(2240,30,'Tatatila'),(2241,30,'Tatahuicapan de Juárez'),(2242,30,'Tecolutla'),(2243,30,'Tehuipango'),(2244,30,'Tempoal'),(2245,30,'Tenampa'),(2246,30,'Tenochtitlán'),(2247,30,'Teocelo'),(2248,30,'Tepatlaxco'),(2249,30,'Tepetlán'),(2250,30,'Tepetzintla'),(2251,30,'Tequila'),(2252,30,'Texcatepec'),(2253,30,'Texhuacán'),(2254,30,'Texistepec'),(2255,30,'Tezonapa'),(2256,30,'Tihuatlán'),(2257,30,'Tierra Blanca'),(2258,30,'Tlacojalpan'),(2259,30,'Tlacolulan'),(2260,30,'Tlacotalpan'),(2261,30,'Tlacotepec de Mejía'),(2262,30,'Tlachichilco'),(2263,30,'Tlalixcoyan'),(2264,30,'Tlalnelhuayocan'),(2265,30,'Tlaltetela'),(2266,30,'Tlapacoyan'),(2267,30,'Tlaquilpa'),(2268,30,'Tlilapan'),(2269,30,'Tomatlán'),(2270,30,'Tonayán'),(2271,30,'Totutla'),(2272,30,'Tres Valles'),(2273,30,'Tuxpan'),(2274,30,'Tuxtilla'),(2275,30,'Úrsulo Galván'),(2276,30,'Uxpanapa'),(2277,30,'Vega de Alatorre'),(2278,30,'Veracruz'),(2279,30,'Villa Aldama'),(2280,30,'Xalapa'),(2281,30,'Xico'),(2282,30,'Xoxocotla'),(2283,30,'Yanga'),(2284,30,'Yecuatla'),(2285,30,'Zacualpan'),(2286,30,'Zaragoza'),(2287,30,'Zentla'),(2288,30,'Zongolica'),(2289,30,'Zontecomatlán'),(2290,30,'Zozocolco de Hidalgo'),(2291,31,'Abalá'),(2292,31,'Acanceh'),(2293,31,'Akil'),(2294,31,'Baca'),(2295,31,'Bokobá'),(2296,31,'Buctzotz'),(2297,31,'Cacalchén'),(2298,31,'Calotmul'),(2299,31,'Cansahcab'),(2300,31,'Cantamayec'),(2301,31,'Calestún'),(2302,31,'Cenotillo'),(2303,31,'Conkal'),(2304,31,'Cuncunul'),(2305,31,'Cuzamá'),(2306,31,'Chacsinkín'),(2307,31,'Chankom'),(2308,31,'Chapab'),(2309,31,'Chemax'),(2310,31,'Chicxulub Pueblo'),(2311,31,'Chichimilá'),(2312,31,'Chikindzonot'),(2313,31,'Chocholá'),(2314,31,'Chumayel'),(2315,31,'Dzán'),(2316,31,'Dzemul'),(2317,31,'Dzidzantún'),(2318,31,'Dzilam de Bravo'),(2319,31,'Dzilam González'),(2320,31,'Dzitás'),(2321,31,'Dzoncauich'),(2322,31,'Espita'),(2323,31,'Halachó'),(2324,31,'Hocabá'),(2325,31,'Hoctún'),(2326,31,'Homún'),(2327,31,'Huhí'),(2328,31,'Hunucmá'),(2329,31,'Ixtil'),(2330,31,'Izamal'),(2331,31,'Kanasín'),(2332,31,'Kantunil'),(2333,31,'Kaua'),(2334,31,'Kinchil'),(2335,31,'Kopomá'),(2336,31,'Mama'),(2337,31,'Maní'),(2338,31,'Maxcanú'),(2339,31,'Mayapán'),(2340,31,'Mérida'),(2341,31,'Mocochá'),(2342,31,'Motul'),(2343,31,'Muna'),(2344,31,'Muxupip'),(2345,31,'Opichén'),(2346,31,'Oxkutzcab'),(2347,31,'Panabá'),(2348,31,'Peto'),(2349,31,'Progreso'),(2350,31,'Quintana Roo'),(2351,31,'Río Lagartos'),(2352,31,'Sacalum'),(2353,31,'Samahil'),(2354,31,'Sanahcat'),(2355,31,'San Felipe'),(2356,31,'Santa Elena'),(2357,31,'Seyé'),(2358,31,'Sinanché'),(2359,31,'Sotuta'),(2360,31,'Sucilá'),(2361,31,'Sudzal'),(2362,31,'Suma de Hidalgo'),(2363,31,'Tahdziú'),(2364,31,'Tahmek'),(2365,31,'Teabo'),(2366,31,'Tecoh'),(2367,31,'Tekal de Venegas'),(2368,31,'Tekantó'),(2369,31,'Tekax'),(2370,31,'Tekit'),(2371,31,'Tekom'),(2372,31,'Telchac Pueblo'),(2373,31,'Telchac Puerto'),(2374,31,'Temax'),(2375,31,'Temozón'),(2376,31,'Tepakán'),(2377,31,'Tetiz'),(2378,31,'Teya'),(2379,31,'Ticul'),(2380,31,'Timucuy'),(2381,31,'Tinúm'),(2382,31,'Tixcacalcupul'),(2383,31,'Tixkokob'),(2384,31,'Tixméhuac'),(2385,31,'Tixpéhual'),(2386,31,'Tizimín'),(2387,31,'Tunkás'),(2388,31,'Tzucacab'),(2389,31,'Uayma'),(2390,31,'Ucú'),(2391,31,'Umán'),(2392,31,'Valladolid'),(2393,31,'Xocchel'),(2394,31,'Yaxcabá'),(2395,31,'Yaxkukul'),(2396,31,'Yobaín'),(2397,32,'Apozol'),(2398,32,'Apulco'),(2399,32,'Atolinga'),(2400,32,'Benito Juárez'),(2401,32,'Calera'),(2402,32,'Cañitas de Felipe Pescador'),(2403,32,'Concepción del Oro'),(2404,32,'Cuauhtémoc'),(2405,32,'Chalchihuites'),(2406,32,'Fresnillo'),(2407,32,'Trinidad García de la Cadena'),(2408,32,'Genaro Codina'),(2409,32,'General Enrique Estrada'),(2410,32,'General Francisco R. Murguía'),(2411,32,'El Plateado de Joaquín Amaro'),(2412,32,'El Salvador'),(2413,32,'General Pánfilo Natera'),(2414,32,'Guadalupe'),(2415,32,'Huanusco'),(2416,32,'Jalpa'),(2417,32,'Jerez'),(2418,32,'Jiménez del Teul'),(2419,32,'Juan Aldama'),(2420,32,'Juchipila'),(2421,32,'Loreto'),(2422,32,'Luis Moya'),(2423,32,'Mazapil'),(2424,32,'Melchor Ocampo'),(2425,32,'Mezquital del Oro'),(2426,32,'Miguel Auza'),(2427,32,'Momax'),(2428,32,'Monte Escobedo'),(2429,32,'Morelos'),(2430,32,'Moyahua de Estrada'),(2431,32,'Nochistlán de Mejía'),(2432,32,'Noria de Ángeles'),(2433,32,'Ojocaliente'),(2434,32,'Pánuco'),(2435,32,'Pinos'),(2436,32,'Río Grande'),(2437,32,'Sain Alto'),(2438,32,'Santa María de la Paz'),(2439,32,'Sombrerete'),(2440,32,'Susticacán'),(2441,32,'Tabasco'),(2442,32,'Tepechitlán'),(2443,32,'Tepetongo'),(2444,32,'Teul de González Ortega'),(2445,32,'Tlaltenango de Sánchez Román'),(2446,32,'Trancoso'),(2447,32,'Valparaíso'),(2448,32,'Vetagrande'),(2449,32,'Villa de Cos'),(2450,32,'Villa García'),(2451,32,'Villa González Ortega'),(2452,32,'Villa Hidalgo'),(2453,32,'Villanueva'),(2454,32,'Zacatecas');
/*!40000 ALTER TABLE `towns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `idUser` int NOT NULL AUTO_INCREMENT,
  `idRole` int NOT NULL,
  `idTown` int NOT NULL,
  `idOrganization` int NOT NULL,
  `idConektaAccount` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(150) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `phone` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `passwordGoogle` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '',
  `lastLogin` datetime NOT NULL DEFAULT '2021-07-28 18:19:34',
  `firstName` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `lastName` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `mothersLastName` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `passwordFacebook` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '',
  `active` tinyint(1) NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `lastLoginDate` datetime DEFAULT NULL,
  `updatedAt` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE KEY `users_UN` (`idUser`),
  KEY `users_FK` (`idRole`),
  KEY `users_FK_1` (`idTown`),
  KEY `users_FK_2` (`idOrganization`),
  CONSTRAINT `users_FK` FOREIGN KEY (`idRole`) REFERENCES `roles` (`idRole`),
  CONSTRAINT `users_FK_1` FOREIGN KEY (`idTown`) REFERENCES `towns` (`idTown`),
  CONSTRAINT `users_FK_2` FOREIGN KEY (`idOrganization`) REFERENCES `organizations` (`idOrganization`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,1,164,1,'cus_2qqj8WiV2A8CUZLUg','admin@ingmulti.com','$2b$10$fCYd5ebhCDRimGsXQo6mGu1TLcH1Rk.cJ6iiquCYhz5JNu16Fdnxi','6145047361','','2021-07-28 18:19:34','Administrador','IMTECH','Desarrollos','',1,0,'2022-02-20 22:41:04','2021-08-24 16:32:05','2022-01-01 00:00:00'),(2,3,164,1,'cus_2qqj8WiV2A8CUZLUg','almacen@ingmulti.com','$2b$10$fCYd5ebhCDRimGsXQo6mGu1TLcH1Rk.cJ6iiquCYhz5JNu16Fdnxi','6145047361','','2021-07-28 18:19:34','Almacén','IMTECH','Desarrollos','',1,0,'2022-02-15 00:18:53','2021-08-24 16:32:05','2022-01-01 00:00:00'),(3,6,164,1,'cus_2qqj8WiV2A8CUZLUg','tecnico@ingmulti.com','$2b$10$fCYd5ebhCDRimGsXQo6mGu1TLcH1Rk.cJ6iiquCYhz5JNu16Fdnxi','6145047361','','2021-07-28 18:19:34','Técnico','IMTECH','Desarrollos','',1,0,'2022-02-15 00:19:02','2021-08-24 16:32:05','2022-01-01 00:00:00'),(4,8,164,1,'cus_2qqj8WiV2A8CUZLUg','produccion@ingmulti.com','$2b$10$fCYd5ebhCDRimGsXQo6mGu1TLcH1Rk.cJ6iiquCYhz5JNu16Fdnxi','6145047361','','2021-07-28 18:19:34','Producción','IMTECH','Desarrollos','',1,0,'2022-02-15 19:02:34','2021-08-24 16:32:05','2022-01-01 00:00:00'),(5,1,164,1,'cus_2qqj8WiV2A8CUZLUg','daniela.navarro.admin@ingmulti.com','$2b$10$fCYd5ebhCDRimGsXQo6mGu1TLcH1Rk.cJ6iiquCYhz5JNu16Fdnxi','6142209336','','2021-07-28 18:19:34','Daniela Alejandra','Navarro','Herrera','',1,0,'2022-02-15 18:47:00','2021-08-24 16:32:05','2022-01-01 00:00:00'),(6,7,164,1,'cus_2qqj8WiV2A8CUZLUg','daniela.navarro@ingmulti.com','$2b$10$fCYd5ebhCDRimGsXQo6mGu1TLcH1Rk.cJ6iiquCYhz5JNu16Fdnxi','6142209336','','2021-07-28 18:19:34','Daniela Alejandra','Navarro','Herrera','',1,0,'2022-02-20 21:11:18','2021-08-24 16:32:05','2022-01-01 00:00:00'),(7,1,164,1,'cus_2qqj8WiV2A8CUZLUg','jesus.carrillo.admin@ingmulti.com','$2b$10$fCYd5ebhCDRimGsXQo6mGu1TLcH1Rk.cJ6iiquCYhz5JNu16Fdnxi','6141268787','','2021-07-28 18:19:34','Jesús Alfonso','Carrillo','Armenta','',1,0,'2022-02-21 15:54:21','2021-08-24 16:32:05','2022-01-01 00:00:00'),(8,7,164,1,'cus_2qqj8WiV2A8CUZLUg','jesus.carrillo@ingmulti.com','$2b$10$fCYd5ebhCDRimGsXQo6mGu1TLcH1Rk.cJ6iiquCYhz5JNu16Fdnxi','6141268787','','2021-07-28 18:19:34','Jesús Alfonso','Carrillo','Armenta','',1,0,'2022-02-20 23:28:24','2021-08-24 16:32:05','2022-01-01 00:00:00'),(9,7,164,1,'cus_2qqj8WiV2A8CUZLUg','giovanny.chavez@ingmulti.com','$2b$10$fCYd5ebhCDRimGsXQo6mGu1TLcH1Rk.cJ6iiquCYhz5JNu16Fdnxi','6141268787','','2021-07-28 18:19:34','Giovanny alfonso','Chávez','Ceniceros','',1,0,'2022-02-20 23:24:13','2021-08-24 16:32:05','2022-01-01 00:00:00');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `waterHistory`
--

DROP TABLE IF EXISTS `waterHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `waterHistory` (
  `idWaterHistory` int NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `idDevice` int NOT NULL COMMENT 'FK: devices',
  `flow` double(10,2) DEFAULT '0.00' COMMENT 'CG: flujo medido',
  `consumption` double(10,2) DEFAULT '0.00' COMMENT 'CG: consumo calculado',
  `reversedConsumption` double(10,2) DEFAULT '0.00' COMMENT 'CG: consumo inverso calculado',
  `temperature` double(10,2) DEFAULT '0.00' COMMENT 'CG: temperatura calculada',
  `dripAlert` tinyint(1) DEFAULT '0' COMMENT 'AL: estado de la alerta de',
  `manipulationAlert` tinyint(1) DEFAULT '0' COMMENT 'AL: estado de la alerta de',
  `emptyAlert` tinyint(1) DEFAULT '0' COMMENT 'AL: estado de la alerta de',
  `burstAlert` tinyint(1) DEFAULT '0' COMMENT 'AL: estado de la alerta de',
  `bubbleAlert` tinyint(1) DEFAULT '0' COMMENT 'AL: estado de la alerta de burbujas',
  `reversedFlowAlert` tinyint(1) DEFAULT '0' COMMENT 'AL: estado de la alerta de flujo inverso',
  `bateryLevel` int DEFAULT '0' COMMENT 'ST: estado de la bateria',
  `signalQuality` int DEFAULT '0' COMMENT 'ST: calidad de la señal de transmision',
  `reason` int DEFAULT '0' COMMENT 'ST: motivo de la transmision',
  `dateTime` datetime DEFAULT NULL COMMENT 'DT: fecha de la toma de la medicion',
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`idWaterHistory`),
  UNIQUE KEY `waterHistory_UN` (`idWaterHistory`),
  KEY `waterHistory_FK` (`idDevice`),
  CONSTRAINT `waterHistory_FK` FOREIGN KEY (`idDevice`) REFERENCES `devices` (`idDevice`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `waterHistory`
--

LOCK TABLES `waterHistory` WRITE;
/*!40000 ALTER TABLE `waterHistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `waterHistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `waterSettings`
--

DROP TABLE IF EXISTS `waterSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `waterSettings` (
  `idWaterSettings` int NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `idDevice` int NOT NULL COMMENT 'FK: devices',
  `firmwareVersion` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '0.0' COMMENT 'CR: version del Fw',
  `serviceOutageDay` int DEFAULT '1' COMMENT 'CR: dia de corte',
  `wereApplied` tinyint(1) DEFAULT '0' COMMENT 'CR: cambios aplicados',
  `status` int unsigned DEFAULT '0' COMMENT 'CR: bits con las configuraciones aplicadas',
  `monthMaxConsumption` float DEFAULT '0' COMMENT 'CR: consumo max. mensual',
  `apiUrl` varchar(150) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '' COMMENT 'CG: URL de la API',
  `consumptionUnits` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '' COMMENT 'CG: unidades de consumo',
  `flowUnits` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '' COMMENT 'CG: unidades de flujo',
  `storageFrequency` int DEFAULT '0' COMMENT 'CG: frecuencia de alamacenamiento',
  `storageTime` varchar(5) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '00:00' COMMENT 'CG: hora de inicio',
  `dailyTransmission` int DEFAULT '0' COMMENT 'CG: habilitada/inhabilitada',
  `dailyTime` varchar(5) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '00:00' COMMENT 'CG: hora de inicio',
  `customDailyTime` int DEFAULT '0' COMMENT 'CG: seleccion de hora; siempre habilitada',
  `periodicFrequency` int DEFAULT '0' COMMENT 'CG: frecuencia de transmision',
  `periodicTime` varchar(5) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '00:00' COMMENT 'CG: hora de inicio',
  `ipProtocol` int DEFAULT '0' COMMENT 'CG: protocolo IP',
  `auth` int DEFAULT '0' COMMENT 'CG: tipo de autenticacion',
  `label` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '' COMMENT 'CG: descripcion del medidor',
  `consumptionAlertType` int DEFAULT '0' COMMENT 'CG: tipo de alerta de consumo: continua/mensual',
  `consumptionSetpoint` int DEFAULT '0' COMMENT 'CG: setpoint del consumo en m3',
  `dripSetpoint` int DEFAULT '0' COMMENT 'CG: setpoint de goteo en mins',
  `burstSetpoint` int DEFAULT '0' COMMENT 'CG: setpoint de fuga en mins',
  `flowSetpoint` int DEFAULT '0' COMMENT 'CG: setpoint de flujo continuo en mins',
  `dripFlag` tinyint(1) DEFAULT '1' COMMENT 'AL: bandera de alerta de goteo',
  `manipulationFlag` tinyint(1) DEFAULT '1' COMMENT 'AL: bandera de alerta de manipulacion',
  `reversedFlowFlag` tinyint(1) DEFAULT '1' COMMENT 'AL: bandera de alerta de flujo inverso',
  `burstFlag` tinyint(1) DEFAULT '1' COMMENT 'AL: bandera de alerta de fuga',
  `bubbleFlag` tinyint(1) DEFAULT '1' COMMENT 'AL: bandera de alerta de presencia de burbujas',
  `emptyFlag` tinyint(1) DEFAULT '1' COMMENT 'AL: bandera de alerta de vacio',
  `createdAt` datetime DEFAULT NULL COMMENT 'DT: fecha de creacion de la instancia en la DB',
  `updatedAt` datetime DEFAULT NULL COMMENT 'DT: fecha de actualizacion de la instancia en la DB',
  PRIMARY KEY (`idWaterSettings`),
  UNIQUE KEY `waterSettings_UN` (`idWaterSettings`),
  UNIQUE KEY `waterSettings_UN_device` (`idDevice`),
  CONSTRAINT `waterSettings_FK` FOREIGN KEY (`idDevice`) REFERENCES `devices` (`idDevice`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `waterSettings`
--

LOCK TABLES `waterSettings` WRITE;
/*!40000 ALTER TABLE `waterSettings` DISABLE KEYS */;
INSERT INTO `waterSettings` VALUES (34,2,'6.0',1,1,0,0,'http://ingmulti.dyndns.org:3002','M3','LPS',60,'23:15',1,'16:35',0,120,'00:50',0,0,'medidor GTest para las configuraciones',0,100,60,60,60,1,1,1,1,1,1,'2022-02-01 15:16:05','2022-02-01 15:16:05'),(35,1,'6.0',1,0,0,0,'http://ingmulti.dyndns.org:3002','M3','LPS',60,'23:15',1,'16:35',0,120,'00:50',0,0,'medidor JTest para las configuraciones',0,100,60,60,60,1,1,1,1,1,1,'2022-02-01 15:16:05','2022-02-01 15:16:05');
/*!40000 ALTER TABLE `waterSettings` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-02-21  8:55:40
