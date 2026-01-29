<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import JsonSearch from '@/components/JsonSearch'
import type { SearchSchema } from '@/components/JsonSearch'

const queryParams = reactive({})

const schema: SearchSchema = {
  items: [
    { prop: 'keyword', label: '关键词', type: 'input', placeholder: '请输入关键词' },
    { 
      prop: 'type', 
      label: '类型', 
      type: 'select',
      options: [
        { label: '类型A', value: 'a' },
        { label: '类型B', value: 'b' }
      ]
    },
    { prop: 'date', label: '日期', type: 'date' },
    { prop: 'range', label: '时间范围', type: 'daterange' }
  ]
}

const handleSearch = (params: any) => {
  Object.assign(queryParams, params)
  ElMessage.success('触发查询: ' + JSON.stringify(params))
}

const handleReset = () => {
  ElMessage.info('触发重置')
}
</script>

<template>
  <div class="demo-card">
    <h3>JsonSearch 演示</h3>
    <JsonSearch 
      :schema="schema"
      @search="handleSearch"
      @reset="handleReset"
    />
    <div class="result-box">
      当前查询参数: {{ queryParams }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.demo-card {
  padding: 20px;
  background: #fff;

  .result-box {
    margin-top: 20px;
    padding: 10px;
    background: #f5f7fa;
    border-radius: 4px;
  }
}
</style>
