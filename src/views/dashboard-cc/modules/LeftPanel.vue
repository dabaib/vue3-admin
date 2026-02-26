<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BaseChart from '@/components/BaseChart/index.vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { getServerStats, getTrafficBar, getStaffList } from '@/api/dashboard-cc'

// 服务器统计数据
const serverStats = ref<{ totalServers: number; events: Array<{ label: string; value: number }> }>({
  totalServers: 0,
  events: []
})

// 柱状图配置
const barChartOption = ref<EChartsOption>({})

// 人员列表
const staffList = ref<Array<{ name: string; dept: string; phone: string; status: string; statusType: string }>>([])

// 状态标签样式
const getStatusClass = (statusType: string) => {
  const map: Record<string, string> = {
    success: 'status-success',
    danger: 'status-danger',
    warning: 'status-warning'
  }
  return map[statusType] || ''
}

// 加载数据
const loadData = async () => {
  try {
    // 服务器统计
    const statsRes = await getServerStats()
    serverStats.value = statsRes.data

    // 柱状图
    const barRes = await getTrafficBar()
    barChartOption.value = {
      grid: {
        left: '10%',
        right: '5%',
        bottom: '15%',
        top: '15%'
      },
      xAxis: {
        type: 'category',
        data: barRes.data.categories,
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
        axisLabel: { color: '#A0A0A0', fontSize: 12 }
      },
      yAxis: {
        type: 'value',
        max: 100,
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
        axisLabel: { color: '#A0A0A0' }
      },
      legend: {
        data: barRes.data.series.map(s => s.name),
        top: 5,
        right: 10,
        textStyle: { color: '#A0A0A0' },
        itemWidth: 10,
        itemHeight: 10,
        borderRadius: 5
      },
      series: barRes.data.series.map((s, index) => ({
        name: s.name,
        type: 'bar',
        data: s.data,
        barWidth: '35%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: index === 0 ? '#00BFFF' : '#00E09E' },
            { offset: 1, color: index === 0 ? '#0066FF' : '#00B085' }
          ])
        }
      })),
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: { color: 'rgba(255,255,255,0.1)' }
        }
      }
    }

    // 人员列表
    const listRes = await getStaffList()
    staffList.value = listRes.data.list
  } catch (error) {
    console.error('加载左侧数据失败:', error)
  }
}

onMounted(() => {
  loadData()
  // 定时刷新
  setInterval(loadData, 30000)
})
</script>

<template>
  <div class="left-panel">
    <!-- 左上：服务器统计 -->
    <div class="panel-card left-top">
      <div class="panel-title-bar">
        <span class="title-text">这里是标题名称</span>
        <div class="title-decor"></div>
      </div>
      <div class="stats-content">
        <div class="core-metric">
          <div class="rotating-ring">
            <svg class="ring-svg" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0,240,255,0.2)" stroke-width="2" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#00F0FF" stroke-width="2"
                stroke-dasharray="70 200" stroke-linecap="round" class="ring-animate" />
            </svg>
            <div class="ring-number">{{ serverStats.totalServers }}</div>
          </div>
          <span class="metric-label">服务器总数</span>
        </div>
        <div class="event-cards">
          <div v-for="event in serverStats.events" :key="event.id" class="event-card">
            <div class="card-corners"></div>
            <div class="card-value">{{ event.value }}</div>
            <div class="card-label">{{ event.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 左中：柱状图 -->
    <div class="panel-card left-middle">
      <div class="panel-title-bar">
        <span class="title-text">这里是标题名称</span>
        <div class="title-decor"></div>
      </div>
      <div class="chart-container">
        <BaseChart :options="barChartOption" />
      </div>
    </div>

    <!-- 左下：人员状态列表 -->
    <div class="panel-card left-bottom">
      <div class="panel-title-bar">
        <span class="title-text">这里是标题名称</span>
        <div class="title-decor"></div>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>姓名</th>
              <th>部门</th>
              <th>电话</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in staffList" :key="index" :class="{ odd: index % 2 === 0 }">
              <td>{{ item.name }}</td>
              <td>{{ item.dept }}</td>
              <td>{{ item.phone }}</td>
              <td>
                <span class="status-tag" :class="getStatusClass(item.statusType)">
                  {{ item.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$primary: #00F0FF;
$secondary: #00E09E;
$danger: #FF4D4F;
$warning: #FFA500;
$bg-dark: #0B1325;

.left-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.panel-card {
  background: rgba(11, 19, 37, 0.8);
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: 4px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, $primary, transparent);
  }
}

.panel-title-bar {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background: linear-gradient(90deg, rgba(0, 240, 255, 0.15), transparent);
  border-bottom: 1px solid rgba(0, 240, 255, 0.1);

  .title-text {
    font-size: 14px;
    color: #fff;
    font-weight: 500;
  }

  .title-decor {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(0, 240, 255, 0.3), transparent);
    margin-left: 15px;
  }
}

// 左上：服务器统计
.left-top {
  flex: 0 0 auto;
  padding: 15px;

  .stats-content {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .core-metric {
    display: flex;
    align-items: center;
    gap: 20px;

    .rotating-ring {
      position: relative;
      width: 80px;
      height: 80px;

      .ring-svg {
        width: 100%;
        height: 100%;
        animation: rotate 10s linear infinite;

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .ring-animate {
          animation: dash 2s ease-in-out infinite;
        }

        @keyframes dash {
          0%, 100% { stroke-dashoffset: 0; }
          50% { stroke-dashoffset: 30; }
        }
      }

      .ring-number {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 24px;
        font-weight: bold;
        color: $primary;
        text-shadow: 0 0 10px rgba(0, 240, 255, 0.8);
      }
    }

    .metric-label {
      font-size: 16px;
      color: #fff;
    }
  }

  .event-cards {
    display: flex;
    gap: 10px;

    .event-card {
      flex: 1;
      position: relative;
      background: rgba(0, 240, 255, 0.05);
      border: 1px solid rgba(0, 240, 255, 0.2);
      padding: 12px;
      text-align: center;

      .card-corners {
        position: absolute;
        width: 8px;
        height: 8px;

        &:nth-child(1) {
          top: -1px;
          left: -1px;
          border-top: 1px solid $primary;
          border-left: 1px solid $primary;
        }

        &:nth-child(2) {
          top: -1px;
          right: -1px;
          border-top: 1px solid $primary;
          border-right: 1px solid $primary;
        }

        &:nth-child(3) {
          bottom: -1px;
          left: -1px;
          border-bottom: 1px solid $primary;
          border-left: 1px solid $primary;
        }

        &:nth-child(4) {
          bottom: -1px;
          right: -1px;
          border-bottom: 1px solid $primary;
          border-right: 1px solid $primary;
        }
      }

      .card-value {
        font-size: 20px;
        font-weight: bold;
        color: $primary;
        margin-bottom: 5px;
      }

      .card-label {
        font-size: 12px;
        color: #A0A0A0;
      }
    }
  }
}

// 左中：柱状图
.left-middle {
  flex: 1;
  min-height: 200px;

  .chart-container {
    height: calc(100% - 45px);
    padding: 10px;
  }
}

// 左下：人员列表
.left-bottom {
  flex: 1;
  min-height: 200px;

  .table-container {
    height: calc(100% - 45px);
    overflow-y: auto;
    padding: 10px;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 240, 255, 0.3);
      border-radius: 2px;
    }
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;

    th {
      text-align: left;
      padding: 8px;
      color: $primary;
      border-bottom: 1px solid rgba(0, 240, 255, 0.2);
    }

    td {
      padding: 8px;
      color: #fff;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    tr.odd {
      background: rgba(0, 240, 255, 0.03);
    }

    .status-tag {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 11px;

      &.status-success {
        background: rgba(0, 224, 158, 0.2);
        color: $secondary;
      }

      &.status-danger {
        background: rgba(255, 77, 79, 0.2);
        color: $danger;
      }

      &.status-warning {
        background: rgba(255, 165, 0, 0.2);
        color: $warning;
      }
    }
  }
}
</style>
