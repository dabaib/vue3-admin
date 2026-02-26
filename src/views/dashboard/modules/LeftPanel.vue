<template>
  <div class="panel-container">
    <!-- Top Part: 服务器总数 & 违规统计 -->
    <div class="sub-panel left-top">
      <div class="panel-title-bar">
        <span class="decor-line"></span>
        <span class="title-text">数据接入概况</span>
      </div>

      <!-- 服务器总数行 -->
      <div class="server-total-row">
        <div class="icon-ring-wrapper">
           <div class="icon-ring">
             <!-- 内部旋转环 -->
             <div class="ring-inner"></div>
             <!-- 外部旋转环 -->
             <div class="ring-outer"></div>
             <!-- 中心发光点 -->
             <div class="ring-center"></div>
           </div>
        </div>
        <div class="info-section">
          <div class="label-text">总数据量</div>
          <div class="value-text">{{ formatNumber(serverStats.totalServers) }}</div>
          <div class="unit-text">TB</div>
        </div>
      </div>

      <!-- 违规事件卡片 -->
      <div class="event-cards-row">
        <div class="corner-card" v-for="(item, i) in serverStats.events" :key="item.id">
          <!-- 四角装饰 -->
          <span class="corner c-tl"></span>
          <span class="corner c-tr"></span>
          <span class="corner c-bl"></span>
          <span class="corner c-br"></span>

          <div class="card-content">
            <div class="card-num">{{ item.value }}</div>
            <div class="card-label">{{ item.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Middle & Bottom remain unchanged for now until user provides specs -->
    <div class="sub-panel left-middle">
      <div class="panel-title-bar">
        <span class="title-text">接入流量统计</span>
      </div>
      <div class="chart-box" ref="barChartRef"></div>
    </div>

    <div class="sub-panel left-bottom">
      <div class="panel-title-bar">
        <span class="title-text">运维人员状态</span>
      </div>
      <!-- 表格内容 -->
      <div class="custom-table">
          <div class="table-header">
              <span>姓名</span>
              <span>部门</span>
              <span>电话</span>
              <span>状态</span>
          </div>
          <div class="table-body">
              <div class="table-row" v-for="(row, idx) in tableData" :key="idx">
                  <span>{{ row.name }}</span>
                  <span class="truncate" :title="row.dept">{{ row.dept }}</span>
                  <span>{{ row.phone }}</span>
                  <div>
                    <span class="status-wrapper" :class="row.statusType">{{ row.status }}</span>
                  </div>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { getServerStats, getTrafficBar, getStaffList } from '@/api/dashboard'
import type { ServerStatsResponse, StaffItem } from '@/api/dashboard/types'

const barChartRef = ref<HTMLElement | null>(null)
const serverStats = ref<ServerStatsResponse>({ totalServers: 0, events: [] })
const tableData = ref<StaffItem[]>([])

// 格式化数字（添加千分位）
const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const fetchServerStats = async () => {
    const res = await getServerStats()
    if (res.code === 200) {
        serverStats.value = res.data
    }
}

const fetchStaffList = async () => {
    const res = await getStaffList()
    if (res.code === 200) {
        tableData.value = res.data.list
    }
}

const initChart = async () => {
  if (!barChartRef.value) return
  const myChart = echarts.init(barChartRef.value, 'dark')

  // 先获取数据
  const res = await getTrafficBar()
  if (res.code !== 200) return

  const { categories, series } = res.data

  const option = {
    backgroundColor: 'transparent',
    color: ['#00BFFF', '#00E09E'],
    grid: {
      top: '20%',
      bottom: '10%',
      left: '5%',
      right: '5%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(10, 30, 60, 0.95)',
      borderColor: '#00F0FF',
      borderWidth: 1,
      textStyle: { color: '#fff' },
      padding: [10, 15],
      extraCssText: 'box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);'
    },
    legend: {
      right: 10,
      top: 0,
      textStyle: { color: '#B0C4DE', fontSize: 12 },
      itemWidth: 12,
      itemHeight: 12,
      icon: 'roundRect',
      itemGap: 15
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLine: { lineStyle: { color: 'rgba(0, 240, 255, 0.2)' } },
      axisTick: { show: false },
      axisLabel: {
        color: '#8aa',
        fontSize: 12,
        margin: 10,
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.05)',
          type: 'dashed'
        }
      },
      axisLabel: { color: '#8aa', fontSize: 11 },
      axisLine: { show: false }
    },
    series: series.map((item, index) => ({
      name: item.name,
      type: 'bar',
      barWidth: 14,
      barGap: '30%',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: index === 0 ? '#00D4FF' : '#00F0FF' },
          { offset: 1, color: index === 0 ? '#0060AA' : '#00A0AA' }
        ]),
        borderRadius: [4, 4, 0, 0],
        shadowBlur: 10,
        shadowColor: index === 0 ? 'rgba(0, 191, 255, 0.3)' : 'rgba(0, 224, 158, 0.3)'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 15,
          shadowColor: index === 0 ? 'rgba(0, 191, 255, 0.5)' : 'rgba(0, 224, 158, 0.5)'
        }
      },
      animationDelay: (idx: number) => idx * 50,
      data: item.data
    }))
  }

  myChart.setOption(option)
  window.addEventListener('resize', () => myChart.resize())
}

onMounted(() => {
  fetchServerStats()
  fetchStaffList()
  initChart()
})
</script>

<style lang="scss" scoped>
// @import '../styles/common.scss'; 

.panel-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
}

.sub-panel {
  background: rgba(13, 22, 45, 0.7);
  border: 1px solid rgba(0, 140, 255, 0.3);
  border-radius: 4px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;

  // 面板内发光效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(ellipse at top, rgba(0, 240, 255, 0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  &:hover {
    border-color: rgba(0, 240, 255, 0.5);
    box-shadow: 0 0 20px rgba(0, 240, 255, 0.1) inset;
  }
}

.panel-title-bar {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  height: 40px;
  background: linear-gradient(90deg, rgba(20, 60, 120, 0.8) 0%, rgba(20, 60, 120, 0.3) 50%, rgba(20, 60, 120, 0) 100%);
  position: relative;
  padding-left: 15px;
  border-left: 4px solid #00F0FF;

  // 标题右侧装饰线
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 80px;
    height: 1px;
    background: linear-gradient(90deg, rgba(0, 240, 255, 0.5), transparent);
  }

  // 标题文字
  .title-text {
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 1px;
    font-family: 'Microsoft YaHei', sans-serif;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  }

  .decor-line { display: none; }
}

// Left Top Specific Styles
.left-top {
    flex: 1;
    border: 1px solid rgba(0, 80, 150, 0.5);
    background: rgba(10, 20, 40, 0.8);

    .server-total-row {
        display: flex;
        align-items: center;
        padding: 15px;
        margin-bottom: 15px;
        background: linear-gradient(90deg, rgba(0, 40, 80, 0.4) 0%, rgba(0, 20, 40, 0.2) 100%);
        border-radius: 4px;

        .icon-ring-wrapper {
            margin-right: 20px;
            flex-shrink: 0;

            .icon-ring {
                width: 70px;
                height: 70px;
                border-radius: 50%;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;

                // 外部旋转环
                .ring-outer {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: 2px solid transparent;
                    border-top-color: #00F0FF;
                    border-right-color: rgba(0, 240, 255, 0.5);
                    border-bottom-color: rgba(0, 240, 255, 0.2);
                    border-left-color: rgba(0, 240, 255, 0.5);
                    animation: spin 4s linear infinite;
                }

                // 内部旋转环
                .ring-inner {
                    position: absolute;
                    top: 8px;
                    left: 8px;
                    width: calc(100% - 16px);
                    height: calc(100% - 16px);
                    border-radius: 50%;
                    border: 2px solid transparent;
                    border-bottom-color: #00E09E;
                    border-left-color: rgba(0, 224, 158, 0.5);
                    animation: spin-reverse 3s linear infinite;
                }

                // 中心发光点
                .ring-center {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: radial-gradient(circle, #00F0FF 0%, rgba(0, 100, 200, 0.8) 100%);
                    box-shadow: 0 0 20px rgba(0, 240, 255, 0.8), 0 0 40px rgba(0, 240, 255, 0.4);
                    animation: pulse-center 2s ease-in-out infinite;
                    z-index: 10;
                }
            }
        }

        .info-section {
            flex: 1;
            display: flex;
            align-items: baseline;
            gap: 8px;

            .label-text {
                color: #B0C4DE;
                font-size: 16px;
            }

            .value-text {
                color: #00F0FF;
                font-size: 36px;
                font-family: 'Arial', sans-serif;
                font-weight: bold;
                text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
                line-height: 1;
            }

            .unit-text {
                color: #00A0CC;
                font-size: 14px;
            }
        }
    }

    .event-cards-row {
        display: flex;
        justify-content: space-between;
        gap: 10px;

        .corner-card {
            position: relative;
            flex: 1;
            height: 75px;
            background: linear-gradient(180deg, rgba(20, 60, 100, 0.3) 0%, rgba(10, 40, 80, 0.2) 100%);
            border: 1px solid rgba(0, 140, 255, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            transition: all 0.3s;

            // 背景网格装饰
            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image:
                    linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px);
                background-size: 10px 10px;
                opacity: 0;
                transition: opacity 0.3s;
            }

            // Corner Accents
            .corner {
                position: absolute;
                width: 10px;
                height: 10px;
                border-color: #00F0FF;
                border-style: solid;
                transition: all 0.3s;
            }
            .c-tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
            .c-tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; }
            .c-bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; }
            .c-br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

            .card-content {
                text-align: center;
                z-index: 1;
                .card-num {
                    color: #00BFFF;
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 5px;
                    text-shadow: 0 0 5px rgba(0, 191, 255, 0.5);
                }
                .card-label {
                    color: #8aa;
                    font-size: 12px;
                }
            }

            &:hover {
                background: rgba(20, 60, 100, 0.5);
                border-color: #00F0FF;
                box-shadow: 0 0 15px rgba(0, 240, 255, 0.3) inset;

                &::before {
                    opacity: 1;
                }

                .corner {
                    border-color: #00E09E;
                    box-shadow: 0 0 5px #00E09E;
                }
                .card-num {
                    color: #00E09E;
                    text-shadow: 0 0 8px rgba(0, 224, 158, 0.6);
                }
            }
        }
    }
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@keyframes spin-reverse {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
}

@keyframes pulse-center {
    0%, 100% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.1);
        opacity: 0.8;
    }
}

.left-middle { flex: 1.5; .chart-box { flex: 1; } }
.left-bottom { flex: 1.5; overflow: hidden; }

// Custom Table
.custom-table {
    display: flex;
    flex-direction: column;
    height: 100%;
    
    .table-header {
        display: grid;
        grid-template-columns: 1fr 1.5fr 1.5fr 1.2fr; // 调整列宽
        padding: 12px 10px;
        background: rgba(10, 40, 80, 0.9); // 深蓝背景
        color: #B0C4DE; // 浅灰蓝文字
        font-weight: 500;
        font-size: 14px;
        border-radius: 4px 4px 0 0;
    }
    
    .table-body {
        flex: 1;
        overflow-y: auto;
        
        .table-row {
            display: grid;
            grid-template-columns: 1fr 1.5fr 1.5fr 1.2fr;
            padding: 10px 10px;
            color: #fff;
            font-size: 13px;
            align-items: center;
            transition: background 0.3s;
            
            // 隔行变色
            &:nth-child(even) {
                background: rgba(20, 60, 120, 0.2);
            }
            
            &:hover {
                background: rgba(0, 240, 255, 0.1);
            }
            
            // 状态胶囊样式
            .status-wrapper {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 2px 12px;
                border-radius: 12px;
                font-size: 12px;
                border: 1px solid transparent;
                width: fit-content;
                
                // 圆点
                &::before {
                    content: '';
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    margin-right: 6px;
                    background: currentColor;
                }
                
                &.success {
                    color: #00F0FF;
                    border-color: #00F0FF;
                    background: rgba(0, 240, 255, 0.1);
                }
                
                &.warning {
                    color: #FFA500;
                    border-color: #FFA500;
                    background: rgba(255, 165, 0, 0.1);
                }
                
                &.danger {
                    color: #FF4D4D;
                    border-color: #FF4D4D;
                    background: rgba(255, 77, 77, 0.1);
                }
            }
        }
    }
}
</style>
