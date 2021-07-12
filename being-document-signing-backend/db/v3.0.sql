ALTER TABLE `letter` 
ADD COLUMN `comment` VARCHAR(300) NULL DEFAULT NULL COMMENT '撤回评论' AFTER `email_switch`,
ADD COLUMN `withdraw_time`  timestamp NULL DEFAULT NULL COMMENT '撤回時間' AFTER `comment`;

DROP TABLE IF EXISTS `letter_draft`;

CREATE TABLE `letter_draft` (
  `id` bigint(12) unsigned NOT NULL AUTO_INCREMENT,
  `sender_id` bigint(12) unsigned NOT NULL COMMENT '發起簽署的 user id',
  `company_id` bigint(12) unsigned NOT NULL COMMENT 'sender 所簽署時用的公司身分（如果簽署時是用個人身分則是 0）',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `expired_time` timestamp NULL DEFAULT NULL COMMENT '過期時間',
  `email_switch` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '签署通知开关',
  `letter_signer` VARCHAR(2000) NULL DEFAULT '' COMMENT '签署人列表',
  `letter_viewer` VARCHAR(2000) NULL DEFAULT '' COMMENT '阅览人列表',
  `letter_file` VARCHAR(4000) NULL DEFAULT '' COMMENT '文件列表',
  `tag_name` VARCHAR(255) NULL DEFAULT '' COMMENT '标签列表',
  `creator_sign` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '发起人签署',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;