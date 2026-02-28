---
name: crud-page
description: 创建增删改查(CRUD)页面。提供完整的从 JSON 配置到页面渲染的标准化代码结构。触发词：增删改查, CRUD, 列表页, 业务页面。
---

# 创建 CRUD 页面规范

本 Skill 用于指导如何使用项目中的核心业务组件（如 `JsonSearch`, `JsonTable`, `JsonDialog`, `JsonForm` 等）统筹构建标准化的后台管理 CRUD 页面。
> **突破局限性：** 不应该只被这几个组件限制！如果开发过程中发现当前组件库缺失能够满足特定业务需求的控件，**必须**主动考虑该交互的可复用性，将其封装成独立子组件或工具后再进行调用，从而不断扩展基础组件库，杜绝在页面内部堆砌一次性的“面条代码”。

## 1. 标准化代码结构

每次新建 CRUD 页面时，必须遵循以下步骤和纯文本标准结构进行代码拼装。在构建页面时，请根据当前 API 文档和需求补充调整相关的数据字段信息：

### 组件编排与结构规范

请开发者完全依靠文档与基础组件按以下逻辑自行在 `index.vue` 或对应的 `Module.vue` 中进行系统化组装：

1. **页面骨架与容器规范**：
   - 所有的 CRUD 页面主体必须使用 `<div class="page-container">` 作为根容器。
   - 包含表格的部分必须使用 `<div class="table-container">` 作为外层包裹，以便 Flex 撑开剩余空间。
   - 在底部 `<style scoped lang="scss">` 中必须包含以下标准的容器排版样式：
     ```scss
     .page-container {
       height: 100%;
       display: flex;
       flex-direction: column;
       background-color: #fff;
       border-radius: 8px;
       overflow: hidden;
     }
     
     .table-container {
       flex: 1;
       min-height: 0;
       padding: 0 16px 16px;
     }
     ```
2. **状态抽象**：定义好表格引用 (`tableRef`)、表单引用 (`formRef`)、查询参数对象 (`queryParams`)、弹窗控制变量 (`dialogVisible`, `dialogType`等) 及核心提交数据 (`formData`)。
3. **顶层查询**：在 `.page-container` 内的顶部排布 `JsonSearch` 组件，传入响应式的 `searchSchema` 及监听其回调事件 (`search`、`reset`)，并修改 `queryParams`。
4. **主体主表格**：紧贴在查询区下方，在 `.table-container` 中使用 `JsonTable` 组件，传入响应式的 `tableSchema`、异步的 `fetchData`，完成与后端的请求与数据格式映射。
5. **业务侧边/抽屉/弹窗**：所有的附加侧边交互均应采用 `JsonDialog` 或单独组件囊括，表单填报则采用 `JsonForm` 结合 `formSchema` 控制视图。
6. **事件响应钩子**：页面的 Methods 中集中管理对应的生命周期和交互，不要在 Template 中写行内逻辑闭包。

在此过程中，有几个强烈遵循的**UI样式规范（必须核对）**：
1. **JsonSearch 搜索和重置按钮**：不再使用 `el-icon` 控制默认图标。按钮仅保留文字。
2. **JsonTable 操作列按钮**：
   - 必须表现为**主要主色调（primary）的纯文本链接**。
   - 所有操作项均需设置：`type: 'primary'` 及 `link: true`，不要保留多余图标（如 Edit/Delete 图标）或使用 `danger/success` 等混杂警示色。
3. **工具栏按钮**（如“新增”、“导出”等）：
   - 默认**不要**添加对应的 `el-icon` 图标，仅保留纯文字（如：新增、导出）保持界面极简风格。

## 2. 关键配置项说明

### SearchSchema (查询配置)
- 主要用在 `JsonSearch` 中。
- `items`: 数组，每项包含 `prop`, `label`, `type` (`input`, `select`, `date` 等)。

### TableSchema (表格配置)
- 主要用在 `JsonTable` 中。
- `columns`: 数组，定义列属性及渲染方式。
- `actionColumn`: 定义右侧操作按钮，参考前述的视觉规范（文本链接+主色调）。

### FormSchema (表单配置)
- 主要用在 `JsonForm` 中。
- `items`: 数组，定义表单项及验证规则。
  - `type`: `input`, `number`, `select`, `switch`, `radio`, `checkbox`, `textarea`, `date` 等。
  - `rules`: Element Plus 验证规则数组。
  - `span`: 栅格占位 (默认 24，代表表单项占满一行)。
### 组件与类型扩展补充原则 (非常重要)
在根据需求设定 `SearchSchema` 或 `FormSchema` 的 `type` 时，如果遇到现有组件未覆盖支持的新控件或类型功能：
**禁止**采取忽略、直接硬写不支持属性、甚至绕过组件在外部单独手写 UI 等敷衍措施。
你**必须**主动进入 `JsonSearch` 或 `JsonForm` 组件的内部源码，考虑封装的必要性并完成扩充。如果是一个全新的复合业务交互，应考虑在 `src/components/` 目录下封装独立组件，完成扩展后再继续调用，确保代码始终保持高内聚低耦合的状态。

## 3. 最佳实践提醒

1. **统一交互**: 新增和编辑尽量复用同一个弹窗和表单，通过 `dialogType` 区分逻辑。
2. **表单重置**: 每次打开弹窗前，必须清空被绑定的 `formData` 数据对象，并在 `nextTick` 中调用 `<JsonForm>` 实例的 `clearValidate()` 以清空上一次残余的校验警告。
3. **类型安全**: 数据接口对接前，需要通过 `API.md` 或 Swagger 核对后端实体模型，保证前端填写的字段及字段类型与之绝对吻合。
4. **复合页面布局规范（如“左树右表”）**:
   - **布局方式**：遇到左侧为树（如组织架构），右侧为 CRUD 表格的复合页面时，不再使用原有的 `.page-container` 独占模式，**必须**使用标准的 Flexbox 布局进行整体分割。
   - **容器结构**：
     外层使用 `<div class="complex-page-container">` 包裹。
     左侧树包裹在 `<div class="left-panel">` 中（内部使用 `.tree-card`）。
     右侧表格包裹在 `<div class="right-panel page-container">` 内，由于右侧本质上还是一个标准 CRUD，所以其内部结构必须**完全复用**前文提及的 `.page-container` 样式。
   - **标准 CSS 模板**：
     ```scss
     .complex-page-container {
       display: flex;
       gap: 16px;
       height: 100%;
       box-sizing: border-box;
     }
     
     .left-panel {
       width: 260px;
       flex-shrink: 0;
       
       .tree-card {
         height: 100%;
         border: none;
         border-radius: 8px;
         background-color: #fff;
         
         ::v-deep(.el-card__body) {
           height: calc(100% - 55px);
           overflow-y: auto;
         }
       }
     }
     
     .right-panel {
       flex: 1;
       min-width: 0;
     }

     // 在下方必须补充 .page-container 及其余的通用标准 CRUD 样式...
     .page-container {
       height: 100%;
       display: flex;
       flex-direction: column;
       background-color: #fff;
       border-radius: 8px;
       overflow: hidden;
     }

     .table-container {
       flex: 1;
       min-height: 0;
       padding: 0 16px 16px;
     }
     ```
