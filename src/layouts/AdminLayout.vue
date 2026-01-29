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
          <!-- 全屏 -->
          <el-tooltip content="全屏" placement="bottom">
            <el-icon class="header-icon"><FullScreen /></el-icon>
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



      <!-- 主内容区 -->
      <el-main class="layout-content">
        <RouterView />
      </el-main>

      <!-- 底部 -->
      <el-footer class="layout-footer">
        <span>Copyright © 2024 Vue3 Admin. All Rights Reserved.</span>
      </el-footer>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* 侧边栏 */
.layout-aside {
  background-color: #001529;
  transition: width 0.3s;
  overflow: hidden;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  background-color: #002140;
  overflow: hidden;
}

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

.layout-menu {
  border-right: none;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.layout-menu:not(.el-menu--collapse) {
  width: 220px;
}

/* 激活菜单项样式 */
.layout-menu .el-menu-item.is-active {
  background-color: #1890ff !important;
}

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
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: #333;
  transition: color 0.3s;
}

.collapse-btn:hover {
  color: #1890ff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-icon {
  font-size: 18px;
  cursor: pointer;
  color: #666;
  transition: color 0.3s;
}

.header-icon:hover {
  color: #1890ff;
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
}

.user-info:hover {
  background-color: #f5f5f5;
}

.user-name {
  color: #333;
  font-size: 14px;
}



/* 主内容区 */
.layout-main {
  background-color: #f0f2f5;
  overflow: hidden;
}

.layout-content {
  padding: 16px;
  overflow-y: auto;
}

/* 底部 */
.layout-footer {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  background-color: #fff;
}
</style>
