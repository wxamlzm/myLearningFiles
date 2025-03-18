CREATE TABLE `rescue_schedule` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `word_date` date not null COMMENT '排班日期',
  `week_name` varchar(8) not NULL COMMENT '星期几'
  `phone` varchar(8) not NULL COMMENT '电话'
)