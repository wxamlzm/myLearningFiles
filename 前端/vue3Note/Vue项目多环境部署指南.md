# Vue项目多环境部署指南

## 背景
在实际项目中，前端项目通常需要在不同环境（本地开发、测试、预发布、生产）中正确配置路由、接口和资源路径。本文档旨在帮助解决常见的部署配置问题。

## 1. Webpack配置 (vue.config.js)

### 1.1 基本配置示例
```javascript
module.exports = {
  // 根据不同环境配置基础路径
  publicPath: process.env.NODE_ENV === 'production' 
    ? '/your-frontend-namespace/'  // 测试环境的具体命名空间
    : '/',
  
  // 代理配置
  devServer: {
    proxy: {
      '/api': {
        target: '后端测试环境地址',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '' // 重写路径
        }
      }
    }
  }
}
```

## 2. 环境变量管理

### 2.1 创建环境文件
在项目根目录创建以下文件：
- `.env.development`（本地开发）
- `.env.test`（测试环境）
- `.env.production`（生产环境）

#### .env.development
```
VUE_APP_BASE_URL=/api
VUE_APP_NAMESPACE=
```

#### .env.test
```
VUE_APP_BASE_URL=/your-frontend-namespace/api
VUE_APP_NAMESPACE=/your-frontend-namespace
```

## 3. Axios配置

### 3.1 请求工具封装
```javascript
// src/utils/request.js
import axios from 'axios'

const service = axios.create({
  // 从环境变量读取基础URL
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 可以在这里添加token等
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
```

## 4. Vue Router配置

### 4.1 路由基础配置
```javascript
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  // 使用history模式
  mode: 'history',
  
  // 从环境变量读取基础路径
  base: process.env.VUE_APP_NAMESPACE || '/',
  
  routes: [
    // 你的路由配置
  ]
})

export default router
```

## 5. 常见问题排查

### 5.1 资源加载问题
- 检查`publicPath`配置是否正确
- 确认环境变量是否正确设置
- 查看Network面板，检查资源加载路径

### 5.2 接口访问问题
- 验证`baseURL`配置
- 检查代理配置是否正确
- 对比本地和线上环境的接口调用方式

## 6. CICD注意事项

### 6.1 构建配置
- 确保在CICD流程中正确设置NODE_ENV
- 使用对应环境的环境变量文件
- 验证构建输出的资源路径

## 7. 最佳实践

1. 统一管理环境配置
2. 使用环境变量解耦配置
3. 保持本地开发和线上环境的一致性
4. 细心检查每个环境的具体配置

## 8. 调试技巧

- 使用`console.log`打印环境变量
- 在浏览器Network面板仔细检查资源和接口路径
- 对比本地和线上环境的具体配置差异

## 结语
多环境配置是前端工程中的常见挑战。通过合理的配置管理和环境变量控制，可以有效解决部署中的各种问题。

建议：
- 与后端紧密沟通
- 保持配置的灵活性
- 及时调整和优化
```