CREATE TABLE `department` (
  `id` bigint(12) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` bigint(12) NOT NULL,
  `admin_id` bigint(12) NOT NULL,
  `name` varchar(256) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `user_department` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `department_id` bigint(20) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `mobile` varchar(20) DEFAULT '' COMMENT 'mobile',
  `city` varchar(20) DEFAULT '' COMMENT 'city',
  `country` varchar(20) DEFAULT '',
  `name` varchar(64) NOT NULL DEFAULT '',
  `position_name` varchar(20) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE `invite_record` (
  `id` bigint(12) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(12) NOT NULL,
  `company_id` bigint(12) NOT NULL,
  `department_id` bigint(12) DEFAULT NULL,
  `expired_time` timestamp NOT NULL COMMENT '過期時間',
  `name` varchar(256) NOT NULL DEFAULT '',
  `mobile` varchar(20) NOT NULL DEFAULT '',
  `email` varchar(256) NOT NULL DEFAULT '',
  `city` varchar(20) DEFAULT '' COMMENT 'city',
  `country` varchar(20) DEFAULT '',
  `position_name` varchar(20) NOT NULL DEFAULT '',
  `invite_code` varchar(64) NOT NULL DEFAULT '',
  `use_by` bigint(12) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE `letter` ADD COLUMN `complete_time` timestamp NULL DEFAULT NULL;

CREATE TABLE `business_company` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `tax_id` int(20) NOT NULL COMMENT '統一編號',
  `company_name` varchar(64) NOT NULL DEFAULT '' COMMENT '公司名稱',
  `title` varchar(64) NOT NULL DEFAULT '' COMMENT '顯示名稱',
  `registered_mail` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '申請人信箱',
  `registered_name` varchar(64) NOT NULL DEFAULT '' COMMENT '申請人姓名',
  `registered_phone` varchar(20) DEFAULT '' COMMENT '申請人電話',
  `owner` varchar(64) NOT NULL DEFAULT '' COMMENT '負責人',
  `address` varchar(64) NOT NULL DEFAULT '' COMMENT '地址',
  `phone` varchar(20) DEFAULT '' COMMENT '電話',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE `user` ADD COLUMN `registered_type` int(2) DEFAULT 0 COMMENT '註冊狀態';


