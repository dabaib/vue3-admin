<script setup lang="ts">
import BorderBox from './BorderBox.vue';
import { ref } from 'vue';

const serverInfo = ref({
  total: 198,
  subMetrics: [
    { label: '违规事件总数', value: 1234, unit: '个' },
    { label: '违规事件总数', value: 567, unit: '个' },
    { label: '违规事件总数', value: 4568, unit: '个' }
  ]
});
</script>

<template>
  <BorderBox title="这里是标题名称">
    <div class="server-status-content">
      <div class="main-metric">
        <div class="icon-wrapper">
          <div class="glow-ring"></div>
          <el-icon class="icon"><Monitor /></el-icon>
        </div>
        <div class="info">
          <div class="label">服务器总数(台)</div>
          <div class="value">{{ serverInfo.total }}</div>
        </div>
      </div>
      
      <div class="sub-metrics">
        <div 
          class="metric-item" 
          v-for="(item, index) in serverInfo.subMetrics" 
          :key="index"
        >
          <div class="value">{{ item.value }}</div>
          <div class="label">{{ item.label }}</div>
        </div>
      </div>
    </div>
  </BorderBox>
</template>

<style scoped lang="scss">
.server-status-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  
  .main-metric {
    display: flex;
    align-items: center;
    margin-top: 5px;
    margin-bottom: 20px;
    padding: 0 10px;
    
    .icon-wrapper {
      position: relative;
      width: 60px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 20px;
      
      .glow-ring {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 2px dashed rgba(0, 229, 255, 0.8);
        border-top: 2px solid #00E5FF; /* Solid top for dynamic look */
        animation: spin 8s linear infinite;
        box-shadow: 0 0 15px rgba(0, 229, 255, 0.3);
      }
      
      .icon {
        font-size: 28px;
        color: #00E5FF;
        z-index: 2;
        text-shadow: 0 0 10px #00E5FF;
      }
    }
    
    @keyframes spin {
      100% { transform: rotate(360deg); }
    }
    
    .info {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .label {
        font-size: 16px;
        color: #fff;
        font-weight: bold;
      }
      
      .value {
        font-size: 36px;
        font-weight: bold;
        color: #00E5FF;
        font-family: 'Digital', monospace, sans-serif;
        text-shadow: 0 0 15px rgba(0, 229, 255, 0.6);
      }
    }
  }
  
  .sub-metrics {
    display: flex;
    justify-content: space-between;
    gap: 15px;
    padding: 0 10px;
    
    .metric-item {
      flex: 1;
      background: rgba(0, 229, 255, 0.05); /* very faint cyan fill */
      border: 1px solid rgba(0, 229, 255, 0.3); /* solid bright border */
      padding: 15px 5px; /* more vertical padding */
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      
      .value {
        font-size: 24px;
        color: #00E5FF;
        font-weight: bold;
        font-family: 'Digital', monospace, sans-serif;
        margin-bottom: 8px;
        text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
      }
      
      .label {
        font-size: 13px;
        color: #4b8cc4; /* more subdued blue than cyan */
        white-space: nowrap;
      }
    }
  }
}
</style>
