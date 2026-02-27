<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute, type RouteRecordRaw } from 'vue-router'
import { routes } from '@/router'

// 路由
const router = useRouter()
const route = useRoute()

// 侧边栏折叠状态
const isCollapse = defineModel<boolean>('collapse', { default: false })

// 用户信息
const userInfo = {
  name: '管理员',
  avatar: 'https://picsum.photos/100/100?random=user'
}

// 从路由配置中自动生成菜单
const menuList = computed(() => {
  // 获取主布局的子路由
  const layoutRoute = routes.find(r => r.path === '/')
  if (!layoutRoute?.children) return []
  
  return layoutRoute.children
    .filter(child => child.meta?.menu !== false) // 过滤掉不显示的菜单
    .map(child => ({
      index: child.path === '' ? '/' : `/${child.path}`,
      title: (child.meta?.title as string) || child.name?.toString() || '',
      icon: (child.meta?.icon as string) || 'Document',
      children: child.children?.filter(c => c.meta?.menu !== false).map(c => ({
        index: `/${child.path}/${c.path}`,
        title: (c.meta?.title as string) || c.name?.toString() || '',
        icon: (c.meta?.icon as string) || 'Document'
      }))
    }))
})

// 当前激活菜单
const activeMenu = computed(() => route.path)

// 切换折叠
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 全屏切换
import { useFullscreen } from '@vueuse/core'
import TagsView from './components/TagsView.vue'

const { isFullscreen, toggle } = useFullscreen()

// 定义大屏/外部路由，这些路由将会在新标签页中打开
const topRoutes = computed(() => {
  return routes.filter(r => r.path !== '/' && r.meta?.menu !== false).map(r => {
    return {
      path: r.path.startsWith('/') ? r.path : `/${r.path}`,
      title: r.meta?.title || r.name,
      icon: r.meta?.icon || 'DataBoard'
    }
  })
})

const openDashboard = (path: string) => {
  const routeUrl = router.resolve({ path })
  window.open(routeUrl.href, '_blank')
}

// 处理菜单点击
const handleMenuSelect = (index: string) => {
  router.push(index)
}

// 处理用户下拉菜单
const handleUserCommand = (command: string) => {
  switch (command) {
    case 'profile':
      console.log('个人中心')
      break
    case 'settings':
      console.log('设置')
      break
    case 'logout':
      console.log('退出登录')
      break
  }
}

</script>

<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="layout-aside">
      <!-- Logo -->
      <div class="logo-container">
        <el-icon class="logo-icon" :size="28"><Promotion /></el-icon>
        <span v-show="!isCollapse" class="logo-text">Vue3 Admin</span>
      </div>

      <!-- 菜单 - 根据路由自动生成 -->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :collapse-transition="false"
        background-color="#001529"
        text-color="#ffffffa6"
        active-text-color="#fff"
        class="layout-menu"
        @select="handleMenuSelect"
      >
        <template v-for="item in menuList" :key="item.index">
          <!-- 有子菜单 -->
          <el-sub-menu v-if="item.children?.length" :index="item.index">
            <template #title>
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item
              v-for="child in item.children"
              :key="child.index"
              :index="child.index"
            >
              <el-icon><component :is="child.icon" /></el-icon>
              <template #title>{{ child.title }}</template>
            </el-menu-item>
          </el-sub-menu>

          <!-- 无子菜单 -->
          <el-menu-item v-else :index="item.index">
            <el-icon><component :is="item.icon" /></el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>

      <!-- 侧边栏底部版本信息 -->
      <div class="sidebar-footer" v-show="!isCollapse">
        <span>v1.0.0</span>
      </div>
    </el-aside>

    <!-- 右侧内容区 -->
    <el-container class="layout-main">
      <!-- 顶部导航 -->
      <el-header class="layout-header">
        <div class="header-left">
          <!-- 折叠按钮 -->
          <el-icon class="collapse-btn" @click="toggleCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          
          <!-- 面包屑 -->
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="route.path !== '/' && route.meta?.title">
              {{ route.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <!-- 大屏空间 -->
          <el-popover placement="bottom-end" :width="320" trigger="hover" :offset="12">
            <template #reference>
              <div class="header-action-item">
                <el-icon class="header-icon"><DataBoard /></el-icon>
                <span class="action-text">数据大屏</span>
              </div>
            </template>
            <div class="dashboard-cards-grid">
              <div 
                v-for="item in topRoutes" 
                :key="item.path"
                class="dash-card" 
                @click="openDashboard(item.path)"
              >
                <div class="card-icon-wrapper">
                  <el-icon class="card-icon"><component :is="item.icon" /></el-icon>
                </div>
                <span class="card-title">{{ item.title }}</span>
              </div>
            </div>
          </el-popover>

          <!-- 全屏 -->
          <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
            <el-icon class="header-icon" @click="toggle">
              <FullScreen v-if="!isFullscreen" />
              <Aim v-else />
            </el-icon>
          </el-tooltip>

          <!-- 消息 -->
          <el-badge :value="3" class="header-badge">
            <el-icon class="header-icon"><Bell /></el-icon>
          </el-badge>

          <!-- 用户信息 -->
          <el-dropdown @command="handleUserCommand">
            <div class="user-info">
              <el-avatar :size="32" :src="userInfo.avatar" />
              <span class="user-name">{{ userInfo.name }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>个人中心
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>系统设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 标签导航 -->
      <TagsView />

      <!-- 主内容区 -->
      <el-main class="layout-content">
        <RouterView v-slot="{ Component, route }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive>
              <component :is="Component" :key="route.path" />
            </keep-alive>
          </transition>
        </RouterView>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;

  /* 侧边栏 */
  .layout-aside {
    background-color: #001529;
    transition: width 0.3s;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    
    .logo-container {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 16px;
      background-color: #002140;
      overflow: hidden;

      .logo-icon {
        color: #1890ff;
        flex-shrink: 0;
      }

      .logo-text {
        color: #fff;
        font-size: 18px;
        font-weight: 600;
        margin-left: 10px;
        white-space: nowrap;
      }
    }

    .layout-menu {
      border-right: none;
      flex: 1;
      height: 0; // Trigger flex growing
      overflow-y: auto;

      &:not(.el-menu--collapse) {
        width: 220px;
      }

      /* 激活菜单项样式 */
      .el-menu-item.is-active {
        background-color: #1890ff !important;
      }
    }

    .sidebar-footer {
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.45);
      font-size: 13px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      background-color: #001529;
      flex-shrink: 0;
      white-space: nowrap;
    }
  }

  /* 主内容区 */
  .layout-main {
    background-color: #f0f2f5;
    overflow: hidden;

    /* 顶部导航 */
    .layout-header {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      background-color: #fff;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      z-index: 10;

      .header-left {
        display: flex;
        align-items: center;
        gap: 16px;

        .collapse-btn {
          font-size: 20px;
          cursor: pointer;
          color: #333;
          transition: color 0.3s;

          &:hover {
            color: #1890ff;
          }
        }
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 20px;

        .header-action-item {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          color: #666;
          padding: 6px 10px;
          border-radius: 4px;
          transition: all 0.3s;
          
          &:hover {
            color: #1890ff;
            background-color: #f5f5f5;
          }

          .header-icon {
            font-size: 18px;
          }

          .action-text {
            font-size: 14px;
            font-weight: 500;
          }
        }

        .header-icon {
          font-size: 18px;
          cursor: pointer;
          color: #666;
          transition: color 0.3s;

          &:hover {
            color: #1890ff;
          }
        }

        .header-badge {
          cursor: pointer;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background-color 0.3s;

          &:hover {
            background-color: #f5f5f5;
          }

          .user-name {
            color: #333;
            font-size: 14px;
          }
        }
      }
    }

    .layout-content {
      padding: 16px;
      overflow-y: auto;
    }
  }
}

/* 大屏网格面板 */
.dashboard-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 8px;

  .dash-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px 12px;
    background: #f8fafc;
    border: 1px solid #e1e7ef;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background: #fff;
      border-color: #1890ff;
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
      transform: translateY(-2px);

      .card-icon-wrapper {
        background: #e6f7ff;
        color: #1890ff;
      }
    }

    .card-icon-wrapper {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #eef2f6;
      border-radius: 12px;
      color: #64748b;
      margin-bottom: 12px;
      transition: all 0.3s;

      .card-icon {
        font-size: 24px;
      }
    }

    .card-title {
      font-size: 14px;
      font-weight: 500;
      color: #334155;
      text-align: center;
      word-break: break-all;
    }
  }
}
</style>
