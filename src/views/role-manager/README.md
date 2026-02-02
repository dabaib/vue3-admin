# 角色管理 (Role Management) - 详细设计文档

## 1. 背景与目标
角色管理模块用于维护系统中的角色信息，配置角色对应的菜单权限和数据权限。作为 RBAC（基于角色的访问控制）的核心部分，该功能直接关系到系统的安全性和灵活性。

## 2. 功能概述
本模块将实现一个标准的 CRUD 管理界面，允许管理员对角色进行创建、编辑、删除、授权和停用/启用。

核心特性：
- **角色维护**: 标准的增删改查功能。
- **权限分配**: 可视化配置角色拥有的菜单和按钮权限。
- **状态控制**: 快速启用或禁用角色。

## 3. 详细需求

### 3.1 页面布局
- **布局结构**: Standard Table Layout (基于 `JsonTable`)。
  - **搜索栏**: 支持按“角色名称”或“状态”筛选。
  - **工具栏**: “新增角色”、“批量删除”按钮。
  - **主内容区**: 数据表格。

### 3.2 数据列表 (Table)
字段定义：
- **角色名称** (Name): 文本显示。
- **角色编码** (Code): 唯一标识，如 `ROLE_ADMIN`，文本显示。
- **排序** (Sort): 数字，用于显示顺序。
- **状态** (Status): 启用/停用 (Switch/Tag)。
- **备注** (Description): 描述性文本。
- **创建时间** (Create Time): 格式化时间字符串。
- **操作列**:
  - **权限设置**: 点击弹出权限配置抽屉 (`Drawer`)。
  - **编辑**: 点击弹出编辑弹窗。
  - **删除**: 删除角色（需二次确认）。

### 3.3 编辑/新增表单 (Dialog)
表单字段：
- **角色名称** (Name): 必填，文本输入。
- **角色编码** (Code): 必填，唯一标识，建议大写下划线格式。
- **排序** (Sort): `InputNumber`，默认 0。
- **状态** (Status): `Radio` / `Switch`，默认启用。
- **备注** (Remark): 文本域 (`type="textarea"`)。

### 3.4 权限配置 (Drawer)
- **组件**: `ElTree` (开启 search 和 checkbox)。
- **交互**:
  - 展示完整的系统菜单树。
  - 回显当前角色已拥有的权限。
  - 支持“全选/取消全选”、“展开/折叠”操作。

## 4. 数据模型设计 (Mock)

```typescript
interface Role {
  id: string;
  name: string;      // 角色名称
  code: string;      // 角色编码 (唯一)
  sort: number;      // 排序
  status: 'enable' | 'disable';
  remark?: string;   // 备注
  createTime: string;
}
```

## 5. 组件架构
遵循项目宪章的目录规范：

```text
src/views/role-manager/
├── README.md            # 本详细设计文档
├── index.vue            # 页面入口 (列表 + 搜索)
└── modules/             # 私有组件
    ├── RoleForm.vue         # 角色增改表单 (Dialog)
    ├── RolePermission.vue   # 角色权限设置 (Drawer) (原 PermissionDrawer)
    └── RoleSearch.vue       # (可选) 搜索栏组件
```

## 6. 技术实现细节
1.  **数据获取**: 使用 `useJsonTable` 或 `useTable` hook 管理列表数据。
2.  **表单复用**: 新增和编辑使用同一个 `RoleForm` 组件，通过 `prop` 传入 `id` 判断模式。
3.  **权限树**: 权限数据量可能较大，需注意渲染性能，必要时使用虚拟滚动（但在 Element Plus Tree 中通常由分页控制或数据量不大）。
4.  **Mock 数据**: 需在 `src/api` 中通过 Mock 模拟接口响应。

## 7. 后续扩展
- 数据权限配置（Data Scope）。
- 角色成员查看（查看该角色下有哪些用户）。
