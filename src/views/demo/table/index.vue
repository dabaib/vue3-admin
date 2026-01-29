<script setup lang="ts">
import { ref, reactive } from 'vue'
import JsonTable from '@/components/JsonTable'
import type { TableSchema } from '@/components/JsonTable'

const schema: TableSchema = {
  columns: [
    { type: 'index', label: '#' },
    { prop: 'name', label: '名称', width: 120 },
    { prop: 'status', label: '状态', width: 100, render: 'tag' },
    { prop: 'date', label: '日期' }
  ],
  actionColumn: {
    buttons: [
      { text: '查看', type: 'primary', event: 'view' },
      { text: '删除', type: 'danger', event: 'delete' }
    ]
  }
}

const fetchData = async (params: any) => {
  console.log('加载数据', params)
  await new Promise(r => setTimeout(r, 500))
  return {
    list: [
      { id: 1, name: 'Item 1', status: 'success', date: '2024-01-01' },
      { id: 2, name: 'Item 2', status: 'warning', date: '2024-01-02' }
    ],
    total: 2
  }
}
</script>

<template>
  <div class="demo-card">
    <h3>JsonTable 演示</h3>
    <div style="height: 400px">
      <JsonTable :schema="schema" :fetch-data="fetchData" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.demo-card {
  padding: 20px;
  background: #fff;
}
</style>
