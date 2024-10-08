# 博客系统认证方案文档

## 1. 概述

本文档描述了一个基于Spring Boot后端和Vue 3 + Vite前端的博客系统的认证方案。该方案采用JWT (JSON Web Token) 来实现无状态的用户认证。

## 2. 技术栈

- 后端: Spring Boot
- 前端: Vue 3 + Vite
- 数据库: MySQL (假设)
- 认证方式: JWT

## 3. 后端实现

### 3.1 依赖

在`pom.xml`中添加以下依赖:

```xml
<dependencies>
    <!-- Spring Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt</artifactId>
        <version>0.9.1</version>
    </dependency>
</dependencies>
```

### 3.2 配置

创建`SecurityConfig`类:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Autowired
    private UserDetailsService jwtUserDetailsService;

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf().disable()
                .authorizeRequests().antMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
                .and()
                .exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint)
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        httpSecurity.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
    }
}
```

### 3.3 JWT工具类

创建`JwtTokenUtil`类:

```java
@Component
public class JwtTokenUtil implements Serializable {
    private static final long serialVersionUID = -2550185165626007488L;
    public static final long JWT_TOKEN_VALIDITY = 5 * 60 * 60;

    @Value("${jwt.secret}")
    private String secret;

    // 生成token
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return doGenerateToken(claims, userDetails.getUsername());
    }

    private String doGenerateToken(Map<String, Object> claims, String subject) {
        return Jwts.builder().setClaims(claims).setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000))
                .signWith(SignatureAlgorithm.HS512, secret).compact();
    }

    // 验证token
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // 从token中获取用户名
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    private <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
    }

    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }
}
```

### 3.4 认证控制器

创建`AuthController`:

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtRequest authenticationRequest) throws Exception {
        authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
        final String token = jwtTokenUtil.generateToken(userDetails);
        return ResponseEntity.ok(new JwtResponse(token));
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }
}
```

## 4. 前端实现

### 4.1 安装依赖

```bash
npm install axios vue-router vuex
```

### 4.2 配置Vuex

创建`store/index.js`:

```javascript
import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    token: localStorage.getItem('token') || ''
  },
  mutations: {
    setToken(state, token) {
      state.token = token
    },
    clearToken(state) {
      state.token = ''
    }
  },
  actions: {
    login({ commit }, credentials) {
      return axios.post('/api/auth/login', credentials)
        .then(response => {
          const token = response.data.token
          localStorage.setItem('token', token)
          commit('setToken', token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        })
    },
    logout({ commit }) {
      localStorage.removeItem('token')
      commit('clearToken')
      delete axios.defaults.headers.common['Authorization']
    }
  },
  getters: {
    isLoggedIn: state => !!state.token
  }
})
```

### 4.3 登录组件

创建`Login.vue`:

```vue
<template>
  <div class="login">
    <h2>登录</h2>
    <form @submit.prevent="login">
      <input v-model="username" type="text" placeholder="用户名" required>
      <input v-model="password" type="password" placeholder="密码" required>
      <button type="submit">登录</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    const username = ref('')
    const password = ref('')

    const login = async () => {
      try {
        await store.dispatch('login', {
          username: username.value,
          password: password.value
        })
        router.push('/')
      } catch (error) {
        console.error('登录失败', error)
      }
    }

    return {
      username,
      password,
      login
    }
  }
}
</script>
```

### 4.4 路由守卫

在`router/index.js`中添加:

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

const routes = [
  // 定义路由...
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
```

## 5. 安全考虑

- 使用HTTPS加密所有通信
- 实现密码哈希存储（例如使用BCrypt）
- 实现登录尝试限制以防止暴力攻击
- 定期轮换JWT密钥
- 实现token刷新机制
- 在前端安全存储token（HttpOnly cookies）

## 6. 下一步

- 实现注册功能
- 添加邮箱验证
- 实现"忘记密码"功能
- 增加多因素认证
- 实现用户角色和权限系统

