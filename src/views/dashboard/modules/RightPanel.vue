<template>
  <div class="panel-container">
    <!-- Top: 设备总览 -->
    <div class="sub-panel item-top">
      <div class="panel-title-bar">
        <span class="title-text">设备总览</span>
      </div>
      <div class="device-total-card">
        <div class="icon-box">
            <div class="hex-shape">
                <span class="icon">📋</span>
            </div>
        </div>
        <div class="info">
           <div class="label">设备总数量</div>
           <div class="value">{{ deviceData.totalDevices }}</div>
        </div>
      </div>
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
      <div class="stats-row">
         <div class="stat-item">
             <div class="icon-cyl">
                 <span class="icon">📶</span>
             </div>
             <div class="val text-blue">{{ localizationData.stat1.value }}</div>
             <div class="lbl">{{ localizationData.stat1.label }}</div>
         </div>
         <div class="stat-item">
             <div class="icon-cyl">
                 <span class="icon">📶</span>
             </div>
             <div class="val text-blue">{{ localizationData.stat2.value }}</div>
             <div class="lbl">{{ localizationData.stat2.label }}</div>
         </div>
      </div>
      
      <div class="progress-section">
          <div class="prog-label">
              <span>{{ localizationData.progress.label }}替代情况</span>
              <div class="dots">
                 <span class="dot green">●</span> 数据开通
                 <span class="dot blue">●</span> 数据示意
              </div>
          </div>
          <div class="progress-bar-bg">
              <div class="dserver-count">服务器 {{ localizationData.progress.total }}</div>
               <div class="progress-bar-fill" :style="{ width: localizationData.progress.percentage + '%' }"></div>
          </div>
      </div>
    </div>

    <!-- Bottom: 通知列表 -->
    <div class="sub-panel item-bottom">
      <div class="panel-title-bar">
        <span class="title-text">通知列表</span>
      </div>
      <div class="info-list">
         <div class="info-item" v-for="(item, i) in notificationList" :key="i">
             <div class="icon-hex">
                <span>🔔</span>
             </div>
             <div class="content">
                 <div class="info-title">{{ item.title }}</div>
                 <div class="info-desc">{{ item.content }}</div>
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
    height: 100%;
}

.sub-panel {
  background: rgba(13, 22, 45, 0.6);
  border: 1px solid rgba(0, 240, 255, 0.2);
  padding: 15px;
  display: flex;
  flex-direction: column;
  margin-bottom: 15px; // 间距
  
  &:last-child { margin-bottom: 0; }
}

// 复用标题栏样式
.panel-title-bar {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  height: 36px;
  background: linear-gradient(90deg, rgba(20, 60, 120, 0.8) 0%, rgba(20, 60, 120, 0.3) 50%, rgba(20, 60, 120, 0) 100%);
  position: relative;
  padding-left: 15px;
  border-left: 4px solid #00F0FF;
  
  .title-text {
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      letter-spacing: 1px;
      font-family: 'Microsoft YaHei', sans-serif;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  }
}

.item-top {
    flex: 0 0 35%; // 增加高度占比

    .device-total-card {
        background: linear-gradient(90deg, rgba(0, 50, 100, 0.6) 0%, rgba(0, 20, 40, 0.3) 100%);
        padding: 20px;
        display: flex;
        align-items: center;
        margin: 15px 0;
        border-radius: 4px;
        position: relative;
        
        // 左边框装饰
        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 10%;
            height: 80%;
            width: 2px;
            background: #00F0FF;
            opacity: 0.5;
        }
        
        // 发光六边形图标
        .icon-box {
            width: 60px;
            height: 60px;
            margin-right: 25px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            
            // 外发光晕
            filter: drop-shadow(0 0 10px rgba(0, 240, 255, 0.5));

            .hex-shape {
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #00C0FF, #0060A0);
                clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                display: flex;
                align-items: center;
                justify-content: center;
                
                // 内部边框效果(模拟)
                &::after {
                    content: '';
                    position: absolute;
                    width: 80%;
                    height: 80%;
                    background: rgba(0, 30, 60, 0.6);
                    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                    z-index: 1;
                }
                
                .icon {
                    position: relative;
                    z-index: 2;
                    font-size: 24px;
                    color: #fff;
                }
            }
        }
        
        .info {
            .label { color: #8aa; font-size: 14px; margin-bottom: 5px; }
            .value { 
                color: #00F0FF; 
                font-size: 32px; 
                font-weight: bold; 
                text-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
            }
        }
    }
    
    .device-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        margin-top: 15px;
        
        .grid-item {
            text-align: center;
            position: relative;
            
            // 右侧分割线
            &:not(:last-child)::after {
                content: '';
                position: absolute;
                right: 0;
                top: 20%;
                height: 60%;
                width: 1px;
                background: rgba(255, 255, 255, 0.1);
            }

            .val { 
                color: #fff; 
                font-size: 20px; 
                font-weight: bold; 
                margin-bottom: 5px;
            }
            .lbl { color: #aaa; font-size: 13px; }
        }
    }
}

.item-middle {
    flex: 0 0 25%;
    
    .stats-row {
        display: flex;
        justify-content: space-around;
        margin: 20px 0;
        
        .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            
            .icon-cyl {
                width: 60px;
                height: 40px;
                position: relative;
                margin-bottom: 10px;
                
                // 圆柱体底座光效
                &::before {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 5%;
                    width: 90%;
                    height: 10px;
                    border-radius: 50%;
                    background: rgba(0, 240, 255, 0.3);
                    box-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
                    border: 1px solid rgba(0, 240, 255, 0.6);
                }
                
                // 内部图标 (Wifi)
                .icon {
                    position: absolute;
                    bottom: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 24px;
                    color: #00F0FF;
                    text-shadow: 0 0 5px #00F0FF;
                }
                
                // 顶部虚线框装饰 (模拟圆柱体)
                &::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 10%;
                    width: 80%;
                    height: 30px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-bottom: none;
                    border-radius: 50% 50% 0 0;
                }
            }

            .val { font-size: 28px; font-weight: bold; color: #00F0FF; margin-bottom: 2px; }
            .lbl { color: #aaa; font-size: 13px; }
        }
    }
    
    .progress-section {
        padding: 0 10px;
        
        .prog-label {
            display: flex;
            justify-content: space-between;
            color: #fff;
            font-size: 14px;
            margin-bottom: 30px; // 留出空间给Tooltip
            
            .dots span { margin-left: 10px; font-size: 12px; }
            .green { color: #00E09E; }
            .blue { color: #1E90FF; }
        }
        
        .progress-bar-bg {
            height: 16px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            position: relative;
            border: 1px solid rgba(0, 240, 255, 0.3);
            
            .progress-bar-fill {
                height: 100%;
                background: linear-gradient(90deg, #00E09E 0%, #00F0FF 100%);
                border-radius: 8px;
                position: relative;
                
                // 悬浮Tooltip样式
                &::after {
                    content: '● 国产化\A 服务器 112'; // \A for newline
                    white-space: pre;
                    position: absolute;
                    right: -10px; // 偏移微调
                    bottom: 25px; // 位于进度条上方
                    background: rgba(10, 40, 70, 0.9);
                    border: 1px solid #00F0FF;
                    color: #fff;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 12px;
                    line-height: 1.4;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                }
                
                // Tooltip小箭头
                &::before {
                    content: '';
                    position: absolute;
                    right: 0;
                    bottom: 18px;
                    border-width: 5px;
                    border-style: solid;
                    border-color: #00F0FF transparent transparent transparent;
                }
            }
            
            // 移除旧的 .dserver-count
            .dserver-count { display: none; }
        }
    }
}

.item-bottom {
    flex: 1;
    overflow-y: auto;
    
    .info-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-top: 10px;
        
        .info-item {
            display: flex;
            align-items: center;
            background: rgba(0, 30, 60, 0.4);
            padding: 15px;
            border: 1px solid #0070C0;
            box-shadow: inset 0 0 10px rgba(0, 112, 192, 0.2);
            position: relative;
            
            &:hover {
                background: rgba(0, 50, 100, 0.5);
                border-color: #00F0FF;
            }
            
            .icon-hex {
                width: 50px;
                height: 50px;
                margin-right: 15px;
                background: linear-gradient(135deg, rgba(0, 192, 255, 0.2), rgba(0, 96, 160, 0.6));
                clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid rgba(0, 240, 255, 0.5); // 模拟边框
                
                // 内部六边形边框效果
                &::after {
                    content: '';
                    position: absolute;
                    width: 70%;
                    height: 70%;
                    border: 1px solid #00F0FF;
                    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                }

                span {
                    font-size: 20px;
                    z-index: 2;
                }
            }
            
            .content {
                flex: 1;
                
                .info-title { 
                    color: #fff; 
                    font-size: 15px; 
                    font-weight: bold; 
                    margin-bottom: 5px; 
                }
                .info-desc { 
                    color: #8aa; 
                    font-size: 13px; 
                    line-height: 1.5; 
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
