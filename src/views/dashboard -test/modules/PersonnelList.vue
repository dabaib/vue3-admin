<script setup lang="ts">
import { ref } from 'vue';
import BorderBox from './BorderBox.vue';

const personnelData = ref([
  { name: '李雷雷', dept: '产品研究中心', phone: '15080001340', status: '已处理' },
  { name: '孙北冀', dept: '人事部', phone: '--', status: '待处理' },
  { name: '孙北冀', dept: '产品研发中心', phone: '1540003040', status: '处理中' },
  { name: '李雷', dept: '数字交流', phone: '1540003400', status: '已处理' },
  { name: '赵勇', dept: '科技成果展示', phone: '15080001340', status: '待处理' },
  { name: '孙北冀', dept: '数字技术', phone: '15080001340', status: '已处理' }
]);

const getStatusColor = (status: string) => {
  switch (status) {
    case '已处理': return '#1351b8';
    case '待处理': return '#a42c38';
    case '处理中': return '#d27c1f';
    default: return '#79A3CE';
  }
};
</script>

<template>
  <BorderBox title="这里是标题名称">
    <div class="list-container">
      <div class="list-header">
        <span class="col name">姓名</span>
        <span class="col dept">部门</span>
        <span class="col phone">电话</span>
        <span class="col status">状态</span>
      </div>
      <div class="list-body">
        <div 
          class="list-row" 
          v-for="(item, index) in personnelData" 
          :key="index"
        >
          <span class="col name">{{ item.name }}</span>
          <span class="col dept">{{ item.dept }}</span>
          <span class="col phone">{{ item.phone }}</span>
          <span class="col status">
            <div class="status-tag" :style="{ backgroundColor: getStatusColor(item.status) }">
              {{ item.status }}
            </div>
          </span>
        </div>
      </div>
    </div>
  </BorderBox>
</template>

<style scoped lang="scss">
.list-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #fff;
  font-size: 14px;
  
  .col {
    display: inline-block;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    
    &.name { width: 20%; }
    &.dept { width: 35%; }
    &.phone { width: 25%; }
    &.status { width: 20%; display: flex; justify-content: center; }
  }
  
  .list-header {
    display: flex;
    padding: 12px 0;
    color: #fff;
    font-weight: bold;
    background: #143673; /* Solid deeper blue header */
    margin-bottom: 5px;
  }
  
  .list-body {
    flex: 1;
    overflow-y: auto;
    
    &::-webkit-scrollbar {
      width: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 229, 255, 0.3);
      border-radius: 4px;
    }
    
    .list-row {
      display: flex;
      align-items: center;
      padding: 10px 0;
      color: #8bb1d8;
      
      /* Alternating row backgrounds */
      &:nth-child(odd) {
        background-color: rgba(20, 54, 115, 0.3);
      }
      
      &:hover {
        background-color: rgba(0, 229, 255, 0.1);
      }
      
      .status-tag {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 24px;
        border-radius: 12px;
        font-size: 12px;
        color: #fff !important; /* Force text white on colored pills */
        border: 1px solid rgba(255, 255, 255, 0.2);
        
        /* The dot inside was removed in template update next */
      }
    }
  }
}
</style>
