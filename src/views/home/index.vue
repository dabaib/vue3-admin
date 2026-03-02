<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDashboardStats, getRecentActivities } from '@/api/home'
import type { DashboardStats, Activity } from '@/api/home/types'
import { User, View, Money, ShoppingCart, Setting, Folder, Menu as IconMenu } from '@element-plus/icons-vue'
import BaseChart from '@/components/BaseChart/index.vue'

// 统计数据
const stats = ref<DashboardStats>({
  userCount: 0,
  roleCount: 0,
  menuCount: 0,
  deptCount: 0
})

// 最近活动
const activities = ref<Activity[]>([])

// 快捷操作 (静态快捷入口)
const shortcuts = ref([
  { title: '用户管理', icon: User, path: '/user-manager' },
  { title: '角色权限', icon: Setting, path: '/role-manager' },
  { title: '部门管理', icon: Folder, path: '/department-manager' },
  { title: '菜单配置', icon: IconMenu, path: '/menu-manager' } // 假设系统有这个路由
])

// 初始化获取数据
const fetchData = async () => {
  try {
    const statsRes = await getDashboardStats()
    stats.value = statsRes

    const activitiesRes = await getRecentActivities()
    activities.value = activitiesRes
  } catch (error) {
    console.error('获取首页数据失败', error)
  }
}

onMounted(() => {
  fetchData()
})

// 刷新动态
const handleRefresh = () => {
  getRecentActivities().then(res => {
    activities.value = res
  })
}

// 图表配置 - 假装渲染一个访问趋势图
const chartOptions = ref({
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    axisLine: { lineStyle: { color: '#e4e7ed' } },
    axisLabel: { color: '#606266' }
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { type: 'dashed', color: '#ebeef5' } },
    axisLabel: { color: '#606266' }
  },
  series: [
    {
      name: '活跃度',
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line',
      smooth: true,
      symbolSize: 8,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(64, 158, 255, 0.5)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
          ]
        }
      },
      itemStyle: {
        color: 'var(--el-color-primary)',
        borderWidth: 2
      },
      lineStyle: {
        width: 3,
        shadowColor: 'rgba(64,158,255, 0.3)',
        shadowBlur: 10,
        shadowOffsetY: 8
      }
    }
  ],
  grid: {
    left: '2%',
    right: '4%',
    bottom: '2%',
    top: '10%',
    containLabel: true
  }
})
</script>

<template>
  <div class="home-view">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-title">总用户数</div>
              <div class="stat-value">{{ stats.userCount }}</div>
            </div>
            <div class="stat-icon" style="background: var(--el-color-primary-light-9);">
              <el-icon :size="28" color="var(--el-color-primary)">
                <User />
              </el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-title">总角色数</div>
              <div class="stat-value">{{ stats.roleCount }}</div>
            </div>
            <div class="stat-icon" style="background: #f0f9eb;">
              <el-icon :size="28" color="#67c23a">
                <View />
              </el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-title">总菜单数</div>
              <div class="stat-value">{{ stats.menuCount }}</div>
            </div>
            <div class="stat-icon" style="background: #fdf6ec;">
              <el-icon :size="28" color="#e6a23c">
                <Money />
              </el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-title">总部门数</div>
              <div class="stat-value">{{ stats.deptCount }}</div>
            </div>
            <div class="stat-icon" style="background: #fef0f0;">
              <el-icon :size="28" color="#f56c6c">
                <ShoppingCart />
              </el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表和最近活动 -->
    <el-row :gutter="20">
      <el-col :xs="24" :lg="16">
        <el-card class="section-card chart-card">
          <template #header>
            <div class="card-header">
              <span>系统活跃度趋势</span>
            </div>
          </template>
          <div class="chart-container">
            <BaseChart :options="chartOptions" />
          </div>
        </el-card>

        <el-card class="section-card mt-20 shortcut-card">
          <template #header>
            <div class="card-header">
              <span>快捷入口</span>
            </div>
          </template>
          <el-row :gutter="16">
            <el-col :span="6" v-for="item in shortcuts" :key="item.title">
              <div class="shortcut-item" @click="$router.push(item.path)">
                <el-icon :size="32" color="var(--el-color-primary)">
                  <component :is="item.icon" />
                </el-icon>
                <span>{{ item.title }}</span>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card class="section-card activity-card">
          <template #header>
            <div class="card-header">
              <span>系统动态</span>
              <el-link type="primary" :underline="false" @click="handleRefresh">刷新</el-link>
            </div>
          </template>
          <div class="activity-list">
             <el-timeline v-if="activities.length > 0">
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :type="activity.type as any"
                :timestamp="activity.time"
                placement="top"
                size="large"
              >
                <div class="activity-content">
                  <span class="activity-user">{{ activity.user }}</span>
                  <span class="activity-action">{{ activity.action }}</span>
                </div>
              </el-timeline-item>
            </el-timeline>
            <el-empty v-else description="暂无动态数据" :image-size="80" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.home-view {
  padding: 0;

  .stats-row {
    margin-bottom: 20px;

    .stat-card {
      border: none;
      border-radius: 12px;
      overflow: hidden;

      .stat-content {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .stat-info {
          flex: 1;

          .stat-title {
            font-size: 14px;
            color: var(--el-text-color-secondary);
            margin-bottom: 8px;
            font-weight: 500;
          }

          .stat-value {
            font-size: 32px;
            font-weight: 700;
            color: var(--el-text-color-primary);
            line-height: 1;
            font-family: 'DIN Alternate', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          }
        }

        .stat-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      }

      &:hover .stat-icon {
        transform: scale(1.1) rotate(6deg);
      }
    }
  }

  .mt-20 {
    margin-top: 20px;
  }

  .section-card {
    border: none;
    border-radius: 12px;
    height: 100%;

    :deep(.el-card__header) {
      border-bottom: 1px solid var(--el-border-color-lighter);
      padding: 16px 20px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
      font-size: 16px;
      color: var(--el-text-color-primary);
    }

    &.chart-card {
      .chart-container {
        height: 320px;
        width: 100%;
      }
    }

    &.shortcut-card {
      .shortcut-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 24px 10px;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3sease;
        background: var(--el-fill-color-lighter);

        &:hover {
          background-color: var(--el-color-primary-light-9);
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

          .el-icon {
            transform: scale(1.1);
          }
        }

        .el-icon {
          transition: transform 0.3sease;
        }

        span {
          margin-top: 14px;
          font-size: 14px;
          color: var(--el-text-color-regular);
          font-weight: 500;
        }
      }
    }

    &.activity-card {
      .activity-list {
        padding-top: 10px;
        max-height: 440px;
        overflow-y: auto;
        
        &::-webkit-scrollbar {
          width: 6px;
        }
        &::-webkit-scrollbar-thumb {
          background: var(--el-border-color-darker);
          border-radius: 3px;
        }

        .activity-content {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          background: var(--el-fill-color-light);
          border-radius: 6px;
          margin-top: 4px;
          
          .activity-user {
            font-weight: 600;
            color: var(--el-text-color-primary);
          }
          
          .activity-action {
            color: var(--el-text-color-regular);
            font-size: 13px;
          }
        }

        :deep(.el-timeline-item__timestamp) {
          color: var(--el-text-color-placeholder);
          font-size: 13px;
          margin-bottom: 6px;
        }
      }
    }
  }
}
</style>
