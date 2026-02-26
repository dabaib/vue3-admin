import type {
  HeaderConfigResponse,
  ServerStatsResponse,
  TrafficBarResponse,
  StaffListResponse,
  TopologyResponse,
  CategoryPieResponse,
  AccessTrendResponse,
  DeviceOverviewResponse,
  LocalizationResponse,
  NotificationsResponse
} from './types'

// ========== Mock 数据 ==========

// 顶部配置
const mockTimeFilters = [
  { label: '近一月', value: 'last_month' },
  { label: '近一周', value: 'last_week' },
  { label: '近一年', value: 'last_year' }
]

// 服务器统计
const mockServerStats: ServerStatsResponse = {
  totalServers: 198,
  events: [
    { label: '违规事件总数', value: 1234, id: 'event_1' },
    { label: '违规事件总数', value: 567, id: 'event_2' },
    { label: '违规事件总数', value: 4568, id: 'event_3' }
  ]
}

// 流量柱状图
const mockTrafficBar: TrafficBarResponse = {
  categories: ['标题1', '标题2', '标题3', '标题4', '标题5', '标题6', '标题7'],
  series: [
    { name: '数据标题1', data: [30, 80, 50, 90, 40, 60, 85] },
    { name: '数据标题2', data: [20, 60, 40, 70, 30, 50, 75] }
  ]
}

// 人员状态列表
const mockStaffList: StaffListResponse = {
  list: [
    { name: '李雷雷', dept: '产品研究中心', phone: '15080001340', status: '已处理', statusType: 'success' },
    { name: '孙北芙', dept: '人事资源中心', phone: '--', status: '待处理', statusType: 'danger' },
    { name: '孙北芙', dept: '产品研发中心', phone: '15400030400', status: '处理中', statusType: 'warning' },
    { name: '李雷', dept: '数字交流', phone: '1540030400', status: '已处理', statusType: 'success' },
    { name: '赵勇勇', dept: '科技成果展示', phone: '15080001340', status: '待处理', statusType: 'danger' }
  ]
}

// 拓扑图
const mockTopology: TopologyResponse = {
  centerNode: { name: 'XXXXX', status: 'active' },
  nodes: [
    { id: 1, name: '机构总数(家)', value: 18, ip: '1.1.1.94' },
    { id: 2, name: '机构总数(家)', value: 22 },
    { id: 3, name: '网络攻击(3个)', details: ['1.1.1.94', '172.160.0.1', '1567.87.5'] },
    { id: 4, name: '异常访问(5个)', details: ['172.160.0.1', '172.1620.0.1'] }
  ],
  connections: [
    { source: 'center', target: 1 },
    { source: 'center', target: 2 }
  ]
}

// 分类占比
const mockCategoryPie: CategoryPieResponse = {
  data: [
    { name: 'AA', value: 213 },
    { name: 'BB', value: 213 },
    { name: 'CC', value: 213 },
    { name: 'DD', value: 213 }
  ]
}

// 访问趋势
const mockAccessTrend: AccessTrendResponse = {
  xAxis: ['标题1', '标题2', '标题3', '标题4', '标题5', '标题6', '标题7', '标题8', '标题9'],
  series: [
    { name: '访问正常', data: [10, 50, 30, 80, 40, 60, 50, 45, 30] },
    { name: '访问异常', data: [5, 20, 10, 40, 20, 30, 20, 15, 10] }
  ]
}

// 设备总览
const mockDeviceOverview: DeviceOverviewResponse = {
  totalDevices: 3452,
  details: [
    { label: '应用', value: 30 },
    { label: '交换机', value: 46 },
    { label: '防火墙', value: 12 },
    { label: '路由器', value: 155 }
  ]
}

// 国产化进度
const mockLocalization: LocalizationResponse = {
  stat1: { label: '这里是文字', value: 548 },
  stat2: { label: '这里是文字', value: 456 },
  progress: {
    total: 112,
    current: 80,
    label: '国产化',
    percentage: 71.4
  }
}

// 通知列表
const mockNotifications: NotificationsResponse = {
  list: [
    { title: '此处是标题内容', content: '此处是内容此处处理内容此处是内容...' },
    { title: '此处是标题内容', content: '此处是内容此处处理内容此处是内容...' },
    { title: '此处是标题内容', content: '此处是内容此处处理内容此处是内容...' }
  ]
}

// ========== API 函数 ==========

// 基础请求包装
const request = <T>(data: T, delay = 300): Promise<{ code: number; data: T; msg: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 200, data, msg: 'success' })
    }, delay)
  })
}

export const getHeaderConfig = () => request({ timeFilters: mockTimeFilters })

export const getServerStats = () => request(mockServerStats)

export const getTrafficBar = () => request(mockTrafficBar)

export const getStaffList = () => request(mockStaffList)

export const getTopology = () => request(mockTopology)

export const getCategoryPie = () => request(mockCategoryPie)

export const getAccessTrend = () => request(mockAccessTrend)

export const getDeviceOverview = () => request(mockDeviceOverview)

export const getLocalization = () => request(mockLocalization)

export const getNotifications = () => request(mockNotifications)
