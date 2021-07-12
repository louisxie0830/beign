# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: rm-bp180vtkhser4mkqbro.mysql.rds.aliyuncs.com (MySQL 5.7.20-log)
# Database: ding_cloud_push
# Generation Time: 2019-06-06 01:42:13 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table address_list
# ------------------------------------------------------------

CREATE TABLE `address_list` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `user_id` bigint(12) unsigned NOT NULL COMMENT '用戶id',
  `address` varchar(42) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '以太坊的 address',
  `status` tinyint(1) unsigned NOT NULL COMMENT '状态:1 正常 2 失效',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `stop_time` timestamp NULL DEFAULT NULL COMMENT '失效时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table blockchain_error_logs
# ------------------------------------------------------------

CREATE TABLE `blockchain_error_logs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `transaction_object` varchar(4096) DEFAULT NULL,
  `contract_params` varchar(1024) DEFAULT NULL,
  `code` varchar(256) DEFAULT NULL,
  `message` mediumtext,
  `stack` mediumtext,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table client_logs
# ------------------------------------------------------------

CREATE TABLE `client_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `fileName` varchar(256) DEFAULT NULL,
  `errorLine` varchar(11) DEFAULT NULL,
  `errorCode` varchar(64) DEFAULT NULL,
  `errorMsg` varchar(2048) DEFAULT NULL,
  `uri` varchar(1024) DEFAULT NULL,
  `stackTrace` text,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table company
# ------------------------------------------------------------

CREATE TABLE `company` (
  `id` bigint(12) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '公司名稱',
  `url` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '公司網站',
  `applicant_id` bigint(12) unsigned NOT NULL DEFAULT '0' COMMENT '替這家公司申請的用戶 id',
  `status` tinyint(1) unsigned NOT NULL COMMENT '状态:1 正常 2 停权',
  `signing_quota` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '总共能簽署的次數',
  `signing_remain` int(11) DEFAULT NULL COMMENT '剩餘能簽署的次數',
  `signing_due_date` timestamp NULL DEFAULT NULL COMMENT '簽署服務的到期時間',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `stop_time` timestamp NULL DEFAULT NULL COMMENT '停权时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table company_authorized
# ------------------------------------------------------------

CREATE TABLE `company_authorized` (
  `id` bigint(12) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `company_id` bigint(12) unsigned NOT NULL COMMENT '所屬公司id',
  `user_id` bigint(12) unsigned NOT NULL COMMENT '被授權的用户id （表示此用戶被授權為管理者或簽署者）',
  `role` tinyint(1) unsigned NOT NULL COMMENT '被授權成為的角色類型：1主管理者，2子管理者、3簽署者',
  `status` tinyint(1) unsigned NOT NULL COMMENT '狀態:1 授權 2 取消授權',
  `authorizer_signature_id` bigint(12) unsigned NOT NULL COMMENT '授權的簽章 id',
  `cancel_signature_id` bigint(12) unsigned NOT NULL COMMENT '取消授權的簽章 id',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '授權時間',
  `stop_time` timestamp NULL DEFAULT NULL COMMENT '取消授權時間',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table company_oauth
# ------------------------------------------------------------

CREATE TABLE `company_oauth` (
  `id` bigint(12) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `company_id` bigint(12) unsigned NOT NULL COMMENT '對應的公司 id（company 表裡的 id）',
  `source_name` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '驗證來源的名稱（釘釘）',
  `source_company_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '從其他驗證來源取得的 company id',
  `status` tinyint(1) unsigned NOT NULL COMMENT '状态:1 正常 2 失效',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `stop_time` timestamp NULL DEFAULT NULL COMMENT '失效时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table contact
# ------------------------------------------------------------

CREATE TABLE `contact` (
  `id` bigint(12) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `owner_id` bigint(12) unsigned NOT NULL COMMENT '擁有者的 user id，owner_id 與 contact_email 為組合鍵 (Composite Key)',
  `contact_email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '收件人/聯絡人 email，owner_id 與 contact_email 為組合鍵 (Composite Key)',
  `contact_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '收件人/聯絡人姓名',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table contact_info
# ------------------------------------------------------------

CREATE TABLE `contact_info` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `uuid` varchar(36) NOT NULL DEFAULT '',
  `message` varchar(300) DEFAULT NULL,
  `create_time` time DEFAULT NULL,
  `email` varchar(254) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table file_verify
# ------------------------------------------------------------

CREATE TABLE `file_verify` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL DEFAULT '',
  `user_id` bigint(20) NOT NULL,
  `file_hash` varchar(512) NOT NULL DEFAULT '',
  `create_time` datetime NOT NULL,
  `ip` varchar(128) NOT NULL DEFAULT '',
  `user_agent` varchar(512) NOT NULL DEFAULT '',
  `signing_status` tinyint(2) DEFAULT NULL COMMENT '0「待簽署」、1「已撤回」、2「簽署中」、3「已完成」、4「已拒絕」',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table invoice
# ------------------------------------------------------------

CREATE TABLE `invoice` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` varchar(50) DEFAULT NULL,
  `type` tinyint(1) DEFAULT NULL,
  `name` varchar(30) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `address` varchar(120) DEFAULT NULL,
  `title` varchar(60) DEFAULT NULL,
  `tax_id` varchar(10) DEFAULT NULL,
  `corp_id` bigint(20) DEFAULT NULL,
  `invoice_no` varchar(10) DEFAULT NULL,
  `user_id` bigint(11) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL COMMENT '创建時間',
  `invoice_at` timestamp NULL DEFAULT NULL COMMENT '开票時間',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table letter
# ------------------------------------------------------------

CREATE TABLE `letter` (
  `id` bigint(12) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `sender_id` bigint(12) unsigned NOT NULL COMMENT '發起簽署的 user id',
  `company_id` bigint(12) unsigned NOT NULL COMMENT 'sender 所簽署時用的公司身分（如果簽署時是用個人身分則是 0）',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `progress` smallint(6) unsigned NOT NULL COMMENT '目前簽署輪到的順位號碼（對應到 letter_receiver.order）',
  `status` tinyint(1) unsigned NOT NULL COMMENT '0「待簽署」、1「已撤回」、2「簽署中」、3「已完成」、4「已拒絕」',
  `canceler_id` bigint(12) unsigned NOT NULL COMMENT '撤回或拒絕的 user id',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `expired_time` timestamp NULL DEFAULT NULL COMMENT '過期時間',
  `email_switch` tinyint(1) NOT NULL DEFAULT '0',
  `comment` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '撤回评论',
  `withdraw_time` timestamp NULL DEFAULT NULL COMMENT '撤回時間',
  PRIMARY KEY (`id`),
  KEY `sender_idx` (`sender_id`),
  KEY `create_time_index` (`create_time`),
  KEY `sender_id_index` (`sender_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table letter_draft
# ------------------------------------------------------------

CREATE TABLE `letter_draft` (
  `id` bigint(12) unsigned NOT NULL AUTO_INCREMENT,
  `sender_id` bigint(12) unsigned NOT NULL COMMENT '發起簽署的 user id',
  `company_id` bigint(12) unsigned NOT NULL COMMENT 'sender 所簽署時用的公司身分（如果簽署時是用個人身分則是 0）',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `expired_time` timestamp NULL DEFAULT NULL COMMENT '過期時間',
  `email_switch` tinyint(1) NOT NULL DEFAULT '0' COMMENT '签署通知开关',
  `letter_signer` varchar(2000) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '签署人列表',
  `letter_viewer` varchar(2000) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '阅览人列表',
  `letter_file` text COLLATE utf8mb4_unicode_ci,
  `tag_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '标签列表',
  `creator_sign` tinyint(1) NOT NULL DEFAULT '0' COMMENT '发起人签署',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table letter_file
# ------------------------------------------------------------

CREATE TABLE `letter_file` (
  `id` bigint(12) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `letter_id` bigint(12) unsigned NOT NULL COMMENT '信件的 id',
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '檔案路徑',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '檔名',
  `size` int(11) unsigned NOT NULL COMMENT '檔案大小(單位是kb)',
  `type` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '附檔名(doc, docx, pdf, jpg, jpeg...之類的)',
  `hash` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '檔案的 sha256',
  `order` smallint(6) unsigned NOT NULL COMMENT '在信件裡的排序順序',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table letter_receiver
# ------------------------------------------------------------

CREATE TABLE `letter_receiver` (
  `id` bigint(12) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `letter_id` bigint(12) unsigned NOT NULL COMMENT '信件的 id，信件 id 與 接收者 id 為組合鍵 (Composite Key)',
  `receiver_company_id` bigint(12) NOT NULL DEFAULT '0' COMMENT '公司身分',
  `user_id` bigint(12) unsigned NOT NULL COMMENT '接收者的 user id，信件 id 與 接收者 id 為組合鍵 (Composite Key)',
  `email` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '接收者的 email',
  `type` tinyint(1) unsigned NOT NULL COMMENT '權限類型：1(簽署)、2(閱覽)',
  `is_signing` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0「已發起」、1「已撤回」、2「等待中」、3「已簽署」、4「已拒絕」',
  `order` smallint(6) unsigned NOT NULL COMMENT '在信件裡的排序順序',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `read` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否已读',
  `comment` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '评论',
  `sign_time` timestamp NULL DEFAULT NULL COMMENT '签署时间',
  PRIMARY KEY (`id`),
  KEY `user_id_idx` (`user_id`),
  KEY `letter_id_idx` (`letter_id`),
  KEY `user_id_index` (`user_id`),
  KEY `letter_id_index` (`letter_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table letter_tag
# ------------------------------------------------------------

CREATE TABLE `letter_tag` (
  `tag_id` bigint(20) unsigned NOT NULL,
  `letter_id` bigint(20) unsigned NOT NULL,
  UNIQUE KEY `tag_id` (`tag_id`,`letter_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table open_sync_biz_data
# ------------------------------------------------------------

CREATE TABLE `open_sync_biz_data` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `gmt_create` datetime NOT NULL COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL COMMENT '更新时间',
  `subscribe_id` varchar(64) NOT NULL COMMENT '订阅方ID',
  `corp_id` varchar(64) NOT NULL COMMENT '企业ID',
  `biz_id` varchar(128) NOT NULL COMMENT '业务ID',
  `biz_type` int(11) NOT NULL COMMENT '业务类型',
  `biz_data` text NOT NULL COMMENT '业务数据',
  `open_cursor` bigint(20) NOT NULL COMMENT '对账游标',
  `status` int(11) NOT NULL COMMENT '处理状态0为未处理。其他状态开发者自行定义',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_subscribe_corp_biz` (`subscribe_id`,`corp_id`,`biz_id`,`biz_type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='高优先级数据';



# Dump of table open_sync_biz_data_medium
# ------------------------------------------------------------

CREATE TABLE `open_sync_biz_data_medium` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `gmt_create` datetime NOT NULL COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL COMMENT '更新时间',
  `subscribe_id` varchar(64) NOT NULL COMMENT '订阅方ID',
  `corp_id` varchar(64) NOT NULL COMMENT '企业ID',
  `biz_id` varchar(128) NOT NULL COMMENT '业务ID',
  `biz_type` int(11) NOT NULL COMMENT '业务类型',
  `biz_data` text NOT NULL COMMENT '业务数据',
  `open_cursor` bigint(20) NOT NULL COMMENT '对账游标',
  `status` int(11) NOT NULL COMMENT '处理状态0为未处理。其他状态开发者自行定义',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_subscribe_corp_biz` (`subscribe_id`,`corp_id`,`biz_id`,`biz_type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='中低优先级数据';



# Dump of table order_list
# ------------------------------------------------------------

CREATE TABLE `order_list` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL DEFAULT '',
  `order_id` varchar(64) NOT NULL DEFAULT '' COMMENT '订单号码',
  `package_id` varchar(20) NOT NULL DEFAULT '' COMMENT '商品编号',
  `package_name` varchar(64) NOT NULL DEFAULT '' COMMENT '商品名称',
  `amount` int(10) unsigned NOT NULL COMMENT '数量',
  `currency` varchar(5) NOT NULL DEFAULT '' COMMENT '货币类型',
  `unit_price` decimal(18,8) NOT NULL COMMENT '单价',
  `total_price` decimal(18,8) NOT NULL COMMENT '总价',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `company_id` bigint(20) NOT NULL COMMENT '公司ID',
  `remark` varchar(2048) DEFAULT NULL,
  `payment_method` varchar(20) NOT NULL DEFAULT '' COMMENT '支付方式',
  `payment_order_id` varchar(128) DEFAULT NULL COMMENT '支付方单号',
  `payment_result` varchar(2048) DEFAULT NULL COMMENT '支付结果',
  `order_status` tinyint(2) NOT NULL COMMENT '订单状态:0,待支付；1,支付成功，2支付失败，3取消，4退款',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  `modified_at` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table signature
# ------------------------------------------------------------

CREATE TABLE `signature` (
  `id` bigint(12) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `target_type` tinyint(1) unsigned NOT NULL COMMENT '簽署目標的類型：1(用戶)、2(信件)',
  `target_id` bigint(12) unsigned NOT NULL COMMENT '簽署目標的 id',
  `signer_id` bigint(12) unsigned NOT NULL COMMENT '簽署人的 id',
  `signer_company_id` bigint(12) NOT NULL DEFAULT '0' COMMENT '公司身分',
  `signer_address` varchar(42) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '簽署人的 address (因 address 可能失效，故需在每次簽署時保存)',
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '簽署的相關參數',
  `signature` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用簽署人的私鑰對相關參數簽署得到的簽章，可證明真的是有被簽署人授權',
  `payload` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '預留自定義的欄位',
  `tx` varchar(66) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '將簽署資訊存到區塊鏈上所得到的 transaction hash',
  `send` tinyint(2) NOT NULL DEFAULT '0' COMMENT '发送状态，-1失败，0未发，1成功',
  `status` tinyint(2) NOT NULL DEFAULT '0' COMMENT '区块链receipt，-1: error, 0: waiting, 1:confirmed',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '簽署時間',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table tag
# ------------------------------------------------------------

CREATE TABLE `tag` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `name` varchar(64) NOT NULL DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table user
# ------------------------------------------------------------

CREATE TABLE `user` (
  `id` bigint(12) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `mobile` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '手機號',
  `mobile_verify` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '待驗證手機號，只有此欄位的手機號驗證通過後，才能將手機號寫入mobile欄位',
  `mobile_verify_time` timestamp NULL DEFAULT NULL COMMENT '手機號驗證時間',
  `password` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '密碼',
  `password_error_count` tinyint(1) NOT NULL DEFAULT '0' COMMENT '密碼錯誤次數，最多錯 5 次，超過次數鎖定帳號，並要求用戶重新設定密碼。\\n輸入正確或是重設密碼則歸零',
  `password_reset_link_hash` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '重設密碼驗證連結用的 hash，md5（email+系統時間Time+rand）',
  `cer_pwd` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '加密過後的憑證密碼，加密用的 Key 只有用戶知道',
  `name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '姓名',
  `id_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '身份證號',
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '郵箱',
  `email_crc` bigint(10) NOT NULL DEFAULT '0' COMMENT 'email 的 crc 值，用來增加搜尋 email 效率，參考 https://goo.gl/p4hUJs',
  `email_verify` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '待驗證郵箱地址，只有此欄位的郵箱地址驗證通過後，才能將郵箱地址寫入email欄位',
  `email_verify_time` timestamp NULL DEFAULT NULL COMMENT '郵箱地址驗證時間',
  `status` tinyint(1) NOT NULL COMMENT '狀態：1(正常)、2(鎖定)、3(停權)',
  `language_id` bigint(12) DEFAULT NULL COMMENT '語系ID',
  `country_id` bigint(12) DEFAULT NULL COMMENT '國家ID',
  `language_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户语言',
  `birthday` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '生日(格式：0000-00-00)',
  `gender` tinyint(1) DEFAULT NULL COMMENT '性別(1保密，2男，3女)',
  `register_ip` varchar(46) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `register_time` timestamp NULL DEFAULT NULL COMMENT '註冊時間',
  `last_login_time` timestamp NULL DEFAULT NULL COMMENT '最後登入時間',
  `verify_code` varchar(4) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '4位數的驗證碼',
  `verify_code_send_count` tinyint(1) DEFAULT NULL COMMENT '驗證碼發送次數，最多 5 次，驗證通過或是距離上次發送時間超過1小時則歸零',
  `verify_code_error_count` tinyint(1) DEFAULT NULL COMMENT '驗證碼錯誤次數，最多 5 次，驗證通過或是重發驗證信時歸零',
  `verify_code_status` tinyint(1) DEFAULT NULL COMMENT '驗證碼狀態：1 待驗證、2 已使用',
  `verify_code_create_time` timestamp NULL DEFAULT NULL COMMENT '產生驗證碼的時間，15分鐘後就過期',
  `verify_code_expired_time` timestamp NULL DEFAULT NULL COMMENT '驗證碼過期時間',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table user_oauth
# ------------------------------------------------------------

CREATE TABLE `user_oauth` (
  `id` bigint(12) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `company_id` bigint(12) NOT NULL COMMENT '公司ID',
  `third_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '第三方ID',
  `user_id` bigint(12) unsigned DEFAULT NULL COMMENT 'user表的ID',
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '第三方名字',
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '第三方邮箱',
  `type` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '來源類型，如：google、facebook、qq、weixin',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `last_login` timestamp NULL DEFAULT NULL COMMENT '最后登入时间',
  `status` tinyint(1) unsigned NOT NULL COMMENT '状态：1正常，2停权（表示该用户不能使用该第三方登入）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
