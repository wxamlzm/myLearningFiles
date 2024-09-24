# Vite 环境变量和配置指南

## 1. 基础概念

### 1.1 什么是环境变量？

环境变量是在操作系统层面上存在的动态命名值，可以影响运行在系统上的进程的行为。在开发中，我们often 使用环境变量来存储配置信息，如API端点、数据库连接字符串等。

### 1.2 Vite 中的环境变量

Vite 提供了一种便捷的方式来管理不同环境（如开发、测试、生产）的配置。它使用 `.env` 文件来定义环境变量，并提供了一种模式（mode）的概念来加载不同的环境配置。

## 2. Vite 环境变量文件

Vite 使用以下文件来加载环境变量：

- `.env`：所有情况下都会加载
- `.env.local`：所有情况下都会加载，但会被 git 忽略
- `.env.[mode]`：只在特定模式下加载
- `.env.[mode].local`：只在特定模式下加载，但会被 git 忽略

加载优先级（从低到高）：
`.env` < `.env.local` < `.env.[mode]` < `.env.[mode].local`

## 3. 环境变量的使用

### 3.1 定义环境变量

在 `.env` 文件中定义变量：

```
VITE_API_URL=http://api.example.com
VITE_APP_TITLE=My Vite App
```

注意：只有以 `VITE_` 为前缀的变量才会被 Vite 暴露给客户端源码。

### 3.2 在代码中使用环境变量

在 JavaScript/TypeScript 代码中：

```typescript
console.log(import.meta.env.VITE_API_URL);
console.log(import.meta.env.VITE_APP_TITLE);
```

在 Vue 模板中：

```vue
<template>
  <h1>{{ import.meta.env.VITE_APP_TITLE }}</h1>
</template>
```

## 4. 模式（Modes）

### 4.1 预定义模式

Vite 有两个预定义的模式：

- `development`：用于 `vite` 和 `vite serve`
- `production`：用于 `vite build`

### 4.2 自定义模式

你可以通过命令行参数 `--mode` 来指定自定义模式：

```bash
vite build --mode staging
```

这将加载 `.env.staging` 文件（如果存在）。

## 5. 最佳实践

1. 使用 `.env` 存储所有环境共享的变量
2. 使用 `.env.development` 存储开发环境特定的变量
3. 使用 `.env.production` 存储生产环境特定的变量
4. 使用 `.env.local` 或 `.env.[mode].local` 存储本地特定的变量，这些不应该被提交到版本控制系统
5. 在 `.gitignore` 文件中添加 `*.local` 以防止本地环境文件被提交

## 6. TypeScript 支持

为了在 TypeScript 中获得环境变量的类型支持，可以创建一个 `env.d.ts` 文件：

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

## 7. 高级配置

### 7.1 在 vite.config.ts 中使用环境变量

```typescript
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
  // 加载 env 文件基于 `mode` 
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    // vite 配置
    define: {
      __APP_ENV__: env.APP_ENV
    }
  }
})
```

### 7.2 条件配置

你可以基于当前命令或模式来条件性地进行配置：

```typescript
export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    return {
      // 开发特定配置
    }
  } else {
    return {
      // 构建特定配置
    }
  }
})
```

## 8. 安全考虑

- 不要在客户端代码中存储敏感信息（如API密钥）
- 使用服务端来处理敏感操作
- 考虑使用环境变量加密工具来增加安全性

## 9. 调试技巧

- 使用 `console.log(import.meta.env)` 来查看所有可用的环境变量
- 在构建过程中使用 `--debug` 标志来查看更多信息：`vite build --debug`

通过遵循这些指南和最佳实践，你可以有效地管理 Vite 项目中的环境变量和配置，使你的开发过程更加高效和安全。
