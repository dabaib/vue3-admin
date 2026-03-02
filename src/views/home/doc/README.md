# 首页 (Dashboard) - 详细设计文档

## 1. 背景与目标
首页作为进入管理后台的第一个入口，主要用于直观地为管理员展示当前系统的核心业务数据指标、应用活跃度趋势以及系统最新的活动动态。帮助管理员快速了解系统概况与运行状态。

## 2. 功能概述
- **核心数据指标展示**: 实时展示系统总用户数、总角色数、总菜单数、总部门数。
- **活跃度趋势统计**: 通过 ECharts 渲染系统近期活跃度的折线趋势图。
- **快捷入口**: 提供常用功能模块的快捷跳转链接。
- **系统动态**: 时间轴样式的最近操作和系统活动展示。

## 3. 详细需求

### 3.1 页面布局
- **上方**: 包含四张统计卡片，采用响应式布局分栏排列。
- **下方左侧**: 横跨大半个容器的 ECharts 数据折线图，以及下方的快捷访问入口项。
- **下方右侧**: 垂直排布的最近活动 Timeline 列表。

### 3.2 动态特性
- 鼠标悬停统计图标和快捷入口伴随轻量化、平滑的弹性缩放与阴影特效 (`scale` 交互)。
- 图表组件与布局响应式同步，页面大小变化时动态 `resize` 不被截断。

## 4. 数据模型设计 (Typescript)
```typescript
interface DashboardStats {
  userCount: number;
  roleCount: number;
  menuCount: number;
  deptCount: number;
}

interface Activity {
  user: string;
  action: string;
  time: string;
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}
```

## 5. 组件架构
```text
src/views/home/
├── doc/
│   ├── README.md       # 本文档
│   └── API.md          # 接口文档
└── index.vue           # 首页入口
```

## 6. 技术实现细节
- 采用 `@/components/BaseChart` 组件封装进行 ECharts 渲染。
- `stats` 卡片与 `activities` 卡片的数据通过 `onMounted` 钩子请求真实后端接口获取，去除了原有的静态 Mock。
- 时间轴数据结合了 Element-Plus 的 `el-timeline` 与 `el-timeline-item` 实现动态颜色配置。
