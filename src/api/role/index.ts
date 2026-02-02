/**
 * 角色管理 API
 * @description 提供角色的增删改查及权限配置接口
 */

import { request } from '@/utils/request'
import type {
    Role,
    RoleFormData,
    RoleQueryParams,
    RoleListResult,
    MenuTreeNode
} from './types'

const BASE_URL = '/system/role'

/**
 * 获取角色列表（分页）
 */
export const getRoleList = (params: RoleQueryParams): Promise<RoleListResult> => {
    return request.get<RoleListResult>(`${BASE_URL}/list`, { params })
}

/**
 * 创建角色
 */
export const createRole = (data: RoleFormData): Promise<void> => {
    return request.post(BASE_URL, data)
}

/**
 * 更新角色
 */
export const updateRole = (id: string, data: RoleFormData): Promise<void> => {
    return request.put(`${BASE_URL}/${id}`, data)
}

/**
 * 删除角色（支持批量删除）
 * @param ids 角色ID，多个用逗号分隔
 */
export const deleteRole = (ids: string): Promise<void> => {
    return request.delete(`${BASE_URL}/${ids}`)
}

/**
 * 获取角色权限（菜单ID列表）
 */
export const getRolePermissions = (roleId: string): Promise<string[]> => {
    return request.get<string[]>(`${BASE_URL}/${roleId}/permissions`)
}

/**
 * 更新角色权限
 */
export const updateRolePermissions = (roleId: string, menuIds: string[]): Promise<void> => {
    return request.put(`${BASE_URL}/${roleId}/permissions`, { menuIds })
}

/**
 * 获取菜单树（用于权限配置）
 * @description 返回完整的菜单树结构
 */
export const getMenuTree = (): Promise<MenuTreeNode[]> => {
    return request.get<MenuTreeNode[]>('/system/menu/tree')
}

// 导出类型供外部使用
export type { Role, RoleFormData, RoleQueryParams, RoleListResult, MenuTreeNode }
