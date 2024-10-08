# JWT 配置和使用手册

## 1. JWT 简介

JSON Web Token (JWT) 是一种用于安全传输信息的开放标准。它通过数字签名来验证其自身的真实性，可用于身份验证和信息交换。

## 2. JWT 密钥的作用

JWT 密钥是用于签名和验证 token 的关键要素。它的主要作用包括：

- 确保 token 的完整性和真实性
- 防止 token 被篡改
- 验证 token 是否由可信的服务器生成

## 3. JWT 配置步骤

### 3.1 修改 `application.properties`

在主配置文件中使用占位符：

```properties
# 现有配置
spring.datasource.url=${MYSQL_URL:jdbc:mysql://localhost:3306/mydb}
spring.datasource.username=${MYSQL_USERNAME}
spring.datasource.password=${MYSQL_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
server.port=${SERVER_PORT:8080}

# JWT 配置
jwt.secret=${JWT_SECRET}

# 激活本地配置
spring.profiles.active=local
```

### 3.2 创建 `application-local.properties`

在本地配置文件中设置实际的密钥：

```properties
# 数据库配置
MYSQL_USERNAME=root
MYSQL_PASSWORD=password123

# JWT 配置
JWT_SECRET=my_super_secret_key_123456

# 其他本地配置
SERVER_PORT=8080
```

### 3.3 更新 `.gitignore`

确保本地配置文件不被提交到版本控制系统：

```
application-local.properties
```

### 3.4 创建 `application-local.properties.example`

为其他开发者提供一个模板：

```properties
# 数据库配置
MYSQL_USERNAME=your_username
MYSQL_PASSWORD=your_password

# JWT 配置
JWT_SECRET=your_jwt_secret_here

# 其他本地配置
SERVER_PORT=8080
```

### 3.5 配置 `JwtTokenUtil` 类

```java
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenUtil {

    @Value("${jwt.secret}")
    private String secret;

    // JwtTokenUtil 的其余实现
}
```

## 4. JWT 在不同环境中的应用

### 4.1 开发环境

在开发环境中，可以使用固定的密钥，如 `"my_super_secret_key_123456"`。

### 4.2 生产环境

在生产环境中，应通过环境变量设置更复杂的密钥，例如：

```
export JWT_SECRET=f0e1d2c3b4a5968778695a4b3c2d1e0f
```

## 5. JWT 的应用场景

### 5.1 单点登录（SSO）

```
用户登录 -> 服务A生成JWT -> 用户访问服务B时携带JWT -> 服务B验证JWT
```

### 5.2 微服务架构

```
用户请求 -> API网关验证JWT -> 将请求转发给内部服务
```

### 5.3 移动应用

```
app登录 -> 获取JWT -> 后续请求携带JWT -> 服务器验证JWT
```

## 6. JWT 密钥管理建议

- 使用足够长且复杂的密钥（至少 256 位）
- 定期更换密钥
- 在不同的环境（开发、测试、生产）使用不同的密钥
- 避免将密钥硬编码在源代码中
- 使用环境变量或安全的配置管理系统来存储和管理密钥

## 7. 注意事项

- JWT 密钥的泄露会严重影响系统安全，请妥善保管
- 在分布式系统中，确保所有服务使用相同的密钥进行 JWT 验证
- 定期审查和更新 JWT 相关的安全策略

