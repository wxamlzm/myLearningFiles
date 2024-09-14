# Spring Boot 数据访问层结构

假设您的基础包名为 `com.yourcompany.yourproject`，以下是推荐的包结构：

```
com.yourcompany.yourproject
│
├── config
├── controller
├── model
│   ├── entity
│   └── dto
├── repository
├── service
│   └── impl
└── util
```

## 包说明

1. `config`
   - 用途：存放配置类
   - 内容：数据源配置、JPA 配置等
   - 示例：`DatabaseConfig.java`

2. `controller`
   - 用途：存放控制器类
   - 内容：处理 HTTP 请求，调用服务层
   - 示例：`UserController.java`

3. `model`
   - 用途：存放数据模型相关的类
   - 子包：
     - `entity`: 存放实体类，与数据库表对应
     - `dto`: 存放数据传输对象，用于层间数据传递
   - 示例：
     - `entity/User.java`
     - `dto/UserDTO.java`

4. `repository`
   - 用途：存放数据访问接口
   - 内容：Spring Data JPA 存储库接口
   - 示例：`UserRepository.java`

5. `service`
   - 用途：存放服务接口和实现类
   - 子包：
     - `impl`: 存放服务接口的实现类
   - 示例：
     - `UserService.java`
     - `impl/UserServiceImpl.java`

6. `util`
   - 用途：存放工具类
   - 内容：通用方法、辅助功能等
   - 示例：`DateUtils.java`

## 代码示例

1. 实体类 (`model/entity/User.java`)
   ```java
   @Entity
   @Table(name = "users")
   public class User {
       @Id
       @GeneratedValue(strategy = GenerationType.IDENTITY)
       private Long id;
       private String username;
       // 其他字段、getter 和 setter
   }
   ```

2. 存储库接口 (`repository/UserRepository.java`)
   ```java
   @Repository
   public interface UserRepository extends JpaRepository<User, Long> {
       List<User> findByUsername(String username);
   }
   ```

3. 服务接口 (`service/UserService.java`)
   ```java
   public interface UserService {
       User findById(Long id);
       List<User> findByUsername(String username);
       User save(User user);
   }
   ```

4. 服务实现 (`service/impl/UserServiceImpl.java`)
   ```java
   @Service
   public class UserServiceImpl implements UserService {
       @Autowired
       private UserRepository userRepository;

       @Override
       public User findById(Long id) {
           return userRepository.findById(id).orElse(null);
       }

       // 其他方法实现
   }
   ```

5. 控制器 (`controller/UserController.java`)
   ```java
   @RestController
   @RequestMapping("/api/users")
   public class UserController {
       @Autowired
       private UserService userService;

       @GetMapping("/{id}")
       public ResponseEntity<User> getUserById(@PathVariable Long id) {
           User user = userService.findById(id);
           return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
       }

       // 其他 CRUD 操作
   }
   ```

这种结构提供了清晰的关注点分离，有助于维护和扩展您的应用程序。
