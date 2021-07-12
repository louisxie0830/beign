ALTER TABLE `letter` ADD INDEX `sender_id_index` (`sender_id`);
ALTER TABLE `letter_receiver` ADD INDEX `user_id_index` (`user_id`), ADD INDEX `letter_id_index` (`letter_id`);