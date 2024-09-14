# Spring IOC, DI, 和 @Repository 注解解析

## 1. IOC (控制反转)

IOC 是一种设计原则，其中对象的创建和生命周期管理被转移到框架或容器。

- Spring 容器负责创建和管理bean（对象）
- 开发者不需要显式地创建对象，而是通过配置告诉Spring如何创建

## 2. DI (依赖注入)

DI 是 IOC 的一种实现方式，通过它，对象的依赖关系由容器在运行时注入。

- 主要方式：构造器注入、Setter注入、字段注入
- 通过注解（如 `@Autowired`）或 XML 配置实现

## 3. Spring 注解

### 3.1 @Repository

- 用途：标记数据访问层的类
- 效果：
  1. 将类标记为 Spring 管理的组件
  2. 自动注册到 Spring 容器
  3. 启用与持久层相关的异常转换

### 3.2 其他相关注解

- `@Component`：通用的 Spring 管理组件
- `@Service`：标记业务逻辑层
- `@Controller`/`@RestController`：标记表现层（Web）组件

## 4. Bean 的生命周期

1. 实例化
2. 属性赋值
3. 初始化
4. 使用
5. 销毁

## 5. 依赖注入方式

### 5.1 构造器注入

```java
@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```

### 5.2 Setter 注入

```java
@Service
public class UserService {
    private UserRepository userRepository;

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```

### 5.3 字段注入（不推荐）

```java
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
}
```

## 6. Bean 的作用域

- Singleton（默认）：每个 Spring IoC 容器仅有一个实例
- Prototype：每次请求都会创建新的实例
- Request：每个 HTTP 请求都有一个实例
- Session：每个 HTTP Session 都有一个实例
- Application：每个 ServletContext 都有一个实例
- Websocket：每个 WebSocket 都有一个实例

## 7. 最佳实践

1. 优先使用构造器注入
2. 使用特定的注解（@Repository, @Service 等）而不是通用的 @Component
3. 使用接口进行依赖注入，而不是具体实现
4. 避免使用字段注入
5. 合理使用 bean 的作用域

理解这些概念有助于更好地利用 Spring 框架的特性，创建松耦合、易测试的应用程序。
