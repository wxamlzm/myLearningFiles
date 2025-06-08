# TypeScript Interface 与 Type 使用指南

## 1. 基本概念与区别

### Interface
Interface 主要用于定义对象的形状（shape），是一种契约式的类型定义方式。

```typescript
interface IUser {
  name: string;
  age: number;
}

// 支持继承
interface IAdmin extends IUser {
  permissions: string[];
}

// 支持声明合并
interface IUser {
  email: string;  // 会与之前的定义合并
}
```

### Type
Type 是类型别名，可以为任何类型定义一个名字，包括基本类型、联合类型、元组等。

```typescript
type TUser = {
  name: string;
  age: number;
}

// 支持联合类型
type TStatus = 'pending' | 'success' | 'failed';

// 支持交叉类型
type TAdmin = TUser & {
  permissions: string[];
}
```

## 2. 使用场景对比

### 使用 Interface 的场景
1. 定义对象结构
```typescript
interface IHttpResponse {
  code: number;
  data: any;
  message: string;
}
```

2. 类的实现
```typescript
interface IRepository {
  find(id: string): Promise<any>;
  save(data: any): Promise<void>;
}

class UserRepository implements IRepository {
  // 必须实现接口定义的所有方法
}
```

3. 需要声明合并的场景
```typescript
// 第三方库扩展
interface Window {
  myGlobalValue: string;
}
```

### 使用 Type 的场景
1. 联合类型或交叉类型
```typescript
type TResult = TSuccess | TError;
type TFullUser = TUser & TUserProfile;
```

2. 工具类型和映射类型
```typescript
type TPartialUser = Partial<TUser>;
type TReadonlyUser = Readonly<TUser>;
```

3. 类型索引和嵌套定义
```typescript
type TApiParams = {
  Base: {
    token: string;
    timestamp: number;
  };
  User: TApiParams['Base'] & {
    userId: string;
  };
  Admin: TApiParams['User'] & {
    privileges: string[];
  };
}
```

## 3. 最佳实践示例

### 实际项目中的完整示例

```typescript
// 1. 基础接口定义
interface IBaseParams {
  token: string;
  timestamp: number;
}

// 2. 业务相关类型定义
type TApiResponse<T> = {
  code: number;
  data: T;
  message: string;
}

// 3. 具体业务模型
interface IGitlabBase {
  gitlabName: string;
  roleAccountDeveloper: string;
}

// 4. 组合类型定义
type TGitlabParams = {
  Add: IGitlabBase;
  Edit: IGitlabBase & {
    id: string | number;
  };
}

// 5. 实际使用
const handleGitlab = async (
  params: TGitlabParams['Add'] | TGitlabParams['Edit'],
  type: 'add' | 'edit'
): Promise<TApiResponse<void>> => {
  const baseUrl = '/api/gitlab';
  const url = type === 'add' ? `${baseUrl}/add` : `${baseUrl}/edit`;
  
  return request.post(url, params);
}
```

### 类型守卫的使用

```typescript
// 类型守卫函数
function isEditParams(params: TGitlabParams['Add'] | TGitlabParams['Edit']): 
  params is TGitlabParams['Edit'] {
  return 'id' in params;
}

// 在业务代码中使用
const processGitlab = (params: TGitlabParams['Add'] | TGitlabParams['Edit']) => {
  if (isEditParams(params)) {
    // TypeScript 知道这里的 params 是 Edit 类型
    console.log(params.id);
  } else {
    // TypeScript 知道这里的 params 是 Add 类型
    console.log(params.gitlabName);
  }
}
```

## 4. 选择建议

### 使用 Interface 当：
- 定义对象的形状（Shape）
- 需要继承/实现的场景
- 需要声明合并
- 定义类的契约
- 面向对象编程风格的代码

### 使用 Type 当：
- 需要使用联合类型或交叉类型
- 需要使用工具类型和映射类型
- 需要使用类型索引和嵌套定义
- 定义函数类型
- 需要更灵活的类型操作

## 5. 命名规范

### 推荐的命名约定：
- Interface: 使用 `I` 前缀，如 `IUser`
- Type: 使用 `T` 前缀，如 `TUser`
- 通用类型参数：使用描述性名称，如 `TData`, `TResponse`
- 枚举：直接使用 PascalCase，如 `UserRole`

```typescript
// 完整示例
interface IUser {
  id: string;
  name: string;
}

type TUserResponse = {
  data: IUser;
  status: 'success' | 'error';
}

enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}
```

## 6. 注意事项

1. 一致性：
   - 在同一个项目中保持一致的命名规范
   - 相关的类型定义尽量放在一起
   - 对相似的类型使用相似的定义方式

2. 可维护性：
   - 适当的类型注释
   - 合理的类型拆分
   - 避免过度复杂的类型定义

3. 类型安全：
   - 适当使用类型守卫
   - 避免使用 `any`
   - 使用严格的类型检查

## 7. 性能考虑

- Interface 在编译器内部处理更高效
- 过于复杂的类型操作可能影响 TypeScript 的编译性能
- 适当的类型抽象可以减少重复代码

