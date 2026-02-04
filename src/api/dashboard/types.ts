export interface ApiResponse<T> {
    code: number
    msg: string
    data: T
}

// 1. Header
export interface HeaderConfig {
    timeFilters: { label: string; value: string }[]
}

// 2. Left Column
export interface ServerStat {
    label: string
    value: number
    id: string
}

export interface ServerStatsResponse {
    totalServers: number
    events: ServerStat[]
}

export interface TrafficBarResponse {
    categories: string[]
    series: {
        name: string
        data: number[]
    }[]
}

export interface StaffItem {
    name: string
    dept: string
    phone: string
    status: string
    statusType: 'success' | 'warning' | 'danger'
}

export interface StaffListResponse {
    list: StaffItem[]
}

// 3. Center Column
export interface TopologyNode {
    id?: number | string
    name: string
    value?: number
    ip?: string
    status?: string
    details?: string[]
    itemStyle?: any
    symbolSize?: number
}

export interface TopologyLink {
    source: string | number
    target: string | number
}

export interface TopologyResponse {
    centerNode: TopologyNode
    nodes: TopologyNode[]
    connections: TopologyLink[]
}

export interface PieChartItem {
    name: string
    value: number
}

export interface CategoryPieResponse {
    data: PieChartItem[]
}

export interface AccessTrendResponse {
    xAxis: string[]
    series: {
        name: string
        data: number[]
    }[]
}

// 4. Right Column
export interface DeviceDetail {
    label: string
    value: number
}

export interface DeviceOverviewResponse {
    totalDevices: number
    details: DeviceDetail[]
}

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

export interface NotificationItem {
    title: string
    content: string
}

export interface NotificationResponse {
    list: NotificationItem[]
}
