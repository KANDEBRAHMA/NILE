--This is used to create database.
create database NILE;

--This table is used to store details of users.
CREATE TABLE `NILE`.`USERS` (
  `FirstName` VARCHAR(45) NOT NULL,
  `LastName` VARCHAR(45) NOT NULL,
  `Username` VARCHAR(45) NOT NULL,
  `Password` VARCHAR(45) NOT NULL,
  `Role` VARCHAR(10) NOT NULL,
  `TimeStamp` DATETIME NULL,
  `UserId` VARCHAR(10) NOT NULL,
  `SecurityQuestion` VARCHAR(100) NOT NULL,
  `Answer` VARCHAR(30) NOT NULL,
  `ProfilePic` LONGTEXT ,
  PRIMARY KEY (`Username`, `UserId`),
  UNIQUE INDEX `Username_UNIQUE` (`Username` ASC) VISIBLE,
  UNIQUE INDEX `UserId_UNIQUE` (`UserId` ASC) VISIBLE);
  

--This is used to store admin details.
CREATE TABLE `NILE`.`AdminDetails` (
  `username` VARCHAR(20) NOT NULL,
  `userid` VARCHAR(20) NULL,
  `FirstName` VARCHAR(45) NULL,
  `LastName` VARCHAR(45) NULL,
  `Role` VARCHAR(10) NULL,
  `Verified` VARCHAR(10) NULL,
  PRIMARY KEY (`username`));
  
ALTER TABLE `NILE`.`AdminDetails` 
ADD CONSTRAINT `username`
  FOREIGN KEY (`username`)
  REFERENCES `NILE`.`USERS` (`Username`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
  
--This is the trigger which inserts all the new admins registered into this table.
DROP TRIGGER IF EXISTS `NILE`.`USERS_AFTER_INSERT`;

DELIMITER $$
USE `NILE`$$
CREATE DEFINER = CURRENT_USER TRIGGER `NILE`.`USERS_AFTER_INSERT` AFTER INSERT ON `USERS` FOR EACH ROW
BEGIN
	IF NEW.role = 'admin' OR NEW.role="Admin" OR NEW.role = "ADMIN" THEN
		INSERT INTO NILE.AdminDetails(username,userid,FirstName,LastName,Role,verified) Values(NEW.username,NEW.userid,NEW.FirstName,NEW.LastName,NEW.Role,NULL);
	END IF;
END$$
DELIMITER ;

CREATE TABLE `NILE`.`Employees` (
  `FullName` VARCHAR(50) NOT NULL,
  `Role` VARCHAR(10) NULL,
  PRIMARY KEY (`FullName`));

ALTER TABLE `NILE`.`Employees` 
ADD COLUMN `Available` VARCHAR(45) NULL AFTER `Role`,
ADD COLUMN `email` VARCHAR(45) NULL AFTER `Availble`;

CREATE TABLE `NILE`.`Deliveryservices` (
  `ServiceName` VARCHAR(50) NOT NULL,
  `Price` INT NULL,
  `Duration` VARCHAR(20) NULL,
  `Description` LONGTEXT NULL,
  `Picture` LONGTEXT NULL,
  PRIMARY KEY (`ServiceName`));


ALTER TABLE `NILE`.`Orders` 
ADD COLUMN `Status` VARCHAR(45) NULL AFTER `DestinationAddress`;