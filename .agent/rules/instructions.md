---
trigger: always_on
---

Always read all rules in the .agent/rules directory before responding to any prompt.

# 项目开发宪章 (Project Constitution)

## 第一章：总纲 (General Principles)

### 第0条：启动宣誓
**每次启动开发工作或打开本项目前，所有开发者（包括 AI 助手）必须先阅读并复习本宪章。** 铭记核心愿景与技术信仰，时刻校准开发方向。

### 第1条：核心愿景
本项目旨在构建一个**高性能、可维护、极致用户体验**的 Vue 3 Web 应用。本宪章既定规则为项目开发的最高准则，所有贡献者必须严格遵守。

### 第2条：技术信仰
1.  **Vue 3 First**: 全面拥抱 Vue 3 生态，废弃 Vue 2 思维。
2.  **TypeScript Only**: 严禁无理由使用 JavaScript，类型安全是代码质量的基石。
3.  **Composition API**: 强制使用 `<script setup>` 语法糖，禁止使用 Options API。
4.  **DRY (Don't Repeat Yourself)**: 拒绝重复代码，通过组合式函数 (Composables) 复用逻辑。
5.  **Component First (组件优先)**: 开发新功能前，必须先查找现有组件库（如 `JsonSearch`, `JsonTable` 等）。优先复用或封装通用组件，杜绝重复造轮子。

---

## 第二章：技术栈法案 (Technology Stack Act)

### 第3条：法定技术栈
未经架构委员会（或项目负责人）批准，不得擅自引入新的核心依赖。
-   **核心框架**: Vue 3.5+
-   **语言超集**: TypeScript 5.0+
-   **构建工具**: Vite
-   **UI 组件库**: Element Plus (按需引入)
-   **状态管理**: Pinia (禁止使用 Vuex)
-   **路由管理**: Vue Router 4
-   **图标库**: @element-plus/icons-vue

---

## 第三章：代码规范法案 (Code Standards Act)

### 第4条：文件与命名
1.  **组件文件**: 必须使用 **PascalCase** 命名，例如 `UserProfile.vue`。
2.  **目录命名**: 使用 **kebab-case** 命名，例如 `src/components/user-profile/`。
3.  **引用路径**: 必须使用 `@/` 别名指向 `src` 目录，禁止出现 `../../` 地狱。

### 第5条：Vue 组件规范
1.  **结构顺序**:
    ```vue
    <script setup lang="ts">
    // 逻辑层
    </script>

    <template>
    <!-- 视图层 -->
    </template>

    <style scoped lang="scss">
    /* 样式层 */
    </style>
    ```
2.  **Prop 定义**:必须使用 `defineProps` 配合 TypeScript 接口，禁止使用数组形式。
3.  **Emits 定义**: 必须使用 `defineEmits` 配合 TypeScript 类型声明。

### 第6条：TypeScript 规范
1.  **严禁 Any**: 除非经过特别审批，否则代码中不得出现 explicit `any`。
2.  **接口优先**: 优先使用 `interface` 定义对象结构，使用 `type` 定义联合类型。

### 第7条：样式规范
1.  **Scoped 默认**: 所有组件样式必须添加 `scoped` 属性。
2.  **CSS 变量**: 涉及颜色、圆角等主题样式，必须使用 Element Plus 的 CSS 变量或自定义 CSS 变量，禁止硬编码 Hex 颜色。

---

## 第四章：工程化与协作 (Engineering & Collaboration)

### 第8条：Git 工作流
1.  **提交信息 (Commit Message)** 必须遵循 Conventional Commits 规范：
    -   `feat`: 新功能
    -   `fix`: 修复 Bug
    -   `docs`: 文档变更
    -   `style`: 代码格式调整（不影响逻辑）
    -   `refactor`: 代码重构
    -   `perf`: 性能优化
    -   `chore`: 构建或工具变动
2.  **中文描述**: 提交信息的描述部分（Subject/Body）**必须使用中文**，以确保团队成员快速理解变更内容。
    -   **正确示例**: `feat: 添加用户登录组件`
    -   **错误示例**: `feat: add user login component`
3.  **原子提交 (Atomic Commits)**:
    -   即使本地修改了大量文件，也必须**按功能模块**拆分为多个独立的 Commit 提交。
    -   严禁 "WIP" 或 "Update all" 这种笼统的提交，确保每个 Commit 都是一个可独立回滚的功能单元。

4.  **提交权限 (Commit Authority)**:
    -   **严禁自动提交**: AI 助手**绝对禁止**擅自执行 `git add`, `git commit`, `git push` 等操作。
    -   **被动执行**: 只有在用户**明确指令**（如“提交代码”、“push”）要求时，AI 助手方可执行 Git 操作。
    -   **确认机制**: 即使是为了遵守“原子提交”原则，AI 也必须先完成代码修改，然后询问用户是否提交，不得自动决策。

### 第9条：注释与文档
1.  **自解释代码**: 代码应尽可能自解释，仅在逻辑复杂或 Hack 处添加注释。
2.  **中文注释**: 为保持团队理解一致，注释统一使用**中文**。

### 第10条：协作沟通规范
1.  **AI 助手回复**: AI 助手的所有回答、思考过程、计划 (Plan) 及任务 (Task) 描述，必须完全使用**中文**。
2.  **一致性**: 确保技术术语的准确性，但在解释和规划时使用流畅的中文。

### 第11条：标准化输出格式 (Standardized Output Format)
为了提高沟通效率，AI 输出 Task 和 Plan 时必须严格遵循以下 Markdown 模板：

1.  **计划模式 (Plan Format)**:
    使用 Checkbox 列表，并明确标记状态。
    ```markdown
    ## 📅 实施计划
    - [x] **步骤 1**: [已完成] 简要描述
    - [ ] **步骤 2**: [进行中] 详细描述当前要做的事
    - [ ] **步骤 3**: [待办] 后续规划
    ```

2.  **任务描述 (Current Task)**:
    在执行具体操作前，使用引用块明确当前焦点。
    ```markdown
    > 🎯 **当前任务**: [任务名称]
    > 🔍 **目标**: [一句话描述目标]
    ```

### 第12条：架构与目录规范 (Architecture & Directory Standards)
1.  **结果文档化 (Result Documentation)**:
    *   任何实际输出结果（Output）或功能说明文档，必须直接存放在对应的功能目录下（`src/views/xxx/` 或 `src/components/xxx/`），禁止散落在根目录。
2.  **视图目录结构 (View Directory Structure)**:
    *   **命名**: `src/views` 下必须以**功能名称**（kebab-case）创建文件夹。提交
    *   **拆分**: 功能内部的子组件（Sub-components）必须存放在该功能目录下的 `modules` 子文件夹中。
        -   **强制拆分**: 页面中的弹窗（Dialog）、抽屉（Drawer）或复杂表单，**必须**拆分为独立的子组件，禁止直接写在 `index.vue` 中。
    *   **入口**: 目录下必须包含 `index.vue` 作为入口。
    *   **结构示例**:
        ```text
        src/views/user-manager/
        ├── README.md           # 功能文档/输出结果
        ├── index.vue           # 页面入口
        └── modules/            # 私有组件
            ├── UserForm.vue
            └── UserList.vue
        ```
3.  **组件目录结构 (Component Directory Structure)**:
    *   `src/components` 下同理，复杂组件应独立建文件夹，并在 `modules` 中管理子部件。

---

## 第五章：附则 (Supplementary Provisions)

### 第13条：宪章的修订
本宪章随项目发展可进行修订，但修改需经团队核心成员评审通过。

### 第14条：违宪责任
违反本宪章的代码将在 Code Review 阶段被无情驳回 (Request Changes)。

---
*签署日期: 2026年01月*
*维护者: Antigravity AI*