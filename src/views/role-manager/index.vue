<script setup lang="ts">
/**
 * 角色管理页面
 * @description 基于 JsonSearch + JsonTable 实现的标准 CRUD 页面
 */
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import JsonTable from '@/components/JsonTable'
import JsonSearch from '@/components/JsonSearch'
import type { TableSchema, FetchDataParams, FetchDataResult } from '@/components/JsonTable'
import type { SearchSchema } from '@/components/JsonSearch'
import { getRoleList, deleteRole } from '@/api/role'
import type { Role } from '@/api/role'
import RoleForm from './modules/RoleForm.vue'
import RolePermission from './modules/RolePermission.vue'

// -----------------------------------------------------------------------------
// 1. 状态定义
// -----------------------------------------------------------------------------

// 组件引用
const tableRef = ref()

// 查询参数
const queryParams = reactive<Record<string, any>>({})

// 选中行
const selectedRows = ref<Role[]>([])

// 表单弹窗状态
const formVisible = ref(false)
const editData = ref<Role | null>(null)

// 权限配置抽屉状态
const permissionVisible = ref(false)
const currentRole = ref<Role | null>(null)

// -----------------------------------------------------------------------------
// 2. 配置定义
// -----------------------------------------------------------------------------

// 搜索配置
const searchSchema: SearchSchema = {
  items: [
    {
      prop: 'name',
      label: '角色名称',
      type: 'input',
      placeholder: '请输入角色名称'
    },
    {
      prop: 'status',
      label: '状态',
      type: 'select',
      options: [
        { label: '启用', value: 'enable' },
        { label: '禁用', value: 'disable' }
      ],
      clearable: true
    }
  ]
}

// 表格配置
const tableSchema: TableSchema = {
  columns: [
    { type: 'selection', prop: 'selection', label: '' },
    { type: 'index', prop: 'index', label: '序号', width: 60 },
    { prop: 'name', label: '角色名称', minWidth: 120 },
    { prop: 'code', label: '角色编码', minWidth: 150 },
    { prop: 'sort', label: '排序', width: 80, align: 'center' },
    {
      prop: 'status',
      label: '状态',
      width: 100,
      align: 'center',
      render: 'tag',
      renderOptions: {
        tagMap: {
          enable: { text: '启用', type: 'success' },
          disable: { text: '禁用', type: 'danger' }
        }
      }
    },
    { prop: 'remark', label: '备注', minWidth: 150, showOverflowTooltip: true },
    { prop: 'createTime', label: '创建时间', width: 180 }
  ],
  actionColumn: {
    width: 220,
    fixed: 'right',
    buttons: [
      { text: '权限', type: 'warning', icon: 'Setting', event: 'permission' },
      { text: '编辑', type: 'primary', icon: 'Edit', event: 'edit' },
      { text: '删除', type: 'danger', icon: 'Delete', event: 'delete', confirm: '确认删除该角色吗？' }
    ]
  },
  tableProps: {
    rowKey: 'id'
  }
}

// -----------------------------------------------------------------------------
// 3. 数据交互
// -----------------------------------------------------------------------------

// 获取表格数据
const fetchTableData = async (params: FetchDataParams): Promise<FetchDataResult<Role>> => {
  const result = await getRoleList({
    page: params.page,
    pageSize: params.pageSize,
    ...queryParams
  })
  return result
}

// -----------------------------------------------------------------------------
// 4. 事件处理
// -----------------------------------------------------------------------------

// 搜索
const handleSearch = (params: Record<string, any>) => {
  Object.assign(queryParams, params)
}

// 重置
const handleReset = () => {
  Object.keys(queryParams).forEach(key => delete queryParams[key])
  ElMessage.success('查询条件已重置')
}

// 新增角色
const handleAdd = () => {
  editData.value = null
  formVisible.value = true
}

// 表格操作
const handleAction = (event: string, row: Role) => {
  switch (event) {
    case 'permission':
      currentRole.value = row
      permissionVisible.value = true
      break
    case 'edit':
      editData.value = row
      formVisible.value = true
      break
    case 'delete':
      handleDelete(row.id)
      break
  }
}

// 删除角色
const handleDelete = async (ids: string) => {
  try {
    await deleteRole(ids)
    ElMessage.success('删除成功')
    tableRef.value?.refresh()
  } catch (error) {
    // 错误已在拦截器中处理
  }
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的角色')
    return
  }

  ElMessageBox.confirm(
    `确认删除选中的 ${selectedRows.value.length} 个角色吗？`,
    '警告',
    { type: 'warning' }
  ).then(() => {
    const ids = selectedRows.value.map(row => row.id).join(',')
    handleDelete(ids)
  }).catch(() => {
    // 取消删除
  })
}

// 选择变化
const handleSelectionChange = (rows: Role[]) => {
  selectedRows.value = rows
}

// 表单保存成功
const handleFormSuccess = () => {
  tableRef.value?.refresh()
}

// 权限保存成功
const handlePermissionSuccess = () => {
  // 权限保存不需要刷新列表
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
      </JsonTable>
    </div>

    <!-- 角色表单弹窗 -->
    <RoleForm
      v-model="formVisible"
      :edit-data="editData"
      @success="handleFormSuccess"
    />

    <!-- 权限配置抽屉 -->
    <RolePermission
      v-model="permissionVisible"
      :role="currentRole"
      @success="handlePermissionSuccess"
    />
  </div>
</template>

<style scoped lang="scss">
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
