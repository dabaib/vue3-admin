import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器：自动携带 JWT Token
service.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器：后端统一响应格式 { code: 0, msg, data }
service.interceptors.response.use(
    (response: AxiosResponse) => {
        const { data } = response
        // code === 0 表示成功
        if (data.code === 0) {
            return data.data
        }
        // 401 跳转登录
        if (data.code === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        ElMessage.error(data.msg || '请求失败')
        return Promise.reject(new Error(data.msg || '请求失败'))
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        const message = error.response?.data?.msg || error.message || '网络错误'
        ElMessage.error(message)
        return Promise.reject(error)
    }
)

// 封装请求方法
export const request = {
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return service.get(url, config)
    },
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return service.post(url, data, config)
    },
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return service.put(url, data, config)
    },
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return service.delete(url, config)
    }
}

export default service
