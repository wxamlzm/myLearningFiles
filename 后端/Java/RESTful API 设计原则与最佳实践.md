# RESTful API 设计原则与最佳实践

## 1. REST 基本概念

REST (Representational State Transfer) 是一种架构风格，而不是严格的协议。它强调：

- 资源（Resources）：使用名词表示，如 `/users`，`/articles`
- 表示（Representations）：资源的特定表现形式，如 JSON, XML
- 状态转移（State Transfer）：通过 HTTP 方法实现

## 2. URL 设计原则

### 2.1 使用名词表示资源

- 好的例子：`/users`, `/articles`
- 避免：`/getUsers`, `/createArticle`

### 2.2 使用复数形式

- 推荐：`/users`, `/articles`
- 而不是：`/user`, `/article`

### 2.3 使用层级关系表示资源间的从属关系

- 例如：`/users/{userId}/posts`

## 3. HTTP 方法

使用 HTTP 方法表示操作：

- GET：获取资源
- POST：创建资源
- PUT：更新资源（全量更新）
- PATCH：部分更新资源
- DELETE：删除资源

## 4. 常见误解澄清

### 4.1 "不能有动词"

- 这是一般原则，但并非绝对
- 某些情况下，动词可能更合适，如 `/search`, `/login`

### 4.2 "需要和数据库表同名"

- API 设计应该关注业务领域模型，而不是数据库结构
- 数据库表和 API 资源可以不同名

## 5. 处理复杂操作

对于不符合 CRUD 的操作：

1. 使用自定义动作：`/users/{userId}/activate`
2. 将动作视为资源子集：`POST /users/{userId}/actions/activate`

## 6. 查询和过滤

- 使用查询参数：`/users?status=active`
- 对于复杂查询，考虑使用 POST 和请求体

## 7. 版本控制

在 URL 或 Header 中包含版本信息：
- URL: `/api/v1/users`
- Header: `Accept: application/vnd.company.api+json;version=1`

## 8. 状态码

正确使用 HTTP 状态码传达结果：
- 200 OK：成功的 GET, PUT, PATCH 或 DELETE
- 201 Created：成功的 POST
- 204 No Content：成功但无返回内容
- 400 Bad Request：客户端错误
- 404 Not Found：资源不存在
- 500 Internal Server Error：服务器错误

## 9. 最佳实践

1. 保持简单性和一致性
2. 使用 HATEOAS 提供 API 导航
3. 提供良好的文档
4. 考虑 API 的可扩展性
5. 使用合适的认证和授权机制

理解这些原则有助于设计出直观、一致且易于使用的 API。
