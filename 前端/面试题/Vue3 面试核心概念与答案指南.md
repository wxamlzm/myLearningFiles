# Vue3 面试核心概念与答案指南

## 常见面试问题及标准回答

### 1. Vue3 相比 Vue2 有哪些重要的变化？
**标准回答**：
- 核心架构升级：引入 Composition API，提供更好的代码组织方式
- 性能提升：重写虚拟DOM，优化diff算法，代码体积减少41%
- TypeScript支持：源码采用TypeScript重写，提供更好的类型推导
- 新特性：Teleport、Fragments、Suspense等组件
- 构建工具升级：Vite取代Vue-CLI作为推荐构建工具

### 2. 请解释Composition API的优势
**标准回答**：
- 更好的代码组织：相关联的代码可以组织在一起
- 更好的逻辑复用：通过组合函数实现逻辑复用
- 更好的类型推导：相比Options API有更好的TypeScript支持
- 减少this的使用：没有this的烦恼，代码更容易理解
- 更好的代码压缩：tree-shaking更友好

### 3. ref和reactive的区别是什么？
**标准回答**：
- ref用于基本类型数据的响应式，reactive用于对象的响应式
- ref需要.value访问，reactive直接访问
- ref可以作用于所有类型，会自动对对象类型使用reactive
- reactive只能用于对象类型（数组、普通对象等）
- ref可以模板中自动解包，不需要.value

### 4. Vue3的响应式原理是什么？
**标准回答**：
- 基于Proxy实现，不再使用Object.defineProperty
- 可以监听对象属性的添加和删除
- 可以监听数组的索引和length修改
- 性能更好，不需要递归遍历对象
- 懒观察（lazy observation）：只有被访问时才会被观察

### 5. setup函数的作用是什么？
**标准回答**：
- 是Composition API的入口点
- 在beforeCreate之前执行
- 接收props和context作为参数
- 返回的内容可以在模板中使用
- 没有this上下文

### 6. watchEffect和watch的区别？
**标准回答**：
- watchEffect自动收集依赖并监听
- watch需要明确指定监听的数据
- watchEffect立即执行
- watch可以访问改变前的值
- watch可以监听多个数据源

### 7. Vue3中的生命周期有哪些变化？
**标准回答**：
- 所有生命周期钩子前缀改为on
- beforeDestroy改名为beforeUnmount
- destroyed改名为unmounted
- 生命周期钩子需要手动导入
- setup中可以使用新的生命周期钩子

### 8. defineProps和defineEmits的作用？
**标准回答**：
- 用于在script setup中声明props和emits
- 提供更好的类型推导
- 编译器宏，不需要导入
- 使用更简洁，代码更清晰
- 可以使用运行时声明和类型声明两种方式

### 9. 什么是Teleport组件？
**标准回答**：
- 可以将内容渲染到指定DOM节点
- 常用于模态框、提示框等场景
- 不影响组件逻辑
- 可以与transition配合使用
- 支持动态禁用

### 10. Vue3的异步组件如何使用？
**标准回答**：
- 使用defineAsyncComponent定义
- 支持加载和错误状态处理
- 可以设置加载延迟和超时
- 支持Suspense组件配合使用
- 更好的加载性能控制

## 核心知识点详解

### 响应式系统
1. **Proxy基础**
   - 代理对象的所有操作
   - 可以拦截多种操作符
   - 性能更好
   - 浏览器原生支持

2. **依赖收集**
   - 自动跟踪依赖关系
   - 精确的依赖更新
   - 支持嵌套属性
   - 响应式解构

3. **响应式API**
   - ref：基本类型
   - reactive：对象类型
   - readonly：只读代理
   - toRefs：响应式解构
   - computed：计算属性

### 组合式API
1. **setup函数**
   - 组件初始化入口
   - 数据准备
   - 方法定义
   - 生命周期注册
   - 响应式系统使用

2. **组合式函数**
   - 逻辑复用
   - 状态共享
   - 代码组织
   - 类型推导
   - 测试友好

### 新特性应用
1. **Fragments**
   - 多根节点
   - 更灵活的模板
   - 性能优化
   - 更好的复用

2. **Suspense**
   - 异步加载
   - 加载状态处理
   - 错误边界
   - 更好的用户体验
