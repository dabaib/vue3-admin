<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import JsonTable from '@/components/JsonTable'
import JsonSearch from '@/components/JsonSearch'
import type { TableSchema, FetchDataParams, FetchDataResult } from '@/components/JsonTable'
import type { SearchSchema } from '@/components/JsonSearch'

// 表格引用
const tableRef = ref()

// 查询参数
const queryParams = reactive<Record<string, any>>({})

// 模拟数据库数据
const mockDatabase = [
  { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com', status: 1, role: 'admin', progress: 75, avatar: 'https://picsum.photos/100/100?random=1', createTime: '2024-01-15' },
  { id: 2, name: '李四', age: 32, email: 'lisi@example.com', status: 0, role: 'user', progress: 45, avatar: 'https://picsum.photos/100/100?random=2', createTime: '2024-01-14' },
  { id: 3, name: '王五', age: 25, email: 'wangwu@example.com', status: 1, role: 'editor', progress: 90, avatar: 'https://picsum.photos/100/100?random=3', createTime: '2024-01-13' },
  { id: 4, name: '赵六', age: 35, email: 'zhaoliu@example.com', status: 2, role: 'user', progress: 20, avatar: 'https://picsum.photos/100/100?random=4', createTime: '2024-01-12' },
  { id: 5, name: '钱七', age: 29, email: 'qianqi@example.com', status: 1, role: 'admin', progress: 60, avatar: 'https://picsum.photos/100/100?random=5', createTime: '2024-01-11' },
  { id: 6, name: '孙八', age: 27, email: 'sunba@example.com', status: 1, role: 'editor', progress: 85, avatar: 'https://picsum.photos/100/100?random=6', createTime: '2024-01-10' },
  { id: 7, name: '周九', age: 31, email: 'zhoujiu@example.com', status: 0, role: 'user', progress: 30, avatar: 'https://picsum.photos/100/100?random=7', createTime: '2024-01-09' },
  { id: 8, name: '吴十', age: 26, email: 'wushi@example.com', status: 1, role: 'user', progress: 55, avatar: 'https://picsum.photos/100/100?random=8', createTime: '2024-01-08' },
  { id: 9, name: '郑一', age: 33, email: 'zhengyi@example.com', status: 2, role: 'editor', progress: 40, avatar: 'https://picsum.photos/100/100?random=9', createTime: '2024-01-07' },
  { id: 10, name: '王二', age: 24, email: 'wanger@example.com', status: 1, role: 'user', progress: 70, avatar: 'https://picsum.photos/100/100?random=10', createTime: '2024-01-06' },
  { id: 11, name: '刘三', age: 30, email: 'liusan@example.com', status: 1, role: 'admin', progress: 95, avatar: 'https://picsum.photos/100/100?random=11', createTime: '2024-01-05' },
  { id: 12, name: '陈四', age: 28, email: 'chensi@example.com', status: 0, role: 'user', progress: 25, avatar: 'https://picsum.photos/100/100?random=12', createTime: '2024-01-04' },
]

// 查询配置
const searchSchema: SearchSchema = {
  items: [
    { prop: 'name', label: '姓名', type: 'input', placeholder: '请输入姓名' },
    { 
      prop: 'status', 
      label: '状态', 
      type: 'select',
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
        { label: '待审核', value: 2 }
      ]
    },
    { 
      prop: 'role', 
      label: '角色', 
      type: 'select',
      options: [
        { label: '管理员', value: 'admin' },
        { label: '编辑者', value: 'editor' },
        { label: '普通用户', value: 'user' }
      ]
    },
    { prop: 'dateRange', label: '创建时间', type: 'daterange' },
  ]
}

// 模拟 API 请求 - 实际项目中替换为真实的 API 调用
const fetchTableData = async (params: FetchDataParams): Promise<FetchDataResult> => {
  console.log('API 请求参数:', params)
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // 模拟筛选逻辑
  let filteredData = [...mockDatabase]
  
  if (params.name) {
    filteredData = filteredData.filter(item => item.name.includes(params.name))
  }
  if (params.status !== undefined && params.status !== null) {
    filteredData = filteredData.filter(item => item.status === params.status)
  }
  if (params.role) {
    filteredData = filteredData.filter(item => item.role === params.role)
  }
  if (params.dateRange?.length === 2) {
    const [start, end] = params.dateRange
    filteredData = filteredData.filter(item => item.createTime >= start && item.createTime <= end)
  }
  
  // 模拟分页逻辑
  const { page, pageSize } = params
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filteredData.slice(start, end)
  
  return {
    list,
    total: filteredData.length
  }
}

// 表格 Schema 配置
const tableSchema: TableSchema = {
  columns: [
    { type: 'selection', prop: 'selection' },
    { type: 'index', prop: 'index', label: '序号' },
    { prop: 'avatar', label: '头像', width: 80, render: 'image', renderOptions: { imageWidth: 40, imageHeight: 40 } },
    { prop: 'name', label: '姓名', width: 100, sortable: true },
    { prop: 'age', label: '年龄', width: 80, sortable: true, align: 'center' },
    { prop: 'email', label: '邮箱', minWidth: 180 },
    { prop: 'status', label: '状态', width: 100, render: 'tag', renderOptions: { tagMap: { 0: { text: '禁用', type: 'danger' }, 1: { text: '启用', type: 'success' }, 2: { text: '待审核', type: 'warning' } } } },
    { prop: 'role', label: '角色', width: 100, render: 'slot', slotName: 'role' },
    { prop: 'progress', label: '完成度', width: 150, render: 'progress' },
    { prop: 'createTime', label: '创建时间', width: 180, sortable: true }
  ],
  actionColumn: {
    width: 200,
    fixed: 'right',
    buttons: [
      { text: '编辑', type: 'primary', icon: 'Edit', event: 'edit' },
      { text: '删除', type: 'danger', icon: 'Delete', event: 'delete', confirm: '确定要删除这条记录吗？' },
      { text: '详情', type: 'info', icon: 'View', event: 'view', hidden: (row) => row.status === 2 }
    ]
  },
  pagination: {
    show: true,
    pageSize: 5
  },
  tableProps: {
    border: true,
    stripe: true,
    rowKey: 'id',
    highlightCurrentRow: true
  }
}

// 选中行
const selectedRows = ref<any[]>([])

// 角色映射
const roleMap: Record<string, { text: string; color: string }> = {
  admin: { text: '管理员', color: '#e6a23c' },
  editor: { text: '编辑者', color: '#409eff' },
  user: { text: '普通用户', color: '#909399' }
}

// 新增
const handleAdd = () => {
  ElMessage.success('点击了新增按钮')
}

// 导出
const handleExport = () => {
  ElMessage.success('点击了导出按钮')
}

// 处理查询
const handleSearch = (params: Record<string, any>) => {
  console.log('查询参数:', params)
  Object.assign(queryParams, params)
}

// 处理重置
const handleReset = () => {
  Object.keys(queryParams).forEach(key => {
    delete queryParams[key]
  })
  ElMessage.success('已重置查询条件')
}

// 处理操作事件
const handleAction = (event: string, row: any, index: number) => {
  console.log('Action:', event, row, index)
  
  switch (event) {
    case 'edit':
      ElMessage.info(`编辑: ${row.name}`)
      break
    case 'delete':
      ElMessage.success(`已删除: ${row.name}`)
      tableRef.value?.refresh()
      break
    case 'view':
      ElMessage.info(`查看详情: ${row.name}`)
      break
  }
}

// 处理排序
const handleSortChange = (prop: string, order: 'ascending' | 'descending' | null) => {
  ElMessage.info(`排序: ${prop} - ${order}`)
}

// 处理选中
const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows
}
</script>

<template>
  <div class="table-page">
    <!-- 查询区域 -->
    <JsonSearch
      :schema="searchSchema"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 表格区域 -->
    <div class="table-container">
      <JsonTable
        ref="tableRef"
        :schema="tableSchema"
        :fetch-data="fetchTableData"
        :query-params="queryParams"
        v-model:selected-rows="selectedRows"
        @action="handleAction"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
      >
        <!-- 左侧工具栏：新增按钮 -->
        <template #toolbar-left>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增
          </el-button>
          <el-button type="danger" :disabled="selectedRows.length === 0">
            批量删除 ({{ selectedRows.length }})
          </el-button>
        </template>

        <!-- 右侧工具栏：导出按钮 -->
        <template #toolbar-right>
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon>
            导出
          </el-button>
        </template>

        <!-- 自定义角色列 -->
        <template #role="{ value }">
          <el-tag
            :color="roleMap[value]?.color"
            effect="dark"
            size="small"
          >
            {{ roleMap[value]?.text || value }}
          </el-tag>
        </template>
      </JsonTable>
    </div>
  </div>
</template>

<style scoped>
.table-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.table-container {
  flex: 1;
  min-height: 0;
  padding: 0 16px 16px;
}
</style>
