-- alter table `letter_receiver`
-- add column `company_id` bigint(20) NOT NULL DEFAULT '0' COMMENT '签署人身份';
alter table `letter`
add column `enable_sms_notify` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否接收SMS通知';

alter table `letter_draft`
add column `enable_sms_notify` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否接收SMS通知';

CREATE TABLE `sms_notify` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `letter_id` int(11) NOT NULL,
  `sms_id` varchar(128) NOT NULL DEFAULT '',
  `sms_content` varchar(512) NOT NULL DEFAULT '',
  `receiver` varchar(16) NOT NULL DEFAULT '',
  `send_at` datetime NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '0:not send,1:sended,2:send confirmed',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
