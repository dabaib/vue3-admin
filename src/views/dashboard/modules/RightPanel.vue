<template>
  <div class="panel-container">
    <!-- Top: 设备总览 -->
    <div class="sub-panel item-top">
      <div class="panel-title-bar">
        <span class="title-text">设备总览</span>
      </div>
      <!-- 总数大数字展示 -->
      <div class="total-number-section">
        <div class="number-display">
          <span class="number">{{ formatNumber(deviceData.totalDevices) }}</span>
          <span class="unit">台</span>
        </div>
        <div class="number-label">设备总数量</div>
      </div>
      <!-- 设备分类网格 -->
      <div class="device-grid">
         <div class="grid-item" v-for="item in deviceData.details" :key="item.label">
            <div class="val">{{ item.value }}</div>
            <div class="lbl">{{ item.label }}</div>
         </div>
      </div>
    </div>

    <!-- Middle: 国产化情况 -->
    <div class="sub-panel item-middle" v-if="localizationData">
      <div class="panel-title-bar">
        <span class="title-text">国产化情况</span>
      </div>
      <!-- 两个统计数字 -->
      <div class="stats-row">
         <div class="stat-card">
             <div class="stat-value">{{ localizationData.stat1.value }}</div>
             <div class="stat-label">{{ localizationData.stat1.label }}</div>
         </div>
         <div class="stat-card">
             <div class="stat-value">{{ localizationData.stat2.value }}</div>
             <div class="stat-label">{{ localizationData.stat2.label }}</div>
         </div>
      </div>

      <!-- 进度条 -->
      <div class="progress-section">
          <div class="prog-label">
              <span>{{ localizationData.progress.label }}替代情况</span>
              <div class="legend">
                 <span class="legend-item"><span class="dot green"></span>数据开通</span>
                 <span class="legend-item"><span class="dot blue"></span>数据示意</span>
              </div>
          </div>
          <div class="progress-bar-bg">
              <div class="progress-bar-fill" :style="{ width: localizationData.progress.percentage + '%' }"></div>
              <div class="progress-tooltip">服务器 {{ localizationData.progress.total }}</div>
          </div>
      </div>
    </div>

    <!-- Bottom: 通知列表 -->
    <div class="sub-panel item-bottom">
      <div class="panel-title-bar">
        <span class="title-text">系统通知</span>
        <span class="more-link">更多 ></span>
      </div>
      <div class="info-list">
         <div class="info-item" v-for="(item, i) in notificationList" :key="i">
             <div class="item-dot" :class="item.type || 'info'"></div>
             <div class="content">
                 <div class="info-title">{{ item.title }}</div>
                 <div class="info-desc">{{ item.content }}</div>
                 <div class="info-time">{{ item.time || '刚刚' }}</div>
             </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDeviceOverview, getLocalization, getNotifications } from '@/api/dashboard'
import type { DeviceOverviewResponse, LocalizationResponse, NotificationItem } from '@/api/dashboard/types'

const deviceData = ref<DeviceOverviewResponse>({ totalDevices: 0, details: [] })
const localizationData = ref<LocalizationResponse | null>(null)
const notificationList = ref<NotificationItem[]>([])

// 格式化数字
const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const fetchDeviceData = async () => {
    const res = await getDeviceOverview()
    if (res.code === 200) {
        deviceData.value = res.data
    }
}

const fetchLocalization = async () => {
    const res = await getLocalization()
    if (res.code === 200) {
        localizationData.value = res.data
    }
}

const fetchNotifications = async () => {
    const res = await getNotifications()
    if (res.code === 200) {
        notificationList.value = res.data.list
    }
}

onMounted(() => {
    fetchDeviceData()
    fetchLocalization()
    fetchNotifications()
})
</script>

<style lang="scss" scoped>
.panel-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    height: 100%;
}

.sub-panel {
  background: rgba(13, 22, 45, 0.7);
  border: 1px solid rgba(0, 140, 255, 0.3);
  border-radius: 4px;
  padding: 15px;
  display: flex;
  flex-direction: column;
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

// 复用标题栏样式
.panel-title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  height: 40px;
  background: linear-gradient(90deg, rgba(20, 60, 120, 0.8) 0%, rgba(20, 60, 120, 0.3) 50%, rgba(20, 60, 120, 0) 100%);
  position: relative;
  padding-left: 15px;
  padding-right: 15px;
  border-left: 4px solid #00F0FF;

  // 标题右侧装饰线
  &::after {
    content: '';
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    width: 80px;
    height: 1px;
    background: linear-gradient(90deg, rgba(0, 240, 255, 0.5), transparent);
  }

  .title-text {
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 1px;
    font-family: 'Microsoft YaHei', sans-serif;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  }
}

.item-top {
    flex: 0 0 auto;

    // 总数大数字展示
    .total-number-section {
        text-align: center;
        padding: 20px 0;
        background: linear-gradient(180deg, rgba(0, 60, 120, 0.3) 0%, rgba(0, 30, 60, 0.1) 100%);
        border-radius: 4px;
        margin-bottom: 15px;
        position: relative;
        overflow: hidden;

        // 背景装饰
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, rgba(0, 240, 255, 0.1) 0%, transparent 70%);
        }

        .number-display {
            display: flex;
            align-items: baseline;
            justify-content: center;
            gap: 8px;
            position: relative;
            z-index: 1;

            .number {
                font-size: 48px;
                font-weight: bold;
                font-family: 'Arial', sans-serif;
                background: linear-gradient(180deg, #00F0FF 0%, #0080AA 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
            }

            .unit {
                font-size: 16px;
                color: #00A0CC;
            }
        }

        .number-label {
            color: #B0C4DE;
            font-size: 14px;
            margin-top: 5px;
            position: relative;
            z-index: 1;
        }
    }

    // 设备分类网格
    .device-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;

        .grid-item {
            text-align: center;
            padding: 15px 5px;
            background: rgba(0, 40, 80, 0.3);
            border: 1px solid rgba(0, 140, 255, 0.2);
            border-radius: 4px;
            transition: all 0.3s;
            cursor: pointer;

            &:hover {
                background: rgba(0, 60, 120, 0.4);
                border-color: #00F0FF;
                box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
            }

            .val {
                color: #fff;
                font-size: 22px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            .lbl {
                color: #8aa;
                font-size: 12px;
            }
        }
    }
}

.item-middle {
    flex: 0 0 auto;

    // 统计数字行
    .stats-row {
        display: flex;
        justify-content: space-between;
        gap: 15px;
        margin-bottom: 20px;

        .stat-card {
            flex: 1;
            text-align: center;
            padding: 15px 10px;
            background: linear-gradient(180deg, rgba(0, 60, 120, 0.3) 0%, rgba(0, 30, 60, 0.1) 100%);
            border: 1px solid rgba(0, 140, 255, 0.2);
            border-radius: 4px;
            transition: all 0.3s;

            &:hover {
                background: linear-gradient(180deg, rgba(0, 80, 140, 0.4) 0%, rgba(0, 40, 80, 0.2) 100%);
                border-color: #00F0FF;
                box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
            }

            .stat-value {
                font-size: 28px;
                font-weight: bold;
                color: #00F0FF;
                text-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
                margin-bottom: 5px;
            }

            .stat-label {
                font-size: 12px;
                color: #8aa;
            }
        }
    }

    // 进度条区域
    .progress-section {
        padding: 0 5px;

        .prog-label {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #fff;
            font-size: 14px;
            margin-bottom: 15px;

            .legend {
                display: flex;
                gap: 15px;

                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 12px;
                    color: #8aa;

                    .dot {
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        box-shadow: 0 0 5px currentColor;

                        &.green {
                            background: #00E09E;
                            color: #00E09E;
                        }
                        &.blue {
                            background: #1E90FF;
                            color: #1E90FF;
                        }
                    }
                }
            }
        }

        .progress-bar-bg {
            height: 12px;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 6px;
            position: relative;
            border: 1px solid rgba(0, 140, 255, 0.2);
            overflow: visible;

            .progress-bar-fill {
                height: 100%;
                background: linear-gradient(90deg, #00E09E 0%, #00F0FF 100%);
                border-radius: 6px;
                position: relative;
                transition: width 1s ease-out;
                box-shadow: 0 0 10px rgba(0, 224, 158, 0.4);

                // 进度条右侧发光点
                &::after {
                    content: '';
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 4px;
                    height: 16px;
                    background: #fff;
                    border-radius: 2px;
                    box-shadow: 0 0 10px #00F0FF, 0 0 20px #00F0FF;
                }
            }

            // 悬浮提示
            .progress-tooltip {
                position: absolute;
                right: 0;
                top: -35px;
                transform: translateX(50%);
                background: rgba(10, 40, 70, 0.95);
                border: 1px solid #00F0FF;
                color: #fff;
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);

                &::after {
                    content: '';
                    position: absolute;
                    bottom: -6px;
                    left: 50%;
                    transform: translateX(-50%);
                    border-width: 6px 6px 0;
                    border-style: solid;
                    border-color: #00F0FF transparent transparent transparent;
                }
            }
        }
    }
}

.item-bottom {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .panel-title-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .more-link {
        color: #00F0FF;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          color: #00E09E;
          text-shadow: 0 0 5px rgba(0, 224, 158, 0.5);
        }
      }
    }

    .info-list {
        display: flex;
        flex-direction: column;
        gap: 0;
        margin-top: 10px;
        flex: 1;
        overflow-y: auto;

        // 自定义滚动条
        &::-webkit-scrollbar {
            width: 4px;
        }
        &::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2);
        }
        &::-webkit-scrollbar-thumb {
            background: rgba(0, 240, 255, 0.3);
            border-radius: 2px;
        }
        &::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 240, 255, 0.5);
        }

        .info-item {
            display: flex;
            align-items: flex-start;
            padding: 12px 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.3s;
            cursor: pointer;
            position: relative;

            // 左侧装饰线
            &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 2px;
                background: #00F0FF;
                opacity: 0;
                transition: opacity 0.3s;
            }

            &:hover {
                background: rgba(0, 50, 100, 0.3);

                &::before {
                    opacity: 1;
                }

                .info-title {
                    color: #00F0FF;
                }
            }

            .item-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                margin-right: 12px;
                margin-top: 6px;
                flex-shrink: 0;
                box-shadow: 0 0 8px currentColor;

                &.info {
                    background: #00F0FF;
                    color: #00F0FF;
                }
                &.warning {
                    background: #FFA500;
                    color: #FFA500;
                }
                &.danger {
                    background: #FF4D4D;
                    color: #FF4D4D;
                }
                &.success {
                    background: #00E09E;
                    color: #00E09E;
                }
            }

            .content {
                flex: 1;
                min-width: 0;

                .info-title {
                    color: #B0C4DE;
                    font-size: 14px;
                    font-weight: 500;
                    margin-bottom: 4px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    transition: color 0.3s;
                }
                .info-desc {
                    color: #8aa;
                    font-size: 12px;
                    line-height: 1.4;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    margin-bottom: 4px;
                }
                .info-time {
                    color: #668;
                    font-size: 11px;
                }
            }
        }
    }
}

.panel-title {
  font-size: 16px;
  color: #fff;
  border-left: 4px solid #00F0FF;
  padding-left: 10px;
}
</style>
