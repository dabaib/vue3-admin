<script setup lang="ts">
import { ref, reactive, nextTick, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import JsonTable from '@/components/JsonTable'
import JsonSearch from '@/components/JsonSearch'
import JsonDialog from '@/components/JsonDialog'
import JsonForm from '@/components/JsonForm'
import RolePermission from './modules/RolePermission.vue'
import type { TableSchema, FetchDataParams, FetchDataResult } from '@/components/JsonTable'
import type { SearchSchema } from '@/components/JsonSearch'
import type { FormSchema } from '@/components/JsonForm'
import type { Role, RoleFormData } from '@/api/role/types'
import { getRoleList, createRole, updateRole, deleteRole } from '@/api/role'

// -----------------------------------------------------------------------------
// 1. 状态定义
// -----------------------------------------------------------------------------

const tableRef = ref()
const formRef = ref()

const queryParams = reactive<Record<string, any>>({})
const selectedRows = ref<Role[]>([])

// 弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogType = ref<'add' | 'edit'>('add')
const confirmLoading = ref(false)

// 表单
const formData = ref<RoleFormData>({
  name: '',
  code: '',
  sort: 0,
  status: 'enable',
  remark: ''
})

// 权限抽屉
const permissionVisible = ref(false)
const currentRoleId = ref('')

// -----------------------------------------------------------------------------
// 2. 配置定义
// -----------------------------------------------------------------------------

const searchSchema: SearchSchema = {
  items: [
    { prop: 'name', label: '角色名称', type: 'input', placeholder: '请输入角色名称' },
    {
      prop: 'status',
      label: '状态',
      type: 'select',
      placeholder: '请选择状态',
      options: [
        { label: '启用', value: 'enable' },
        { label: '停用', value: 'disable' }
      ]
    }
  ]
}

const tableSchema: TableSchema = {
  tableProps: { 'row-key': 'id' },
  columns: [
    { type: 'selection', prop: 'selection', label: '', width: 50 },
    { type: 'index', prop: 'index', label: '序号', width: 60, align: 'center' },
    { prop: 'name', label: '角色名称', minWidth: 120 },
    { prop: 'code', label: '角色编码', width: 150 },
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
          disable: { text: '停用', type: 'info' }
        }
      }
    },
    { prop: 'remark', label: '备注', minWidth: 150, showOverflowTooltip: true },
    { prop: 'createTime', label: '创建时间', width: 180 }
  ],
  actionColumn: {
    width: 240,
    fixed: 'right',
    buttons: [
      { text: '权限设置', type: 'primary', event: 'permission' },
      { text: '编辑', type: 'primary', event: 'edit' },
      { text: '删除', type: 'primary', event: 'delete', confirm: '确认删除该角色吗？' }
    ]
  }
}

const formSchema = computed<FormSchema>(() => ({
  labelWidth: '80px',
  defaultSpan: 24,
  items: [
    {
      prop: 'name',
      label: '角色名称',
      type: 'input',
      span: 12,
      rules: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
    },
    {
      prop: 'code',
      label: '角色编码',
      type: 'input',
      span: 12,
      readonly: dialogType.value === 'edit',
      rules: [
        { required: true, message: '请输入角色编码', trigger: 'blur' },
        { pattern: /^[A-Z_]+$/, message: '仅允许大写字母和下划线', trigger: 'blur' }
      ]
    },
    {
      prop: 'sort',
      label: '排序',
      type: 'number',
      span: 12,
      min: 0,
      step: 1
    },
    {
      prop: 'status',
      label: '状态',
      type: 'radio',
      span: 12,
      options: [
        { label: '启用', value: 'enable' },
        { label: '停用', value: 'disable' }
      ]
    },
    {
      prop: 'remark',
      label: '备注',
      type: 'textarea',
      span: 24,
      rows: 3
    }
  ]
}))

// -----------------------------------------------------------------------------
// 3. 数据交互 (API)
// -----------------------------------------------------------------------------

const fetchTableData = async (params: FetchDataParams): Promise<FetchDataResult<Role>> => {
  const res = await getRoleList({
    page: params.page,
    pageSize: params.pageSize,
    name: params.name,
    status: params.status
  })
  return { list: res.list, total: res.total }
}

// -----------------------------------------------------------------------------
// 4. 事件处理
// -----------------------------------------------------------------------------

const handleSearch = (params: Record<string, any>) => Object.assign(queryParams, params)

const handleReset = () => {
  Object.keys(queryParams).forEach(key => delete queryParams[key])
  ElMessage.success('查询条件已重置')
}

const handleAdd = () => {
  dialogType.value = 'add'
  dialogTitle.value = '新增角色'
  formData.value = { name: '', code: '', sort: 0, status: 'enable', remark: '' }
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

const handleEdit = (row: Role) => {
  dialogType.value = 'edit'
  dialogTitle.value = '编辑角色'
  formData.value = { ...row }
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

const handleSave = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  confirmLoading.value = true
  try {
    if (dialogType.value === 'edit') {
      await updateRole(formData.value)
    } else {
      await createRole(formData.value)
    }
    ElMessage.success(dialogType.value === 'add' ? '新增成功' : '编辑成功')
    dialogVisible.value = false
    tableRef.value?.refresh()
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : '操作失败'
    ElMessage.error(msg)
  } finally {
    confirmLoading.value = false
  }
}

const handleDelete = async (row: Role) => {
  try {
    await deleteRole(row.id)
    ElMessage.success('删除成功')
    tableRef.value?.refresh()
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : '删除失败'
    ElMessage.error(msg)
  }
}

const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) return
  ElMessageBox.confirm(
    `确认删除选中的 ${selectedRows.value.length} 条数据吗？`,
    '警告',
    { type: 'warning' }
  ).then(async () => {
    const ids = selectedRows.value.map(r => r.id).join(',')
    try {
      await deleteRole(ids)
      ElMessage.success('批量删除成功')
      tableRef.value?.refresh()
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : '删除失败'
      ElMessage.error(msg)
    }
  })
}

const handleAction = (event: string, row: Role) => {
  switch (event) {
    case 'permission':
      currentRoleId.value = row.id
      permissionVisible.value = true
      break
    case 'edit':
      handleEdit(row)
      break
    case 'delete':
      handleDelete(row)
      break
  }
}

const handleSelectionChange = (rows: Role[]) => {
  selectedRows.value = rows
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
            新增
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

    <!-- 新增 / 编辑弹窗 -->
    <JsonDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :confirm-loading="confirmLoading"
      width="600px"
      @confirm="handleSave"
    >
      <JsonForm
        ref="formRef"
        :schema="formSchema"
        v-model="formData"
      />
    </JsonDialog>

    <!-- 权限配置抽屉 -->
    <RolePermission
      v-model="permissionVisible"
      :role-id="currentRoleId"
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
