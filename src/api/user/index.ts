import request from '@/utils/request'
import type { User, UserQueryParams, UserListResponse, UserFormData } from './types'

/**
 * 获取用户列表（分页）
 */
export function getUserList(params: UserQueryParams): Promise<UserListResponse> {
    return request.get('/user/page', { params })
}

/**
 * 创建用户
 */
export function createUser(data: UserFormData): Promise<void> {
    return request.post('/user', data)
}

/**
 * 更新用户
 */
export function updateUser(data: UserFormData): Promise<void> {
    return request.put('/user', data)
}

/**
 * 删除用户（支持批量，逗号分隔ID）
 */
export function deleteUser(ids: string): Promise<void> {
    return request.delete(`/user/${ids}`)
}
