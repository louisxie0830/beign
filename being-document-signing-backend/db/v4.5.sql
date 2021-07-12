ALTER TABLE `letter_receiver`
ADD COLUMN `view_file` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否已查阅';

CREATE TABLE `letter_signer_signature` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `letter_id` int(11) NOT NULL,
  `letter_file_key` varchar(255) NOT NULL DEFAULT '',
  `user_id` int(11) NOT NULL,
  `page_no` int(11) NOT NULL,
  `position_x` int(11) NOT NULL,
  `position_y` int(11) NOT NULL,
  `png_content` text NOT NULL,
  `color` varchar(20) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
