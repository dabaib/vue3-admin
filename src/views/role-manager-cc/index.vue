<script setup lang="ts">
import { ref, reactive, nextTick, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Download } from '@element-plus/icons-vue'
import JsonTable from '@/components/JsonTable/JsonTable.vue'
import JsonSearch from '@/components/JsonSearch/JsonSearch.vue'
import JsonDialog from '@/components/JsonDialog/JsonDialog.vue'
import JsonForm from '@/components/JsonForm/JsonForm.vue'
import RolePermission from './modules/RolePermission.vue'
import type { TableSchema, FetchDataParams, FetchDataResult } from '@/components/JsonTable/types'
import type { SearchSchema } from '@/components/JsonSearch/types'
import type { FormSchema } from '@/components/JsonForm/types'
import type { Role, RoleFormData } from '@/api/role/types'
import { getRoleList, createRole, updateRole, deleteRole } from '@/api/role'

// -----------------------------------------------------------------------------
// 1. 状态定义
// -----------------------------------------------------------------------------

const tableRef = ref()
const formRef = ref()

// 查询参数
const queryParams = reactive<Record<string, any>>({
  page: 1,
  pageSize: 10
})

// 选中行
const selectedRows = ref<Role[]>([])

// 弹窗状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogType = ref<'add' | 'edit'>('add')
const confirmLoading = ref(false)

// 表单数据
const formData = ref<RoleFormData>({
  name: '',
  code: '',
  sort: 0,
  status: 'enable',
  remark: ''
})

// 权限抽屉状态
const drawerVisible = ref(false)
const currentRoleId = ref('')

// -----------------------------------------------------------------------------
// 2. 配置定义
// -----------------------------------------------------------------------------

// Search Schema: 查询配置
const searchSchema: SearchSchema = {
  items: [
    {
      prop: 'name',
      label: '角色名称',
      type: 'input',
      placeholder: '请输入角色名称',
      width: 200
    },
    {
      prop: 'status',
      label: '状态',
      type: 'select',
      placeholder: '请选择状态',
      width: 120,
      options: [
        { label: '启用', value: 'enable' },
        { label: '停用', value: 'disable' }
      ]
    }
  ]
}

// Table Schema: 表格配置
const tableSchema: TableSchema = {
  tableProps: {
    'row-key': 'id'
  },
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

// Form Schema: 表单配置
const formSchema: FormSchema = {
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
      rules: [
        { required: true, message: '请输入角色编码', trigger: 'blur' },
        { pattern: /^[A-Z_]+$/, message: '只能包含大写字母和下划线', trigger: 'blur' }
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
}

// -----------------------------------------------------------------------------
// 3. 数据交互 (API)
// -----------------------------------------------------------------------------

// 获取数据 API
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

// 查询与重置
const handleSearch = (params: Record<string, any>) => Object.assign(queryParams, params)

const handleReset = () => {
  Object.keys(queryParams).forEach(key => {
    if (key !== 'page' && key !== 'pageSize') {
      delete queryParams[key]
    }
  })
  ElMessage.success('查询条件已重置')
}

// 打开新增弹窗
const handleAdd = () => {
  dialogType.value = 'add'
  dialogTitle.value = '新增角色'
  formData.value = {
    name: '',
    code: '',
    sort: 0,
    status: 'enable',
    remark: ''
  }
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

// 打开编辑弹窗
const handleEdit = (row: Role) => {
  dialogType.value = 'edit'
  dialogTitle.value = '编辑角色'
  formData.value = { ...row }
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

// 保存数据
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
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
    throw error // 保持弹窗打开
  } finally {
    confirmLoading.value = false
  }
}

// 表格操作
const handleAction = (event: string, row: Role) => {
  switch (event) {
    case 'permission':
      currentRoleId.value = row.id
      drawerVisible.value = true
      break
    case 'edit':
      handleEdit(row)
      break
    case 'delete':
      handleDelete(row)
      break
  }
}

// 删除角色
const handleDelete = async (row: Role) => {
  try {
    await deleteRole(row.id)
    ElMessage.success('删除成功')
    tableRef.value?.refresh()
  } catch (error: any) {
    ElMessage.error(error.message || '删除失败')
  }
}

const handleSelectionChange = (rows: Role[]) => {
  selectedRows.value = rows
}

const handleExport = () => ElMessage.success('导出数据')

const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) return

  const ids = selectedRows.value.map(r => r.id).join(',')
  try {
    await deleteRole(ids)
    ElMessage.success(`成功删除 ${selectedRows.value.length} 条数据`)
    tableRef.value?.refresh()
  } catch (error: any) {
    ElMessage.error(error.message || '删除失败')
  }
}

// 表单项是否只读（编码编辑时不可修改）
const isCodeReadonly = computed(() => dialogType.value === 'edit')
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

        <template #toolbar-right>
          <el-button @click="handleExport">
            导出
          </el-button>
        </template>
      </JsonTable>
    </div>

    <!-- 弹窗表单 -->
    <JsonDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :confirm-loading="confirmLoading"
      width="600px"
      @confirm="handleSave"
    >
      <JsonForm
        ref="formRef"
        :schema="{
          ...formSchema,
          items: formSchema.items.map(item => ({
            ...item,
            readonly: item.prop === 'code' && isCodeReadonly
          }))
        }"
        v-model="formData"
      />
    </JsonDialog>

    <!-- 权限配置抽屉 -->
    <RolePermission
      v-model="drawerVisible"
      :role-id="currentRoleId"
    />
  </div>
</template>

<style scoped lang="scss">
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: var(--el-bg-color-page);
  box-sizing: border-box;
}

.table-container {
  flex: 1;
  min-height: 0;
  background: var(--el-bg-color);
  border-radius: 4px;
  padding: 16px;
  margin-top: 16px;
}
</style>
