# Vue3 响应式系统：ref vs reactive 完全指南

## 前置知识

### 1. Vue3 的响应式原理
- 基于 ES6 的 Proxy 实现响应式
- 能够监听对象的变化并触发更新
- 相比 Vue2 的 Object.defineProperty 有更好的性能和功能

### 2. 基本概念
- 响应式数据：能够自动追踪依赖并在数据变化时触发更新的数据
- 浅层响应式：只监听对象第一层属性的变化
- 深层响应式：递归监听对象所有层级的变化

## ref 和 reactive 的基本介绍

### ref
```typescript
// 定义
function ref<T>(value: T): Ref<UnwrapRef<T>>

// 使用示例
const count = ref(0)
const user = ref({ name: 'Alice' })

// 访问和修改
console.log(count.value)  // 0
count.value++            // 1
```

### reactive
```typescript
// 定义
function reactive<T extends object>(target: T): UnwrapNestedRefs<T>

// 使用示例
const state = reactive({ count: 0 })
const user = reactive({ name: 'Alice' })

// 访问和修改
console.log(state.count)  // 0
state.count++            // 1
```

## 使用场景对比

### 1. ref 适用场景
- 处理基本数据类型（string, number, boolean 等）
- 需要保持响应式的单一引用
- 需要在多个组合式函数之间传递响应式数据
- TypeScript 中需要明确的类型推导
```typescript
// 基本类型
const name = ref<string>('Alice')
const age = ref<number>(25)
const isActive = ref<boolean>(true)

// 复杂类型
const user = ref<{
  name: string
  age: number
}>({
  name: 'Alice',
  age: 25
})
```

### 2. reactive 适用场景
- 处理对象类型数据
- 处理复杂的数据结构
- 需要对象的多个属性保持响应式
- 主要用于组件的本地状态管理
```typescript
// 对象类型
const user = reactive({
  name: 'Alice',
  age: 25
})

// 复杂数据结构
const state = reactive({
  users: [],
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0
  }
})
```

## 最佳实践

### 1. ref 最佳实践
```typescript
// 1. 基本类型使用 ref
const count = ref(0)
const message = ref('')

// 2. 需要解构的对象使用 ref
const userData = ref({
  name: 'Alice',
  age: 25
})

// 可以安全解构
const { name, age } = toRefs(userData.value)

// 3. 组合式函数返回值使用 ref
function useCounter() {
  const count = ref(0)
  const increment = () => count.value++
  return { count, increment }
}
```

### 2. reactive 最佳实践
```typescript
// 1. 组件本地状态使用 reactive
const state = reactive({
  users: [],
  loading: false,
  filters: {
    status: 'active',
    type: 'all'
  }
})

// 2. 表单数据使用 reactive
const formData = reactive({
  username: '',
  password: '',
  remember: false
})

// 3. 复杂数据结构使用 reactive
const tableData = reactive({
  items: [],
  selection: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0
  },
  sorting: {
    field: null,
    order: null
  }
})
```

## 注意事项

### 1. ref 注意事项
- 始终通过 .value 访问和修改值
- 在模板中会自动解包，不需要 .value
- 解构会丢失响应性，需要使用 toRefs
```typescript
const user = ref({ name: 'Alice', age: 25 })

// ❌ 错误方式：直接解构会丢失响应性
const { name, age } = user.value

// ✅ 正确方式：使用 toRefs
const { name, age } = toRefs(user.value)
```

### 2. reactive 注意事项
- 不能直接赋值整个对象，会破坏响应性
- 不能解构使用，会丢失响应性
- 数组的索引和 length 变更不会触发响应式
```typescript
const state = reactive({ count: 0 })

// ❌ 错误方式：直接赋值新对象
state = { count: 1 }  // 这会破坏响应性

// ✅ 正确方式：修改属性值
state.count = 1

// ❌ 错误方式：解构使用
const { count } = state  // count 失去响应性

// ✅ 正确方式：使用 toRefs 后解构
const { count } = toRefs(state)
```

## 实际应用示例

### 1. 表单处理
```typescript
// 使用 reactive 管理表单状态
const formState = reactive({
  username: '',
  password: '',
  remember: false,
  loading: false,
  errors: {}
})

// 表单提交处理
const handleSubmit = async () => {
  formState.loading = true
  try {
    await submitForm(formState)
    formState.errors = {}
  } catch (error) {
    formState.errors = error.validationErrors
  } finally {
    formState.loading = false
  }
}
```

### 2. 数据列表
```typescript
// 使用 reactive 管理列表状态
const listState = reactive({
  items: [],
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0
  }
})

// 使用 ref 管理独立状态
const searchKeyword = ref('')
const selectedIds = ref<string[]>([])

// 加载数据
const loadData = async () => {
  listState.loading = true
  try {
    const result = await fetchData({
      page: listState.pagination.current,
      pageSize: listState.pagination.pageSize,
      keyword: searchKeyword.value
    })
    listState.items = result.items
    listState.pagination.total = result.total
  } catch (error) {
    listState.error = error
  } finally {
    listState.loading = false
  }
}
```

## 性能考虑

### 1. ref
- 适合频繁变化的简单数据
- 基本类型值的响应式性能较好
- 深层对象的变更追踪开销较大

### 2. reactive
- 适合整体状态管理
- 对象属性的响应式性能好
- 避免不必要的深层响应式转换

## 常见问题解决

### 1. 类型报错问题
```typescript
// 问题：reactive 不接受 null
const data = reactive<FormData | null>(null) // 错误

// 解决方案1：使用 ref
const data = ref<FormData | null>(null)

// 解决方案2：使用空对象
const data = reactive<FormData>({} as FormData)
```

### 2. 响应式丢失问题
```typescript
// 问题：解构后丢失响应式
const state = reactive({ count: 0 })
const { count } = state // 丢失响应式

// 解决方案：使用 toRefs
const state = reactive({ count: 0 })
const { count } = toRefs(state) // 保持响应式
```

### 3. 数组响应式问题
```typescript
// 问题：通过索引修改数组可能不触发更新
const list = reactive([1, 2, 3])
list[0] = 4 // 可能不会触发更新

// 解决方案：使用数组方法
list.splice(0, 1, 4)
// 或
list.push(4)
```
