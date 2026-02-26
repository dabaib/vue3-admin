<script setup lang="ts">
import { ref } from 'vue';
import * as echarts from 'echarts';
import BorderBox from './BorderBox.vue';
import BaseChart from '@/components/BaseChart/index.vue';

const progressOption = ref({
  grid: {
    top: 5, bottom: 5, left: 0, right: 0, containLabel: false
  },
  xAxis: { type: 'value', show: false, max: 100 },
  yAxis: { type: 'category', show: false, data: [''] },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    backgroundColor: 'rgba(6, 15, 35, 0.95)',
    borderColor: 'rgba(0, 229, 255, 0.4)',
    textStyle: { color: '#fff' },
    position: function (pos: any, params: any, el: any, elRect: any, size: any) {
      // position center-top above the mouse
      return [pos[0] - size.contentSize[0] / 2, pos[1] - size.contentSize[1] - 15];
    },
    formatter: function(params: any[]) {
      if (!params || !params.length) return '';
      let res = '';
      const actualData = params.filter(p => p.seriesName !== 'gap');
      actualData.forEach((param, index) => {
        res += `<div style="display:flex;align-items:center;justify-content:space-between;gap:15px;">
           <div style="display:flex;align-items:center;gap:6px;">
             ${param.marker} <span style="color:#b0c4de">${param.seriesName}</span>
           </div>
           <span style="font-weight:bold;color:#fff">${param.value}</span>
        </div>`;
        if (index === 0 && actualData.length > 1) { // Add horizontal line after first actual data
           res += `<div style="border-bottom: 1px solid rgba(0, 229, 255, 0.3); margin: 6px 0;"></div>`;
        }
      });
      return res;
    }
  },
  series: [
    {
      name: '数据1',
      type: 'bar',
      stack: 'total',
      barWidth: 16,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
          { offset: 0, color: '#00E5FF' },
          { offset: 1, color: '#00FA9A' }
        ]),
        borderRadius: [8, 0, 0, 8]
      },
      data: [25]
    },
    {
      name: 'gap', // Physical gap representation between bars
      type: 'bar',
      stack: 'total',
      itemStyle: { color: '#060a1f' }, // Match global dark background color to simulate gap visually
      data: [1] // 1% gap
    },
    {
      name: '数据2',
      type: 'bar',
      stack: 'total',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#0066FF' },
          { offset: 1, color: '#00E5FF' }
        ]),
        borderRadius: [0, 8, 8, 0]
      },
      data: [74]
    }
  ]
});
</script>

<template>
  <BorderBox title="这里是标题名称">
    <div class="system-status">
      <div class="top-stats">
        <div class="stat-item">
          <div class="icon-wrapper">
             <div class="base"></div>
             <el-icon class="icon"><Platform /></el-icon>
          </div>
          <div class="info">
            <div class="value">548</div>
            <div class="label">这里是文字</div>
          </div>
        </div>
        
        <div class="stat-item">
          <div class="icon-wrapper">
             <div class="base"></div>
             <el-icon class="icon"><Setting /></el-icon>
          </div>
          <div class="info">
            <div class="value">456</div>
            <div class="label">这里是文字</div>
          </div>
        </div>
      </div>
      
      <div class="progress-section">
        <div class="header-with-legend">
          <div class="progress-header">国产化替代情况</div>
          <div class="legend">
            <div class="legend-item"><span class="dot active"></span>数据1</div>
            <div class="legend-item"><span class="dot blue"></span>数据2</div>
          </div>
        </div>
        <div class="progress-container">
           <BaseChart :options="progressOption as any" />
        </div>
      </div>
    </div>
  </BorderBox>
</template>

<style scoped lang="scss">
.system-status {
  display: flex;
  flex-direction: column;
  height: 100%;
  
  .top-stats {
    display: flex;
    justify-content: space-around;
    padding-top: 15px;
    margin-bottom: 25px;
    
    .stat-item {
      display: flex;
      align-items: center;
      gap: 15px;
      
      .icon-wrapper {
        position: relative;
        width: 70px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: flex-end; /* Align to bottom for base */
        
        .base {
          position: absolute;
          bottom: 0;
          width: 50px;
          height: 12px;
          background: radial-gradient(ellipse at center, rgba(0, 229, 255, 0.6) 0%, transparent 70%);
          border-radius: 50%;
        }
        
        .icon {
          font-size: 32px;
          color: #00E5FF;
          z-index: 1;
          margin-bottom: 8px; /* Lift above base */
          text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
        }
      }
      
      .info {
        display: flex;
        flex-direction: column;
        
        .value {
          font-size: 26px;
          color: #00E5FF;
          font-family: 'Digital', sans-serif;
          margin-bottom: 2px;
          font-weight: bold;
        }
        
        .label {
          font-size: 13px;
          color: #b0c4de;
        }
      }
    }
  }
  
  .progress-section {
    padding: 0 15px;
    margin-top: 10px;
    
    .header-with-legend {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      
      .progress-header {
        font-size: 14px;
        color: #fff;
        font-weight: bold;
      }
      
      .legend {
        display: flex;
        gap: 15px;
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #8bb1d8;
          
          .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            &.active { background: #00FA9A; box-shadow: 0 0 5px #00FA9A; }
            &.blue { background: #0066FF; box-shadow: 0 0 5px #0066FF; } /* Darker blue as in prototype */
          }
        }
      }
    }
    
    .progress-container {
      position: relative;
      padding: 0;
      border: none;
      height: 24px; /* Give enough height for the BaseChart to render the 16px bar */
      width: 100%;
      box-shadow: 0 0 10px rgba(0, 229, 255, 0.1);
      border-radius: 9px;
      border: 1px solid rgba(0, 229, 255, 0.4);
      background: rgba(8, 17, 43, 0.8);
      /* BaseChart needs a wrapper that matches our desired bar look */
    }
  }
}
</style>
