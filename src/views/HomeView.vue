<script setup lang="ts">
import { ref } from 'vue'

// 统计数据
const stats = ref([
  { title: '总用户数', value: '12,345', icon: 'User', color: '#409eff', bg: '#ecf5ff' },
  { title: '今日访问', value: '1,234', icon: 'View', color: '#67c23a', bg: '#f0f9eb' },
  { title: '销售金额', value: '¥89,012', icon: 'Money', color: '#e6a23c', bg: '#fdf6ec' },
  { title: '待处理订单', value: '56', icon: 'ShoppingCart', color: '#f56c6c', bg: '#fef0f0' }
])

// 快捷操作
const shortcuts = ref([
  { title: '用户管理', icon: 'User', path: '/table' },
  { title: '数据分析', icon: 'DataAnalysis', path: '/' },
  { title: '系统设置', icon: 'Setting', path: '/' },
  { title: '消息中心', icon: 'Message', path: '/' },
  { title: '文件管理', icon: 'Folder', path: '/' },
  { title: '帮助文档', icon: 'Document', path: '/' }
])

// 最近活动
const activities = ref([
  { user: '张三', action: '创建了新订单', time: '2 分钟前', type: 'success' },
  { user: '李四', action: '更新了用户信息', time: '10 分钟前', type: 'info' },
  { user: '王五', action: '删除了一条记录', time: '30 分钟前', type: 'warning' },
  { user: '系统', action: '完成了数据备份', time: '1 小时前', type: 'primary' }
])
</script>

<template>
  <div class="home-view">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6" v-for="stat in stats" :key="stat.title">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-title">{{ stat.title }}</div>
              <div class="stat-value">{{ stat.value }}</div>
            </div>
            <div class="stat-icon" :style="{ background: stat.bg }">
              <el-icon :size="24" :color="stat.color">
                <component :is="stat.icon" />
              </el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷操作和最近活动 -->
    <el-row :gutter="20">
      <el-col :xs="24" :lg="16">
        <el-card class="section-card">
          <template #header>
            <div class="card-header">
              <span>快捷操作</span>
            </div>
          </template>
          <el-row :gutter="16">
            <el-col :span="8" v-for="item in shortcuts" :key="item.title">
              <div class="shortcut-item" @click="$router.push(item.path)">
                <el-icon :size="32" color="#409eff">
                  <component :is="item.icon" />
                </el-icon>
                <span>{{ item.title }}</span>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card class="section-card">
          <template #header>
            <div class="card-header">
              <span>最近活动</span>
              <el-link type="primary">查看更多</el-link>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="activity in activities"
              :key="activity.time"
              :type="activity.type"
              :timestamp="activity.time"
              placement="top"
            >
              <span class="activity-user">{{ activity.user }}</span>
              {{ activity.action }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.home-view {
  padding: 0;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.shortcut-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 16px;
}

.shortcut-item:hover {
  background-color: #f5f7fa;
  transform: translateY(-2px);
}

.shortcut-item span {
  margin-top: 10px;
  font-size: 14px;
  color: #606266;
}

.activity-user {
  font-weight: 600;
  color: #409eff;
}
</style>
