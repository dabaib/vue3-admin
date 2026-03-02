<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Loading } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 登录表单 ref
const formRef = ref()

// 表单数据
const form = reactive({
    account: 'admin',
    password: '123456'
})

// 加载状态
const loading = ref(false)

// 表单校验规则
const rules = {
    account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

/**
 * 提交登录
 */
const handleLogin = async () => {
    await formRef.value?.validate()
    loading.value = true
    try {
        await authStore.login({ account: form.account, password: form.password })
        ElMessage.success('登录成功')
        // 跳转到首页（或 redirect 参数指定的页面）
        const redirect = (router.currentRoute.value.query.redirect as string) || '/'
        router.push(redirect)
    } catch {
        // 错误已由 request 拦截器统一 ElMessage 提示，此处不重复处理
    } finally {
        loading.value = false
    }
}

/** 回车提交 */
const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') handleLogin()
}
</script>

<template>
    <div class="login-page">
        <!-- 背景装饰 -->
        <div class="bg-decoration">
            <div class="circle circle-1"></div>
            <div class="circle circle-2"></div>
            <div class="circle circle-3"></div>
        </div>

        <!-- 登录卡片 -->
        <div class="login-card">
            <!-- 左侧品牌区 -->
            <div class="login-brand">
                <div class="brand-logo">
                    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="80" height="80" rx="20" fill="url(#grad1)"/>
                        <defs>
                            <linearGradient id="grad1" x1="0" y1="0" x2="80" y2="80">
                                <stop offset="0%" stop-color="#667eea"/>
                                <stop offset="100%" stop-color="#764ba2"/>
                            </linearGradient>
                        </defs>
                        <path d="M20 55L40 25L60 55" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="40" cy="42" r="6" fill="white"/>
                    </svg>
                </div>
                <h1 class="brand-name">Vue3 Admin</h1>
                <p class="brand-desc">高性能 · 可维护 · 极致体验</p>
                <div class="brand-features">
                    <div class="feature-item">
                        <span class="feature-dot"></span>
                        <span>Vue 3.5 + TypeScript</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-dot"></span>
                        <span>Spring Boot 3 后端</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-dot"></span>
                        <span>RBAC 权限管理</span>
                    </div>
                </div>
            </div>

            <!-- 右侧表单区 -->
            <div class="login-form-wrap">
                <div class="form-header">
                    <h2>欢迎回来</h2>
                    <p>请输入您的账号和密码登录系统</p>
                </div>

                <el-form
                    ref="formRef"
                    :model="form"
                    :rules="rules"
                    class="login-form"
                    @keydown="handleKeydown"
                >
                    <el-form-item prop="account">
                        <el-input
                            v-model="form.account"
                            placeholder="请输入账号"
                            size="large"
                            clearable
                            :prefix-icon="User"
                        />
                    </el-form-item>

                    <el-form-item prop="password">
                        <el-input
                            v-model="form.password"
                            type="password"
                            placeholder="请输入密码"
                            size="large"
                            show-password
                            :prefix-icon="Lock"
                        />
                    </el-form-item>

                    <el-form-item>
                        <el-button
                            class="login-btn"
                            type="primary"
                            size="large"
                            :loading="loading"
                            @click="handleLogin"
                        >
                            {{ loading ? '登录中...' : '立即登录' }}
                        </el-button>
                    </el-form-item>
                </el-form>

                <div class="login-tips">
                    <p>默认账号：<strong>admin</strong> / <strong>123456</strong></p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%);
    position: relative;
    overflow: hidden;
}

/* 背景装饰圆 */
.bg-decoration {
    position: absolute;
    inset: 0;
    pointer-events: none;

    .circle {
        position: absolute;
        border-radius: 50%;
        opacity: 0.08;
        animation: float 8s ease-in-out infinite;
    }

    .circle-1 {
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, #667eea, transparent);
        top: -100px;
        left: -100px;
        animation-delay: 0s;
    }

    .circle-2 {
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, #764ba2, transparent);
        bottom: -80px;
        right: 10%;
        animation-delay: 3s;
    }

    .circle-3 {
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, #f64f59, transparent);
        top: 50%;
        right: 30%;
        animation-delay: 6s;
    }
}

@keyframes float {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-20px) scale(1.05); }
}

/* 登录卡片 */
.login-card {
    display: flex;
    width: 880px;
    min-height: 520px;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 40px 80px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.05);
    backdrop-filter: blur(20px);
    position: relative;
    z-index: 1;
}

/* 品牌区 */
.login-brand {
    flex: 1;
    background: linear-gradient(145deg, #667eea 0%, #764ba2 100%);
    padding: 56px 48px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle at 30% 40%, rgba(255,255,255,0.12) 0%, transparent 50%);
        pointer-events: none;
    }

    .brand-logo {
        width: 72px;
        height: 72px;
        margin-bottom: 24px;
        border-radius: 18px;
        overflow: hidden;
        box-shadow: 0 12px 32px rgba(0,0,0,0.25);

        svg { width: 100%; height: 100%; }
    }

    .brand-name {
        font-size: 32px;
        font-weight: 700;
        color: #fff;
        margin: 0 0 8px;
        letter-spacing: 1px;
    }

    .brand-desc {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        margin: 0 0 40px;
    }

    .brand-features {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .feature-item {
            display: flex;
            align-items: center;
            gap: 10px;
            color: rgba(255, 255, 255, 0.85);
            font-size: 14px;
        }

        .feature-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            flex-shrink: 0;
        }
    }
}

/* 表单区 */
.login-form-wrap {
    flex: 1;
    background: #fff;
    padding: 56px 48px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .form-header {
        margin-bottom: 36px;

        h2 {
            font-size: 26px;
            font-weight: 700;
            color: var(--el-text-color-primary);
            margin: 0 0 8px;
        }

        p {
            font-size: 14px;
            color: var(--el-text-color-secondary);
            margin: 0;
        }
    }

    .login-form {
        .el-form-item {
            margin-bottom: 20px;
        }

        :deep(.el-input__wrapper) {
            border-radius: 10px;
            box-shadow: 0 0 0 1px var(--el-border-color) inset;
            transition: box-shadow 0.2s;

            &:hover {
                box-shadow: 0 0 0 1px var(--el-color-primary-light-3) inset;
            }

            &.is-focus {
                box-shadow: 0 0 0 2px var(--el-color-primary-light-5) inset;
            }
        }
    }

    .login-btn {
        width: 100%;
        height: 46px;
        border-radius: 10px;
        font-size: 15px;
        font-weight: 600;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border: none;
        letter-spacing: 1px;
        transition: opacity 0.2s, transform 0.1s;

        &:hover { opacity: 0.92; transform: translateY(-1px); }
        &:active { transform: translateY(0); }
    }

    .login-tips {
        margin-top: 20px;
        text-align: center;

        p {
            font-size: 13px;
            color: var(--el-text-color-placeholder);
        }

        strong {
            color: var(--el-color-primary);
            font-weight: 600;
        }
    }
}
</style>
