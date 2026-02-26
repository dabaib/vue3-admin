<script setup lang="ts">
import BorderBox from './BorderBox.vue';
import { ref } from 'vue';

const deviceData = ref({
  total: 3452,
  categories: [
    { name: '应用', count: 30 },
    { name: '交换机', count: 46 },
    { name: '防火墙', count: 12 },
    { name: '路由器', count: 155 }
  ]
});
</script>

<template>
  <BorderBox title="这里是标题名称">
    <div class="device-status">
      <div class="total-section">
        <div class="icon-box">
          <el-icon><Tickets /></el-icon>
        </div>
        <div class="label">设备总数量</div>
        <div class="value">{{ deviceData.total }}</div>
      </div>
      
      <div class="category-list">
        <div class="category-item" v-for="(item, index) in deviceData.categories" :key="index">
          <div class="count">{{ item.count }}</div>
          <div class="name">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </BorderBox>
</template>

<style scoped lang="scss">
.device-status {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 10px;
  
  .total-section {
    display: flex;
    align-items: center;
    background: rgba(0, 102, 255, 0.2); 
    border: 1px solid rgba(0, 102, 255, 0.5); /* Solid deep blue border */
    padding: 10px 20px;
    margin: 5px 10px 20px 10px;
    box-shadow: inset 0 0 20px rgba(0, 102, 255, 0.2);
    
    .icon-box {
      width: 48px;
      height: 56px;
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2300E5FF" opacity="0.8"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>') no-repeat center;
      background-size: contain;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 15px;
      
      .el-icon {
        font-size: 20px;
        color: #fff;
        z-index: 2;
        margin-top: -2px;
      }
    }
    
    .label {
      font-size: 15px;
      color: #b0c4de;
      flex: 1;
    }
    
    .value {
      font-size: 32px;
      color: #00E5FF;
      font-weight: bold;
      font-family: 'Digital', monospace, sans-serif;
      text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
    }
  }
  
  .category-list {
    display: flex;
    justify-content: space-around;
    padding: 0 10px;
    margin-top: 10px;
    
    .category-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .count {
        font-size: 22px;
        color: #fff;
        margin-bottom: 8px;
        font-weight: normal;
      }
      
      .name {
        font-size: 13px;
        color: #79A3CE;
      }
    }
  }
}
</style>
