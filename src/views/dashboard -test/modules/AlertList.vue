<script setup lang="ts">
import BorderBox from './BorderBox.vue';
import { ref } from 'vue';

const alertList = ref([
  { id: 1, title: '此处是标题内容', desc: '此处是内容此处处理内容此处是内容此处是内容此处是内容此处。', type: 'warning' },
  { id: 2, title: '此处是标题内容', desc: '此处是内容此处处理内容此处是内容此处是内容此处是内容此处。', type: 'info' },
  { id: 3, title: '此处是标题内容', desc: '此处是内容此处处理内容此处是内容此处是内容此处是内容此处。', type: 'success' }
]);

const getIcon = (type: string) => {
  switch (type) {
    case 'warning': return 'Bell';
    case 'info': return 'Document';
    case 'success': return 'PriceTag';
    default: return 'Warning';
  }
};
</script>

<template>
  <BorderBox title="这里是标题名称">
    <div class="alert-list">
      <div 
        class="alert-item" 
        v-for="item in alertList" 
        :key="item.id"
      >
        <div class="icon-box" :class="item.type">
          <el-icon><component :is="getIcon(item.type)" /></el-icon>
        </div>
        <div class="contentBox">
          <div class="title">{{ item.title }}</div>
          <div class="desc">{{ item.desc }}</div>
        </div>
      </div>
    </div>
  </BorderBox>
</template>

<style scoped lang="scss">
.alert-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
  overflow-y: auto;
  padding-right: 5px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 216, 255, 0.3);
    border-radius: 4px;
  }
  
  .alert-item {
    display: flex;
    background: rgba(8, 17, 43, 0.8);
    border: 1px solid rgba(0, 229, 255, 0.15);
    border-left: 3px solid #00E5FF; /* Distinctive left accent */
    padding: 12px 15px;
    margin-bottom: 5px; /* Adjust gap to match design density */
    border-radius: 0 4px 4px 0;
    transition: all 0.3s;
    
    &:hover {
      background: rgba(11, 38, 74, 0.9);
      border-color: rgba(0, 229, 255, 0.4);
      box-shadow: inset 0 0 20px rgba(0, 229, 255, 0.15);
    }
    
    .icon-box {
      width: 48px;
      height: 56px;
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2300E5FF" opacity="0.15"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>') no-repeat center;
      background-size: contain;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 15px;
      flex-shrink: 0;
      
      .el-icon {
        font-size: 22px;
        color: #00E5FF;
        text-shadow: 0 0 8px #00E5FF;
      }
      
      &.warning .el-icon { color: #00E5FF; }
      &.info .el-icon { color: #00E5FF; }
      &.success .el-icon { color: #00E5FF; }
    }
    
    .contentBox {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      
      .title {
        font-size: 14px;
        color: #fff;
        font-weight: bold;
        margin-bottom: 6px;
      }
      
      .desc {
        font-size: 12px;
        color: #5e8ab4;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2; /* Add standard line-clamp property */
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
}
</style>
