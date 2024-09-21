# Spring Boot 配置占位符解析

## 占位符的本质
占位符是一种值替换机制，而不是启动或触发变量。

## 占位符的作用
1. 提供灵活的值注入方式
2. 允许从多个来源获取配置值
3. 支持默认值设置

## 占位符解析流程
1. Spring Boot 读取配置文件
2. 遇到占位符 `${...}`
3. 按以下顺序查找值：
   a. 环境变量
   b. Java 系统属性
   c. 其他配置文件（如 application-local.properties）
   d. 占位符中指定的默认值
4. 用找到的值替换占位符

## 示例
配置：`spring.datasource.username=${MYSQL_USERNAME:defaultuser}`

解析过程：
1. 查找环境变量 MYSQL_USERNAME
2. 如果没找到，查找 Java 系统属性
3. 如果还没找到，查找其他激活的配置文件
4. 如果都没找到，使用默认值 "defaultuser"

