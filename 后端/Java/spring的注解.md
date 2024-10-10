# Spring框架常用注解

## 控制器相关注解

1. `@Controller`
   - 用于标识一个类作为Spring MVC控制器
   - 通常用于返回视图

2. `@RestController`
   - `@Controller`和`@ResponseBody`的组合
   - 用于创建RESTful Web服务,方法返回的对象会自动序列化为JSON或XML

3. `@RequestMapping`
   - 用于映射Web请求到特定的处理器类或处理器方法
   - 可以指定HTTP方法、URL、请求参数、请求头等

4. `@GetMapping`
   - `@RequestMapping(method = RequestMethod.GET)`的简写
   - 用于处理GET请求

5. `@PostMapping`
   - `@RequestMapping(method = RequestMethod.POST)`的简写
   - 用于处理POST请求

6. `@PutMapping`
   - 用于处理PUT请求

7. `@DeleteMapping`
   - 用于处理DELETE请求

8. `@PatchMapping`
   - 用于处理PATCH请求

## 请求处理相关注解

9. `@RequestParam`
   - 用于将请求参数绑定到控制器中的方法参数

10. `@PathVariable`
    - 用于将URL中的模板变量绑定到控制器中的方法参数

11. `@RequestBody`
    - 用于将HTTP请求体绑定到控制器中的方法参数

12. `@ResponseBody`
    - 表示方法返回的对象应该被直接写入HTTP响应体中

## 依赖注入相关注解

13. `@Autowired`
    - 用于自动装配bean
    - 可以对构造器、setter方法、普通方法及字段进行注入

14. `@Component`
    - 标识一个类作为组件类，并告知Spring要为这个类创建bean

15. `@Service`
    - 标识一个类为业务逻辑组件类

16. `@Repository`
    - 标识一个类为数据访问组件类

## 配置相关注解

17. `@Configuration`
    - 标识一个类为配置类

18. `@Bean`
    - 标识一个方法产生一个bean，交给Spring容器管理

19. `@Value`
    - 用于注入基于properties的配置

20. `@PropertySource`
    - 用于加载properties文件

## 事务相关注解

21. `@Transactional`
    - 声明式事务管理

## 异常处理相关注解

22. `@ExceptionHandler`
    - 用于全局异常处理

23. `@ControllerAdvice`
    - 定义一个全局的异常处理类

这些注解涵盖了Spring框架中最常用的一部分。在实际开发中，您可能会根据具体需求使用其中的一部分或更多其他注解。
