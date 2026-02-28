# 用户管理 (User Manager) - 详细设计文档

## 1. 背景与目标
实现后台系统的用户管理功能。目标是提供一个左右分栏的复合视图，左侧可通过部门层级树过滤用户，右侧为标准的用户信息数据列表。支持用户资料的查看、新增、编辑及删除。

## 2. 功能概述
- **左侧部门树**:
  - 以树形结构展示完整的部门架构。
  - 点击部门节点，可以筛选右侧属于该部门（及下级）的用户。
- **右侧查询与列表**:
  - 提供用户名称/账号的模糊查询。
  - 提供状态筛选。
  - 数据列表使用分页加载。
- **表单操作**:
  - 支持新增用户资料（需关联部门）。
  - 支持编辑已存在用户的信息。
  - 支持针对用户条目的批量和单行删除。

## 3. 详细需求

### 3.1 页面布局
- 标准的 Flex Left-Right 布局结构。
- 左侧树形面板限定宽度 260px，带有 `.tree-card` 白色背景。
- 右侧复用标准的 `.page-container` CRUD 工作流布局。

### 3.2 数据列表 (Table)
- **序号** (Index): 自动生成
- **用户名** (account): 展示用户登录账号
- **姓名** (name): 展示真实姓名
- **所属部门** (deptName): 展示用户归属的部门名
- **手机号** (phone): 展示联系方式
- **状态** (status): 使用 Tag 展示，如：启用(success) / 停用(info)
- **创建时间** (createTime): 展示账号生成时间
- **操作列**:
  - 编辑 (`handleEdit`)
  - 删除 (`handleDelete`) 参数化二次确认 `confirm: '确认删除该用户吗？'`

### 3.3 编辑/新增表单 (Dialog)
- **账号** (account): 必填，单行文本。如果是编辑模式建议可选只读。
- **姓名** (name): 必填，单行文本。
- **所属部门** (deptId): 必填，树形下拉选择或直接列表（Mock期间使用 Select）。
- **手机号** (phone): 选填。
- **状态** (status): 必选，Radio 单选（启用/停用）。

## 4. 数据模型设计 (Typescript)
详见 `src/api/user/types.ts` 及 `src/api/department/types.ts`。

## 5. 组件架构
```text
src/views/user-manager/
├── doc/
│   ├── README.md       # 本详细设计文档
│   └── API.md          # 接口文档
├── index.vue           # 入口：承载左右栏分块，调用左右侧子组件
└── modules/
    ├── DeptTree.vue    # 左侧：提取出独立的依赖于 department 接口的树
    └── UserForm.vue    # 用户信息新增编辑弹框表单
```

## 6. 技术实现细节
- 采用 Element Plus 的 `el-tree` 组件实现左侧逻辑，需监听 `node-click` 事件向右侧传递过滤条件。
- 右侧核心采用全局的 `JsonSearch`, `JsonTable`, `JsonDialog` 进行搭积木。
- 所有的数据源与状态维护需按照纯组合式 API (Composition API) 原则进行剥离。
