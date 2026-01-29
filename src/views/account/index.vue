<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import JsonTable from '@/components/JsonTable'
import JsonSearch from '@/components/JsonSearch'
import type { TableSchema, FetchDataParams, FetchDataResult } from '@/components/JsonTable'
import type { SearchSchema } from '@/components/JsonSearch'
import AccountDialog from './modules/AccountDialog.vue'

// -----------------------------------------------------------------------------
// 1. 状态定义
// -----------------------------------------------------------------------------

// 表格引用
const tableRef = ref()
// 弹窗引用
const dialogRef = ref()

// 查询参数
const queryParams = reactive<Record<string, any>>({})

// 选中行
const selectedRows = ref<any[]>([])

// -----------------------------------------------------------------------------
// 2. 配置定义
// -----------------------------------------------------------------------------

// Search Schema: 查询配置
const searchSchema: SearchSchema = {
  items: [
    { prop: 'username', label: '用户名', type: 'input', placeholder: '请输入用户名' },
    { prop: 'phone', label: '手机号', type: 'input', placeholder: '请输入手机号' },
    { 
      prop: 'status', 
      label: '状态', 
      type: 'select',
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
    },
    { 
      prop: 'department', 
      label: '部门', 
      type: 'select',
      options: [
        { label: '研发部', value: 'dev' },
        { label: '市场部', value: 'market' },
        { label: '运营部', value: 'operation' }
      ]
    }
  ]
}

// Table Schema: 表格配置
const tableSchema: TableSchema = {
  columns: [
    { type: 'selection', prop: 'selection', label: '' },
    { type: 'index', prop: 'index', label: '序号' },
    { prop: 'username', label: '用户名', width: 120, sortable: true },
    { prop: 'realName', label: '真实姓名', width: 120 },
    { prop: 'phone', label: '手机号', width: 140 },
    { 
      prop: 'role', 
      label: '角色', 
      width: 120,
      render: 'tag',
      renderOptions: {
        tagMap: {
          admin: { text: '管理员', type: 'danger' },
          editor: { text: '编辑', type: 'warning' },
          user: { text: '普通用户', type: 'info' }
        }
      }
    },
    { prop: 'department', label: '部门', width: 120 },
    { 
      prop: 'status', 
      label: '状态', 
      width: 150, 
      render: 'switch', 
      renderOptions: { 
        activeValue: 1, 
        inactiveValue: 0 
      }
    },
    { prop: 'createTime', label: '创建时间', minWidth: 160, sortable: true }
  ],
  actionColumn: {
    width: 240,
    fixed: 'right',
    buttons: [
      { text: '编辑', type: 'primary', icon: 'Edit', event: 'edit' },
      { text: '重置密码', type: 'warning', icon: 'Key', event: 'resetPwd', confirm: '确认重置该用户的密码吗？' },
      { text: '删除', type: 'danger', icon: 'Delete', event: 'delete', confirm: '确认删除该用户吗？' }
    ]
  }
}

// -----------------------------------------------------------------------------
// 3. 数据交互
// -----------------------------------------------------------------------------

// 模拟数据
let mockData = Array.from({ length: 50 }).map((_, index) => ({
  id: index + 1,
  username: `user_${index + 1}`,
  realName: `用户${index + 1}`,
  phone: `138001380${index.toString().padStart(2, '0')}`,
  role: ['admin', 'editor', 'user'][index % 3],
  department: ['研发部', '市场部', '运营部'][index % 3],
  status: index % 5 === 0 ? 0 : 1,
  createTime: '2024-01-23 10:00:00'
}))

// 获取数据 API
const fetchTableData = async (params: FetchDataParams): Promise<FetchDataResult> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // 模拟筛选
  let list = mockData
  if (params.username) list = list.filter(item => item.username.includes(params.username))
  if (params.status !== undefined) list = list.filter(item => item.status === params.status)
  
  // 模拟分页
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  
  return {
    list: list.slice(start, end),
    total: list.length
  }
}

// -----------------------------------------------------------------------------
// 4. 事件处理
// -----------------------------------------------------------------------------

// 处理查询
const handleSearch = (params: Record<string, any>) => {
  Object.assign(queryParams, params)
}

// 处理重置
const handleReset = () => {
  Object.keys(queryParams).forEach(key => delete queryParams[key])
  ElMessage.success('查询条件已重置')
}

// 打开新增弹窗
const handleAdd = () => {
  dialogRef.value?.open('add')
}

// 打开编辑弹窗
const handleEdit = (row: any) => {
  dialogRef.value?.open('edit', row)
}

// 弹窗回调成功
const handleSuccess = ({ type, data }: { type: string, data: any }) => {
  if (type === 'add') {
    // 模拟新增
    const newItem = {
      id: mockData.length + 1,
      ...data,
      createTime: new Date().toLocaleString()
    }
    mockData.unshift(newItem)
    ElMessage.success('新增成功')
  } else {
    // 模拟编辑
    const index = mockData.findIndex(item => item.id === data.id)
    if (index > -1) {
      mockData[index] = { ...mockData[index], ...data }
    }
    ElMessage.success('编辑成功')
  }
  tableRef.value?.refresh()
}

// 处理操作事件
const handleAction = (event: string, row: any, index: number) => {
  switch (event) {
    case 'edit':
      handleEdit(row)
      break
    case 'resetPwd':
      ElMessage.success(`已重置用户 ${row.username} 的密码`)
      break
    case 'delete':
      ElMessage.success(`删除用户: ${row.username}`)
      mockData = mockData.filter(item => item.id !== row.id)
      tableRef.value?.refresh()
      break
  }
}

// 处理多选
const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows
}

// 导出
const handleExport = () => {
  ElMessage.success('导出数据')
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(`确认删除选中的 ${selectedRows.value.length} 个用户吗？`, '警告', {
    type: 'warning'
  }).then(() => {
    ElMessage.success('批量删除成功')
    const ids = selectedRows.value.map(row => row.id)
    mockData = mockData.filter(item => !ids.includes(item.id))
    tableRef.value?.refresh()
  })
}
</script>

<template>
  <div class="page-container">
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
        @selection-change="handleSelectionChange"
      >
        <!-- 左侧工具栏 -->
        <template #toolbar-left>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增用户
          </el-button>
          <el-button 
            type="danger" 
            :disabled="selectedRows.length === 0"
            @click="handleBatchDelete"
          >
            批量删除
          </el-button>
        </template>

        <!-- 右侧工具栏 -->
        <template #toolbar-right>
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon>导出
          </el-button>
        </template>
      </JsonTable>
    </div>

    <!-- 弹窗组件 -->
    <AccountDialog ref="dialogRef" @success="handleSuccess" />
  </div>
</template>

<style scoped>
.page-container {
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

