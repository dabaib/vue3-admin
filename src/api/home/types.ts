/**
 * 仪表盘统计数据
 */
export interface DashboardStats {
    userCount: number
    roleCount: number
    menuCount: number
    deptCount: number
}

/**
 * 最近活动项
 */
export interface Activity {
    user: string
    action: string
    time: string
    type: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}
