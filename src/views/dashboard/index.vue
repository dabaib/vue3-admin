<template>
  <div class="dashboard-container">
    <div class="scale-box">
      <DashboardHeader />
      <div class="dashboard-content">
        <LeftPanel class="dashboard-panel left-panel" />
        <CenterPanel class="dashboard-panel center-panel" />
        <RightPanel class="dashboard-panel right-panel" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardHeader from './modules/DashboardHeader.vue'
import LeftPanel from './modules/LeftPanel.vue'
import CenterPanel from './modules/CenterPanel.vue'
import RightPanel from './modules/RightPanel.vue'
</script>

<style lang="scss" scoped>
.dashboard-container {
  width: 100vw;
  height: 100vh;
  background-color: #0b1325;
  overflow: hidden;
  position: relative;
}

.scale-box {
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/bg.png'); // 假设有背景图，后续需替换
  background-size: cover;
  display: flex;
  flex-direction: column;
}

.dashboard-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  padding: 5px 10px 10px;
  box-sizing: border-box;
  height: calc(100% - 80px); // 减去 Header 高度
  gap: 10px;
}

.dashboard-panel {
  height: 100%;
}

.left-panel, .right-panel {
  width: 25%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.center-panel {
  width: 50%; // 或 calc(50% - gap)
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
