# Vue3 + TypeScript 接口继承与目录结构规范

## 1. 目录结构

推荐的目录结构如下：

```
src/
├── types/               # 类型定义根目录
│   ├── common/         # 通用类型定义
│   │   ├── base.ts    # 基础类型（如分页、响应等）
│   │   └── enums.ts   # 枚举类型
│   ├── api/           # API相关类型定义
│   │   └── user.ts    # 用户模块API类型
│   ├── components/    # 组件相关类型定义
│   │   └── user.ts    # 用户模块组件类型
│   └── store/         # 状态管理相关类型定义
│       └── user.ts    # 用户模块状态类型
├── api/                # API 请求封装
│   └── user.ts        # 用户模块API
├── components/         # 组件目录
│   └── user/          # 用户模块组件
│       ├── form.vue   # 用户表单组件
│       └── list.vue   # 用户列表组件
└── views/             # 页面视图
    └── user/          # 用户模块页面
        ├── index.vue  # 用户列表页
        └── edit.vue   # 用户编辑页
```

## 2. 接口继承原则

### 2.1 基本原则

1. **单一职责**：每个接口应该只定义一个主要用途的数据结构
2. **最小完整**：接口应包含必需的字段，避免冗余
3. **分层清晰**：按数据流向和使用场景分层定义接口
4. **可维护性优先**：适度复用，避免过度耦合
5. **命名规范**：使用清晰的命名约定，便于理解和维护

### 2.2 继承策略

1. **基础接口优先**：
   - 将共用字段抽象为基础接口
   - 特定场景通过继承扩展

2. **工具类型配合**：
   - 使用 `Pick`、`Omit` 裁剪字段
   - 使用 `Partial`、`Required` 调整可选性
   - 使用 `Record`、`Exclude` 等辅助类型

3. **命名空间分组**：
   - 使用 namespace 按功能域分组
   - 避免类型命名冲突

## 3. 代码实现示例

### 3.1 基础类型定义 (src/types/common/base.ts)

```typescript
// 基础响应格式
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 分页参数
export interface PageParams {
  pageSize: number;
  pageNum: number;
}

// 分页响应
export interface PageResult<T> {
  list: T[];
  total: number;
}
```

### 3.2 用户模块类型定义 (src/types/api/user.ts)

```typescript
import type { PageParams, PageResult, ApiResponse } from '../common/base';

// 基础用户信息
export interface BaseUserInfo {
  name: string;
  age: number;
  email: string;
}

// API相关类型定义
export namespace UserAPI {
  // 查询参数
  export interface QueryParams extends PageParams {
    keyword?: string;
    status?: UserStatus;
  }

  // 创建用户参数
  export interface CreateParams extends BaseUserInfo {
    department: string;
  }

  // 更新用户参数
  export interface UpdateParams extends Partial<CreateParams> {
    id: number;
  }

  // 用户记录
  export interface UserRecord extends BaseUserInfo {
    id: number;
    createTime: string;
    updateTime: string;
    status: UserStatus;
  }

  // API响应类型
  export type QueryResponse = ApiResponse<PageResult<UserRecord>>;
  export type DetailResponse = ApiResponse<UserRecord>;
  export type CreateResponse = ApiResponse<{ id: number }>;
  export type UpdateResponse = ApiResponse<null>;
}
```

### 3.3 组件类型定义 (src/types/components/user.ts)

```typescript
import type { BaseUserInfo } from '../api/user';

export namespace UserComponent {
  // 表单数据类型
  export interface FormData extends BaseUserInfo {
    department: string;
  }

  // 表单属性类型
  export interface FormProps {
    initialData?: FormData;
    loading?: boolean;
    mode: 'create' | 'edit';
  }

  // 列表项类型
  export interface ListItem extends BaseUserInfo {
    id: number;
    statusText: string;
    department: string;
  }

  // 表格列配置
  export interface TableColumn {
    title: string;
    dataIndex: keyof ListItem;
    width?: number;
  }
}
```

### 3.4 API 实现示例 (src/api/user.ts)

```typescript
import type { UserAPI } from '@/types/api/user';
import { request } from '@/utils/request';

export const userApi = {
  query(params: UserAPI.QueryParams) {
    return request<UserAPI.QueryResponse>({
      url: '/api/users',
      method: 'GET',
      params
    });
  },

  create(data: UserAPI.CreateParams) {
    return request<UserAPI.CreateResponse>({
      url: '/api/users',
      method: 'POST',
      data
    });
  },

  update(data: UserAPI.UpdateParams) {
    return request<UserAPI.UpdateResponse>({
      url: `/api/users/${data.id}`,
      method: 'PUT',
      data
    });
  }
};
```

### 3.5 组件使用示例 (src/components/user/form.vue)

```typescript
<script lang="ts" setup>
import type { UserComponent } from '@/types/components/user';
import type { UserAPI } from '@/types/api/user';
import { userApi } from '@/api/user';

const props = defineProps<UserComponent.FormProps>();
const emit = defineEmits<{
  (e: 'success'): void;
}>();

const formData = ref<UserComponent.FormData>({
  name: '',
  age: 0,
  email: '',
  department: ''
});

const handleSubmit = async () => {
  if (props.mode === 'create') {
    await userApi.create(formData.value);
  } else {
    await userApi.update({
      id: props.initialData?.id!,
      ...formData.value
    });
  }
  emit('success');
};
</script>
```

## 4. 最佳实践建议

### 4.1 类型文件命名

- 使用模块名作为文件名 (如 `user.ts`, `product.ts`)
- 通用类型使用描述性名称 (如 `base.ts`, `common.ts`)
- 组件类型可使用 `.d.ts` 后缀 (如 `user.d.ts`)

### 4.2 类型导入导出

- 使用 `type` 关键字导入类型，避免运行时开销
- 相关类型放在同一个命名空间下
- 导出时使用明确的类型名称，避免使用 `export default`

### 4.3 类型复用建议

1. **通用类型优先**：
   - 优先使用项目中已有的通用类型
   - 避免重复定义相似的类型

2. **合理拆分**：
   - 按功能模块拆分类型文件
   - 避免单个文件过大

3. **版本控制**：
   - 类型变更要同步更新所有使用处
   - 考虑向后兼容性

4. **注释完善**：
   - 为复杂类型添加 JSDoc 注释
   - 说明类型的用途和注意事项

## 5. 注意事项

1. 避免循环依赖：类型定义之间避免形成循环依赖
2. 路径别名：推荐使用 `@/` 等路径别名，简化导入路径
3. 类型检查：定期运行 `tsc --noEmit` 检查类型问题
4. 文档维护：及时更新类型定义文档
5. 代码评审：类型定义变更需要重点评审

