<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BaseChart from '@/components/BaseChart/index.vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { getTopology, getCategoryPie, getAccessTrend } from '@/api/dashboard-cc'

// 拓扑图配置
const topologyOption = ref<EChartsOption>({})

// 环形图配置
const pieOption = ref<EChartsOption>({})

// 折线图配置
const lineOption = ref<EChartsOption>({})

// 加载数据
const loadData = async () => {
  try {
    // 拓扑图
    const topoRes = await getTopology()
    const nodes = topoRes.data.nodes.map(node => ({
      id: node.id,
      name: node.name,
      value: node.value || 10,
      symbolSize: node.value ? 40 + node.value : 50,
      itemStyle: {
        color: node.name?.includes('攻击') ? '#FF4D4F' :
               node.name?.includes('异常') ? '#FFA500' : '#00F0FF'
      },
      label: { color: '#fff', fontSize: 12 }
    }))

    topologyOption.value = {
      tooltip: {
        formatter: (params: any) => {
          if (params.data.details) {
            return `${params.data.name}<br/>${params.data.details.join('<br/>')}`
          }
          return `${params.data.name}<br/>数量: ${params.data.value}`
        }
      },
      series: [{
        type: 'graph',
        layout: 'force',
        force: {
          repulsion: 200,
          edgeLength: 100
        },
        data: [
          { id: 'center', name: topoRes.data.centerNode.name, symbolSize: 80, itemStyle: { color: '#00E09E' }, label: { color: '#fff', fontSize: 16 } },
          ...nodes
        ],
        links: topoRes.data.connections.map(c => ({ source: c.source, target: c.target })),
        lineStyle: {
          color: 'source',
          curveness: 0.2,
          width: 2
        },
        itemStyle: {
          shadowBlur: 10,
          shadowColor: '#00F0FF'
        }
      }]
    }

    // 环形图
    const pieRes = await getCategoryPie()
    const colors = ['#FF4D4F', '#FFA500', '#FFD700', '#00BFFF']
    pieOption.value = {
      series: [{
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['50%', '50%'],
        data: pieRes.data.data.map((item, index) => ({
          name: item.name,
          value: item.value,
          itemStyle: { color: colors[index % colors.length] }
        })),
        label: {
          color: '#fff',
          formatter: '{b}\n{c}'
        },
        labelLine: {
          lineStyle: { color: 'rgba(255,255,255,0.3)' }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.5)'
          }
        }
      }]
    }

    // 折线图
    const trendRes = await getAccessTrend()
    const lineColors = ['#00BFFF', '#00E09E', '#A855F7']
    lineOption.value = {
      grid: {
        left: '10%',
        right: '5%',
        bottom: '10%',
        top: '15%'
      },
      xAxis: {
        type: 'category',
        data: trendRes.data.xAxis,
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
        axisLabel: { color: '#A0A0A0', fontSize: 11 }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
        axisLabel: { color: '#A0A0A0' }
      },
      legend: {
        data: trendRes.data.series.map(s => s.name),
        top: 5,
        right: 10,
        textStyle: { color: '#A0A0A0' },
        itemWidth: 10,
        itemHeight: 10,
        borderRadius: 5
      },
      series: trendRes.data.series.map((s, index) => ({
        name: s.name,
        type: 'line',
        data: s.data,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: lineColors[index % lineColors.length], width: 2 },
        itemStyle: { color: lineColors[index % lineColors.length] },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: lineColors[index % lineColors.length] + '40' },
            { offset: 1, color: lineColors[index % lineColors.length] + '05' }
          ])
        }
      }))
    }
  } catch (error) {
    console.error('加载中间数据失败:', error)
  }
}

onMounted(() => {
  loadData()
  setInterval(loadData, 30000)
})
</script>

<template>
  <div class="center-panel">
    <!-- 中上：拓扑图 -->
    <div class="panel-card center-top">
      <BaseChart :options="topologyOption" />
    </div>

    <!-- 中下区域 -->
    <div class="center-bottom">
      <!-- 中下左：环形图 -->
      <div class="panel-card bottom-left">
        <div class="panel-title-bar">
          <span class="title-text">这里是标题名称</span>
          <div class="title-decor"></div>
        </div>
        <div class="chart-container">
          <BaseChart :options="pieOption" />
        </div>
      </div>

      <!-- 中下右：折线图 -->
      <div class="panel-card bottom-right">
        <div class="panel-title-bar">
          <span class="title-text">这里是标题名称</span>
          <div class="title-decor"></div>
        </div>
        <div class="chart-container">
          <BaseChart :options="lineOption" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$primary: #00F0FF;
$bg-dark: #0B1325;

.center-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.panel-card {
  background: rgba(11, 19, 37, 0.6);
  border: 1px solid rgba(0, 240, 255, 0.15);
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
  padding: 8px 15px;
  background: linear-gradient(90deg, rgba(0, 240, 255, 0.1), transparent);
  border-bottom: 1px solid rgba(0, 240, 255, 0.1);

  .title-text {
    font-size: 13px;
    color: #fff;
    font-weight: 500;
  }

  .title-decor {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(0, 240, 255, 0.2), transparent);
    margin-left: 15px;
  }
}

// 中上：拓扑图
.center-top {
  flex: 1;
  min-height: 300px;
}

// 中下区域
.center-bottom {
  flex: 1;
  display: flex;
  gap: 10px;
  min-height: 250px;

  .bottom-left,
  .bottom-right {
    flex: 1;
    display: flex;
    flex-direction: column;

    .chart-container {
      flex: 1;
      min-height: 0;
    }
  }
}
</style>
