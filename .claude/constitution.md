# Vue3 Admin 项目宪法

## 项目概述

这是一个基于 Vue 3 + TypeScript + Element Plus 的现代化后台管理系统模板。

## 技术栈

- **框架**: Vue 3.x (Composition API + `<script setup>`)
- **语言**: TypeScript
- **构建工具**: Vite
- **UI 组件库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **包管理器**: npm

## 目录结构

```
src/
├── assets/          # 静态资源（CSS、图片等）
├── components/      # 公共组件
│   └── JsonTable/   # JSON Schema 表格组件
├── layouts/         # 布局组件
│   └── AdminLayout.vue
├── router/          # 路由配置
├── stores/          # Pinia 状态管理
├── views/           # 页面视图
├── App.vue          # 根组件
└── main.ts          # 入口文件
```

## 编码规范

### Vue 组件

1. 使用 `<script setup lang="ts">` 语法
2. 组件文件名使用 PascalCase（如 `JsonTable.vue`）
3. Props 使用 `defineProps<T>()` 定义类型
4. Emits 使用 `defineEmits<T>()` 定义类型
5. 响应式数据优先使用 `ref`，复杂对象使用 `reactive`

### TypeScript

1. 避免使用 `any`，优先定义明确类型
2. 接口定义放在 `types.ts` 文件中
3. 使用 `type` 定义联合类型，使用 `interface` 定义对象类型

### 样式

1. 组件样式使用 `<style scoped>`
2. 全局样式放在 `assets/main.css`
3. 使用 CSS 变量实现主题定制

## 路由规范

路由配置在 `src/router/index.ts`，菜单根据路由自动生成：

```typescript
{
  path: 'example',
  name: 'example',
  component: () => import('@/views/Example.vue'),
  meta: {
    title: '示例页面',    // 菜单标题（必填）
    icon: 'Document',     // 菜单图标（Element Plus Icons）
    menu: true            // 是否显示在菜单中
  }
}
```

## 组件开发规范

### 创建新组件

1. 在 `components/` 下创建组件目录
2. 包含 `index.ts`（导出）、`types.ts`（类型）、`ComponentName.vue`（组件）
3. 提供完整的 TypeScript 类型定义
4. 编写使用示例

### JsonTable 组件

使用 JSON Schema 配置表格，支持：
- 多种列类型（selection、index、普通列）
- 内置渲染器（tag、image、link、switch、progress）
- 自定义插槽渲染
- 操作列配置
- 分页和排序

## Git 规范

### 提交信息格式

```
<type>(<scope>): <subject>

feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式（不影响功能）
refactor: 重构
perf: 性能优化
test: 测试
chore: 构建/工具变更
```

## 常用命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 类型检查
npm run type-check

# 代码格式化
npm run format
```

## 注意事项

1. Element Plus 组件自动导入，无需手动 import
2. Element Plus 图标已全局注册，直接使用组件名
3. 使用 `@/` 作为 `src/` 的别名
4. 路由懒加载，使用 `() => import()` 语法
