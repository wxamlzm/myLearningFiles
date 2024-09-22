# Vite loadEnv 函数详解

## 1. 概述

在 Vite 项目中，`loadEnv` 函数是一个强大的工具，用于加载和处理环境变量。它允许我们根据不同的运行模式加载相应的环境变量，从而实现灵活的配置管理。

## 2. 函数签名

```typescript
const env = loadEnv(mode, envDir, prefixes)
```

## 3. 参数详解

### 3.1 mode

- **类型**：`string`
- **描述**：当前的运行模式
- **常见值**：'development'、'production'、'test'
- **如何设置**：
  1. 通过 npm scripts（默认情况）
  2. 通过命令行参数
  3. 在 `vite.config.ts` 中自动传入

#### 示例：

```json
// package.json
{
  "scripts": {
    "dev": "vite",             // mode 为 'development'
    "build": "vite build",     // mode 为 'production'
    "preview": "vite preview"  // mode 为 'production'
  }
}
```

```bash
# 命令行指定 mode
vite --mode development
vite build --mode production
```

### 3.2 envDir

- **类型**：`string`
- **描述**：环境文件所在的目录路径
- **常见用法**：`process.cwd()`

#### 说明：
`process.cwd()` 返回 Node.js 进程的当前工作目录。这通常是项目的根目录，也是存放 `.env` 文件的地方。

### 3.3 prefixes

- **类型**：`string | string[]`
- **描述**：要加载的环境变量的前缀
- **默认值**：`'VITE_'`
- **特殊情况**：传入空字符串 `''` 会加载所有环境变量

## 4. 在 vite.config.ts 中的使用

```typescript
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  // 加载环境变量
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

## 5. 环境文件加载顺序

Vite 会按以下顺序加载环境文件：

1. `.env`
2. `.env.local`
3. `.env.[mode]`
4. `.env.[mode].local`

后加载的文件中的变量会覆盖先加载的文件中的同名变量。

## 6. 最佳实践

1. 使用 `VITE_` 前缀命名客户端可用的环境变量。
2. 敏感信息（如 API 密钥）应该只在服务器端使用，不要以 `VITE_` 开头。
3. 为不同环境创建不同的 `.env` 文件（如 `.env.development`、`.env.production`）。
4. 使用 `.env.local` 存储本地特定的配置，并将其添加到 `.gitignore`。

## 7. 注意事项

- 环境变量在构建时被静态替换。这意味着在引用环境变量时，应该使用 `import.meta.env.VITE_XXX` 而不是 `process.env.VITE_XXX`。
- 只有以 `VITE_` 开头的变量才会暴露给客户端代码。

通过正确使用 `loadEnv` 函数和环境变量，你可以轻松地管理不同环境的配置，提高项目的灵活性和安全性。
