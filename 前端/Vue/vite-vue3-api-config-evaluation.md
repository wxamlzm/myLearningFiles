# Vue 3 with Vite API 配置方法评估文档

## 1. 引言

在使用 Vite 构建的 Vue 3 项目中配置 API 请求与之前使用 webpack 的方式有所不同。本文档将评估几种主要的配置方法，重点关注 Vite 的特性和与之前配置的区别。

## 2. Vite 与 webpack 配置的主要区别

1. 配置文件：Vite 使用 `vite.config.ts`（或 .js），而不是 `vue.config.js`。
2. 语法：Vite 配置使用 ES 模块语法。
3. 开发服务器：Vite 的开发服务器比 webpack 更快，使用原生 ES 模块。
4. 环境变量：Vite 使用 `import.meta.env` 而不是 `process.env`。

## 3. 配置方法比较

### 3.1 Vite 开发服务器代理配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

**优点：**
- 配置简单，与 webpack 版本类似
- Vite 的快速热模块替换 (HMR) 使开发更高效
- 自动处理开发环境中的跨域问题

**缺点：**
- 仅适用于开发环境

**适用场景：** 开发环境，特别是当后端 API 地址相对固定时

### 3.2 环境变量配置

```
# .env.development
VITE_API_URL=http://localhost:3000

# .env.production
VITE_API_URL=https://api.example.com
```

```typescript
// api/config.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

export default api
```

**优点：**
- 可以轻松切换不同环境
- Vite 原生支持 `.env` 文件，无需额外配置
- 使用 `import.meta.env` 访问环境变量，type-safe

**缺点：**
- 需要前缀 `VITE_` 才能在客户端代码中访问

**适用场景：** 多环境部署，需要频繁切换 API 地址的项目

### 3.3 运行时配置

```html
<!-- index.html -->
<script>
  window.apiConfig = {
    apiUrl: '<%- API_URL %>'
  }
</script>
```

```typescript
// api/config.ts
import axios from 'axios'

const api = axios.create({
  baseURL: window.apiConfig.apiUrl
})

export default api
```

**优点：**
- 可以在不重新构建的情况下更改 API 地址
- 适用于所有环境

**缺点：**
- 需要服务器端支持动态注入配置
- 增加了额外的全局变量

**适用场景：** 需要频繁更改 API 地址且不想重新构建的场景

### 3.4 Composition API 配置

```typescript
// api/index.ts
import { inject, provide, InjectionKey } from 'vue'
import axios, { AxiosInstance } from 'axios'

const ApiSymbol: InjectionKey<AxiosInstance> = Symbol()

export const provideApi = () => {
  const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })
  provide(ApiSymbol, api)
}

export const useApi = () => {
  const api = inject(ApiSymbol)
  if (!api) throw new Error('API instance not provided')
  return api
}
```

**优点：**
- 与 Vue 3 的 Composition API 集成良好
- 类型安全，便于在组件中使用和测试

**缺点：**
- 相对复杂，需要在应用启动时提供 API 实例

**适用场景：** 大型应用，需要更细粒度控制 API 配置和使用的场景

## 4. 推荐方案

考虑到 Vite 的特性和 Vue 3 的最佳实践，我们推荐结合使用环境变量和 Vite 的代理配置：

1. 使用环境变量存储 API 地址：

```
# .env.development
VITE_API_URL=http://localhost:3000

# .env.production
VITE_API_URL=https://api.example.com
```

2. 在 `vite.config.ts` 中配置代理：

```typescript
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [vue()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
```

3. 在 API 配置文件中使用环境变量：

```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

export default api
```

这种方法结合了环境变量的灵活性和 Vite 代理的便利性，同时利用了 Vite 的快速开发服务器和原生 ES 模块支持。

## 5. 结论

Vite 在 Vue 3 项目中带来了显著的性能改进和开发体验提升。虽然配置方法与 webpack 有所不同，但核心概念仍然相似。选择配置方法时，应考虑项目规模、团队熟悉度和部署需求。推荐的方案提供了灵活性和易用性的平衡，适合大多数 Vue 3 with Vite 项目。

重要的是要注意 Vite 的一些特性，如使用 `import.meta.env` 访问环境变量，这些可以帮助你更好地利用 Vite 的优势。
