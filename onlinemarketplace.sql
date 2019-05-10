-- MySQL dump 10.13  Distrib 5.7.26, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: onlinemarketplace
-- ------------------------------------------------------
-- Server version	5.7.26-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_order`
--

DROP TABLE IF EXISTS `_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `orderDate` date NOT NULL,
  `total` float NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `money` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `_order_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_order`
--

LOCK TABLES `_order` WRITE;
/*!40000 ALTER TABLE `_order` DISABLE KEYS */;
INSERT INTO `_order` VALUES (6,21,'2019-03-04',53.7,0,NULL),(7,21,'2019-03-06',17.9,0,NULL),(8,21,'2019-04-20',12.1,0,NULL),(9,21,'2019-04-20',18.7,0,NULL),(10,21,'2019-04-20',22.6,0,NULL),(11,32,'2019-04-24',113.22,0,NULL);
/*!40000 ALTER TABLE `_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Categoria 1'),(2,'Categoria 2'),(3,'Categoria 3'),(4,'Categoria 4'),(5,'Categoria 5'),(6,'Categoria 6'),(7,'Categoria 7'),(8,'Categoria 8'),(9,'Categoria 9'),(10,'Categoria 10'),(11,'Categoria 11'),(16,'Categoria 12');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client`
--

DROP TABLE IF EXISTS `client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client` (
  `address` varchar(500) NOT NULL,
  `add_number` int(11) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  KEY `user_id` (`user_id`),
  CONSTRAINT `client_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client`
--

LOCK TABLES `client` WRITE;
/*!40000 ALTER TABLE `client` DISABLE KEYS */;
INSERT INTO `client` VALUES ('Av. Lagoa Central',330,'85-7756-3738',21,'Fulane Bastos'),('Rua dos Patos Brancos',334,'85-15467-9087',32,'Cicrano Pereira do Nascimento ');
/*!40000 ALTER TABLE `client` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `productId` int(11) NOT NULL,
  `price` float NOT NULL,
  `quantity` int(11) NOT NULL,
  `subtotal` float NOT NULL,
  `orderId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  KEY `orderId` (`orderId`),
  CONSTRAINT `item_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `product` (`id`),
  CONSTRAINT `item_ibfk_2` FOREIGN KEY (`orderId`) REFERENCES `_order` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` VALUES (10,14,5.6,3,16.8,6),(11,16,6.5,3,19.5,6),(12,17,5.8,3,17.4,6),(13,14,5.6,1,5.6,7),(14,16,6.5,1,6.5,7),(15,17,5.8,1,5.8,7),(16,14,5.6,1,5.6,8),(17,16,6.5,1,6.5,8),(18,20,5.8,1,5.8,9),(19,21,12.9,1,12.9,9),(20,36,5.8,1,5.8,10),(21,37,3.9,1,3.9,10),(22,38,12.9,1,12.9,10),(23,16,6.5,3,19.5,11),(24,26,23.43,4,93.72,11);
/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `category` int(11) NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `stock` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `category` (`category`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`category`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (14,'Produto 1','Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Suspendisse potenti.',1,5.60,'1554286552617_Product.jpg',0),(16,'Product 2 ','Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Suspendisse potenti.',7,6.50,'1554286897868_Product.jpg',0),(17,'Produto 3','Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Suspendisse potenti.',6,5.80,'1554286919657_Product.jpg',0),(18,'Produto 4','Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Suspendisse potenti.',8,4.50,'1554286952465_Product.jpg',0),(19,'Produto 5','Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Suspendisse potenti.',8,6.50,'1554286980076_Product.jpg',0),(20,'Produto 6','Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Suspendisse potenti.',8,5.80,'1554287002182_Product.jpg',0),(21,'Produto 7','Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Suspendisse potenti.',8,12.90,'1554287022166_Product.jpg',0),(22,'Produto 8','Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Suspendisse potenti.',9,5.80,'1554287043899_Product.jpg',0),(23,'Produto 9','Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Suspendisse potenti.',10,4.50,'1554287067008_Product.jpg',0),(24,'Produto 10','Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Suspendisse potenti.',8,6.50,'1554287088160_Product.jpg',0),(25,'Produto 11','Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Suspendisse potenti.',8,5.80,'1554287110207_Product.jpg',0),(26,'Produto 12','Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Suspendisse potenti.',8,23.43,'1554287130384_Product.jpg',0),(27,'Produto 13','Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Suspendisse potenti.',6,5.80,'1554287151627_Product.jpg',0),(28,'Produto 14','Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Suspendisse potenti.',11,5.80,'1554541645569_Product.jpg',0),(29,'Produto 15','Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Suspendisse potenti.',9,6.50,'1554541677095_Product.jpg',0),(30,'Produto 16','Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Suspendisse potenti.',9,6.50,'1554541705613_Product.jpg',0),(31,'Produto 16','Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Suspendisse potenti.',6,4.50,'1554541730992_Product.jpg',0),(32,'Produto 17','Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Suspendisse potenti.',9,6.50,'1554541756125_Product.jpg',0),(33,'Produto 18','Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Suspendisse potenti.',9,12.90,'1554541782850_Product.jpg',0),(34,'Produto 19','Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Suspendisse potenti.',3,5.60,'1554541810127_Product.jpg',0),(35,'Produto 20','Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Suspendisse potenti.',3,6.50,'1554541852665_Product.jpg',0),(36,'Produto 21','Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Suspendisse potenti.',7,5.80,'1554541881336_Product.jpg',0),(37,'Produto 22','Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Suspendisse potenti.',1,3.90,'1554541917272_Product.jpg',0),(38,'Produto 23','Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Suspendisse potenti.',1,12.90,'1554541957694_Product.jpg',0),(39,'Produto 24','Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Suspendisse potenti.',7,5.60,'1554541984513_Product.jpg',0);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('CvbZtHIVSnglGYKEpZfZoyTPtrUwZVJp',1557595001,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"message\":\"\",\"error\":\"\",\"user\":{\"id\":1,\"email\":\"admin@email.com\",\"password\":\"453231\",\"image\":\"1554230246449_user-male.png\",\"admin\":1},\"loged\":true,\"orderImpress\":{\"items\":[{\"price\":5.6,\"quantity\":1,\"subtotal\":5.6,\"productName\":\"Produto 1\"},{\"price\":6.5,\"quantity\":1,\"subtotal\":6.5,\"productName\":\"Product 2 \"},{\"price\":5.8,\"quantity\":1,\"subtotal\":5.8,\"productName\":\"Produto 3\"}],\"order\":{\"orderId\":7,\"date\":\"2019-03-06T03:00:00.000Z\",\"total\":17.9,\"status\":0,\"money\":null,\"userId\":21,\"userEmail\":\"fulane@email.com\",\"address\":\"Av. Lagoa Central\",\"number\":330,\"phone\":\"85-7756-3738\",\"clientName\":\"Fulane Bastos\"}}}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `image` varchar(1000) DEFAULT NULL,
  `admin` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin@email.com','453231','1554230246449_user-male.png',1),(21,'fulane@email.com','fu123','1555066605070_user-female.jpeg',0),(32,'cicrano@email.com','ci123','1556106629398_client_user.png',0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'onlinemarketplace'
--

--
-- Dumping routines for database 'onlinemarketplace'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-05-10 14:18:09
