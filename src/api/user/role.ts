import request from '@/utils/request'

/** 角色选项（用于分配） */
export interface RoleOption {
    id: number
    name: string
    code: string
}

/**你·
 * 获取用户已分配的角色 ID 列表
 */
export function getUserRoles(userId: number | string): Promise<number[]> {
    return request.get(`/user/${userId}/roles`)
}

/**
 * 为用户分配角色（覆盖式）
 */
export function assignUserRoles(userId: number | string, roleIds: number[]): Promise<void> {
    return request.put(`/user/${userId}/roles`, roleIds)
}

/**
 * 获取所有启用角色列表（用于分配时选择）
 */
export function getRoleOptions(): Promise<RoleOption[]> {
    return request.get('/user/role-options')
}
