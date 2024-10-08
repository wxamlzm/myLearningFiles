# Spring Security 与 JWT 集成指南

## 1. 基础概念

### 1.1 Spring Security
- 一个强大的身份验证和访问控制框架。
- 用于保护基于 Spring 的应用程序。

### 1.2 JWT (JSON Web Token)
- 一种开放标准（RFC 7519），用于在各方之间安全地传输信息。
- 信息被数字签名，可以被验证和信任。

## 2. Spring Security 默认行为

- 基于 session 的认证。
- 使用内置的登录表单。
- 创建和管理 session。
- 实现 CSRF 保护。

## 3. JWT 认证特点

- 无状态（Stateless）：服务器不存储会话信息。
- 每个请求都包含完整的认证信息。
- 适合分布式系统和微服务架构。

## 4. 集成 JWT 与 Spring Security

### 4.1 主要配置

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeRequests()
                .antMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            .and()
            .exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint)
            .and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
    }
}
```

### 4.2 配置解释

- **禁用 CSRF**：JWT 是无状态的，不需要 CSRF 保护。
- **路径权限配置**：定义哪些路径需要认证，哪些可以公开访问。
- **异常处理**：自定义未认证请求的处理方式。
- **无状态会话**：配置 Spring Security 不创建或使用 session。
- **JWT 过滤器**：添加自定义过滤器来处理 JWT。

## 5. 关键组件

### 5.1 JwtAuthenticationEntryPoint
- 处理未经认证的请求。
- 实现 `AuthenticationEntryPoint` 接口。

### 5.2 JwtRequestFilter
- 拦截所有请求。
- 验证 JWT token。
- 设置 Spring Security 的认证信息。

### 5.3 UserDetailsService
- Spring Security 的核心接口。
- 加载特定用户的数据。
- 在 JWT 认证中用于初始认证过程。

## 6. Session 管理策略

- **STATELESS**：不创建或使用任何 session。
- **ALWAYS**：总是创建 session。
- **IF_REQUIRED**：需要时创建 session（默认）。
- **NEVER**：不创建 session，但使用已存在的。

## 7. 认证流程

1. 用户提供凭证（如用户名和密码）。
2. 服务器验证凭证。
3. 生成 JWT token。
4. 返回 token 给客户端。
5. 客户端在后续请求中包含此 token。
6. 服务器验证每个请求中的 token。

## 8. 安全考虑

- 使用 HTTPS 保护所有通信。
- 正确处理 token 的过期和刷新。
- 实施适当的密码策略。
- 考虑 token 撤销策略。

## 9. 优势与劣势

### 优势
- 提高可扩展性。
- 适合微服务架构。
- 减少服务器端存储需求。

### 劣势
- 增加每个请求的大小。
- token 管理的复杂性。
- 无法即时撤销访问权限。

## 10. 最佳实践

- 保持 token 生命周期较短。
- 实现 token 刷新机制。
- 在客户端安全存储 token。
- 定期审查和更新安全配置。

