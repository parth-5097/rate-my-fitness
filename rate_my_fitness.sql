-- Adminer 4.7.7 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `blogs`;
CREATE TABLE `blogs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` int(11) NOT NULL,
  `title` char(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `blog_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0' COMMENT '0 - active, 1- deactive, 2 - deleted',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `title_index` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `blogs` (`id`, `type`, `title`, `description`, `blog_image`, `status`, `created_at`, `updated_at`) VALUES
(1,	1,	'Michael Crump #freemike-crump',	'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su',	'upload/90976-blog-gym-1.png',	1,	'2020-11-10 12:35:48',	'2020-11-12 08:57:30'),
(2,	1,	'Michael Crump #freemike-crump',	'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su',	'upload/18406-blog-gym-2.png',	1,	'2020-11-10 12:54:45',	'2020-11-12 08:57:31'),
(3,	3,	'Michael Crump #freemike-crump',	'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,',	'upload/55635-blog-gym-3.png',	1,	'2020-11-11 04:59:08',	'2020-11-12 08:58:45'),
(4,	2,	'Michael Crump #freemike-crump',	'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,',	'upload/23108-blog-gym-4.png',	1,	'2020-11-11 04:59:24',	'2020-11-12 08:57:36'),
(5,	3,	'Michael Crump #freemike-crump',	'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,',	'upload/89522-blog-gym-5.png',	1,	'2020-11-11 04:59:37',	'2020-11-12 08:57:38')
ON DUPLICATE KEY UPDATE `id` = VALUES(`id`), `type` = VALUES(`type`), `title` = VALUES(`title`), `description` = VALUES(`description`), `blog_image` = VALUES(`blog_image`), `status` = VALUES(`status`), `created_at` = VALUES(`created_at`), `updated_at` = VALUES(`updated_at`);

DROP TABLE IF EXISTS `contact_us`;
CREATE TABLE `contact_us` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(255) NOT NULL,
  `email` char(45) NOT NULL,
  `phone` char(15) NOT NULL,
  `subject` char(45) NOT NULL,
  `message` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `contact_us` (`id`, `name`, `email`, `phone`, `subject`, `message`, `created_at`) VALUES
(1,	'Nikunj Hapani',	'nikunj@rentechdigital.com',	'7567793250',	'please contact',	'hii how are you ?',	'2020-11-12 10:13:55')
ON DUPLICATE KEY UPDATE `id` = VALUES(`id`), `name` = VALUES(`name`), `email` = VALUES(`email`), `phone` = VALUES(`phone`), `subject` = VALUES(`subject`), `message` = VALUES(`message`), `created_at` = VALUES(`created_at`);

DROP TABLE IF EXISTS `exercises`;
CREATE TABLE `exercises` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(55) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `name_index` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `exercises` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1,	'exercises one',	'2020-11-12 11:40:38',	'2020-11-12 11:40:38'),
(2,	'exercises two',	'2020-11-12 11:40:59',	'2020-11-12 11:40:59'),
(3,	'exercises three',	'2020-11-12 11:41:14',	'2020-11-12 11:41:14'),
(4,	'exercises four',	'2020-11-12 11:41:23',	'2020-11-12 11:41:23')
ON DUPLICATE KEY UPDATE `id` = VALUES(`id`), `name` = VALUES(`name`), `created_at` = VALUES(`created_at`), `updated_at` = VALUES(`updated_at`);

DROP TABLE IF EXISTS `gym`;
CREATE TABLE `gym` (
  `gym_id` int(11) NOT NULL AUTO_INCREMENT,
  `gym_avatar` varchar(255) DEFAULT NULL,
  `gym_name` char(45) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `street_address` char(45) NOT NULL,
  `suite_number` char(10) DEFAULT NULL,
  `city` char(45) NOT NULL,
  `state` char(45) NOT NULL,
  `country` char(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `zipcode` int(6) NOT NULL,
  `phone` char(15) NOT NULL,
  `status` tinyint(1) DEFAULT '0',
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`gym_id`),
  KEY `gym_name_index` (`gym_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `gym` (`gym_id`, `gym_avatar`, `gym_name`, `description`, `street_address`, `suite_number`, `city`, `state`, `country`, `zipcode`, `phone`, `status`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1,	'upload/81349-gym-detail-pic-1.png',	'Crunch Fitness',	'About',	' William St',	'151',	'New York',	'NY',	'United States',	10038,	'6904821520',	1,	0,	'2020-11-10 08:40:27',	'2020-11-10 13:34:43')
ON DUPLICATE KEY UPDATE `gym_id` = VALUES(`gym_id`), `gym_avatar` = VALUES(`gym_avatar`), `gym_name` = VALUES(`gym_name`), `description` = VALUES(`description`), `street_address` = VALUES(`street_address`), `suite_number` = VALUES(`suite_number`), `city` = VALUES(`city`), `state` = VALUES(`state`), `country` = VALUES(`country`), `zipcode` = VALUES(`zipcode`), `phone` = VALUES(`phone`), `status` = VALUES(`status`), `is_deleted` = VALUES(`is_deleted`), `created_at` = VALUES(`created_at`), `updated_at` = VALUES(`updated_at`);

DROP TABLE IF EXISTS `gym_feedbacks`;
CREATE TABLE `gym_feedbacks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gym_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `safety` tinyint(1) NOT NULL,
  `location` tinyint(1) NOT NULL,
  `food` tinyint(1) NOT NULL,
  `opportunities` tinyint(1) NOT NULL,
  `happyness` tinyint(1) NOT NULL,
  `facilities` tinyint(1) NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT '0' COMMENT '0 - Not Deleted, 1- Deleted',
  PRIMARY KEY (`id`),
  KEY `gym_fk_idx` (`gym_id`),
  CONSTRAINT `gym_fk` FOREIGN KEY (`gym_id`) REFERENCES `gym` (`gym_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `gym_media`;
CREATE TABLE `gym_media` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file` varchar(255) NOT NULL,
  `create_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` char(20) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `RoleNameIndex` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `roles` (`id`, `role_name`, `created_at`, `updated_at`) VALUES
(1,	'admin',	'2020-11-09 04:50:35',	'2020-11-09 04:50:35'),
(2,	'user',	'2020-11-09 04:51:03',	'2020-11-09 04:51:03'),
(3,	'trainer',	'2020-11-09 04:51:29',	'2020-11-09 04:51:29')
ON DUPLICATE KEY UPDATE `id` = VALUES(`id`), `role_name` = VALUES(`role_name`), `created_at` = VALUES(`created_at`), `updated_at` = VALUES(`updated_at`);

DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags` (
  `tag_id` int(11) NOT NULL AUTO_INCREMENT,
  `tag_name` varchar(255) NOT NULL,
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `tags` (`tag_id`, `tag_name`) VALUES
(1,	'GIVES GOOD FEEDBACK'),
(2,	'RESPECTED'),
(3,	'CARING'),
(4,	'INSPIRATIONAL'),
(5,	'CARDIO'),
(6,	'STRENGTH'),
(7,	'DEDICATION'),
(8,	'RECOVER'),
(9,	'GYMLIFE'),
(10,	'TRAINHARD'),
(11,	'MOTIVATION'),
(12,	'TRAIN')
ON DUPLICATE KEY UPDATE `tag_id` = VALUES(`tag_id`), `tag_name` = VALUES(`tag_name`);

DROP TABLE IF EXISTS `trainer_feedbacks`;
CREATE TABLE `trainer_feedbacks` (
  `trainer_feedback_id` int(11) NOT NULL AUTO_INCREMENT,
  `trainer_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `exercise_id` int(11) NOT NULL,
  `trainer_rate` int(5) NOT NULL COMMENT 'rate 5 stars',
  `level_of_difficulty` int(5) DEFAULT NULL,
  `is_online_training` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0- Online training, 1- Offline training',
  `will_take_training_again` tinyint(1) NOT NULL COMMENT '0 - No,1 - Yes',
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `tags` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `feedback_created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`trainer_feedback_id`),
  KEY `excercise_fk_idx` (`exercise_id`),
  CONSTRAINT `excercise_fk` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `trainer_feedbacks` (`trainer_feedback_id`, `trainer_id`, `user_id`, `exercise_id`, `trainer_rate`, `level_of_difficulty`, `is_online_training`, `will_take_training_again`, `comment`, `tags`, `feedback_created_at`) VALUES
(6,	5,	7,	1,	3,	2,	1,	1,	'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',	'1,2,3,4,5',	'2020-11-12 11:45:47'),
(7,	8,	7,	2,	3,	4,	1,	1,	'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of scrambled it to make a type specimen book.',	'1,3,4,6,7,8',	'2020-11-12 12:38:34'),
(8,	6,	7,	1,	5,	2,	1,	1,	'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',	'1,2,3,4,5',	'2020-11-18 08:19:34'),
(9,	7,	7,	1,	2,	5,	0,	1,	'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the',	'2,5',	'2020-11-19 07:02:30'),
(10,	5,	19,	2,	5,	4,	0,	1,	'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the',	'1,2,4,6',	'2020-11-19 09:00:45'),
(11,	10,	7,	1,	2,	2,	0,	1,	'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockup',	'3,5',	'2020-11-19 13:27:08')
ON DUPLICATE KEY UPDATE `trainer_feedback_id` = VALUES(`trainer_feedback_id`), `trainer_id` = VALUES(`trainer_id`), `user_id` = VALUES(`user_id`), `exercise_id` = VALUES(`exercise_id`), `trainer_rate` = VALUES(`trainer_rate`), `level_of_difficulty` = VALUES(`level_of_difficulty`), `is_online_training` = VALUES(`is_online_training`), `will_take_training_again` = VALUES(`will_take_training_again`), `comment` = VALUES(`comment`), `tags` = VALUES(`tags`), `feedback_created_at` = VALUES(`feedback_created_at`);

DROP TABLE IF EXISTS `trainers`;
CREATE TABLE `trainers` (
  `trainer_id` int(11) NOT NULL AUTO_INCREMENT,
  `gym_id` int(11) DEFAULT NULL,
  `first_name` char(45) NOT NULL,
  `last_name` char(45) NOT NULL,
  `email` char(45) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `rating` int(5) NOT NULL DEFAULT '0',
  `about` text,
  `auth_token` text,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`trainer_id`),
  KEY `gym_id` (`gym_id`),
  CONSTRAINT `trainers_ibfk_1` FOREIGN KEY (`gym_id`) REFERENCES `gym` (`gym_id`),
  CONSTRAINT `trainers_ibfk_2` FOREIGN KEY (`gym_id`) REFERENCES `gym` (`gym_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `trainers` (`trainer_id`, `gym_id`, `first_name`, `last_name`, `email`, `password`, `phone`, `avatar`, `rating`, `about`, `auth_token`, `is_active`, `created_at`, `updated_at`) VALUES
(5,	1,	'arjun',	'patel',	'arjun@rentechdigital.com',	NULL,	'7567793250',	'upload/71705-trainer-pic-1.png',	4,	'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',	NULL,	1,	'2020-11-12 06:36:41',	'2020-11-19 09:00:46'),
(6,	1,	'dhaval',	'patel',	'dhaval@gmail.com',	NULL,	'7567793250',	'upload/80171-trainer-pic-1.png',	5,	'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',	NULL,	1,	'2020-11-12 06:43:38',	'2020-11-19 07:01:26'),
(7,	1,	'vivek',	'patel',	'vivek@gmail.com',	NULL,	'7567793250',	'upload/69836-trainer-pic-1.png',	2,	'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',	NULL,	1,	'2020-11-12 06:44:36',	'2020-11-19 07:02:31'),
(8,	1,	'manthan',	'patel',	'manthan@gmail.com',	NULL,	'7567793250',	'upload/59641-trainer-pic-1.png',	3,	'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',	NULL,	1,	'2020-11-12 06:54:38',	'2020-11-19 07:03:15'),
(10,	1,	'himanshu',	'patel',	'trainer@gmail.com',	'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',	'7567793250',	NULL,	5,	'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,',	NULL,	1,	'2020-11-19 12:43:09',	'2020-11-20 09:13:34')
ON DUPLICATE KEY UPDATE `trainer_id` = VALUES(`trainer_id`), `gym_id` = VALUES(`gym_id`), `first_name` = VALUES(`first_name`), `last_name` = VALUES(`last_name`), `email` = VALUES(`email`), `password` = VALUES(`password`), `phone` = VALUES(`phone`), `avatar` = VALUES(`avatar`), `rating` = VALUES(`rating`), `about` = VALUES(`about`), `auth_token` = VALUES(`auth_token`), `is_active` = VALUES(`is_active`), `created_at` = VALUES(`created_at`), `updated_at` = VALUES(`updated_at`);

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) NOT NULL,
  `first_name` char(45) NOT NULL,
  `last_name` char(45) NOT NULL,
  `email` char(45) NOT NULL,
  `password` text NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `auth_token` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `is_active` tinyint(1) DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_email_phone` (`email`,`phone`) /*!80000 INVISIBLE */,
  KEY `role_id_foreign_key_idx` (`role_id`),
  KEY `user_index` (`first_name`,`last_name`,`email`) /*!80000 INVISIBLE */,
  CONSTRAINT `role_id_foreign_key` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`id`, `role_id`, `first_name`, `last_name`, `email`, `password`, `phone`, `avatar`, `auth_token`, `is_active`, `created_at`, `updated_at`) VALUES
(1,	1,	'John',	'Doe',	'admin@gmail.com',	'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',	'1244585245',	'',	'6595',	1,	'2020-11-09 04:52:26',	'2020-11-10 04:40:45'),
(4,	2,	'Nikunj',	'Hapani',	'nikunj1@rentechdigital.com',	'0',	'1244585245',	NULL,	'6953',	1,	'2020-11-09 13:13:29',	'2020-11-11 13:13:17'),
(7,	2,	'Dhameliya',	'Himanshu',	'dhameliya.hp992@live.com',	'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',	'7567793250',	NULL,	NULL,	1,	'2020-11-10 05:18:00',	'2020-11-11 11:28:24'),
(19,	2,	'nikunj',	'hapani',	'nikunj@rentechdigital.com',	'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',	'7567793250',	NULL,	NULL,	1,	'2020-11-11 13:41:16',	'2020-11-12 13:12:11')
ON DUPLICATE KEY UPDATE `id` = VALUES(`id`), `role_id` = VALUES(`role_id`), `first_name` = VALUES(`first_name`), `last_name` = VALUES(`last_name`), `email` = VALUES(`email`), `password` = VALUES(`password`), `phone` = VALUES(`phone`), `avatar` = VALUES(`avatar`), `auth_token` = VALUES(`auth_token`), `is_active` = VALUES(`is_active`), `created_at` = VALUES(`created_at`), `updated_at` = VALUES(`updated_at`);

-- 2020-11-20 10:06:43
