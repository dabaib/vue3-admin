<template>
  <div class="panel-container">
    <!-- Top: 核心拓扑图 -->
    <div class="center-top">
      <div class="topology-chart" ref="topologyRef"></div>
      
      <!-- 左右侧悬浮数据面板 -->
      <!-- 这里简化处理，直接用ECharts graph渲染节点，或者用绝对定位的HTML元素 -->
    </div>

    <!-- Bottom -->
    <div class="center-bottom">
      <div class="sub-panel bottom-left">
        <div class="panel-header">这里是标题名称</div>
        <div class="chart-box" ref="pieRef"></div>
      </div>
      
      <div class="sub-panel bottom-right">
        <div class="panel-header">这里是标题名称</div>
        <div class="chart-box" ref="lineRef"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { getTopology, getCategoryPie, getAccessTrend } from '@/api/dashboard'

const topologyRef = ref<HTMLElement | null>(null)
const pieRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)

const initTopology = async () => {
    if (!topologyRef.value) return
    const myChart = echarts.init(topologyRef.value)
    
    // 获取容器实际宽高以计算坐标
    const width = topologyRef.value.clientWidth || 800
    const height = topologyRef.value.clientHeight || 500

    const res = await getTopology()
    if (res.code !== 200) return
    const { centerNode, nodes, connections } = res.data

    // 动态计算伪3D布局坐标
    const layoutConfig = [
        { x: width * 0.5, y: height * 0.55 }, // Center (稍下移)
        { x: width * 0.15, y: height * 0.6 },  // Left (前排左)
        { x: width * 0.85, y: height * 0.6 },  // Right (前排右)
        { x: width * 0.3, y: height * 0.25 },  // Top-Left (后排左)
        { x: width * 0.7, y: height * 0.25 }   // Top-Right (后排右)
    ]

    // 简易服务器 SVG Path
    const serverPath = 'path://M50 0 L90 20 L90 80 L50 100 L10 80 L10 20 Z M10 20 L50 40 L90 20 M50 40 L50 100'

    const graphData = [
        { 
            id: 'center_node',
            name: centerNode.name, 
            x: layoutConfig[0].x, 
            y: layoutConfig[0].y,
            symbol: serverPath,
            symbolSize: [80, 100], 
            itemStyle: { 
                color: {
                    type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [{ offset: 0, color: '#4488FF' }, { offset: 1, color: '#0055AA' }]
                },
                shadowBlur: 20, shadowColor: '#00F0FF'
            },
            label: { show: true, position: 'bottom', formatter: '{b}', fontSize: 16, color: '#fff', fontWeight: 'bold' },
            category: 0,
            tooltip: { show: false }
        },
        ...nodes.map((node, index) => {
            // 简单分配位置
            let pos;
            if (index === 0) pos = layoutConfig[1]; // Left
            else if (index === 1) pos = layoutConfig[2]; // Right
            else if (index === 2) pos = layoutConfig[3]; // TL
            else pos = layoutConfig[4]; // TR
            // 防止 undef
            if (!pos) pos = { x: Math.random() * width, y: Math.random() * height }

            const isDanger = node.id === 3 || node.id === 4;
            
            return {
                id: String(node.id),
                name: node.name,
                value: node.value,
                x: pos.x, y: pos.y,
                symbol: serverPath,
                symbolSize: [50, 70],
                itemStyle: { 
                    color: {
                        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: isDanger ? '#FF6666' : '#66FFFF' }, 
                            { offset: 1, color: isDanger ? '#AA0000' : '#0088AA' }
                        ]
                    },
                    opacity: 0.9 
                },
                label: { 
                    show: true, 
                    position: 'top',
                    formatter: `{name|${node.name}}\n{val|${node.value}}`,
                    rich: {
                        name: { color: '#ccc', fontSize: 12, padding: [0, 0, 5, 0] },
                        val: { color: isDanger ? '#FF4D4D' : '#00E09E', fontSize: 18, fontWeight: 'bold' }
                    }
                },
                dataInfo: node.details
            }
        })
    ]

    const graphLinks = connections.map(link => {
        const isDanger = link.target === 3 || link.target === 4 
        // 关键修复：匹配 mock 数据中的 source 字段 (即 name 'XXXXX')
        const sourceId = (link.source === 'center' || link.source === centerNode.name) ? 'center_node' : String(link.source)
        
        return {
            source: sourceId,
            target: String(link.target),
            lineStyle: {
                color: isDanger ? '#FF4D4D' : '#00F0FF',
                width: 2,
                curveness: 0.2, // 弧度
                type: isDanger ? 'dashed' : 'solid'
            }
        }
    })
    
    const option = {
        grid: { left: 0, right: 0, top: 0, bottom: 0 },
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(10, 30, 60, 0.9)',
            borderColor: '#00F0FF',
            textStyle: { color: '#fff' },
            formatter: (params: any) => {
                if (params.dataType === 'node' && params.data.dataInfo) {
                    const title = params.data.name.includes('攻击') ? '网络攻击' : '异常访问'
                    const list = params.data.dataInfo.map((ip: string) => `<div style="color:${params.data.itemStyle.color.colorStops[0].color}">${ip}</div>`).join('')
                    return `<div style="font-weight:bold;margin-bottom:5px;">${title} (${params.data.dataInfo.length}个)</div>${list}`
                }
                return params.name
            }
        },
        legend: {
            bottom: 20,
            right: 20,
            orient: 'vertical',
            data: [
                { name: '访问正常', icon: 'line', itemStyle: { color: '#00F0FF' } },
                { name: '访问异常', icon: 'line', itemStyle: { color: '#FF4D4D' } }
            ],
            textStyle: { color: '#fff' }
        },
        series: [
            {
                type: 'graph',
                layout: 'none',
                // coordinateSystem: 'cartesian2d', // 移除坐标系，使用像素绝对位置
                data: graphData,
                links: graphLinks,
                z: 3,
                edgeSymbol: ['none', 'arrow'],
                edgeSymbolSize: 8
            },
            // Legend helpers using graph items won't work well without data, simplified to empty series
            { name: '访问正常', type: 'graph', data: [], itemStyle: { color: '#00F0FF' } },
            { name: '访问异常', type: 'graph', data: [], itemStyle: { color: '#FF4D4D' } }
        ]
    }
    myChart.setOption(option)
    
    // Resize 时需重新计算坐标
    window.addEventListener('resize', () => {
        myChart.resize()
        // 理想情况下应重新initTopology以更新坐标，简化起见这里仅resize画布
    })
}

const initPie = async () => {
    if (!pieRef.value) return
    const myChart = echarts.init(pieRef.value)

    const res = await getCategoryPie()
    if (res.code !== 200) return

    const colorMap: Record<string, string> = {
        '绝密': '#FF4D4D',
        '机密': '#FFA500',
        '秘密': '#FFD700',
        '内部': '#00BFFF' 
    }
    
    const option = {
        color: ['#00BFFF', '#FFD700', '#FFA500', '#FF4D4D'],
        legend: {
            top: 0,
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { color: '#8aa' }
        },
        series: [
            {
                type: 'pie',
                radius: ['45%', '65%'],
                center: ['50%', '55%'],
                label: { 
                    show: true,
                    formatter: '{b}  {c|{c}}',
                    color: '#8aa',
                    rich: {
                        c: {
                            color: 'inherit',
                            fontSize: 16,
                            fontWeight: 'bold',
                            padding: [0, 0, 0, 5]
                        }
                    } 
                },
                labelLine: {
                    show: true,
                    length2: 10,
                    lineStyle: { color: '#555' }
                },
                data: res.data.data.map(item => ({
                    ...item,
                    itemStyle: { color: colorMap[item.name] || '#ccc' }
                }))
            }
        ]
    }
    myChart.setOption(option)
    window.addEventListener('resize', () => myChart.resize())
}

const initLine = async () => {
    if (!lineRef.value) return
    const myChart = echarts.init(lineRef.value)
    
    const res = await getAccessTrend()
    if (res.code !== 200) return
    const { xAxis, series } = res.data

    const option = {
        color: ['#00BFFF', '#00E09E', '#AA00FF'],
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'line', lineStyle: { color: '#00F0FF' } },
            backgroundColor: 'rgba(10, 30, 60, 0.9)',
            borderColor: '#00F0FF',
            textStyle: { color: '#fff' }
        },
        legend: {
            right: 0,
            top: 0,
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { color: '#8aa' }
        },
        grid: { top: '30%', bottom: '10%', left: '5%', right: '5%', containLabel: true },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxis,
            axisLine: { show: false }, 
            axisTick: { show: false },
            axisLabel: { color: '#8aa', margin: 15 }
        },
        yAxis: {
            type: 'value',
            splitLine: { show: true, lineStyle: { color: 'rgba(255,255,255,0.05)' } },
            axisLabel: { show: true, color: '#8aa' }
        },
        series: series.map((item, index) => ({
            name: item.name,
            type: 'line',
            smooth: false, // 截图看起来是折线而非纯平滑曲线，或者平滑度很低
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: { width: 2 },
            areaStyle: {
                opacity: 0.2,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: ['#00BFFF', '#00E09E', '#AA00FF'][index] },
                    { offset: 1, color: 'rgba(0,0,0,0)' }
                ])
            },
            data: item.data
        }))
    }
    myChart.setOption(option)
    window.addEventListener('resize', () => myChart.resize())
}

onMounted(() => {
    initTopology()
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

.center-top {
    flex: 2; // 占较大部分
    position: relative;
    background: radial-gradient(circle at center, rgba(0,240,255,0.1) 0%, rgba(0,0,0,0) 70%); // 简单的背景光效
    
    .topology-chart {
        width: 100%;
        height: 100%;
    }
}

.center-bottom {
    flex: 1;
    display: flex;
    gap: 15px;
    height: 35%; // 显式给个高度比例，或者靠flex分配
    
    .sub-panel {
         flex: 1;
         background: rgba(13, 22, 45, 0.6);
         border: 1px solid rgba(0, 240, 255, 0.2);
         padding: 15px;
         display: flex;
         flex-direction: column;
         
         .panel-header {
             color: #fff;
             font-size: 14px;
             font-weight: bold;
             padding-left: 10px;
             border-left: 3px solid #00F0FF;
             margin-bottom: 10px;
         }
         
         .chart-box {
             flex: 1;
             width: 100%;
             min-height: 0; // Fix flex overlap
         }
    }
}
</style>
