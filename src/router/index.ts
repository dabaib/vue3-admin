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
        component: () => import('@/views/HomeView.vue'),
        meta: {
          title: '首页',
          icon: 'HomeFilled',
          menu: true  // 显示在菜单中
        }
      },
      {
        path: 'table',
        name: 'table',
        component: () => import('@/views/TableDemo.vue'),
        meta: {
          title: '表格管理',
          icon: 'Grid',
          menu: true
        }
      },
      {
        path: 'account',
        name: 'account',
        component: () => import('@/views/AccountList.vue'),
        meta: {
          title: '账号管理',
          icon: 'User',
          menu: true
        }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/RoleList.vue'),
        meta: {
          title: '角色管理',
          icon: 'Lock',
          menu: true
        }
      },
      {
        path: 'element',
        name: 'element',
        component: () => import('@/views/ElementDemo.vue'),
        meta: {
          title: 'Element 组件',
          icon: 'Coin',
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
            component: () => import('@/views/demo/SearchDemo.vue'),
            meta: { title: '搜索组件', menu: true }
          },
          {
            path: 'table',
            name: 'demo-table',
            component: () => import('@/views/demo/TableDemo.vue'),
            meta: { title: '表格组件', menu: true }
          },
          {
            path: 'dialog',
            name: 'demo-dialog',
            component: () => import('@/views/demo/DialogDemo.vue'),
            meta: { title: '弹窗组件', menu: true }
          },
          {
            path: 'form',
            name: 'demo-form',
            component: () => import('@/views/demo/FormDemo.vue'),
            meta: { title: '表单组件', menu: true }
          }
        ]
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/views/AboutView.vue'),
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
