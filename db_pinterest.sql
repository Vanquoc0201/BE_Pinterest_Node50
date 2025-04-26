CREATE TABLE `TABLE_TEMPLATE` (
	`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT, -- mặc định luôn luôn có
	
	
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP  NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
CREATE TABLE `Users` (
	`userId` INT PRIMARY KEY NOT NULL AUTO_INCREMENT, -- mặc định luôn luôn có
	 `email` VARCHAR(100) UNIQUE NOT NULL,
	 `password` VARCHAR(255) NOT NULL,
	 `hoTen` VARCHAR(100) NOT NULL,
	 `avatar` VARCHAR(255) DEFAULT NULL,
	
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP  NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
DROP TABLE `Users`
CREATE TABLE `Comments` (
	`commentId` INT PRIMARY KEY NOT NULL AUTO_INCREMENT, -- mặc định luôn luôn có
	`userId` INT NOT NULL,
	`imageId` INT NOT NULL,
	`dateComment` DATE NOT NULL,
	`content` VARCHAR(500),
	FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`),
	FOREIGN KEY (`imageId`) REFERENCES `Images`(`imageId`),	

	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP  NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
CREATE TABLE `Images` (
	`imageId` INT PRIMARY KEY NOT NULL AUTO_INCREMENT, -- mặc định luôn luôn có
	`imageName` VARCHAR(200) NOT NULL,
	`imageLink` VARCHAR(500) NOT NULL,
	`description` VARCHAR(500) ,
	`userId` INT NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`),
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP  NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
CREATE TABLE `Saves` (
	`userId` INT NOT NULL , -- mặc định luôn luôn có
	`imageId` INT NOT NULL,
	`dateSave` DATE NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`),
	FOREIGN KEY (`imageId`) REFERENCES `Images`(`imageId`),	

	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP  NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
CREATE TABLE `Likes` (
	`likeId` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	`userId` INT NOT NULL , 
	`imageId` INT NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`),
	FOREIGN KEY (`imageId`) REFERENCES `Images`(`imageId`),	

	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP  NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	-- Đảm bảo user chỉ like 1 ảnh 1 lần
  UNIQUE KEY `unique_user_image` (`userId`, `imageId`)
)