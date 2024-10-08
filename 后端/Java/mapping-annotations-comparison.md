# Spring MVC 映射注解比较

## 1. @RequestMapping
- 最通用的映射注解
- 可以用于类级别和方法级别
- 可以指定HTTP方法、URL、请求参数等

```java
@RestController
@RequestMapping("/api")
public class UserController {
    @RequestMapping(value = "/users/{id}", method = RequestMethod.GET)
    public User getUser(@PathVariable long id) { ... }
}
```

## 2. HTTP方法特定注解（@GetMapping, @PostMapping 等）
- @RequestMapping 的特化版本
- 只能用于方法级别
- 隐含指定了HTTP方法

```java
@RestController
public class UserController {
    @GetMapping("/users/{id}")
    public User getUser(@PathVariable long id) { ... }
}
```

## 3. 不使用类级别注解
- 直接在方法上使用完整路径
- 适用于简单API或路径不需要共享前缀的情况

```java
@RestController
public class UserController {
    @GetMapping("/api/users/{id}")
    public User getUser(@PathVariable long id) { ... }
}
```

## 最佳实践
- 对于复杂API，使用类级别 @RequestMapping 定义基础路径
- 对于简单API或独立端点，可以只在方法级别使用 @GetMapping 等注解
- 保持一致性和可读性是关键
