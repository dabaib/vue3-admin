<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const input = ref('')
const loading = ref(false)

const handleClick = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('操作成功！')
  }, 1000)
}
</script>

<template>
  <div class="element-demo">
    <h1>Element Plus 组件演示</h1>
    
    <!-- 按钮组 -->
    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <span>按钮 Button</span>
        </div>
      </template>
      <el-button type="primary">主要按钮</el-button>
      <el-button type="success">成功按钮</el-button>
      <el-button type="warning">警告按钮</el-button>
      <el-button type="danger">危险按钮</el-button>
      <el-button type="info">信息按钮</el-button>
      <el-button :loading="loading" type="primary" @click="handleClick">
        <el-icon><Search /></el-icon>
        点击加载
      </el-button>
    </el-card>

    <!-- 输入框 -->
    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <span>输入框 Input</span>
        </div>
      </template>
      <el-input v-model="input" placeholder="请输入内容" style="width: 300px">
        <template #prefix>
          <el-icon><User /></el-icon>
        </template>
      </el-input>
      <p>输入内容: {{ input }}</p>
    </el-card>

    <!-- 表格 -->
    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <span>表格 Table</span>
        </div>
      </template>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="日期" width="180" />
        <el-table-column prop="name" label="姓名" width="180" />
        <el-table-column prop="address" label="地址" />
      </el-table>
    </el-card>

    <!-- 标签 -->
    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <span>标签 Tag</span>
        </div>
      </template>
      <el-tag>标签一</el-tag>
      <el-tag type="success">标签二</el-tag>
      <el-tag type="info">标签三</el-tag>
      <el-tag type="warning">标签四</el-tag>
      <el-tag type="danger">标签五</el-tag>
    </el-card>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      tableData: [
        { date: '2024-01-01', name: '张三', address: '北京市朝阳区' },
        { date: '2024-01-02', name: '李四', address: '上海市浦东新区' },
        { date: '2024-01-03', name: '王五', address: '广州市天河区' },
      ]
    }
  }
}
</script>

<style scoped>
.element-demo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.element-demo h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #409eff;
}

.demo-card {
  margin-bottom: 20px;
}

.card-header {
  font-weight: bold;
}

.el-button {
  margin: 5px;
}

.el-tag {
  margin: 5px;
}
</style>
