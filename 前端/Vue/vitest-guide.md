# Vitest 单元测试指南

## 简介

Vitest 是一个基于 Vite 的快速单元测试框架，专为 Vue 3 和现代 JavaScript 项目设计。它提供了与 Jest 类似的 API，但速度更快，配置更简单。

## 基本概念

1. **测试文件**: 通常以 `.spec.js`, `.spec.ts`, `.test.js`, 或 `.test.ts` 结尾。
2. **测试套件**: 使用 `describe` 函数组织相关的测试。
3. **测试用例**: 使用 `it` 或 `test` 函数定义单个测试。
4. **断言**: 使用 `expect` 函数来验证结果。

## 基本用法

### 运行测试

使用以下命令运行测试：

```bash
npm run test:unit
```

### 编写测试

以下是一个简单的测试文件示例：

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from './MyComponent.vue'

describe('MyComponent', () => {
  it('renders properly', () => {
    const wrapper = mount(MyComponent, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
```

## 常用断言

Vitest 使用与 Jest 类似的断言 API：

- `expect(value).toBe(expected)`: 严格相等
- `expect(value).toEqual(expected)`: 深度相等
- `expect(value).toBeTruthy()`: 检查真值
- `expect(value).toHaveLength(number)`: 检查长度
- `expect(fn).toThrow(error?)`: 检查是否抛出异常

## 异步测试

对于异步操作，可以使用 async/await：

```typescript
import { describe, it, expect } from 'vitest'
import { fetchUserData } from './api'

describe('API', () => {
  it('fetches user data', async () => {
    const userData = await fetchUserData(1)
    expect(userData).toHaveProperty('name')
  })
})
```

## 模拟（Mocking）

Vitest 提供了强大的模拟功能：

```typescript
import { describe, it, expect, vi } from 'vitest'
import { doSomething } from './myModule'

vi.mock('./myModule', () => ({
  doSomething: vi.fn().mockReturnValue('mocked value')
}))

describe('Mocking example', () => {
  it('uses mocked function', () => {
    expect(doSomething()).toBe('mocked value')
  })
})
```

## 覆盖率报告

要生成覆盖率报告，可以在 `vite.config.ts` 中添加以下配置：

```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul' // 或 'c8'
    }
  }
})
```

然后运行：

```bash
npm run test:unit -- --coverage
```

## 最佳实践

1. 保持测试简单和独立。
2. 使用描述性的测试名称。
3. 测试组件的公共 API 和关键功能。
4. 使用 `beforeEach` 和 `afterEach` 进行测试设置和清理。
5. 适当使用模拟来隔离被测试的单元。

## 结论

Vitest 提供了一个强大而灵活的测试环境，非常适合 Vue 3 和 TypeScript 项目。通过编写全面的测试，您可以提高代码质量，减少 bug，并使重构变得更加安全。
