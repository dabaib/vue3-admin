<script setup lang="ts">
import DeviceStatus from './DeviceStatus.vue';
import SystemStatus from './SystemStatus.vue';
import AlertList from './AlertList.vue';
</script>

<template>
  <div class="right-panel">
    <div class="panel-item item-device">
      <DeviceStatus />
    </div>
    <div class="panel-item item-system">
      <SystemStatus />
    </div>
    <div class="panel-item item-alert">
      <AlertList />
    </div>
  </div>
</template>

<style scoped lang="scss">
.right-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 20px;
  overflow: hidden;
  
  .panel-item {
    display: flex;
    flex-direction: column;
    
    // Adjust flex ratios for symmetry with LeftPanel
    &.item-device { 
      flex: 3; 
      min-height: 240px; /* Lowest limit it can squeeze to */
    }
    &.item-system { 
      flex: 3.5; 
      min-height: 250px; /* Lowest limit it can squeeze to */
    }
    &.item-alert { 
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
           overflow-y: auto; /* Enable vertical scroll */
           
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
