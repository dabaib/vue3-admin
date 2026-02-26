<template>
  <div class="panel-container">
    <!-- Middle: 核心拓扑图 -->
    <div class="center-middle">
      <ThreeTopology class="topology-chart" />

    </div>

    <!-- Bottom -->
    <div class="center-bottom">
      <div class="sub-panel bottom-left">
        <div class="panel-header">数据类型分布</div>
        <div class="chart-box" ref="pieRef"></div>
      </div>

      <div class="sub-panel bottom-right">
        <div class="panel-header">接入趋势分析</div>
        <div class="chart-box" ref="lineRef"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { getCategoryPie, getAccessTrend } from '@/api/dashboard'
import ThreeTopology from './ThreeTopology.vue'


const pieRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)






const initPie = async () => {
    if (!pieRef.value) return
    const myChart = echarts.init(pieRef.value, 'dark')

    const res = await getCategoryPie()
    if (res.code !== 200) return

    const colorMap: Record<string, string> = {
        'AA': '#FF4D4D',
        'BB': '#FFA500',
        'CC': '#FFD700',
        'DD': '#00BFFF',
        '结构化数据': '#00F0FF',
        '非结构化数据': '#00E09E',
        '半结构化数据': '#AA00FF',
        '其他': '#FFA500'
    }

    const colors = res.data.data.map(item => colorMap[item.name] || ['#00F0FF', '#00E09E', '#AA00FF', '#FFA500'][res.data.data.indexOf(item) % 4])

    const option = {
        backgroundColor: 'transparent',
        color: colors,
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            icon: 'circle',
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 15,
            textStyle: {
                color: '#B0C4DE',
                fontSize: 12
            },
            formatter: (name: string) => {
                const item = res.data.data.find((d: any) => d.name === name)
                return `${name}  ${item ? item.value : 0}`
            }
        },
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(10, 30, 60, 0.95)',
            borderColor: '#00F0FF',
            borderWidth: 1,
            textStyle: { color: '#fff' },
            formatter: '{b}: {c} ({d}%)',
            extraCssText: 'box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);'
        },
        series: [
            {
                name: '数据类型',
                type: 'pie',
                radius: ['35%', '60%'],
                center: ['40%', '50%'],
                roseType: false,
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
                itemStyle: {
                    borderWidth: 2,
                    borderColor: 'rgba(13, 22, 45, 0.8)',
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.3)'
                },
                emphasis: {
                    scale: true,
                    scaleSize: 10,
                    itemStyle: {
                        shadowBlur: 20,
                        shadowColor: 'rgba(0, 240, 255, 0.5)'
                    }
                },
                data: res.data.data.map((item, index) => ({
                    ...item,
                    itemStyle: {
                        color: colors[index],
                        borderWidth: 2,
                        borderColor: 'rgba(13, 22, 45, 0.8)'
                    }
                })),
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: (idx: number) => idx * 100
            }
        ]
    }
    myChart.setOption(option)
    window.addEventListener('resize', () => myChart.resize())
}

const initLine = async () => {
    if (!lineRef.value) return
    const myChart = echarts.init(lineRef.value, 'dark')

    const res = await getAccessTrend()
    if (res.code !== 200) return
    const { xAxis, series } = res.data

    const lineColors = ['#00F0FF', '#00E09E', '#AA00FF']
    const areaColors = [
        ['rgba(0, 240, 255, 0.3)', 'rgba(0, 240, 255, 0)'],
        ['rgba(0, 224, 158, 0.3)', 'rgba(0, 224, 158, 0)'],
        ['rgba(170, 0, 255, 0.3)', 'rgba(170, 0, 255, 0)']
    ]

    const option = {
        backgroundColor: 'transparent',
        color: lineColors,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                lineStyle: { color: '#00F0FF', type: 'dashed' }
            },
            backgroundColor: 'rgba(10, 30, 60, 0.95)',
            borderColor: '#00F0FF',
            borderWidth: 1,
            textStyle: { color: '#fff' },
            extraCssText: 'box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);'
        },
        legend: {
            right: 10,
            top: 0,
            icon: 'circle',
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 15,
            textStyle: { color: '#B0C4DE', fontSize: 12 }
        },
        grid: {
            top: '25%',
            bottom: '10%',
            left: '3%',
            right: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxis,
            axisLine: {
                show: true,
                lineStyle: { color: 'rgba(0, 240, 255, 0.2)' }
            },
            axisTick: { show: false },
            axisLabel: {
                color: '#8aa',
                margin: 15,
                fontSize: 11,
                interval: 0
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(255,255,255,0.03)',
                    type: 'dashed'
                }
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
            axisLabel: {
                color: '#8aa',
                fontSize: 11
            },
            axisLine: { show: false }
        },
        series: series.map((item, index) => ({
            name: item.name,
            type: 'line',
            smooth: true,
            smoothMonotone: 'x',
            symbol: 'circle',
            symbolSize: 6,
            showSymbol: false,
            lineStyle: {
                width: 2,
                color: lineColors[index],
                shadowBlur: 10,
                shadowColor: lineColors[index]
            },
            itemStyle: {
                color: lineColors[index],
                borderColor: '#fff',
                borderWidth: 1
            },
            emphasis: {
                scale: true,
                showSymbol: true,
                symbolSize: 8
            },
            areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: areaColors[index][0] },
                    { offset: 1, color: areaColors[index][1] }
                ])
            },
            data: item.data,
            animationDelay: (idx: number) => idx * 30
        }))
    }
    myChart.setOption(option)
    window.addEventListener('resize', () => myChart.resize())
}

onMounted(() => {

    initPie()
    initLine()
})
</script>

<style lang="scss" scoped>
.panel-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    height: 100%;
}


// 中间拓扑图区域
.center-middle {
    flex: 1;
    position: relative;
    background: radial-gradient(circle at center, rgba(0, 240, 255, 0.08) 0%, rgba(0, 20, 40, 0.5) 70%);
    border: 1px solid rgba(0, 140, 255, 0.2);
    border-radius: 4px;

    .topology-chart {
        width: 100%;
        height: 100%;
    }
}

.center-bottom {
    flex: 0 0 300px;
    display: flex;
    gap: 15px;

    .sub-panel {
         flex: 1;
         background: rgba(13, 22, 45, 0.6);
         border: 1px solid rgba(0, 240, 255, 0.2);
         padding: 15px;
         display: flex;
         flex-direction: column;

         .panel-header {
             color: #fff;
             font-size: 16px;
             font-weight: bold;
             padding-left: 10px;
             border-left: 4px solid #00F0FF;
             margin-bottom: 10px;
         }

         .chart-box {
             flex: 1;
             width: 100%;
             min-height: 0;
         }
    }
}
</style>
