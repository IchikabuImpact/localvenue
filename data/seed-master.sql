
--
-- @copyright © 2026 IchikabuImpact
-- @license Commercial use prohibited without permission.

REPLACE INTO `baba` VALUES (1,'北見ば',NULL),(2,'岩見ば',NULL),(3,'帯広ば','0304'),(4,'旭川ば',NULL),(7,'旭川',NULL),(8,'札幌',NULL),(10,'盛岡','1006'),(11,'水沢','1106'),(12,'上山',NULL),(15,'足利',NULL),(16,'宇都宮',NULL),(17,'高崎',NULL),(18,'浦和','1800'),(19,'船橋','1914'),(20,'大井','2015'),(21,'川崎','2135'),(22,'金沢','2218'),(23,'笠松','2300'),(24,'名古屋','2400'),(25,'中京',NULL),(27,'園田','2726'),(28,'姫路','2800'),(30,'福山',NULL),(31,'高知','3129'),(32,'佐賀','3230'),(33,'荒尾',NULL),(36,'門別','3600'),(41,'ばんえ',NULL),(42,'北海道',NULL),(43,'岩手',NULL),(44,'新潟',NULL),(45,'北関東',NULL),(46,'南関東',NULL),(47,'栃木',NULL),(48,'東海',NULL),(49,'愛知',NULL),(50,'兵庫',NULL),(61,'九州',NULL),(80,'全国',NULL);
/*!40000 ALTER TABLE `baba` ENABLE KEYS */;


REPLACE INTO `venue_master` VALUES (3,'03041503','帯広ば'),(10,'10061006','盛岡'),(11,'11060605','水沢'),(18,'18131203','浦和'),(19,'19140801','船橋'),(20,'20151205','大井'),(21,'21350805','川崎'),(22,'22181501','金沢'),(23,'23201204','笠松'),(24,'24332203','名古屋'),(27,'27261706','園田'),(28,'28260102','姫路'),(31,'31291106','高知'),(32,'32302205','佐賀'),(36,'36011504','門別');

INSERT INTO `horse_win_pattern_rules`
  (`rule_code`, `rule_name`, `horse_name`, `pattern_type`, `baba_code`,
   `min_frame_number`, `max_frame_number`, `target_running_styles`,
   `max_escape_count_excluding_self`, `max_front_runner_count`, `bonus_pct`, `enabled`, `notes`)
VALUES
  ('shishi_kochi_inner_type_s', 'シシ 高知内枠TYPE S', 'シシ', 'TYPE S', 31,
   1, 4, JSON_ARRAY('逃げ', '先行'),
   0, 3, 10.00, 1, '気持ちで走る持続力タイプ。内枠で集中でき、他に逃げ馬がいない消耗戦を加点')
ON DUPLICATE KEY UPDATE
  `rule_name` = VALUES(`rule_name`),
  `horse_name` = VALUES(`horse_name`),
  `pattern_type` = VALUES(`pattern_type`),
  `baba_code` = VALUES(`baba_code`),
  `min_frame_number` = VALUES(`min_frame_number`),
  `max_frame_number` = VALUES(`max_frame_number`),
  `target_running_styles` = VALUES(`target_running_styles`),
  `max_escape_count_excluding_self` = VALUES(`max_escape_count_excluding_self`),
  `max_front_runner_count` = VALUES(`max_front_runner_count`),
  `bonus_pct` = VALUES(`bonus_pct`),
  `enabled` = VALUES(`enabled`),
  `notes` = VALUES(`notes`);
