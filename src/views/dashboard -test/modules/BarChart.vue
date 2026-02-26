<script setup lang="ts">
import { ref } from 'vue';
import * as echarts from 'echarts';
import BorderBox from './BorderBox.vue';
import BaseChart from '@/components/BaseChart/index.vue';

const option = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    backgroundColor: 'rgba(11, 38, 74, 0.8)',
    borderColor: '#00D8FF',
    textStyle: { color: '#fff' }
  },
  legend: {
    data: ['数据标题', '数据标题2'],
    textStyle: { color: '#8bb1d8' },
    top: 5,
    right: 15,
    icon: 'circle',
    itemWidth: 8,
    itemHeight: 8
  },
  grid: {
    left: '5%',
    right: '5%',
    bottom: '15%',
    top: '20%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['标题1', '标题2', '标题3', '标题4', '标题5', '标题6', '标题7'],
    axisLine: { lineStyle: { color: 'rgba(0, 229, 255, 0.3)' } },
    axisTick: { show: false },
    axisLabel: { color: '#8bb1d8', fontSize: 11, margin: 12 }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#8bb1d8', fontSize: 11 },
    splitLine: { 
      lineStyle: { 
        color: 'rgba(0, 229, 255, 0.15)',
        type: 'dashed'
      } 
    }
  },
  series: [
    {
      name: '数据标题',
      type: 'bar',
      data: [120, 150, 80, 200, 110, 180, 90],
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#00E5FF' },
          { offset: 1, color: 'rgba(0, 229, 255, 0.05)' }
        ]),
        borderRadius: 0
      },
      barWidth: '22%'
    },
    {
      name: '数据标题2',
      type: 'bar',
      data: [90, 110, 150, 80, 190, 120, 170],
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#00FA9A' }, // Bright spring green
          { offset: 1, color: 'rgba(0, 250, 154, 0.05)' }
        ]),
        borderRadius: 0
      },
      barWidth: '22%'
    }
  ]
});
</script>

<template>
  <BorderBox title="这里是标题名称">
    <div class="chart-container">
      <BaseChart :options="option as any" />
    </div>
  </BorderBox>
</template>

<style scoped lang="scss">
.chart-container {
  width: 100%;
  height: 100%;
  min-height: 250px;
}
</style>
