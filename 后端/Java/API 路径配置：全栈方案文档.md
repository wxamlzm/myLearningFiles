# 完整的前后端API配置和应用实例

## 后端配置（Spring Boot）

### 1. `application.properties`
```properties
server.servlet.context-path=/api
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
```

### 2. `ApiConfig.java`
```java
package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ApiConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
    }
}
```

### 3. `User.java` (实体类)
```java
package com.example.demo.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private String email;

    // Getters and setters
}
```

### 4. `UserRepository.java`
```java
package com.example.demo.repository;

import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
```

### 5. `UserController.java`
```java
package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")  // 注意这里不需要/api，因为已经在application.properties中设置了
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    // 其他CRUD操作...
}
```

## 前端配置（Vue 3 + Vite）

### 1. `.env.development`
```
VITE_API_BASE_PATH=/api
VITE_API_SERVER_URL=http://localhost:8080
```

### 2. `vite.config.ts`
```typescript
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [vue()],
    server: {
      proxy: {
        [env.VITE_API_BASE_PATH]: {
          target: env.VITE_API_SERVER_URL,
          changeOrigin: true,
        }
      }
    }
  }
})
```

### 3. `src/api/index.ts`
```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_PATH,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
```

### 4. `src/components/UserList.vue`
```vue
<template>
  <div>
    <h2>User List</h2>
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.name }} - {{ user.email }}</li>
    </ul>
    <form @submit.prevent="addUser">
      <input v-model="newUser.name" placeholder="Name" required>
      <input v-model="newUser.email" placeholder="Email" required>
      <button type="submit">Add User</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import api from '../api'

export default defineComponent({
  setup() {
    const users = ref([])
    const newUser = ref({ name: '', email: '' })

    const fetchUsers = async () => {
      try {
        const response = await api.get('/users')
        users.value = response.data
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    const addUser = async () => {
      try {
        await api.post('/users', newUser.value)
        newUser.value = { name: '', email: '' }
        await fetchUsers()
      } catch (error) {
        console.error('Error adding user:', error)
      }
    }

    onMounted(fetchUsers)

    return { users, newUser, addUser }
  }
})
</script>
```

## `rewrite` 和版本管理

关于 `rewrite` 在版本管理中的应用，您的观察很有洞察力。虽然在当前的简单配置中我们没有使用 `rewrite`，但它确实可以用于API版本控制。例如：

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/v1/, '/api')
    }
  }
}
```

这种配置允许前端使用 `/api/v1/users`，而后端仍然接收 `/api/users`。这为前端提供了版本化API的灵活性，同时允许后端保持一致的路径。

在更复杂的场景中，您可以根据不同的API版本使用不同的 `rewrite` 规则，例如：

```javascript
server: {
  proxy: {
    '^/api/v1': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/v1/, '/api')
    },
    '^/api/v2': {
      target: 'http://localhost:8081',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/v2/, '/api')
    }
  }
}
```

这允许您在前端使用不同版本的API，同时将请求路由到不同的后端服务器或路径。

总的来说，`rewrite` 提供了一种强大的方式来管理API版本和路径，特别是在需要保持向后兼容性或逐步迁移到新API版本的情况下。
