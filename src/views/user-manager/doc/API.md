# 用户管理 & 部门 API 文档

本模块依赖两个 API 命名空间：`department` 和 `user`。

## 1. 部门 API (Department)

### 1.1 获取部门树
- **接口位置**: `src/api/department/index.ts -> getDeptTree`
- **请求参数**: 
  - `name`: (可选) 部门名称筛选
  - `status`: (可选) 状态筛选
- **返回数据**: 包含子节点结构 `children` 的 `Department` 数组。

---

## 2. 用户 API (User)

### 2.1 获取用户分页列表
- **接口位置**: `src/api/user/index.ts -> getUserList`
- **请求参数**: 
  - `page`: 当前页码
  - `pageSize`: 每页条数
  - `name`: (可选) 姓名/账号查询
  - `status`: (可选) 状态
  - `deptId`: (可选) 根据部门 ID 过滤
- **返回数据**: `{ list: User[], total: number }`

### 2.2 创建用户
- **接口位置**: `src/api/user/index.ts -> createUser`
- **请求参数**: 包含基本信息的 `UserFormData`
- **返回结果**: 无/Promise

### 2.3 更新用户
- **接口位置**: `src/api/user/index.ts -> updateUser`
- **请求参数**: 包含 `id` 及其余字段的 `UserFormData`
- **返回结果**: 无/Promise

### 2.4 删除用户
- **接口位置**: `src/api/user/index.ts -> deleteUser`
- **请求参数**: `ids` (逗号分隔的 id 字符串)
- **返回结果**: 无/Promise
