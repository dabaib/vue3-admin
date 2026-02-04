<template>
  <div class="panel-container">
    <!-- Top Part: 服务器总数 & 违规统计 -->
    <div class="sub-panel left-top">
      <div class="panel-title-bar">
        <span class="decor-line"></span>
        <span class="title-text">这里是标题名称</span>
      </div>
      
      <!-- 服务器总数行 -->
      <div class="server-total-row">
        <div class="icon-ring-wrapper">
           <div class="icon-ring">
             <span class="icon">🚨</span> <!-- 模拟截图中的警报/服务器图标 -->
           </div>
        </div>
        <div class="label-text">服务器总数(台)</div>
        <div class="value-text">{{ serverStats.totalServers }}</div>
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
        <span class="decor-line"></span>
        <span class="title-text">流量统计</span>
      </div>
      <div class="chart-box" ref="barChartRef"></div>
    </div>

    <div class="sub-panel left-bottom">
      <div class="panel-title-bar">
        <span class="decor-line"></span>
        <span class="title-text">人员状态</span>
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
  const myChart = echarts.init(barChartRef.value)
  
  // 先获取数据
  const res = await getTrafficBar()
  if (res.code !== 200) return

  const { categories, series } = res.data
  
  const option = {
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
      backgroundColor: 'rgba(10, 30, 60, 0.9)',
      borderColor: '#00F0FF',
      textStyle: { color: '#fff' }
    },
    legend: { 
      right: 10, 
      top: 0,
      textStyle: { color: '#8aa' },
      itemWidth: 10,
      itemHeight: 10,
      icon: 'circle'
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisTick: { show: false },
      axisLabel: { color: '#8aa', fontSize: 12, margin: 10 }
    },
    yAxis: {
      type: 'value',
      splitLine: { show: true, lineStyle: { color: 'rgba(255,255,255,0.05)' } },
      axisLabel: { color: '#8aa' }
    },
    series: series.map((item, index) => ({
      name: item.name,
      type: 'bar',
      barWidth: 12,
      itemStyle: { 
         color: index === 0 ? '#00BFFF' : '#00E09E',
         borderRadius: [2, 2, 0, 0]
      },
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
  background: rgba(13, 22, 45, 0.6);
  border: 1px solid rgba(0, 240, 255, 0.2);
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.panel-title-bar {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  height: 36px;
  background: linear-gradient(90deg, rgba(20, 60, 120, 0.8) 0%, rgba(20, 60, 120, 0.3) 50%, rgba(20, 60, 120, 0) 100%);
  position: relative;
  padding-left: 15px; // 调整 padding
  border-left: 4px solid #00F0FF; // 加粗左侧高亮线替代装饰
  
  // 标题文字
  .title-text {
      color: #fff;
      font-size: 18px;
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
        padding: 10px 15px;
        margin-bottom: 10px;
        
        .icon-ring-wrapper {
            margin-right: 15px;
            
            .icon-ring {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                background: radial-gradient(circle, rgba(0, 240, 255, 0.2) 0%, rgba(0, 0, 0, 0.6) 80%);
                border: 1px solid rgba(0, 240, 255, 0.3); // 最外层细圈
                
                // 内部中心球体发光
                &::after {
                    content: '';
                    position: absolute;
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    background: radial-gradient(circle at 30% 30%, rgba(0,240,255,0.8), rgba(0,160,200,0.4));
                    box-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
                    z-index: 1;
                }

                // 旋转的分段圆环装饰
                &::before {
                    content: '';
                    position: absolute;
                    top: 4px;
                    left: 4px;
                    right: 4px;
                    bottom: 4px;
                    border-radius: 50%;
                    border: 3px solid transparent;
                    border-top-color: #00F0FF; // 上弧
                    border-bottom-color: #00F0FF; // 下弧
                    border-left-color: rgba(0, 240, 255, 0.3); // 左弧变淡
                    animation: spin 3s linear infinite; // 增加动态旋转
                    z-index: 2;
                }
                
                // 静态装饰弧线 (额外增加层次感)
                .icon-arc {
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    width: 54px;
                    height: 54px;
                    border-radius: 50%;
                    border: 2px solid transparent;
                    border-right-color: #00F0FF;
                    transform: rotate(45deg);
                    opacity: 0.6;
                }

                .icon { display: none; } // 隐藏原来的文字图标，因为球体本身已经很丰富
            }
        }
        
        .label-text {
            flex: 1;
            color: #fff;
            font-size: 16px;
        }
        
        .value-text {
            color: #00F0FF;
            font-size: 28px;
            font-family: 'Arial', sans-serif;
            font-weight: bold;
        }
    }

    .event-cards-row {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        
        .corner-card {
            position: relative;
            flex: 1;
            height: 80px;
            background: rgba(20, 60, 100, 0.3);
            border: 1px solid rgba(0, 140, 255, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            
            // Corner Accents
            .corner {
                position: absolute;
                width: 8px;
                height: 8px;
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
                .card-num {
                    color: #00A0FF;
                    font-size: 20px;
                    font-weight: bold;
                }
                .card-label {
                    color: #aaa;
                    font-size: 12px;
                }
            }
            
            &:hover {
                background: rgba(20, 60, 100, 0.5);
                .corner { border-color: #00E09E; box-shadow: 0 0 5px #00E09E; }
                .card-num { color: #00E09E; }
            }
        }
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
