import type {
    ApiResponse,
    HeaderConfig,
    ServerStatsResponse,
    TrafficBarResponse,
    StaffListResponse,
    TopologyResponse,
    CategoryPieResponse,
    AccessTrendResponse,
    DeviceOverviewResponse,
    LocalizationResponse,
    NotificationResponse
} from './types'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 1. Header
export const getHeaderConfig = async (): Promise<ApiResponse<HeaderConfig>> => {
    await delay(200)
    return {
        code: 200,
        msg: 'success',
        data: {
            timeFilters: [
                { label: '近一月', value: 'last_month' },
                { label: '近一周', value: 'last_week' },
                { label: '近一年', value: 'last_year' }
            ]
        }
    }
}

// 2. Left Column
export const getServerStats = async (): Promise<ApiResponse<ServerStatsResponse>> => {
    await delay(300)
    return {
        code: 200,
        msg: 'success',
        data: {
            totalServers: 198,
            events: [
                { label: '违规事件总数', value: 1234, id: 'event_1' },
                { label: '违规事件总数', value: 567, id: 'event_2' },
                { label: '违规事件总数', value: 4568, id: 'event_3' }
            ]
        }
    }
}

export const getTrafficBar = async (): Promise<ApiResponse<TrafficBarResponse>> => {
    await delay(400)
    return {
        code: 200,
        msg: 'success',
        data: {
            categories: ['标题1', '标题2', '标题3', '标题4', '标题5', '标题6', '标题7'],
            series: [
                {
                    name: '数据标题1',
                    data: [30, 80, 50, 90, 40, 60, 85]
                },
                {
                    name: '数据标题2',
                    data: [20, 60, 40, 70, 30, 50, 75]
                }
            ]
        }
    }
}

export const getStaffList = async (): Promise<ApiResponse<StaffListResponse>> => {
    await delay(350)
    return {
        code: 200,
        msg: 'success',
        data: {
            list: [
                { name: '李雷雷', dept: '产品研究中心', phone: '15080001340', status: '已处理', statusType: 'success' },
                { name: '孙北芙', dept: '人事资源中心', phone: '--', status: '待处理', statusType: 'danger' },
                { name: '孙北芙', dept: '产品研发中心', phone: '15400030400', status: '处理中', statusType: 'warning' },
                { name: '李雷', dept: '数字交流', phone: '1540030400', status: '已处理', statusType: 'success' },
                { name: '赵勇勇', dept: '科技成果展示', phone: '15080001340', "status": "待处理", "statusType": "danger" },
                { name: '孙北芙', dept: '数字技术', phone: '15080001340', "status": "已处理", "statusType": "success" }
            ]
        }
    }
}

// 3. Center Column
export const getTopology = async (): Promise<ApiResponse<TopologyResponse>> => {
    await delay(500)
    return {
        code: 200,
        msg: 'success',
        data: {
            centerNode: { name: 'XXXXX', status: 'active' },
            nodes: [
                { id: 1, name: '机构总数(家)', value: 18, ip: '1.1.1.94' },
                { id: 2, name: '机构总数(家)', value: 22 },
                { id: 3, name: '网络攻击(3个)', details: ['1.1.1.94', '172.160.0.1', '1567.87.5'] },
                { id: 4, name: '异常访问(5个)', details: ['172.160.0.1', '172.1620.0.1'] }
            ],
            connections: [
                { source: 'XXXXX', target: 1 },
                { source: 'XXXXX', target: 2 },
                { source: 'XXXXX', target: 3 },
                { source: 'XXXXX', target: 4 }
            ]
        }
    }
}

export const getCategoryPie = async (): Promise<ApiResponse<CategoryPieResponse>> => {
    await delay(300)
    return {
        code: 200,
        msg: 'success',
        data: {
            data: [
                { name: '绝密', value: 213 },
                { name: '机密', value: 213 },
                { name: '秘密', value: 213 },
                { name: '内部', value: 213 }
            ]
        }
    }
}

export const getAccessTrend = async (): Promise<ApiResponse<AccessTrendResponse>> => {
    await delay(400)
    return {
        code: 200,
        msg: 'success',
        data: {
            xAxis: ['标题1', '标题2', '标题3', '标题4', '标题5', '标题6', '标题7', '标题8', '标题9'],
            series: [
                { name: '数据标题1', data: [15, 60, 30, 80, 50, 60, 50, 45, 30] },
                { name: '数据标题2', data: [10, 50, 20, 40, 60, 30, 25, 35, 20] },
                { name: '数据标题3', data: [5, 20, 10, 15, 40, 15, 20, 25, 15] }
            ]
        }
    }
}

// 4. Right Column
export const getDeviceOverview = async (): Promise<ApiResponse<DeviceOverviewResponse>> => {
    await delay(300)
    return {
        code: 200,
        msg: 'success',
        data: {
            totalDevices: 3452,
            details: [
                { label: '应用', value: 30 },
                { label: '交换机', value: 46 },
                { label: '防火墙', value: 12 },
                { label: '路由器', value: 155 }
            ]
        }
    }
}

export const getLocalization = async (): Promise<ApiResponse<LocalizationResponse>> => {
    await delay(350)
    return {
        code: 200,
        msg: 'success',
        data: {
            stat1: { label: '这里是文字', value: 548 },
            stat2: { label: '这里是文字', value: 456 },
            progress: {
                total: 112,
                current: 80,
                label: '国产化',
                percentage: 71.4
            }
        }
    }
}

export const getNotifications = async (): Promise<ApiResponse<NotificationResponse>> => {
    await delay(300)
    return {
        code: 200,
        msg: 'success',
        data: {
            list: [
                { title: '此处是标题内容', content: '此处是内容此处处理内容此处是内容此处处理内容此处是内容。' },
                { title: '此处是标题内容', content: '此处是内容此处处理内容此处是内容此处处理内容此处是内容。' },
                { title: '此处是标题内容', content: '此处是内容此处处理内容此处是内容此处处理内容此处是内容。' }
            ]
        }
    }
}
