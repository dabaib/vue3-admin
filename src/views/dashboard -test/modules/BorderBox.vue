<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="border-box">
    <div class="box-header">
      <div class="title-decoration"></div>
      <span class="title">{{ title }}</span>
    </div>
    <div class="box-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.border-box {
  background: rgba(8, 17, 43, 0.6); // Deeper semi-translucent navy
  border: 1px solid rgba(0, 216, 255, 0.15); // Subtle continuous border
  border-radius: 0px; // Snapshot boxes have sharp corners
  display: flex;
  flex-direction: column;
  position: relative;
  /* Removed heavy inner shadow for a cleaner look */
  overflow: hidden;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  // Corner decorations (top-left & bottom-right bright cyan brackets)
  &::before, &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 3px solid transparent; // Thicker accents
    z-index: 2;
  }
  
  &::before {
    top: -1px;
    left: -1px;
    border-top-color: #00E5FF;
    border-left-color: #00E5FF;
  }
  
  &::after {
    bottom: -1px;
    right: -1px;
    border-bottom-color: #00E5FF;
    border-right-color: #00E5FF;
  }
  
  .box-header {
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    background: linear-gradient(90deg, rgba(0, 216, 255, 0.15) 0%, transparent 60%);
    border-bottom: 1px solid rgba(0, 216, 255, 0.1);
    
    .title-decoration {
      width: 4px;
      height: 16px;
      background: #00E5FF;
      margin-right: 12px;
      position: relative;
      /* Box shadow for glow */
      box-shadow: 0 0 8px #00E5FF;
    }
    
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #fff;
      letter-spacing: 1px;
    }
  }

  .box-content {
    flex: 1;
    padding: 15px;
    overflow: hidden;
  }
}
</style>
