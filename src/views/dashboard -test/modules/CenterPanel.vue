<script setup lang="ts">
import Topology3D from './Topology3D.vue';
import BottomCharts from './BottomCharts.vue';
</script>

<template>
  <div class="center-panel">
    <div class="top-section">
      <Topology3D />
    </div>
    <div class="bottom-section">
      <BottomCharts />
    </div>
  </div>
</template>

<style scoped lang="scss">
.center-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  
  .top-section {
    flex: 2; // Takes more space
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  
  .bottom-section {
    flex: 1;
    min-height: 260px; /* Minimum guaranteed height based on visual design */
    display: flex;
    flex-direction: column;
    width: 100%;
  }
}
</style>
