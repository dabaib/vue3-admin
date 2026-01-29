<script setup lang="ts">
import { ref } from 'vue'
import JsonDialog from '@/components/JsonDialog'

const visible = ref(false)
const loading = ref(false)

const open = () => visible.value = true

const handleConfirm = async () => {
  loading.value = true
  await new Promise(r => setTimeout(r, 1000))
  visible.value = false
  loading.value = false
}
</script>

<template>
  <div class="demo-card">
    <h3>JsonDialog 演示</h3>
    <el-button type="primary" @click="open">打开弹窗</el-button>
    
    <JsonDialog
      v-model="visible"
      title="演示弹窗"
      :confirm-loading="loading"
      @confirm="handleConfirm"
    >
      <p>这是一个标准化的弹窗内容。</p>
      <p>点击保存会触发 1秒 loading。</p>
    </JsonDialog>
  </div>
</template>

<style scoped lang="scss">
.demo-card {
  padding: 20px;
  background: #fff;
}
</style>
