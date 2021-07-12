ALTER TABLE `letter` 
ADD COLUMN `email_switch` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '签署通知' AFTER `expired_time`;
ALTER TABLE `letter_receiver` 
ADD COLUMN `read` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否已读' AFTER `create_time`, 
ADD COLUMN `comment` VARCHAR(300) NULL DEFAULT NULL COMMENT '评论' AFTER `read`, 
ADD COLUMN `sign_time` TIMESTAMP NULL DEFAULT NULL COMMENT '签署时间' AFTER `comment`;