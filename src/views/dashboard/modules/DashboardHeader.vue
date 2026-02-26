<template>
  <div class="dashboard-header">
    <!-- 左侧：标题 + 时间 -->
    <div class="header-left">
      <div class="title-section">
        <span class="logo-icon">📊</span>
        <span class="main-title">数据可视化平台</span>
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
      <div class="nav-item" v-for="(item, i) in navItems" :key="i" :class="{ active: activeNav === i }" @click="activeNav = i">
        <span class="nav-text">{{ item }}</span>
      </div>
    </div>

    <!-- 右侧：筛选 -->
    <div class="header-right">
      <div class="filter-box">
        <select v-model="currentFilter" class="filter-select">
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
const activeNav = ref(0)
const navItems = ref(['数据总览', '实时监控', '统计分析', '系统设置'])
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
      animation: pulse 2s ease-in-out infinite;
    }

    .main-title {
      font-size: 26px;
      font-weight: bold;
      color: #fff;
      letter-spacing: 4px;
      text-shadow: 0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.3);
      font-family: 'Microsoft YaHei', sans-serif;
      background: linear-gradient(180deg, #fff 0%, #00F0FF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .time-section {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-top: 4px;

    .time-block {
      font-family: 'Courier New', monospace;
      font-size: 16px;
      color: #00F0FF;
      font-weight: bold;
      text-shadow: 0 0 5px rgba(0, 240, 255, 0.5);

      .bracket {
        color: #00A0CC;
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
  margin-top: 10px;

  .nav-item {
    position: relative;
    width: 120px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(10, 40, 80, 0.6);
    border: 1px solid rgba(0, 100, 200, 0.5);
    transform: skewX(-20deg);
    cursor: pointer;
    transition: all 0.3s;

    .nav-text {
      color: #B0C4DE;
      font-size: 14px;
      font-weight: 500;
      transform: skewX(20deg);
      letter-spacing: 2px;
    }

    &:hover {
      background: linear-gradient(90deg, rgba(0, 100, 255, 0.4), rgba(0, 200, 255, 0.1));
      border-color: #00F0FF;
      box-shadow: 0 0 10px rgba(0, 240, 255, 0.3) inset;

      .nav-text {
        color: #00F0FF;
      }
    }

    &.active {
      background: linear-gradient(90deg, rgba(0, 80, 160, 0.6), rgba(0, 150, 255, 0.3));
      border-color: #00F0FF;
      box-shadow: 0 0 15px rgba(0, 240, 255, 0.4) inset, 0 0 10px rgba(0, 240, 255, 0.3);

      .nav-text {
        color: #00F0FF;
        text-shadow: 0 0 8px rgba(0, 240, 255, 0.8);
      }

      // 激活状态下底部高亮线
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 10%;
        width: 80%;
        height: 2px;
        background: #00F0FF;
        box-shadow: 0 0 5px #00F0FF;
      }
    }
  }
}

.header-right {
  .filter-box {
    .filter-select {
      background: rgba(0, 20, 40, 0.9);
      color: #00F0FF;
      border: 1px solid #005080;
      padding: 8px 15px;
      border-radius: 0;
      outline: none;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover, &:focus {
        border-color: #00F0FF;
        box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
      }

      option {
        background: #0a2850;
        color: #fff;
      }
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}
</style>
