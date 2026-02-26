// ========== 顶部 Header ==========
export interface TimeFilter {
  label: string
  value: string
}

export interface HeaderConfigResponse {
  timeFilters: TimeFilter[]
}

// ========== 左侧 Left Column ==========

// 服务器统计
export interface ServerStatsResponse {
  totalServers: number
  events: Array<{
    label: string
    value: number
    id: string
  }>
}

// 流量柱状图
export interface TrafficBarResponse {
  categories: string[]
  series: Array<{
    name: string
    data: number[]
  }>
}

// 人员状态列表
export interface StaffItem {
  name: string
  dept: string
  phone: string
  status: string
  statusType: 'success' | 'danger' | 'warning'
}

export interface StaffListResponse {
  list: StaffItem[]
}

// ========== 中间 Center Column ==========

// 拓扑图
export interface TopologyNode {
  id: number
  name: string
  value?: number
  ip?: string
  details?: string[]
}

export interface TopologyConnection {
  source: string | number
  target: string | number
}

export interface TopologyResponse {
  centerNode: {
    name: string
    status: string
  }
  nodes: TopologyNode[]
  connections: TopologyConnection[]
}

// 分类占比环形图
export interface CategoryPieItem {
  name: string
  value: number
}

export interface CategoryPieResponse {
  data: CategoryPieItem[]
}

// 访问趋势折线图
export interface AccessTrendSeries {
  name: string
  data: number[]
}

export interface AccessTrendResponse {
  xAxis: string[]
  series: AccessTrendSeries[]
}

// ========== 右侧 Right Column ==========

// 设备总览
export interface DeviceDetail {
  label: string
  value: number
}

export interface DeviceOverviewResponse {
  totalDevices: number
  details: DeviceDetail[]
}

// 国产化进度
export interface LocalizationStat {
  label: string
  value: number
}

export interface LocalizationProgress {
  total: number
  current: number
  label: string
  percentage: number
}

export interface LocalizationResponse {
  stat1: LocalizationStat
  stat2: LocalizationStat
  progress: LocalizationProgress
}

// 通知列表
export interface NotificationItem {
  title: string
  content: string
}

export interface NotificationsResponse {
  list: NotificationItem[]
}
