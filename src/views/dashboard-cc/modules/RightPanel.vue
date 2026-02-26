<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDeviceOverview, getLocalization, getNotifications } from '@/api/dashboard-cc'

// 设备总览
const deviceOverview = ref<{ totalDevices: number; details: Array<{ label: string; value: number }> }>({
  totalDevices: 0,
  details: []
})

// 国产化进度
const localization = ref<{
  stat1: { label: string; value: number }
  stat2: { label: string; value: number }
  progress: { total: number; current: number; label: string; percentage: number }
}>({
  stat1: { label: '', value: 0 },
  stat2: { label: '', value: 0 },
  progress: { total: 0, current: 0, label: '', percentage: 0 }
})

// 通知列表
const notifications = ref<Array<{ title: string; content: string }>>([])

// 加载数据
const loadData = async () => {
  try {
    // 设备总览
    const deviceRes = await getDeviceOverview()
    deviceOverview.value = deviceRes.data

    // 国产化进度
    const localRes = await getLocalization()
    localization.value = localRes.data

    // 通知列表
    const notifyRes = await getNotifications()
    notifications.value = notifyRes.data.list
  } catch (error) {
    console.error('加载右侧数据失败:', error)
  }
}

onMounted(() => {
  loadData()
  setInterval(loadData, 30000)
})
</script>

<template>
  <div class="right-panel">
    <!-- 右上：设备总览 -->
    <div class="panel-card right-top">
      <div class="panel-title-bar">
        <span class="title-text">设备总览</span>
        <div class="title-decor"></div>
      </div>
      <div class="device-content">
        <div class="core-device">
          <div class="hexagon-icon">
            <svg viewBox="0 0 100 100">
              <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                fill="rgba(0,240,255,0.1)" stroke="#00F0FF" stroke-width="2" />
            </svg>
            <span class="device-number">{{ deviceOverview.totalDevices }}</span>
          </div>
          <span class="device-label">设备总数</span>
        </div>
        <div class="device-details">
          <div v-for="item in deviceOverview.details" :key="item.label" class="detail-item">
            <span class="detail-label">{{ item.label }}</span>
            <span class="detail-value">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 右中：国产化情况 -->
    <div class="panel-card right-middle">
      <div class="panel-title-bar">
        <span class="title-text">国产化情况</span>
        <div class="title-decor"></div>
      </div>
      <div class="localization-content">
        <div class="stat-items">
          <div class="stat-item">
            <div class="stat-icon"></div>
            <span class="stat-label">{{ localization.stat1.label }}</span>
            <span class="stat-value">{{ localization.stat1.value }}</span>
          </div>
          <div class="stat-item">
            <div class="stat-icon"></div>
            <span class="stat-label">{{ localization.stat2.label }}</span>
            <span class="stat-value">{{ localization.stat2.value }}</span>
          </div>
        </div>
        <div class="progress-section">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: localization.progress.percentage + '%' }">
              <span class="progress-tooltip">{{ localization.progress.label }} 服务器 {{ localization.progress.current }}</span>
            </div>
          </div>
          <div class="progress-info">
            <span>{{ localization.progress.current }} / {{ localization.progress.total }}</span>
            <span>{{ localization.progress.percentage }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 右下：通知列表 -->
    <div class="panel-card right-bottom">
      <div class="panel-title-bar">
        <span class="title-text">通知列表</span>
        <div class="title-decor"></div>
      </div>
      <div class="notification-list">
        <div v-for="(item, index) in notifications" :key="index" class="notification-item">
          <div class="notif-icon">
            <svg viewBox="0 0 100 100">
              <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                fill="rgba(0,240,255,0.2)" stroke="#00F0FF" stroke-width="1" />
            </svg>
          </div>
          <div class="notif-content">
            <div class="notif-title">{{ item.title }}</div>
            <div class="notif-desc">{{ item.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$primary: #00F0FF;
$secondary: #00E09E;
$bg-dark: #0B1325;

.right-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.panel-card {
  background: rgba(11, 19, 37, 0.8);
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: 4px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, $primary, transparent);
  }
}

.panel-title-bar {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background: linear-gradient(90deg, rgba(0, 240, 255, 0.15), transparent);
  border-bottom: 1px solid rgba(0, 240, 255, 0.1);

  .title-text {
    font-size: 14px;
    color: #fff;
    font-weight: 500;
  }

  .title-decor {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(0, 240, 255, 0.3), transparent);
    margin-left: 15px;
  }
}

// 右上：设备总览
.right-top {
  flex: 0 0 auto;
  padding: 15px;

  .device-content {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .core-device {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: linear-gradient(135deg, rgba(0, 50, 100, 0.5), rgba(0, 20, 40, 0.8));
    border-radius: 8px;
    border: 1px solid rgba(0, 240, 255, 0.3);

    .hexagon-icon {
      position: relative;
      width: 60px;
      height: 60px;

      svg {
        width: 100%;
        height: 100%;
        filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.6));
      }

      .device-number {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 18px;
        font-weight: bold;
        color: $primary;
      }
    }

    .device-label {
      font-size: 14px;
      color: #fff;
    }
  }

  .device-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: rgba(0, 240, 255, 0.05);
      border-right: 1px solid rgba(0, 240, 255, 0.2);

      .detail-label {
        color: #A0A0A0;
        font-size: 12px;
      }

      .detail-value {
        color: $primary;
        font-weight: bold;
      }
    }
  }
}

// 右中：国产化情况
.right-middle {
  flex: 1;
  min-height: 200px;
  padding: 15px;

  .localization-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%;
  }

  .stat-items {
    display: flex;
    gap: 20px;

    .stat-item {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 10px;

      .stat-icon {
        width: 30px;
        height: 30px;
        background: radial-gradient(ellipse at center bottom, $secondary 0%, rgba(0, 224, 158, 0.2) 70%, transparent 70%);
        border-radius: 50% 50% 0 0;
        border: 1px solid $secondary;
      }

      .stat-label {
        color: #A0A0A0;
        font-size: 12px;
      }

      .stat-value {
        color: $primary;
        font-weight: bold;
        font-size: 16px;
      }
    }
  }

  .progress-section {
    margin-top: auto;

    .progress-bar {
      height: 12px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      overflow: hidden;
      position: relative;

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, $secondary, $primary);
        border-radius: 6px;
        position: relative;
        transition: width 0.5s ease;

        .progress-tooltip {
          position: absolute;
          right: 0;
          top: -25px;
          transform: translateX(50%);
          background: rgba(0, 240, 255, 0.9);
          color: #000;
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 3px;
          white-space: nowrap;
        }
      }
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
      font-size: 12px;
      color: #A0A0A0;
    }
  }
}

// 右下：通知列表
.right-bottom {
  flex: 1;
  min-height: 200px;

  .notification-list {
    padding: 10px;
    max-height: calc(100% - 45px);
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 240, 255, 0.3);
      border-radius: 2px;
    }
  }

  .notification-item {
    display: flex;
    gap: 10px;
    padding: 10px;
    margin-bottom: 8px;
    background: rgba(0, 112, 192, 0.1);
    border: 1px solid #0070C0;
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
      border-color: $primary;
      background: rgba(0, 112, 192, 0.2);
    }

    .notif-icon {
      flex-shrink: 0;
      width: 30px;
      height: 30px;

      svg {
        width: 100%;
        height: 100%;
        filter: drop-shadow(0 0 4px rgba(0, 240, 255, 0.4));
      }
    }

    .notif-content {
      flex: 1;
      min-width: 0;

      .notif-title {
        font-size: 13px;
        color: $primary;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .notif-desc {
        font-size: 11px;
        color: #A0A0A0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
}
</style>
