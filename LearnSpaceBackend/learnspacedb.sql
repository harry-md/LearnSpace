-- MySQL dump 10.13  Distrib 8.4.8, for Linux (x86_64)
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

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '00546850-b2fe-11f0-8147-f26f4349a4ff:1-4165';

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
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Lập trình Web'),(2,'Lập trình Di động'),(3,'Khoa học Dữ liệu'),(4,'Trí tuệ Nhân tạo'),(5,'Thiết kế UI/UX'),(6,'Marketing Online'),(7,'Ngoại ngữ - Tiếng Anh'),(8,'Kỹ năng mềm'),(9,'Quản trị Kinh doanh'),(10,'Tài chính Cá nhân');
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
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_chapter_course_idx` (`course_id`),
  CONSTRAINT `fk_chapter_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chapter`
--

LOCK TABLES `chapter` WRITE;
/*!40000 ALTER TABLE `chapter` DISABLE KEYS */;
INSERT INTO `chapter` VALUES (1,'Chương 1: Giới thiệu ReactJS',1,1,1,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(2,'Chương 2: Components & Props',2,0,1,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(3,'Chương 1: Setup Môi trường Node',1,1,2,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(4,'Chương 2: Express Framework',2,0,2,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(5,'Chương 1: Dart Cơ bản',1,1,3,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(6,'Chương 1: Pandas và Numpy',1,1,4,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(7,'Chương 1: Regression Models',1,0,5,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(8,'Chương 1: Các công cụ trong Figma',1,1,6,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(9,'Chương 1: Setup Tài khoản Quảng cáo',1,1,7,'2026-04-04 08:58:37','2026-04-04 08:58:37'),(10,'Chương 1: Phát âm cơ bản',1,1,8,'2026-04-04 08:58:37','2026-04-04 08:58:37');
/*!40000 ALTER TABLE `chapter` ENABLE KEYS */;
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
  `price` decimal(19,2) NOT NULL DEFAULT '0.00',
  `category_id` int NOT NULL,
  `teacher_id` int NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_course_teacher_idx` (`teacher_id`),
  KEY `fk_course_category` (`category_id`),
  CONSTRAINT `fk_course_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  CONSTRAINT `fk_course_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (1,'Khóa học ReactJS Cơ bản','Học ReactJS từ con số 0','react_img.jpg','intro_react.mp4',500000.00,1,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(2,'Khóa học Node.js Thực chiến','Xây dựng RESTful API','node_img.jpg','intro_node.mp4',600000.00,1,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(3,'Lập trình Flutter','Làm app iOS và Android','flutter_img.jpg','intro_flutter.mp4',700000.00,2,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(4,'Python Data Science','Phân tích dữ liệu với Python','python_img.jpg','intro_python.mp4',800000.00,3,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(5,'Machine Learning A-Z','Thuật toán học máy','ml_img.jpg','intro_ml.mp4',900000.00,4,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(6,'Figma cho người mới','Thiết kế giao diện hiện đại','figma_img.jpg','intro_figma.mp4',400000.00,5,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(7,'Facebook Ads Mastery','Chạy quảng cáo thực chiến','fbads_img.jpg','intro_fbads.mp4',550000.00,6,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(8,'Giao tiếp Tiếng Anh 101','Tự tin nói tiếng Anh','english_img.jpg','intro_eng.mp4',300000.00,7,2,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(9,'Kỹ năng Thuyết trình','Làm chủ sân khấu','presentation_img.jpg','intro_pres.mp4',250000.00,8,3,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(10,'Đầu tư Chứng khoán F0','Kiến thức đầu tư cơ bản','stock_img.jpg','intro_stock.mp4',1000000.00,10,1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01');
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
  `status` enum('PENDING','ACTIVE','COMPLETED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_enrollment_student_idx` (`student_id`),
  KEY `fk_enrollment_course_idx` (`course_id`),
  CONSTRAINT `fk_enrollment_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  CONSTRAINT `fk_enrollment_student` FOREIGN KEY (`student_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollment`
--

LOCK TABLES `enrollment` WRITE;
/*!40000 ALTER TABLE `enrollment` DISABLE KEYS */;
INSERT INTO `enrollment` VALUES (1,4,1,'ACTIVE','2026-04-04 14:07:01','2026-04-04 14:07:01'),(2,4,2,'COMPLETED','2026-04-04 14:07:01','2026-04-04 14:07:01'),(3,5,1,'ACTIVE','2026-04-04 14:07:01','2026-04-04 14:07:01'),(4,5,3,'ACTIVE','2026-04-04 14:07:01','2026-04-04 14:07:01'),(5,6,4,'ACTIVE','2026-04-04 14:07:01','2026-04-04 14:07:01'),(6,7,5,'ACTIVE','2026-04-04 14:07:01','2026-04-04 14:07:01'),(7,8,6,'COMPLETED','2026-04-04 14:07:01','2026-04-04 14:07:01'),(8,9,7,'ACTIVE','2026-04-04 14:07:01','2026-04-04 14:07:01'),(9,10,8,'ACTIVE','2026-04-04 14:07:01','2026-04-04 14:07:01'),(10,10,10,'ACTIVE','2026-04-04 14:07:01','2026-04-04 14:07:01');
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
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `chapter_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_lesson_chapter_idx` (`chapter_id`),
  CONSTRAINT `fk_lesson_chapter` FOREIGN KEY (`chapter_id`) REFERENCES `chapter` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lesson`
--

LOCK TABLES `lesson` WRITE;
/*!40000 ALTER TABLE `lesson` DISABLE KEYS */;
INSERT INTO `lesson` VALUES (1,'ReactJS là gì?',1,'Lý thuyết cơ bản về React','react_l1.mp4',600,'2026-04-04 14:07:01','2026-04-04 14:07:01',1),(2,'Cài đặt Create React App',2,'Hướng dẫn setup project','react_l2.mp4',1200,'2026-04-04 14:07:01','2026-04-04 14:07:01',1),(3,'Tạo Component đầu tiên',1,'Thực hành tạo Component','react_l3.mp4',900,'2026-04-04 14:07:01','2026-04-04 14:07:01',2),(4,'Truyền dữ liệu với Props',2,'Thực hành Props','react_l4.mp4',1500,'2026-04-04 14:07:01','2026-04-04 14:07:01',2),(5,'Cài đặt Node.js',1,'Hướng dẫn cài Node và NPM','node_l1.mp4',800,'2026-04-04 14:07:01','2026-04-04 14:07:01',3),(6,'Routing trong Express',1,'Cách tạo API Endpoint','node_l2.mp4',1800,'2026-04-04 14:07:01','2026-04-04 14:07:01',4),(7,'Biến và Hàm trong Dart',1,'Lý thuyết Dart','flutter_l1.mp4',1000,'2026-04-04 14:07:01','2026-04-04 14:07:01',5),(8,'Thao tác với Series',1,'Pandas Series','python_l1.mp4',1100,'2026-04-04 14:07:01','2026-04-04 14:07:01',6),(9,'Simple Linear Regression',1,'Hồi quy tuyến tính','ml_l1.mp4',2000,'2026-04-04 14:07:01','2026-04-04 14:07:01',7),(10,'Vẽ Vector và Shape',1,'Công cụ thiết kế','figma_l1.mp4',1300,'2026-04-04 14:07:01','2026-04-04 14:07:01',8);
/*!40000 ALTER TABLE `lesson` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `course_id` int NOT NULL,
  `amount` decimal(19,2) NOT NULL DEFAULT '0.00',
  `status` enum('PENDING','COMPLETED','CANCELLED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `vnp_txn_ref` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_payment_student_idx` (`student_id`),
  KEY `fk_payment_course_idx` (`course_id`),
  CONSTRAINT `fk_payment_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  CONSTRAINT `fk_payment_student` FOREIGN KEY (`student_id`) REFERENCES `user` (`id`)
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
  `email` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT 'https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774929819/image-removebg-preview_2_aydokw.png',
  `active` tinyint(1) DEFAULT '1',
  `verified` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'teacher01','hashed_pass_1','TEACHER','Nguyễn','Văn A','nguyenvana@gmail.com','avatar1.jpg',1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(2,'teacher02','hashed_pass_2','TEACHER','Trần','Thị B','tranthib@gmail.com','avatar2.jpg',1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(3,'teacher03','hashed_pass_3','TEACHER','Lê','Văn C','levanc@gmail.com','avatar3.jpg',1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(4,'student01','hashed_pass_4','STUDENT','Phạm','Thị D','phamthid@gmail.com','avatar4.jpg',1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(5,'student02','hashed_pass_5','STUDENT','Hoàng','Văn E','hoangvane@gmail.com','avatar5.jpg',1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(6,'student03','hashed_pass_6','STUDENT','Đặng','Thị F','dangthif@gmail.com','avatar6.jpg',1,0,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(7,'student04','hashed_pass_7','STUDENT','Bùi','Văn G','buivang@gmail.com','avatar7.jpg',1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(8,'student05','hashed_pass_8','STUDENT','Đỗ','Thị H','dothih@gmail.com','avatar8.jpg',1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(9,'student06','hashed_pass_9','STUDENT','Hồ','Văn I','hovani@gmail.com','avatar9.jpg',1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01'),(10,'student07','hashed_pass_10','STUDENT','Ngô','Thị K','ngothik@gmail.com','avatar10.jpg',1,1,'2026-04-04 14:07:01','2026-04-04 14:07:01');
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

-- Dump completed on 2026-04-04 16:32:38
