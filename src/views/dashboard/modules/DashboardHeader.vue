<template>
  <div class="dashboard-header">
    <!-- 左侧：标题 + 时间 -->
    <div class="header-left">
      <div class="title-section">
        <span class="logo-icon">🌐</span>
        <span class="main-title">大孚数据可视化视觉系统</span>
      </div>
      <div class="time-section">
        <span class="time-block">
          <span class="bracket">[</span>
          {{ currentDate }}
          <span class="bracket">]</span>
        </span>
        <span class="time-block">
          <span class="bracket">[</span>
          {{ currentTime }}
          <span class="bracket">]</span>
        </span>
      </div>
      <!-- 底部发光装饰线 -->
      <div class="header-line-decor"></div>
    </div>

    <!-- 中间：斜角导航按钮 -->
    <div class="header-center">
      <div class="nav-item" v-for="i in 4" :key="i" :class="{ active: i === 1 }">
        <span class="nav-text">模拟标题一</span>
      </div>
    </div>

    <!-- 右侧：筛选 -->
    <div class="header-right">
      <div class="filter-box">
        <select v-model="currentFilter">
           <option v-for="opt in timeFilters" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getHeaderConfig } from '@/api/dashboard'

const currentDate = ref('')
const currentTime = ref('')
const currentFilter = ref('month')
const timeFilters = ref<{ label: string; value: string }[]>([])
let timer: number | null = null

const updateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  
  currentDate.value = `${year}.${month}.${day}`
  currentTime.value = `${hours}:${minutes}:${seconds}`
}

const fetchConfig = async () => {
  try {
    const res = await getHeaderConfig()
    if (res.code === 200) {
      timeFilters.value = res.data.timeFilters
      if (timeFilters.value.length > 0) {
          currentFilter.value = timeFilters.value[0].value
      }
    }
  } catch (error) {
    console.error('Failed to fetch header config:', error)
  }
}

onMounted(() => {
  updateTime()
  fetchConfig()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style lang="scss" scoped>
.dashboard-header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,20,40,0.4));
  position: relative;
  z-index: 10;
  border-bottom: 1px solid rgba(0, 240, 255, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  position: relative;
  height: 100%;
  padding-right: 50px;

  .title-section {
    display: flex;
    align-items: center;
    margin-right: 30px;
    z-index: 2;

    .logo-icon {
      font-size: 28px;
      margin-right: 10px;
      color: #00F0FF;
      text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
    }
    
    .main-title {
      font-size: 24px;
      font-weight: bold;
      color: #fff;
      letter-spacing: 2px;
      text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
      font-family: 'Microsoft YaHei', sans-serif;
    }
  }

  .time-section {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-top: 4px; /* 视觉微调 */
    
    .time-block {
      font-family: 'Courier New', monospace; /* 模拟数码字体 */
      font-size: 18px;
      color: #00F0FF;
      font-weight: bold;
      
      .bracket {
        color: #0070AA;
        margin: 0 2px;
      }
    }
  }

  // 底部装饰线
  .header-line-decor {
    position: absolute;
    bottom: 15px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, 
      rgba(0, 240, 255, 0) 0%, 
      rgba(0, 240, 255, 1) 20%, 
      rgba(0, 240, 255, 1) 80%, 
      rgba(0, 240, 255, 0) 100%
    );
    box-shadow: 0 0 10px rgba(0, 240, 255, 0.8);
    transform: skewX(-30deg);
    
    &::after {
        content: '';
        position: absolute;
        bottom: -4px;
        right: 0;
        width: 60%;
        height: 2px;
        background: linear-gradient(90deg, transparent, #0070AA);
        transform: skewX(30deg);
    }
  }
}

.header-center {
  display: flex;
  gap: 15px;
  margin-top: 10px; // 稍微下移以匹配设计

  .nav-item {
    position: relative;
    width: 140px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(10, 40, 80, 0.6);
    border: 1px solid rgba(0, 100, 200, 0.5);
    transform: skewX(-30deg);
    cursor: pointer;
    transition: all 0.3s;
    
    .nav-text {
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      transform: skewX(30deg); // 反向倾斜文字
      letter-spacing: 1px;
    }

    &:hover, &.active {
      background: linear-gradient(90deg, rgba(0, 100, 255, 0.4), rgba(0, 200, 255, 0.1));
      border-color: #00F0FF;
      box-shadow: 0 0 10px rgba(0, 240, 255, 0.3) inset;
      
      .nav-text {
        color: #00F0FF;
        text-shadow: 0 0 5px rgba(0, 240, 255, 0.8);
      }
    }
  }
}

.header-right {
  .filter-box select {
     background: rgba(0, 20, 40, 0.8);
     color: #00F0FF;
     border: 1px solid #005080;
     padding: 5px 10px;
     border-radius: 4px;
     outline: none;
     font-size: 14px;
     
     &:hover {
         border-color: #00F0FF;
     }
  }
}
</style>
