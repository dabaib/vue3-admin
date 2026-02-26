<script setup lang="ts">
import { ref } from 'vue';
import * as echarts from 'echarts'; /* Fix echarts UMD global lint */
import BorderBox from './BorderBox.vue';
import BaseChart from '@/components/BaseChart/index.vue';

const pieOption = ref({
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(8, 17, 43, 0.8)',
    borderColor: '#00E5FF',
    textStyle: { color: '#fff' }
  },
  legend: {
    orient: 'horizontal',
    top: '10%',
    left: 'center',
    textStyle: { color: '#8bb1d8', fontSize: 12 },
    icon: 'circle',
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 15,
    data: ['内部', '米米', '机密', '绝密']
  },
  color: ['#00FA9A', '#FFD700', '#FFA500', '#FF4B4B'], // Green, Yellow, Orange, Red
  series: [
    {
      name: '占比',
      type: 'pie',
      radius: ['45%', '55%'], /* Make donut even thinner to leave room for labels */
      center: ['50%', '55%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 0,
        borderColor: '#060a1f',
        borderWidth: 2
      },
      label: {
        show: true,
        position: 'outside',  // Ensure label is outside
        formatter: (params: any) => {
          return `{name|${params.name}}  {value|${params.value}}`;
        },
        rich: {
          name: {
            color: '#8bb1d8',
            fontSize: 12,
            lineHeight: 20
          },
          value: {
            fontSize: 16,
            fontWeight: 'bold',
            color: 'inherit',
            lineHeight: 20
          }
        }
      },
      labelLine: {
        show: true,
        length: 15,
        length2: 20,
        lineStyle: {
          color: '#8bb1d8', // 改为一个统一的浅灰蓝色，或者可以依据截图里的带颜色的引导线的话，这里用 '#fff' 会更清晰
          width: 1
        }
      },
      data: [
        { value: 213, name: '内部' },
        { value: 213, name: '米米' },
        { value: 213, name: '机密' },
        { value: 213, name: '绝密' }
      ]
    }
  ]
});

const lineOption = ref({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(8, 17, 43, 0.8)',
    borderColor: '#00E5FF',
    textStyle: { color: '#fff' },
    axisPointer: {
      type: 'line',
      lineStyle: {
        color: '#00E5FF',
        width: 1,
        type: 'solid'
      }
    }
  },
  legend: {
    top: '5%',
    right: 'center',
    textStyle: { color: '#8bb1d8', fontSize: 10 }, // 减小字号
    icon: 'circle',
    itemWidth: 6,
    itemHeight: 6,
    itemGap: 10, // 减小间距防止折行
    data: ['数据标题1', '数据标题2', '数据标题3']
  },
  grid: {
    left: '5%',
    right: '5%',
    bottom: '10%',
    top: '25%', // 给图例留出足够空间
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['标题1', '标题2', '标题3', '标题4', '标题5', '标题6', '标题7', '标题8', '标题9'],
    axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
    axisTick: { show: false },
    axisLabel: { color: '#8bb1d8', fontSize: 10, margin: 8 }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#8bb1d8', fontSize: 10, show: true }, 
    splitLine: { 
      lineStyle: { 
        color: 'rgba(255, 255, 255, 0.1)',
        type: 'solid'
      } 
    }
  },
  color: ['#00E5FF', '#00FA9A', '#b388ff'], // Cyan, Green, Purple
  series: [
    {
      name: '数据标题1',
      type: 'line',
      smooth: false, 
      symbol: 'circle',
      symbolSize: 6,
      itemStyle: { 
        color: '#fff',
        borderColor: '#00E5FF',
        borderWidth: 2
      },
      lineStyle: { width: 2, color: '#00E5FF' },
      areaStyle: { 
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(0, 229, 255, 0.5)' },
          { offset: 1, color: 'rgba(0, 229, 255, 0.01)' }
        ])
      },
      data: [0.8, 1.2, 0.3, 1.4, 1.6, 0.9, 1.1, 0.7, 0.3]
    },
    {
      name: '数据标题2',
      type: 'line',
      smooth: false,
      symbol: 'circle',
      symbolSize: 6,
      itemStyle: { 
        color: '#fff',
        borderColor: '#00FA9A',
        borderWidth: 2
      },
      lineStyle: { width: 2, color: '#00FA9A' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(0, 250, 154, 0.5)' },
          { offset: 1, color: 'rgba(0, 250, 154, 0.01)' }
        ])
      },
      data: [0.3, 0.9, 0.1, 0.6, 0.9, 0.3, 0.2, 0.4, 0.1]
    },
    {
      name: '数据标题3',
      type: 'line',
      smooth: false,
      symbol: 'circle',
      symbolSize: 6,
      itemStyle: { 
        color: '#fff',
        borderColor: '#b388ff',
        borderWidth: 2
      },
      lineStyle: { width: 2, color: '#b388ff' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(179, 136, 255, 0.5)' },
          { offset: 1, color: 'rgba(179, 136, 255, 0.01)' }
        ])
      },
      data: [0.1, 0.3, 0.05, 0.1, 0.5, 0.05, 0.1, 0.1, 0.05]
    }
  ]
});
</script>

<template>
  <div class="bottom-charts">
    <div class="chart-wrapper">
      <BorderBox title="这里是标题名称">
        <div class="chart-container">
           <BaseChart :options="pieOption as any" />
        </div>
      </BorderBox>
    </div>
    <div class="chart-wrapper">
      <BorderBox title="这里是标题名称">
        <div class="chart-container">
           <BaseChart :options="lineOption as any" />
        </div>
      </BorderBox>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bottom-charts {
  display: flex;
  gap: 20px;
  flex: 1;
  width: 100%;
  height: 100%;
  
  .chart-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 50%; /* ensure 50% split */
    
    :deep(.border-box) {
      margin-bottom: 0;
      height: 100%;
      flex: 1;
      display: flex;
    }
    
    .chart-container {
      width: 100%;
      height: 100%;
      flex: 1;
    }
  }
}
</style>
