import request from '@/utils/request'

/** 登录请求参数 */
export interface LoginParams {
    account: string
    password: string
}

/** 登录响应数据 */
export interface LoginResult {
    token: string
    userId: number
    account: string
    name: string
    permissions: string[]
}

/**
 * 用户登录
 */
export function login(data: LoginParams): Promise<LoginResult> {
    return request.post('/auth/login', data)
}

/**
 * 用户注销
 */
export function logout(): Promise<void> {
    return request.post('/auth/logout')
}
