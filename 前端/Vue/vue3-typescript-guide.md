# Vue 3 与 TypeScript 开发指南

## 1. 项目设置

### 推荐配置
- 使用 Vite 创建 Vue 3 + TypeScript 项目：
  ```bash
  npm init vite@latest my-vue-ts-app -- --template vue-ts
  ```
- 在 `tsconfig.json` 中启用严格模式：
  ```json
  {
    "compilerOptions": {
      "strict": true,
      // 其他配置...
    }
  }
  ```

## 2. 组件定义

### 推荐使用 `<script setup>` 语法
```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref<number>(0)
</script>
```

### 定义 Props
```vue
<script setup lang="ts">
import { defineProps } from 'vue'

interface Props {
  message: string
  count?: number
}

const props = defineProps<Props>()
</script>
```

### 定义 Emits
```vue
<script setup lang="ts">
import { defineEmits } from 'vue'

const emit = defineEmits<{
  (e: 'update', value: string): void
  (e: 'delete'): void
}>()
```

## 3. 响应式数据

### 使用 `ref` 和 `reactive`
```typescript
import { ref, reactive } from 'vue'

const count = ref<number>(0)
const user = reactive<{ name: string; age: number }>({ name: 'John', age: 30 })
```

### 避免类型断言
尽量避免使用 `as` 进行类型断言，而是明确定义类型：
```typescript
// 避免
const data = reactive({}) as { value: string }

// 推荐
const data = reactive<{ value: string }>({ value: '' })
```

## 4. 计算属性和侦听器

### 计算属性
```typescript
import { computed, ref } from 'vue'

const firstName = ref('')
const lastName = ref('')

const fullName = computed(() => `${firstName.value} ${lastName.value}`)
```

### 侦听器
```typescript
import { watch, ref } from 'vue'

const searchQuery = ref('')

watch(searchQuery, (newValue, oldValue) => {
  console.log(`Query changed from ${oldValue} to ${newValue}`)
})
```

## 5. 方法和事件处理

### 方法类型定义
```typescript
const handleClick = (event: MouseEvent) => {
  console.log(event.target)
}
```

## 6. 使用 Composition API

### 提取可复用逻辑
```typescript
// useUser.ts
import { ref, Ref } from 'vue'

interface User {
  id: number
  name: string
}

export function useUser(userId: Ref<number>) {
  const user = ref<User | null>(null)

  // 假设这里有获取用户数据的逻辑

  return { user }
}

// 在组件中使用
import { useUser } from './useUser'

const userId = ref(1)
const { user } = useUser(userId)
```

## 7. 避错建议

1. **避免使用 `any` 类型**：尽量指定具体类型，如果不确定，可以使用 `unknown`。

2. **使用可选链和空值合并运算符**：
   ```typescript
   const userName = user?.name ?? 'Anonymous'
   ```

3. **为异步操作定义返回类型**：
   ```typescript
   async function fetchUser(): Promise<User> {
     // ...
   }
   ```

4. **使用类型守卫**：
   ```typescript
   function isUser(obj: any): obj is User {
     return 'id' in obj && 'name' in obj
   }
   ```

5. **对 API 响应使用接口**：
   ```typescript
   interface ApiResponse<T> {
     data: T
     status: number
     message: string
   }

   async function fetchData<T>(): Promise<ApiResponse<T>> {
     // ...
   }
   ```

6. **使用 `readonly` 防止意外修改**：
   ```typescript
   interface Config {
     readonly apiUrl: string
   }
   ```

7. **利用 TypeScript 的推断能力**：让 TypeScript 自动推断类型，减少冗余的类型注解。

## 8. 最佳实践

1. 保持一致的命名规范（如 camelCase 用于变量和方法，PascalCase 用于类型和接口）。

2. 使用 ESLint 和 Prettier 保持代码风格一致。

3. 经常使用的类型定义放在单独的文件中（如 `types.ts`）。

4. 对于复杂的类型，使用类型别名或接口来提高可读性。

5. 充分利用 IDE 的类型检查和自动完成功能。

6. 定期更新依赖，跟进 Vue 和 TypeScript 的最新特性。

记住，TypeScript 的目标是帮助你写出更安全、更可维护的代码。在开发过程中，要平衡类型安全和开发效率，找到适合你项目的最佳实践。
