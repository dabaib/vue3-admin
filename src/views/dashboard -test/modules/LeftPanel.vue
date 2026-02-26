<script setup lang="ts">
import ServerStatus from './ServerStatus.vue';
import BarChart from './BarChart.vue';
import PersonnelList from './PersonnelList.vue';
</script>

<template>
  <div class="left-panel">
    <div class="panel-item item-server">
      <ServerStatus />
    </div>
    <div class="panel-item item-chart">
      <BarChart />
    </div>
    <div class="panel-item item-list">
      <PersonnelList />
    </div>
  </div>
</template>

<style scoped lang="scss">
.left-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 20px;
  overflow: hidden;
  
  .panel-item {
    display: flex;
    flex-direction: column;
    
    // Adjust flex ratios to match actual content heights better
    &.item-server {
      flex: 3;
      min-height: 240px;
    }
    
    &.item-chart {
      flex: 3.5;
      min-height: 250px;
    }
    
    &.item-list {
      flex: 3.5;
      display: flex;
      flex-direction: column;
      overflow: hidden; /* Prevent breaking flex rules outward */
      min-height: 0; /* Let it shrink fully if small */
      
      :deep(.border-box) {
         flex: 1; /* Make BorderBox itself stretch */
         min-height: 0; 
         display: flex; /* Make BorderBox flex its children */
         flex-direction: column;
         
        .box-content {
           flex: 1; /* Make box-content stretch to take remaining space */
           min-height: 0; 
           overflow-y: auto; /* Enable vertical scroll only here */
           
           /* Custom Scrollbar Styling */
           &::-webkit-scrollbar {
              width: 4px;
           }
           &::-webkit-scrollbar-track {
              background: rgba(0, 0, 0, 0.1);
           }
           &::-webkit-scrollbar-thumb {
              background: rgba(0, 216, 255, 0.3);
              border-radius: 2px;
           }
        }
      }
    }

    :deep(.border-box) {
      flex: 1;
      margin-bottom: 0;
    }
  }
}
</style>
