import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, logout as logoutApi, type LoginParams } from '@/api/auth'
import router from '@/router'

/** 用户信息 */
interface UserInfo {
    userId: number
    account: string
    name: string
    permissions: string[]
}

/**
 * 用户认证 Store
 * 管理 Token、用户信息的状态与持久化
 */
export const useAuthStore = defineStore('auth', () => {
    // Token（从 localStorage 初始化，保证刷新后不丢失）
    const token = ref<string>(localStorage.getItem('token') ?? '')

    // 用户信息
    const userInfo = ref<UserInfo | null>(
        (() => {
            const stored = localStorage.getItem('userInfo')
            return stored ? JSON.parse(stored) : null
        })()
    )

    /** 是否已登录 */
    const isLoggedIn = () => !!token.value

    /**
     * 登录
     */
    const login = async (params: LoginParams) => {
        const result = await loginApi(params)
        token.value = result.token
        userInfo.value = {
            userId: result.userId,
            account: result.account,
            name: result.name,
            permissions: result.permissions
        }
        // 持久化到 localStorage
        localStorage.setItem('token', result.token)
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    }

    /**
     * 注销
     */
    const logout = async () => {
        try {
            await logoutApi()
        } catch {
            // 忽略注销接口错误，继续清理本地状态
        }
        token.value = ''
        userInfo.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        router.push('/login')
    }

    return { token, userInfo, isLoggedIn, login, logout }
})
