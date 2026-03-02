import request from '@/utils/request'
import type { DashboardStats, Activity } from './types'

/**
 * 获取仪表盘统计数据
 */
export function getDashboardStats(): Promise<DashboardStats> {
    return request.get('/home/stats')
}

/**
 * 获取最近动态
 */
export function getRecentActivities(): Promise<Activity[]> {
    return request.get('/home/activities')
}
