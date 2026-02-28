# 部门 API 文档

## 1. 部门 API (Department)

### 1.1 获取部门树
- **接口位置**: `src/api/department/index.ts -> getDeptTree`
- **请求参数**: 
  - `name`: (可选) 部门名称筛选
  - `status`: (可选) 状态筛选
- **返回数据**: 包含子节点结构 `children` 的 `Department` 数组。

### 1.2 创建部门
- **接口位置**: `src/api/department/index.ts -> createDept`
- **请求参数**: 包含基本信息的 `DeptFormData`
- **返回结果**: 无/Promise

### 1.3 更新部门
- **接口位置**: `src/api/department/index.ts -> updateDept`
- **请求参数**: 包含 `id` 及其余字段的 `DeptFormData`
- **返回结果**: 无/Promise

### 1.4 删除部门
- **接口位置**: `src/api/department/index.ts -> deleteDept`
- **请求参数**: `ids` (逗号分隔的 id 字符串)
- **返回结果**: 无/Promise
