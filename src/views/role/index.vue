<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import JsonTable from '@/components/JsonTable'
import JsonSearch from '@/components/JsonSearch'
import type { TableSchema, FetchDataParams, FetchDataResult } from '@/components/JsonTable'
import type { SearchSchema } from '@/components/JsonSearch'
import RoleDialog from './modules/RoleDialog.vue'

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

// Search Schema
const searchSchema: SearchSchema = {
  items: [
    { prop: 'roleName', label: '角色名称', type: 'input', placeholder: '请输入角色名称' },
    { prop: 'roleKey', label: '角色标识', type: 'input', placeholder: '请输入角色标识' },
    { 
      prop: 'status', 
      label: '状态', 
      type: 'select',
      options: [
        { label: '正常', value: 1 },
        { label: '停用', value: 0 }
      ]
    }
  ]
}

// Table Schema
const tableSchema: TableSchema = {
  columns: [
    { type: 'selection', prop: 'selection', label: '' },
    { type: 'index', prop: 'index', label: '序号' },
    { prop: 'roleName', label: '角色名称', width: 150, sortable: true },
    { prop: 'roleKey', label: '角色标识', width: 150 },
    { prop: 'sort', label: '显示顺序', width: 100, align: 'center', sortable: true },
    { 
      prop: 'status', 
      label: '状态', 
      width: 100, 
      render: 'switch',
      renderOptions: {
        activeValue: 1,
        inactiveValue: 0
      }
    },
    { prop: 'remark', label: '备注', minWidth: 150 },
    { prop: 'createTime', label: '创建时间', width: 180, sortable: true }
  ],
  actionColumn: {
    width: 260,
    fixed: 'right',
    buttons: [
      { text: '编辑', type: 'primary', icon: 'Edit', event: 'edit' },
      { text: '菜单权限', type: 'info', icon: 'Menu', event: 'permission' },
      { text: '删除', type: 'danger', icon: 'Delete', event: 'delete', confirm: '确认删除该角色角色吗？' }
    ]
  }
}

// -----------------------------------------------------------------------------
// 3. 数据交互
// -----------------------------------------------------------------------------

// 模拟数据
let mockData = Array.from({ length: 20 }).map((_, index) => ({
  id: index + 1,
  roleName: index === 0 ? '超级管理员' : `普通角色 ${index}`,
  roleKey: index === 0 ? 'admin' : `role_${index}`,
  sort: index + 1,
  status: 1,
  remark: index === 0 ? '系统拥有最高权限' : '普通角色权限',
  createTime: '2024-01-23 10:00:00'
}))

// 获取数据 API
const fetchTableData = async (params: FetchDataParams): Promise<FetchDataResult> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // 模拟筛选
  let list = mockData
  if (params.roleName) list = list.filter(item => item.roleName.includes(params.roleName))
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

const handleSearch = (params: Record<string, any>) => Object.assign(queryParams, params)

const handleReset = () => {
  Object.keys(queryParams).forEach(key => delete queryParams[key])
  ElMessage.success('重置成功')
}

// 打开新增
const handleAdd = () => {
  dialogRef.value?.open('add')
}

// 打开编辑
const handleEdit = (row: any) => {
  if (row.roleKey === 'admin') {
     ElMessage.warning('系统预置角色不可编辑')
     return
  }
  dialogRef.value?.open('edit', row)
}

// 弹窗成功回调
const handleSuccess = ({ type, data }: { type: string, data: any }) => {
  if (type === 'add') {
    const newItem = {
      id: mockData.length + 1,
      ...data,
      createTime: new Date().toLocaleString()
    }
    mockData.unshift(newItem)
    ElMessage.success('新增成功')
  } else {
     const index = mockData.findIndex(item => item.id === data.id)
    if (index > -1) {
      mockData[index] = { ...mockData[index], ...data }
    }
    ElMessage.success('编辑成功')
  }
  tableRef.value?.refresh()
}

const handleAction = (event: string, row: any) => {
  switch (event) {
    case 'edit':
      handleEdit(row)
      break
    case 'permission':
      ElMessage.info(`分配角色权限: ${row.roleName}`)
      break
    case 'delete':
      if (row.roleKey === 'admin') {
        ElMessage.error('系统管理员角色不允许删除')
        return
      }
      ElMessage.success('删除成功')
      mockData = mockData.filter(item => item.id !== row.id)
      tableRef.value?.refresh()
      break
  }
}

const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows
}

const handleExport = () => ElMessage.success('导出数据')

const handleBatchDelete = () => {
  ElMessageBox.confirm(`确认删除选中的 ${selectedRows.value.length} 个角色吗？`, '警告', {
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
    <JsonSearch
      :schema="searchSchema"
      @search="handleSearch"
      @reset="handleReset"
    />

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
        <template #toolbar-left>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增角色
          </el-button>
          <el-button 
            type="danger" 
            :disabled="selectedRows.length === 0"
            @click="handleBatchDelete"
          >
            批量删除
          </el-button>
        </template>

        <template #toolbar-right>
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon>导出
          </el-button>
        </template>
      </JsonTable>
    </div>

    <!-- 弹窗组件 -->
    <RoleDialog ref="dialogRef" @success="handleSuccess" />
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
