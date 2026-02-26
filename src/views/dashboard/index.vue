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
  background: linear-gradient(135deg, #0a1525 0%, #0d1a30 50%, #0a1525 100%);
  overflow: hidden;
  position: relative;

  // 背景网格装饰
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
      linear-gradient(rgba(0, 240, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 240, 255, 0.02) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
  }

  // 四角装饰
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
      linear-gradient(90deg, #00F0FF 2px, transparent 2px) 0 0,
      linear-gradient(#00F0FF 2px, transparent 2px) 0 0,
      linear-gradient(90deg, #00F0FF 2px, transparent 2px) 100% 0,
      linear-gradient(#00F0FF 2px, transparent 2px) 100% 0,
      linear-gradient(90deg, #00F0FF 2px, transparent 2px) 0 100%,
      linear-gradient(#00F0FF 2px, transparent 2px) 0 100%,
      linear-gradient(90deg, #00F0FF 2px, transparent 2px) 100% 100%,
      linear-gradient(#00F0FF 2px, transparent 2px) 100% 100%;
    background-size: 20px 20px;
    background-repeat: no-repeat;
    pointer-events: none;
    opacity: 0.5;
  }
}

.scale-box {
  width: 100%;
  height: 100%;
  background-size: cover;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.dashboard-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  padding: 15px 20px 20px;
  box-sizing: border-box;
  height: calc(100% - 80px);
  gap: 15px;
}

.dashboard-panel {
  height: 100%;
}

.left-panel, .right-panel {
  width: 25%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.center-panel {
  width: calc(50% - 15px);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

// 全局面板样式统一
:deep(.sub-panel) {
  background: rgba(13, 22, 45, 0.7);
  border: 1px solid rgba(0, 140, 255, 0.3);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;

  // 面板内发光效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(ellipse at top, rgba(0, 240, 255, 0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  &:hover {
    border-color: rgba(0, 240, 255, 0.5);
    box-shadow: 0 0 20px rgba(0, 240, 255, 0.1) inset;
  }
}

// 统一标题栏样式
:deep(.panel-title-bar) {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  height: 40px;
  background: linear-gradient(90deg, rgba(20, 60, 120, 0.8) 0%, rgba(20, 60, 120, 0.3) 50%, rgba(20, 60, 120, 0) 100%);
  position: relative;
  padding-left: 15px;
  border-left: 4px solid #00F0FF;

  // 标题右侧装饰线
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 100px;
    height: 1px;
    background: linear-gradient(90deg, rgba(0, 240, 255, 0.5), transparent);
  }

  .title-text {
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 1px;
    font-family: 'Microsoft YaHei', sans-serif;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }
}
</style>
