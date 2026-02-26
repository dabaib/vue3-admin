<script setup lang="ts">
import { ref } from 'vue';
import BaseChart from '@/components/BaseChart/index.vue';
import type { EChartsOption } from 'echarts';

const options = ref<EChartsOption>({
  title: {
    text: 'BaseChart Demo',
    textStyle: { color: '#ccc' }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisLabel: { color: '#ccc' }
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: '#ccc' }
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      }
    }
  ]
});
</script>

<template>
  <div class="chart-demo-container">
    <h2>BaseChart Demo</h2>
    <p>Resize window to test auto-resize. Hover bars to test transparent tooltip.</p>
    <div class="chart-wrapper">
      <BaseChart :options="options" theme="dark" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart-demo-container {
  padding: 20px;
  background-color: #1e1e1e;
  color: #eee;
  height: 100vh;
}

.chart-wrapper {
  width: 100%;
  height: 400px;
  border: 1px solid #333;
  margin-top: 20px;
}
</style>
