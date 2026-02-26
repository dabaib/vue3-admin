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
            totalServers: 15280,
            events: [
                { label: '今日接入', value: '1,245', id: 'event_1' },
                { label: '成功率', value: '99.8%', id: 'event_2' },
                { label: '异常数', value: '23', id: 'event_3' }
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
            categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            series: [
                {
                    name: '接入流量',
                    data: [3200, 4200, 3800, 4500, 4100, 2800, 2400]
                },
                {
                    name: '处理流量',
                    data: [3100, 4100, 3700, 4400, 4000, 2700, 2300]
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
            centerNode: { name: '数据中心', status: 'active' },
            nodes: [
                { id: 1, name: '数据源A', value: '2,345/s', ip: '192.168.1.10' },
                { id: 2, name: '数据源B', value: '1,890/s', ip: '192.168.1.20' },
                { id: 3, name: '网络攻击(3个)', details: ['10.0.0.1', '10.0.0.2', '10.0.0.3'] },
                { id: 4, name: '异常访问(2个)', details: ['172.16.0.1', '172.16.0.2'] }
            ],
            connections: [
                { source: '数据中心', target: 1 },
                { source: '数据中心', target: 2 },
                { source: '数据中心', target: 3 },
                { source: '数据中心', target: 4 }
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
                { name: '结构化数据', value: 3520 },
                { name: '非结构化数据', value: 2840 },
                { name: '半结构化数据', value: 1650 },
                { name: '其他', value: 890 }
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
            xAxis: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '23:59'],
            series: [
                { name: '实时接入量', data: [1200, 1800, 2500, 3200, 2800, 3500, 3100, 2400, 1900] },
                { name: '处理完成量', data: [1150, 1750, 2450, 3150, 2750, 3420, 3050, 2350, 1850] },
                { name: '异常处理量', data: [50, 50, 50, 50, 50, 80, 50, 50, 50] }
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
            stat1: { label: '已替代设备', value: 85 },
            stat2: { label: '待替代设备', value: 27 },
            progress: {
                total: 112,
                current: 85,
                label: '国产化',
                percentage: 75.9
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
                { title: '系统升级通知', content: '数据可视化平台将于今晚22:00进行系统升级，预计耗时2小时。', time: '10分钟前', type: 'info' },
                { title: '数据接入异常', content: '数据源B连接超时，请检查网络配置状态。', time: '30分钟前', type: 'warning' },
                { title: '安全警告', content: '检测到异常访问行为，已自动拦截，请关注安全日志。', time: '1小时前', type: 'danger' },
                { title: '新功能上线', content: '实时数据监控功能已上线，欢迎体验使用。', time: '2小时前', type: 'success' },
                { title: '定期维护提醒', content: '下周三将进行定期维护，请提前做好数据备份。', time: '昨天', type: 'info' },
                { title: '性能优化完成', content: '图表渲染性能优化完成，加载速度提升50%。', time: '2天前', type: 'success' }
            ]
        }
    }
}
