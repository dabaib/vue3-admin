# 部门管理 (Department Management) - 详细设计文档

## 1. 背景与目标
此功能旨在解决企业内部层级化的人员组织问题，支持复杂的树形结构展示与操作。

## 2. 功能概述
本模块将实现一个支持无限层级的树形部门管理界面，允许用户进行查看、创建、编辑、删除和排序部门。

核心特性：
- **树形数据展示**: 直观展示部门的父子层级关系。
- **部门负责人关联**: 每个部门可指定主管（关联到现有账号）。
- **状态管理**: 控制部门的启用/停用状态。
- **拖拽/排序**: (可选) 支持调整同级部门的显示顺序。

## 3. 详细需求

### 3.1 页面布局
- **布局结构**: 标准 CRUD 布局。
  - **搜索栏**: 支持按“部门名称”或“状态”筛选。
  - **工具栏**: “新增部门”按钮。
  - **主内容区**: 树形表格 (Tree Table)。

### 3.2 数据列表 (Tree Table)
字段定义：
- **部门名称** (Name): 显示部门名称，缩进展示层级。
- **排序** (Sort): 数字，越小越靠前。
- **状态** (Status): 启用/停用 (Switch/Tag)。
- **部门负责人** (Leader): 显示负责人姓名。
- **创建时间** (Create Time): 格式化时间字符串。
- **操作列**:
  - **新增子部门**: 点击直接弹出预填父部门的弹窗。
  - **编辑**: 修改部门详情。
  - **删除**: 删除部门（需校验是否有下级部门或关联人员）。

### 3.3 编辑/新增表单 (Dialog)
表单字段：
- **上级部门** (Parent): `TreeSelect` 组件，选择父节点（根部门则为空）。
- **部门名称** (Name): 必填，文本输入。
- **部门编码** (Code): 必填，唯一标识，比如 `DEPT_001`。
- **负责人** (Leader): `Select` 组件，下拉选择系统用户 (模拟数据)。
- **排序** (Sort): `InputNumber`，默认 0。
- **状态** (Status): `Radio` / `Switch`，默认启用。
- **备注** (Description): 文本域。

## 4. 数据模型设计 (Mock)

```typescript
interface Department {
  id: string;
  parentId: string | null;
  name: string;
  code: string;
  leader: string; // 负责人 User ID 或 Name
  status: 'enable' | 'disable';
  sort: number;
  createTime: string;
  children?: Department[]; // 树形结构必须
}
```

## 5. 组件架构
遵循项目宪章的目录规范：

```text
src/views/department-manager/
├── README.md           # 本设计文档
├── index.vue           # 页面入口 (Container + Table)
└── modules/            # 私有组件
    ├── DepartmentForm.vue  # 新增/编辑 弹窗组件
    └── DepartmentSearch.vue # (可选) 搜索栏组件
```

## 6. 技术实现细节
1.  使用 Element Plus 的 `el-table` 的 `row-key` 和 `tree-props` 属性实现树形展示。
2.  使用 `JsonDialog` 或 `el-dialog` 封装表单逻辑。
3.  Mock 数据层需生成具有层级结构的 JSON 数据。
4.  Typescript 类型定义需严格，优先复用现有公共类型。

## 7. 后续扩展
- 部门成员列表预览。
- 部门维度的权限设置（Data Scope）。
