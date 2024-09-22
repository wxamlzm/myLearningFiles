# Vue 3 Vite 环境变量配置及 API 统一抽象文档

## 1. 环境变量配置

在 Vite 项目中，环境变量的使用有一些特定的规则和最佳实践：

1. **VITE 前缀**：所有要在客户端使用的环境变量必须以 `VITE_` 开头。这是 Vite 的安全机制，用来防止意外暴露服务器端密钥。

2. **环境文件**：Vite 使用 dotenv 加载额外的环境变量。你可以使用 `.env` 文件来设置环境变量：

   - `.env`：所有情况下都会加载
   - `.env.local`：所有情况下都会加载，但会被 git 忽略
   - `.env.[mode]`：只在指定模式下加载（如 `.env.production`）

3. **访问环境变量**：在 Vite 项目中，使用 `import.meta.env` 来访问环境变量，而不是 `process.env`。

示例环境文件（`.env.development`）：

```
VITE_API_URL=http://localhost:3000
VITE_APP_TITLE=My Vue 3 App (Dev)
```

## 2. Vite 配置文件注解

下面是 `vite.config.ts` 文件的详细注解：

```typescript
// 从 vite 包中导入 defineConfig 和 loadEnv 函数
import { defineConfig, loadEnv } from 'vite'
// 导入 Vue 3 插件
import vue from '@vitejs/plugin-vue'

// 使用 defineConfig 来配置 Vite
// 这个函数接收一个配置对象或一个返回配置对象的函数
export default defineConfig(({ mode }) => {
  // loadEnv 函数用于加载指定模式下的环境变量
  // 参数：模式（如 'development'）、环境文件所在目录、环境变量前缀（空字符串表示加载所有变量）
  const env = loadEnv(mode, process.cwd(), '')
  
  // 返回 Vite 配置对象
  return {
    // 配置 Vite 插件
    plugins: [vue()],
    
    // 开发服务器配置
    server: {
      // 配置代理
      proxy: {
        // 将所有 /api 开头的请求代理到目标服务器
        '/api': {
          // 目标服务器地址，从环境变量中读取
          target: env.VITE_API_URL,
          // 改变源头，将主机头的来源更改为目标 URL
          changeOrigin: true,
          // 重写路径，移除 /api 前缀
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
```

这个配置文件动态加载环境变量，并使用这些变量来设置开发服务器的代理。这允许你在不同环境中灵活地切换 API 地址。

## 3. API 统一抽象

为了统一管理 API 请求，我们可以创建一个 API 实例并在整个应用中使用它。以下是一个基本的实现：

```typescript
// src/api/index.ts

import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
  // 使用环境变量中的 API URL
  baseURL: import.meta.env.VITE_API_URL,
  // 可以在这里添加其他配置，如超时时间、请求头等
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么，例如添加认证 token
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data
  },
  (error) => {
    // 对响应错误做点什么
    // 例如，统一的错误处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 处理未授权错误
          break
        // ... 其他错误状态处理
      }
    }
    return Promise.reject(error)
  }
)

export default api
```

## 4. 在组件中使用

在 Vue 组件中，你可以这样使用配置好的 API：

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'

const data = ref(null)

onMounted(async () => {
  try {
    // 使用配置好的 API 实例发起请求
    data.value = await api.get('/some-endpoint')
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
})
</script>

<template>
  <div>
    <!-- 使用获取到的数据 -->
    <pre>{{ data }}</pre>
  </div>
</template>
```

## 5. 结论

通过这种方式，我们实现了：

1. 使用 Vite 的环境变量来管理不同环境的配置。
2. 在 Vite 配置文件中设置代理，解决开发环境的跨域问题。
3. 创建一个统一的 API 实例，集中管理所有的 HTTP 请求。
4. 在这个 API 实例中，我们可以轻松地添加全局的配置、拦截器和错误处理。

这种方法既保持了配置的灵活性，又提供了一个清晰、一致的方式来管理 API 请求。它特别适合中大型的 Vue 3 项目，可以显著提高代码的可维护性和可读性。
