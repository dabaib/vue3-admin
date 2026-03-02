import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// 路由配置（菜单会根据这里自动生成）
export const routes: RouteRecordRaw[] = [

  // 登录页（独立路由，不套 AdminLayout）
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', menu: false }
  },
  {
    path: '/dashboard1',
    name: 'dashboard1',
    component: () => import('@/views/dashboard-cc/index.vue'),
    meta: {
      title: '数据大屏1.0',
      icon: 'DataLine',
      menu: true
    }
  },
  {
    path: '/dashboard2',
    name: 'dashboard2',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      title: '数据大屏2.0',
      icon: 'DataLine', // 假设有这个图标，或者用其他
      menu: true
    }
  },
  {
    path: '/dashboard3',
    name: 'dashboard3',
    component: () => import('@/views/dashboard -test/index.vue'),
    meta: {
      title: '数据大屏3.0',
      icon: 'Platform',
      menu: true
    }
  },

  {
    path: '/',
    component: () => import('@/layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          icon: 'HomeFilled',
          menu: true  // 显示在菜单中
        }
      },

      {
        path: 'user',
        name: 'user-manager',
        component: () => import('@/views/user-manager/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'User',
          menu: true
        }
      },

      {
        path: 'role',
        name: 'role-manager',
        component: () => import('@/views/role-manager/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'Lock',
          menu: true
        }
      },
      {
        path: 'department',
        name: 'department-manager',
        component: () => import('@/views/department-manager/index.vue'),
        meta: {
          title: '部门管理',
          icon: 'OfficeBuilding',
          menu: true
        }
      },

      // 组件演示模块
      {
        path: 'demo',
        name: 'demo',
        meta: {
          title: '组件演示',
          icon: 'Monitor',
          menu: true
        },
        // 这里只是分组，如果需要子路由渲染需提供 router-view，或者直接利用 AdminLayout 的渲染能力
        // 但 AdminLayout 已经在渲染这些子 View 了，所以这里直接平铺或者通过 children 嵌套
        // 既然要求父子关系，这里使用 children
        children: [
          {
            path: 'search',
            name: 'demo-search',
            component: () => import('@/views/demo/search/index.vue'),
            meta: { title: '搜索组件', menu: true }
          },
          {
            path: 'table',
            name: 'demo-table',
            component: () => import('@/views/demo/table/index.vue'),
            meta: { title: '表格组件', menu: true }
          },
          {
            path: 'dialog',
            name: 'demo-dialog',
            component: () => import('@/views/demo/dialog/index.vue'),
            meta: { title: '弹窗组件', menu: true }
          },
          {
            path: 'form',
            name: 'demo-form',
            component: () => import('@/views/demo/form/index.vue'),
            meta: { title: '表单组件', menu: true }
          },
          {
            path: 'chart',
            name: 'demo-chart',
            component: () => import('@/views/demo/chart-demo.vue'),
            meta: { title: '图表组件', menu: true }
          }
        ]
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/views/about/index.vue'),
        meta: {
          title: '关于我们',
          icon: 'InfoFilled',
          menu: true
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 不需要验证登录的白名单路由名称
const whiteList = ['login']

/**
 * 全局路由守卫
 * - 未登录且不在白名单 → 跳转 /login
 * - 已登录且访问 /login → 跳转首页
 */
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  if (whiteList.includes(to.name as string)) {
    // 已登录则无需再去登录页
    if (authStore.isLoggedIn()) {
      next({ name: 'home' })
    } else {
      next()
    }
  } else if (!authStore.isLoggedIn()) {
    // 未登录，记录目标页并重定向到登录
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
