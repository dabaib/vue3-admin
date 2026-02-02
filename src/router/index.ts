import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// 路由配置（菜单会根据这里自动生成）
export const routes: RouteRecordRaw[] = [
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
        path: 'account',
        name: 'account',
        component: () => import('@/views/account/index.vue'),
        meta: {
          title: '账号管理',
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

export default router
