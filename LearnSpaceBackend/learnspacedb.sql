-- MySQL dump 10.13  Distrib 8.4.9, for Linux (x86_64)
--
-- Host: localhost    Database: learnspacedb
-- ------------------------------------------------------
-- Server version	9.5.0

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

-- SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '00546850-b2fe-11f0-8147-f26f4349a4ff:1-11546';

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (3,'Khoa học Dữ liệu'),(8,'Kỹ năng mềm'),(2,'Lập trình Di động'),(1,'Lập trình Web'),(6,'Marketing Online'),(7,'Ngoại ngữ - Tiếng Anh'),(9,'Quản trị Kinh doanh'),(10,'Tài chính Cá nhân'),(5,'Thiết kế UI/UX'),(4,'Trí tuệ Nhân tạo');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chapter`
--

DROP TABLE IF EXISTS `chapter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chapter` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `order` int NOT NULL,
  `free` tinyint(1) DEFAULT '0',
  `course_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_chapter_course_idx` (`course_id`),
  CONSTRAINT `fk_chapter_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chapter`
--

LOCK TABLES `chapter` WRITE;
/*!40000 ALTER TABLE `chapter` DISABLE KEYS */;
INSERT INTO `chapter` VALUES (1,'Chương 1: Giới thiệu ReactJS',1000,0,1,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(2,'Chương 2: Components & Props',2000,0,1,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(3,'Chương 1: Setup Môi trường Node',1000,1,2,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(4,'Chương 2: Express Framework',2000,0,2,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(5,'Chương 1: Dart Cơ bản',1000,1,3,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(6,'Chương 1: Pandas và Numpy',1000,1,4,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(7,'Chương 1: Regression Models',1000,0,5,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(8,'Chương 1: Các công cụ trong Figma',1000,1,6,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(9,'Chương 1: Setup Tài khoản Quảng cáo',1000,1,7,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(10,'Chương 1: Phát âm cơ bản',1000,1,8,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(11,'Chương 3: React Hooks',3000,1,1,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(12,'Chương 4: useReducer, useState',4000,0,1,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(13,'Chương 3: Setup Môi trường Node',3000,1,2,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(14,'Chương 4',4000,0,2,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(15,'Chương 2',2000,1,3,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(16,'Chương 2',2000,1,4,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(17,'Chương 2',2000,0,5,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(18,'Chương 2',2000,1,6,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(19,'Chương 2',2000,1,7,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(20,'Chương 2',2000,1,8,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(22,'chapter test upload video',1000,1,107,'2026-05-22 15:00:28','2026-05-26 13:45:37');
/*!40000 ALTER TABLE `chapter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `lesson_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `lesson_id` (`lesson_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`lesson_id`) REFERENCES `lesson` (`id`),
  CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `image` varchar(255) DEFAULT 'https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg',
  `intro_video` varchar(255) DEFAULT 'https://res.cloudinary.com/dsc8rzpbg/video/upload/v1774930352/0_Teacher_Flowers_3840x2160_azcsmo.mp4',
  `price` decimal(19,2) DEFAULT '0.00',
  `category_id` int NOT NULL,
  `teacher_id` int NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_course_teacher_idx` (`teacher_id`),
  KEY `fk_course_category` (`category_id`),
  CONSTRAINT `fk_course_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  CONSTRAINT `fk_course_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (1,'Khóa học ReactJS Cơ bản','Học ReactJS từ con số 0','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_react.mp4',500000.00,1,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(2,'Khóa học Node.js Thực chiến','Xây dựng RESTful API','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_node.mp4',600000.00,1,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(3,'Lập trình Flutter','Làm app iOS và Android','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_flutter.mp4',700000.00,2,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(4,'Python Data Science','Phân tích dữ liệu với Python','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_python.mp4',800000.00,3,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(5,'Machine Learning A-Z','Thuật toán học máy','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_ml.mp4',900000.00,4,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(6,'Figma cho người mới','Thiết kế giao diện hiện đại','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_figma.mp4',400000.00,5,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(7,'Facebook Ads Mastery','Chạy quảng cáo thực chiến','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_fbads.mp4',550000.00,6,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(8,'Giao tiếp Tiếng Anh 101','Tự tin nói tiếng Anh','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_eng.mp4',300000.00,7,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(9,'Kỹ năng Thuyết trình','Làm chủ sân khấu','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_pres.mp4',250000.00,8,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(10,'Đầu tư Chứng khoán F0','Kiến thức đầu tư cơ bản','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_stock.mp4',1000000.00,10,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(11,'Khóa học ReactJS Cơ bản','Học ReactJS từ con số 0','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_react.mp4',500000.00,1,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(12,'Khóa học Node.js Thực chiến','Xây dựng RESTful API','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_node.mp4',600000.00,1,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(13,'Lập trình Flutter','Làm app iOS và Android','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_flutter.mp4',700000.00,2,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(14,'Python Data Science','Phân tích dữ liệu với Python','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_python.mp4',800000.00,3,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(15,'Machine Learning A-Z','Thuật toán học máy','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_ml.mp4',900000.00,4,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(16,'Figma cho người mới','Thiết kế giao diện hiện đại','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_figma.mp4',400000.00,5,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(17,'Facebook Ads Mastery','Chạy quảng cáo thực chiến','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_fbads.mp4',550000.00,6,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(18,'Giao tiếp Tiếng Anh 101','Tự tin nói tiếng Anh','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_eng.mp4',300000.00,7,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(19,'Kỹ năng Thuyết trình','Làm chủ sân khấu','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_pres.mp4',250000.00,8,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(20,'Đầu tư Chứng khoán F0','Kiến thức đầu tư cơ bản','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_stock.mp4',1000000.00,10,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(21,'Khóa học ReactJS Cơ bản','Học ReactJS từ con số 0','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_react.mp4',500000.00,1,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(22,'Khóa học Node.js Thực chiến','Xây dựng RESTful API','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_node.mp4',600000.00,1,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(23,'Lập trình Flutter','Làm app iOS và Android','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_flutter.mp4',700000.00,2,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(24,'Python Data Science','Phân tích dữ liệu với Python','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_python.mp4',800000.00,3,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(25,'Machine Learning A-Z','Thuật toán học máy','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_ml.mp4',900000.00,4,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(26,'Figma cho người mới','Thiết kế giao diện hiện đại','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_figma.mp4',400000.00,5,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(27,'Facebook Ads Mastery','Chạy quảng cáo thực chiến','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_fbads.mp4',550000.00,6,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(28,'Giao tiếp Tiếng Anh 101','Tự tin nói tiếng Anh','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_eng.mp4',300000.00,7,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(29,'Kỹ năng Thuyết trình','Làm chủ sân khấu','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_pres.mp4',250000.00,8,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(30,'Đầu tư Chứng khoán F0','Kiến thức đầu tư cơ bản','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_stock.mp4',1000000.00,10,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(31,'Khóa học ReactJS Cơ bản','Học ReactJS từ con số 0','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_react.mp4',500000.00,1,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(32,'Khóa học Node.js Thực chiến','Xây dựng RESTful API','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_node.mp4',600000.00,1,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(33,'Lập trình Flutter','Làm app iOS và Android','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_flutter.mp4',700000.00,2,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(34,'Python Data Science','Phân tích dữ liệu với Python','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_python.mp4',800000.00,3,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(35,'Machine Learning A-Z','Thuật toán học máy','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_ml.mp4',900000.00,4,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(36,'Figma cho người mới','Thiết kế giao diện hiện đại','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_figma.mp4',400000.00,5,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(37,'Facebook Ads Mastery','Chạy quảng cáo thực chiến','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_fbads.mp4',550000.00,6,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(38,'Giao tiếp Tiếng Anh 101','Tự tin nói tiếng Anh','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_eng.mp4',300000.00,7,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(39,'Kỹ năng Thuyết trình','Làm chủ sân khấu','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_pres.mp4',250000.00,8,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(40,'Đầu tư Chứng khoán F0','Kiến thức đầu tư cơ bản','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_stock.mp4',1000000.00,10,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(41,'Khóa học ReactJS Cơ bản','Học ReactJS từ con số 0','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_react.mp4',500000.00,1,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(42,'Khóa học Node.js Thực chiến','Xây dựng RESTful API','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_node.mp4',600000.00,1,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(43,'Lập trình Flutter','Làm app iOS và Android','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_flutter.mp4',700000.00,2,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(44,'Python Data Science','Phân tích dữ liệu với Python','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_python.mp4',800000.00,3,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(45,'Machine Learning A-Z','Thuật toán học máy','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_ml.mp4',900000.00,4,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(46,'Figma cho người mới','Thiết kế giao diện hiện đại','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_figma.mp4',400000.00,5,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(47,'Facebook Ads Mastery','Chạy quảng cáo thực chiến','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_fbads.mp4',550000.00,6,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(48,'Giao tiếp Tiếng Anh 101','Tự tin nói tiếng Anh','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_eng.mp4',300000.00,7,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(49,'Kỹ năng Thuyết trình','Làm chủ sân khấu','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_pres.mp4',250000.00,8,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(50,'Đầu tư Chứng khoán F0','Kiến thức đầu tư cơ bản','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_stock.mp4',1000000.00,10,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(51,'Khóa học ReactJS Cơ bản','Học ReactJS từ con số 0','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_react.mp4',500000.00,1,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(52,'Khóa học Node.js Thực chiến','Xây dựng RESTful API','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_node.mp4',600000.00,1,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(53,'Lập trình Flutter','Làm app iOS và Android','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_flutter.mp4',700000.00,2,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(54,'Python Data Science','Phân tích dữ liệu với Python','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_python.mp4',800000.00,3,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(55,'Machine Learning A-Z','Thuật toán học máy','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_ml.mp4',900000.00,4,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(56,'Figma cho người mới','Thiết kế giao diện hiện đại','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_figma.mp4',400000.00,5,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(57,'Facebook Ads Mastery','Chạy quảng cáo thực chiến','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_fbads.mp4',550000.00,6,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(58,'Giao tiếp Tiếng Anh 101','Tự tin nói tiếng Anh','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_eng.mp4',300000.00,7,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(59,'Kỹ năng Thuyết trình','Làm chủ sân khấu','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_pres.mp4',250000.00,8,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(60,'Đầu tư Chứng khoán F0','Kiến thức đầu tư cơ bản','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_stock.mp4',1000000.00,10,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(61,'Khóa học ReactJS Cơ bản','Học ReactJS từ con số 0','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_react.mp4',500000.00,1,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(62,'Khóa học Node.js Thực chiến','Xây dựng RESTful API','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_node.mp4',600000.00,1,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(63,'Lập trình Flutter','Làm app iOS và Android','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_flutter.mp4',700000.00,2,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(64,'Python Data Science','Phân tích dữ liệu với Python','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_python.mp4',800000.00,3,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(65,'Machine Learning A-Z','Thuật toán học máy','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_ml.mp4',900000.00,4,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(66,'Figma cho người mới','Thiết kế giao diện hiện đại','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_figma.mp4',400000.00,5,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(67,'Facebook Ads Mastery','Chạy quảng cáo thực chiến','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_fbads.mp4',550000.00,6,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(68,'Giao tiếp Tiếng Anh 101','Tự tin nói tiếng Anh','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_eng.mp4',300000.00,7,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(69,'Kỹ năng Thuyết trình','Làm chủ sân khấu','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_pres.mp4',250000.00,8,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(70,'Đầu tư Chứng khoán F0','Kiến thức đầu tư cơ bản','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_stock.mp4',1000000.00,10,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(71,'Khóa học ReactJS Cơ bản','Học ReactJS từ con số 0','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_react.mp4',500000.00,1,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(72,'Khóa học Node.js Thực chiến','Xây dựng RESTful API','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_node.mp4',600000.00,1,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(73,'Lập trình Flutter','Làm app iOS và Android','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_flutter.mp4',700000.00,2,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(74,'Python Data Science','Phân tích dữ liệu với Python','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_python.mp4',800000.00,3,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(75,'Machine Learning A-Z','Thuật toán học máy','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_ml.mp4',900000.00,4,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(76,'Figma cho người mới','Thiết kế giao diện hiện đại','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_figma.mp4',400000.00,5,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(77,'Facebook Ads Mastery','Chạy quảng cáo thực chiến','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_fbads.mp4',550000.00,6,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(78,'Giao tiếp Tiếng Anh 101','Tự tin nói tiếng Anh','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_eng.mp4',300000.00,7,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(79,'Kỹ năng Thuyết trình','Làm chủ sân khấu','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_pres.mp4',250000.00,8,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(80,'Đầu tư Chứng khoán F0','Kiến thức đầu tư cơ bản','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_stock.mp4',1000000.00,10,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(81,'Khóa học ReactJS Cơ bản','Học ReactJS từ con số 0','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_react.mp4',500000.00,1,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(82,'Khóa học Node.js Thực chiến','Xây dựng RESTful API','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_node.mp4',600000.00,1,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(83,'Lập trình Flutter','Làm app iOS và Android','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_flutter.mp4',700000.00,2,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(84,'Python Data Science','Phân tích dữ liệu với Python','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_python.mp4',800000.00,3,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(85,'Machine Learning A-Z','Thuật toán học máy','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_ml.mp4',900000.00,4,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(86,'Figma cho người mới','Thiết kế giao diện hiện đại','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_figma.mp4',400000.00,5,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(87,'Facebook Ads Mastery','Chạy quảng cáo thực chiến','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_fbads.mp4',550000.00,6,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(88,'Giao tiếp Tiếng Anh 101','Tự tin nói tiếng Anh','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_eng.mp4',300000.00,7,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(89,'Kỹ năng Thuyết trình','Làm chủ sân khấu','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_pres.mp4',250000.00,8,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(90,'Đầu tư Chứng khoán F0','Kiến thức đầu tư cơ bản','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_stock.mp4',1000000.00,10,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(91,'Khóa học ReactJS Cơ bản','Học ReactJS từ con số 0','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_react.mp4',500000.00,1,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(92,'Khóa học Node.js Thực chiến','Xây dựng RESTful API','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_node.mp4',600000.00,1,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(93,'Lập trình Flutter','Làm app iOS và Android','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_flutter.mp4',700000.00,2,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(94,'Python Data Science','Phân tích dữ liệu với Python','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_python.mp4',800000.00,3,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(95,'Machine Learning A-Z','Thuật toán học máy','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_ml.mp4',900000.00,4,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(96,'Figma cho người mới','Thiết kế giao diện hiện đại','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_figma.mp4',400000.00,5,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(97,'Facebook Ads Mastery','Chạy quảng cáo thực chiến','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_fbads.mp4',550000.00,6,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(98,'Giao tiếp Tiếng Anh 101','Tự tin nói tiếng Anh','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_eng.mp4',300000.00,7,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(99,'Kỹ năng Thuyết trình','Làm chủ sân khấu','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_pres.mp4',250000.00,8,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(100,'Đầu tư Chứng khoán F0','Kiến thức đầu tư cơ bản','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','intro_stock.mp4',1000000.00,10,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(107,'test patch',NULL,'https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg',NULL,100000.00,1,15,1,'2026-05-22 00:10:48','2026-05-26 10:33:42'),(109,'test hehe',NULL,NULL,NULL,1.00,1,15,1,'2026-05-22 17:33:48','2026-05-22 17:33:48'),(115,'test 123321',NULL,'https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg','https://res.cloudinary.com/dsc8rzpbg/video/upload/v1774930352/0_Teacher_Flowers_3840x2160_azcsmo.mp4',0.00,1,1,1,'2026-05-26 08:27:16','2026-05-26 08:27:16');
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollment`
--

DROP TABLE IF EXISTS `enrollment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `course_id` int NOT NULL,
  `status` enum('PENDING','ACTIVE','COMPLETED','DISABLED') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_student_course` (`student_id`,`course_id`),
  KEY `fk_enrollment_student_idx` (`student_id`),
  KEY `fk_enrollment_course_idx` (`course_id`),
  CONSTRAINT `fk_enrollment_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  CONSTRAINT `fk_enrollment_student` FOREIGN KEY (`student_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollment`
--

LOCK TABLES `enrollment` WRITE;
/*!40000 ALTER TABLE `enrollment` DISABLE KEYS */;
INSERT INTO `enrollment` VALUES (1,4,1,'ACTIVE','2026-04-04 14:07:01','2026-04-04 14:07:01'),(2,4,2,'COMPLETED','2026-04-04 14:07:01','2026-04-04 14:07:01'),(3,5,1,'ACTIVE','2026-04-04 14:07:01','2026-04-04 14:07:01'),(4,5,3,'ACTIVE','2026-04-04 14:07:01','2026-04-04 14:07:01'),(5,6,4,'ACTIVE','2026-04-04 14:07:01','2026-04-04 14:07:01'),(6,7,5,'ACTIVE','2026-04-04 14:07:01','2026-04-04 14:07:01'),(7,8,6,'COMPLETED','2026-04-04 14:07:01','2026-04-04 14:07:01'),(8,9,7,'ACTIVE','2026-04-04 14:07:01','2026-04-04 14:07:01'),(9,10,8,'ACTIVE','2026-04-04 14:07:01','2026-04-04 14:07:01'),(10,12,10,'ACTIVE','2026-04-04 14:07:01','2026-04-04 14:07:01'),(11,12,1,'ACTIVE','2026-04-04 14:07:01','2026-04-04 14:07:01'),(14,12,107,'PENDING','2026-05-26 10:33:47','2026-05-26 13:37:46');
/*!40000 ALTER TABLE `enrollment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lesson`
--

DROP TABLE IF EXISTS `lesson`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lesson` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `order` int NOT NULL,
  `content` text,
  `video` varchar(255) NOT NULL,
  `video_length` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `chapter_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_lesson_chapter_idx` (`chapter_id`),
  CONSTRAINT `fk_lesson_chapter` FOREIGN KEY (`chapter_id`) REFERENCES `chapter` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lesson`
--

LOCK TABLES `lesson` WRITE;
/*!40000 ALTER TABLE `lesson` DISABLE KEYS */;
INSERT INTO `lesson` VALUES (1,'ReactJS là gì?',1000,'Lý thuyết cơ bản về React','react_l1.mp4',600,'2026-04-04 14:07:01','2026-04-04 14:07:01',1),(2,'Cài đặt Create React App',2000,'Hướng dẫn setup project','react_l2.mp4',1200,'2026-04-04 14:07:01','2026-04-04 14:07:01',1),(3,'Tạo Component đầu tiên',1000,'Thực hành tạo Component','react_l3.mp4',900,'2026-04-04 14:07:01','2026-04-04 14:07:01',2),(4,'Truyền dữ liệu với Props',2000,'Thực hành Props','react_l4.mp4',1500,'2026-04-04 14:07:01','2026-04-04 14:07:01',2),(5,'Cài đặt Node.js',1000,'Hướng dẫn cài Node và NPM','node_l1.mp4',800,'2026-04-04 14:07:01','2026-04-04 14:07:01',3),(6,'Routing trong Express',1000,'Cách tạo API Endpoint','node_l2.mp4',1800,'2026-04-04 14:07:01','2026-04-04 14:07:01',4),(7,'Biến và Hàm trong Dart',1000,'Lý thuyết Dart','flutter_l1.mp4',1000,'2026-04-04 14:07:01','2026-04-04 14:07:01',5),(8,'Thao tác với Series',1000,'Pandas Series','python_l1.mp4',1100,'2026-04-04 14:07:01','2026-04-04 14:07:01',6),(9,'Simple Linear Regression',1000,'Hồi quy tuyến tính','ml_l1.mp4',2000,'2026-04-04 14:07:01','2026-04-04 14:07:01',7),(10,'Vẽ Vector và Shape',1000,'Công cụ thiết kế','figma_l1.mp4',1300,'2026-04-04 14:07:01','2026-04-04 14:07:01',8),(19,'test patch',1000,NULL,'https://pub-079983cd41a94046925da6f0ec4060bb.r2.dev/lessons/b355d4b1-64d6-4d0e-8018-23b6d042bf50.mp4',30,'2026-05-25 21:51:57','2026-05-25 22:59:54',22);
/*!40000 ALTER TABLE `lesson` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lesson_progress`
--

DROP TABLE IF EXISTS `lesson_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lesson_progress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `enrollment_id` int NOT NULL,
  `lesson_id` int NOT NULL,
  `watched_sec` int NOT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_enrollment_lesson` (`enrollment_id`,`lesson_id`),
  KEY `fk_lesson_progress_enrollment_idx` (`enrollment_id`),
  KEY `fk_lesson_progress_lesson_idx` (`lesson_id`),
  CONSTRAINT `fk_lesson_progress_enrollment` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollment` (`id`),
  CONSTRAINT `fk_lesson_progress_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `lesson` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lesson_progress`
--

LOCK TABLES `lesson_progress` WRITE;
/*!40000 ALTER TABLE `lesson_progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `lesson_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `enrollment_id` int NOT NULL,
  `usd_amount` decimal(19,2) NOT NULL DEFAULT '0.00',
  `vnd_amount` decimal(19,2) NOT NULL DEFAULT '0.00',
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT 'USD',
  `original_currency` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT 'VND',
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `paypal_order_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paypal_capture_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_payment_enrollment` (`enrollment_id`),
  CONSTRAINT `fk_payment_enrollment` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollment` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `course_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_student_course` (`student_id`,`course_id`),
  KEY `fk_review_student_idx` (`student_id`),
  KEY `fk_review_course_idx` (`course_id`),
  CONSTRAINT `fk_review_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  CONSTRAINT `fk_review_student` FOREIGN KEY (`student_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ADMIN','STUDENT','TEACHER') NOT NULL DEFAULT 'STUDENT',
  `first_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `last_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `email` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT 'https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774929819/image-removebg-preview_2_aydokw.png',
  `active` tinyint(1) DEFAULT '1',
  `verified` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'teacher01','hashed_pass_1','TEACHER','Nguyễn','Văn A','nguyenvana@gmail.com','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779015408/user_c0b6wf.png',1,1,'2026-04-04 14:07:01','2026-05-17 17:07:32'),(2,'teacher02','hashed_pass_2','TEACHER','Trần','Thị B','tranthib@gmail.com','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779015408/user_c0b6wf.png',1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(3,'teacher03','hashed_pass_3','TEACHER','Lê','Văn C','levanc@gmail.com','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779015408/user_c0b6wf.png',1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(4,'student01','hashed_pass_4','STUDENT','Phạm','Thị D','phamthid@gmail.com','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779015408/user_c0b6wf.png',1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(5,'student02','hashed_pass_5','STUDENT','Hoàng','Văn E','hoangvane@gmail.com','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779015408/user_c0b6wf.png',1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(6,'student03','hashed_pass_6','STUDENT','Đặng','Thị F','dangthif@gmail.com','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779015408/user_c0b6wf.png',1,0,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(7,'student04','hashed_pass_7','STUDENT','Bùi','Văn G','buivang@gmail.com','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779015408/user_c0b6wf.png',1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(8,'student05','hashed_pass_8','STUDENT','Đỗ','Thị H','dothih@gmail.com','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779015408/user_c0b6wf.png',1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(9,'student06','hashed_pass_9','STUDENT','Hồ','Văn I','hovani@gmail.com','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779015408/user_c0b6wf.png',1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(10,'student07','hashed_pass_10','STUDENT','Ngô','Thị K','ngothik@gmail.com','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779015408/user_c0b6wf.png',1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(11,'admin','$2a$10$XGBatnXuYS3iMMuoio/4/eoF.YxmrfKuAlm.0MDNS5bAyNDBci4he','ADMIN','Duc','Hai','hai@gmail.com','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779015408/user_c0b6wf.png',1,0,'2026-04-12 09:37:32','2026-04-12 09:37:32'),(12,'hau','$2a$10$2wiDlUlT3I7Hovmt4r6SZekD3/VsYNmNDkwuL74ohPm0DfBlTFzBS','STUDENT','Hau','Pham','hau@gmail.com','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779015408/user_c0b6wf.png',1,0,'2026-05-18 18:56:42','2026-05-18 19:01:12'),(14,'hau1','$2a$10$ZWvhJKGdt7WO8evjsUT.oe5B9YBaTsLjSkuf3gitm/CcMhV7WoHsa','STUDENT','Hau','Pham','hau@gmail.com','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779015408/user_c0b6wf.png',1,0,'2026-05-19 15:21:56','2026-05-19 15:21:56'),(15,'hai','$2a$10$VRIxlSZHbZoV7UbMV2K14OAhHSRfrSbjrMV1EjbJYqalWrULWKWEC','TEACHER','Hải','Mao Đức','hai@gmail.com','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779184726/wuofsdu9prnevwq1lpuc.webp',1,1,'2026-05-19 16:58:47','2026-05-19 16:58:47'),(16,'hai1','$2a$10$A5ZlCEWbpmUmaEu8Q7QuE.8R3mLCor0Dg1kr.hueP1EFt67kQRMMu','STUDENT','Duc','Hai','hai@gmail.com','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779015408/user_c0b6wf.png',1,0,'2026-05-19 17:16:42','2026-05-19 17:16:42'),(17,'hau2','$2a$10$/vdGtYSZy7Rd1MyEKOQN3ujlmr6xxkQYac97wyRAIWqBOCKNHJMda','STUDENT','Hau','Pham','hau@gmail.com','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779015408/user_c0b6wf.png',1,0,'2026-05-21 15:03:31','2026-05-21 15:03:31'),(18,'test','$2a$10$LaNnv.02x7L3MeV8AWet7eZg3R8zs/Ffgv2oPz48tzA9Ylcz9sgKe','STUDENT','Tester','Test','aaaaaa@gmail.com','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779015408/user_c0b6wf.png',1,0,'2026-05-21 15:22:11','2026-05-21 15:22:11'),(19,'hau3','$2a$10$vAlttQTH9ExgHWpBTRvfZ.2tl/sGCXDbKu4fn4kacKGeznci5Sl4e','STUDENT','Hậu','Phạm','hau@gmail.com','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779700454/eaggrjtkk65x1el2evf7.webp',1,0,'2026-05-25 16:14:15','2026-05-25 16:14:15'),(22,'admintest','$2a$10$0SwS1z6uP5zFQtz3y7E0PeYOf5B0inLGFv1gUkyGJLNj0kTXVglVO','ADMIN','Test','Admin123123','testadmin@gmail.com','https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779707119/vbqvgobe4gznbk7zphu2.png',1,0,'2026-05-25 17:42:18','2026-05-25 18:05:20');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-27 11:20:10
