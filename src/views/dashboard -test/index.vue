<script setup lang="ts">
import DashboardHeader from './modules/DashboardHeader.vue';
import LeftPanel from './modules/LeftPanel.vue';
import CenterPanel from './modules/CenterPanel.vue';
import RightPanel from './modules/RightPanel.vue';
</script>

<template>
  <div class="dashboard-container">
    <DashboardHeader />
    <div class="dashboard-content">
      <div class="col-left">
        <LeftPanel />
      </div>
      <div class="col-center">
        <CenterPanel />
      </div>
      <div class="col-right">
        <RightPanel />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard-container {
  width: 100vw;
  height: 100vh;
  /* Dark deeper blue from prototype background */
  background-color: #060a1f; 
  /* Subtle radial light centered in the middle */
  background-image: radial-gradient(circle at 50% 50%, rgba(15, 30, 75, 0.4) 0%, rgba(6, 10, 31, 1) 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: 'Microsoft YaHei', sans-serif;

  .dashboard-content {
    flex: 1;
    display: grid;
    // According to the image, center panel is wider, left and right are symmetric
    grid-template-columns: 420px 1fr 420px; 
    gap: 20px;
    padding: 0 20px 20px 20px; // Remove top padding to keep header close
    overflow: hidden;

    .col-left, .col-center, .col-right {
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
