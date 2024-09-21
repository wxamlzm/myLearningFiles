# Vue 3 关键变化和新特性概览

## 1. 组合式 API（Composition API）

组合式 API 是 Vue 3 最重要的新特性，它提供了一种新的组织组件逻辑的方式。

### 关键点：
- `setup()` 函数
- 响应式系统：`ref()`, `reactive()`
- 生命周期钩子：`onMounted()`, `onUpdated()` 等
- 计算属性和侦听器：`computed()`, `watch()`

### 示例：
```javascript
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    
    function increment() {
      count.value++
    }

    onMounted(() => {
      console.log('Component is mounted!')
    })

    return { count, increment }
  }
}
```

## 2. Teleport 组件

Teleport 允许你将组件的一部分模板"传送"到 DOM 中的另一个位置。

### 示例：
```html
<teleport to="body">
  <div class="modal">
    <!-- 模态框内容 -->
  </div>
</teleport>
```

## 3. 片段（Fragments）

Vue 3 组件现在可以有多个根节点。

### 示例：
```html
<template>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</template>
```

## 4. 响应式系统升级

Vue 3 使用 Proxy 代替 Object.defineProperty，提供了更好的性能和更全面的响应式覆盖。

### 关键点：
- 深层响应式
- 集合类型的完整支持（Map, Set）
- 响应式语法糖（实验性）

## 5. 生命周期钩子变化

- `beforeCreate` 和 `created` 被 `setup()` 替代
- 其他钩子前加 `on`：`onMounted()`, `onUpdated()` 等

## 6. 更好的 TypeScript 支持

Vue 3 是用 TypeScript 重写的，提供了更好的类型推断和支持。

## 7. 新的 Compiler

优化的模板编译器，生成更高效的渲染函数。

## 8. Suspense 组件（实验性）

用于协调异步依赖，处理异步组件的加载状态。

## 9. 提升（Hoisting）和 Tree-shaking

更好的静态树提升和 tree-shaking 支持，减小了打包大小。

## 10. 自定义渲染器 API

允许创建自定义渲染器，用于非 DOM 环境。

## 重点学习建议

1. 深入理解组合式 API 及其使用场景
2. 熟悉新的响应式系统，特别是 `ref` 和 `reactive` 的使用
3. 了解生命周期钩子的变化
4. 学习 Teleport 和 Fragments 的使用
5. 如果使用 TypeScript，关注 Vue 3 的类型系统改进

## 资源

- [Vue 3 官方文档](https://v3.vuejs.org/)
- [Vue Composition API 文档](https://v3.vuejs.org/guide/composition-api-introduction.html)
- [Vue 3 迁移指南](https://v3.vuejs.org/guide/migration/introduction.html)

记得在实践中应用这些新概念，以便更好地理解它们在实际开发中的作用。
