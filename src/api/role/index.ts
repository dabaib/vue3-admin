import request from '@/utils/request'
import type { Role, RoleQueryParams, RoleListResponse, RoleFormData } from './types'

// 菜单树节点类型（与后端 MenuTreeVO 对应）
export interface MenuTreeNode {
    id: string
    label: string
    children?: MenuTreeNode[]
}

/**
 * 获取角色列表（分页）
 */
export function getRoleList(params: RoleQueryParams): Promise<RoleListResponse> {
    return request.get('/role/page', { params })
}

/**
 * 创建角色
 */
export function createRole(data: RoleFormData): Promise<void> {
    return request.post('/role', data)
}

/**
 * 更新角色
 */
export function updateRole(data: RoleFormData): Promise<void> {
    return request.put('/role', data)
}

/**
 * 删除角色（支持批量，逗号分隔ID）
 */
export function deleteRole(ids: string): Promise<void> {
    return request.delete(`/role/${ids}`)
}

/**
 * 获取菜单权限树
 */
export function getMenuTree(): Promise<MenuTreeNode[]> {
    return request.get('/role/menu-tree')
}

/**
 * 获取角色已有的菜单权限列表
 */
export function getRolePermissions(roleId: string): Promise<string[]> {
    return request.get(`/role/${roleId}/permissions`)
}

/**
 * 更新角色菜单权限
 */
export function updateRolePermissions(roleId: string, menuIds: string[]): Promise<void> {
    return request.put(`/role/${roleId}/permissions`, { menuIds })
}
