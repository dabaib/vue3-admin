# Vue3 Admin 项目规范

## 概述
这是一个 Vue 3 + TypeScript + Element Plus 后台管理系统模板。

## 技术要求
- 使用 Vue 3 Composition API (`<script setup>`)
- 使用 TypeScript 严格类型
- UI 组件库使用 Element Plus（自动导入）
- 状态管理使用 Pinia
- 路由使用 Vue Router 4

## 编码规范

### 组件开发
1. 组件使用 `<script setup lang="ts">` 语法
2. Props 使用 `defineProps<T>()` 定义
3. Emits 使用 `defineEmits<T>()` 定义
4. 组件文件名使用 PascalCase

### 样式规范
1. 组件样式使用 `<style scoped>`
2. 使用 Element Plus 设计规范
3. 颜色使用 CSS 变量或 Element Plus 变量

### 路由规范
- 路由配置在 `src/router/index.ts`
- 菜单根据 `meta` 自动生成
- 必须设置 `meta.title` 和 `meta.icon`

## 项目结构
```
src/
├── components/     # 公共组件
├── layouts/        # 布局组件
├── router/         # 路由配置
├── stores/         # Pinia 状态
├── views/          # 页面视图
└── main.ts         # 入口文件
```

## 重要提醒
- Element Plus 组件自动导入，无需 import
- 图标已全局注册，直接使用组件名
- 使用 `@/` 作为 src 别名
