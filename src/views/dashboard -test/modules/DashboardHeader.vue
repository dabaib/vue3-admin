<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import dayjs from 'dayjs';

const currentTime = ref('');
const currentDate = ref('');
let timer: number | null = null;

const updateTime = () => {
  const now = dayjs();
  currentDate.value = now.format('YYYY.MM.DD');
  currentTime.value = now.format('HH:mm:ss');
};

onMounted(() => {
  updateTime();
  timer = window.setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const activeMenu = ref(0);
const menus = ['模拟标题一', '模拟标题一', '模拟标题一', '模拟标题一'];
</script>

<template>
  <header class="dashboard-header">
    <div class="header-left">
      <div class="logo-icon">
        <el-icon><Monitor /></el-icon>
      </div>
      <h1 class="title">大孚数据可视化系统</h1>
      <div class="decoration-line"></div>
    </div>
    
    <div class="header-center">
      <div 
        v-for="(menu, index) in menus" 
        :key="index"
        :class="['menu-item', { active: activeMenu === index }]"
        @click="activeMenu = index"
      >
        <span>{{ menu }}</span>
      </div>
    </div>
    
    <div class="header-right">
      <div class="filter-dropdown">
        <span>近一月</span>
        <el-icon><ArrowDown /></el-icon>
      </div>
      <div class="time-container">
        <span class="date">{{ currentDate }}</span>
        <span class="time">{{ currentTime }}</span>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.dashboard-header {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  background: transparent;
  position: relative;
  z-index: 10;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 216, 255, 0.5), transparent);
  }

  .header-left {
    display: flex;
    align-items: center;
    position: relative;
    padding: 0 50px 0 20px;
    height: 100%;
    
    // Angled background shape for title area
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(11, 38, 74, 0.4);
      transform: skewX(-30deg);
      transform-origin: bottom left;
      border-right: 2px solid #00E5FF;
      border-bottom: 2px solid #00E5FF;
      z-index: -1;
    }
    
    .logo-icon {
      font-size: 24px;
      color: #00E5FF;
      margin-right: 15px;
    }
    
    .title {
      font-size: 26px;
      font-weight: bold;
      color: #fff;
      letter-spacing: 2px;
      margin: 0;
      text-shadow: 0 0 10px rgba(0, 229, 255, 0.4);
    }
  }

  .header-center {
    display: flex;
    gap: 15px;
    align-items: center;
    height: 100%;
    padding-top: 10px;
    
    .menu-item {
      padding: 6px 35px;
      color: #8bb1d8;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      position: relative;
      transition: all 0.3s;
      background: rgba(8, 17, 43, 0.6);
      border: 1px solid rgba(0, 229, 255, 0.1);
      border-radius: 2px;
      transform: skewX(-30deg);
      
      span {
        display: inline-block;
        transform: skewX(30deg);
      }
      
      &:hover, &.active {
        color: #fff;
        background: linear-gradient(180deg, rgba(0, 229, 255, 0.05) 0%, rgba(0, 229, 255, 0.25) 100%);
        border-color: rgba(0, 229, 255, 0.3);
        border-bottom: 2px solid #00E5FF;
        box-shadow: 0 5px 15px rgba(0, 229, 255, 0.15);
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 15px;
    position: relative;
    padding: 0 20px 0 50px;
    height: 100%;
    
    // Angled background shape for right area
    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background: rgba(11, 38, 74, 0.4);
      transform: skewX(30deg);
      transform-origin: bottom right;
      border-left: 2px solid #00E5FF;
      border-bottom: 2px solid #00E5FF;
      z-index: -1;
    }
    
    .filter-dropdown {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #8bb1d8;
      font-size: 14px;
      padding: 6px 15px;
      background: rgba(8, 17, 43, 0.6);
      border: 1px solid rgba(0, 229, 255, 0.3);
      cursor: pointer;
      
      &:hover {
        color: #00E5FF;
        border-color: #00E5FF;
      }
    }
    
    .time-container {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 4px 15px;
      font-family: 'Digital', monospace, sans-serif;
      background: rgba(8, 17, 43, 0.6);
      border: 1px solid rgba(0, 229, 255, 0.2);
      
      .date {
        color: #00E5FF;
        font-size: 18px;
      }
      
      .time {
        color: #00E5FF;
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
}
</style>
