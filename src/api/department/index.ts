import request from '@/utils/request'
import type { Department, DeptQueryParams, DeptFormData } from './types'

/**
 * 获取部门树
 */
export function getDeptTree(params?: DeptQueryParams): Promise<Department[]> {
    return request.get('/dept/tree', { params })
}

/**
 * 获取部门列表（平铺）
 */
export function getDeptList(params?: DeptQueryParams): Promise<Department[]> {
    return request.get('/dept/list', { params })
}

/**
 * 创建部门
 */
export function createDept(data: DeptFormData): Promise<void> {
    return request.post('/dept', data)
}

/**
 * 更新部门
 */
export function updateDept(data: DeptFormData): Promise<void> {
    return request.put('/dept', data)
}

/**
 * 删除部门（支持批量，逗号分隔ID）
 */
export function deleteDept(ids: string): Promise<void> {
    return request.delete(`/dept/${ids}`)
}
