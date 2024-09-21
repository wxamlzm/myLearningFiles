# application.properties (主配置文件，会被提交到版本控制)
# 数据库配置
spring.datasource.url=${MYSQL_URL:jdbc:mysql://localhost:3306/mydb}
spring.datasource.username=${MYSQL_USERNAME}
spring.datasource.password=${MYSQL_PASSWORD}
spring.jpa.hibernate.ddl-auto=update

# 服务器配置
server.port=${SERVER_PORT:8080}

# 应用特定配置
myapp.feature.enabled=${FEATURE_FLAG:false}
myapp.api.key=${API_KEY}

# 激活本地配置
spring.profiles.active=local

---
# application-local.properties (本地配置文件，不会被提交到版本控制)
# 数据库配置
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=password123

# 服务器配置
server.port=8080

# 应用特定配置
myapp.feature.enabled=true
myapp.api.key=abcdef123456
