<script setup lang="ts">
import { ref, reactive, nextTick, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DeptTree from './modules/DeptTree.vue'
import AssignRoleDialog from './modules/AssignRoleDialog.vue'
import JsonTable from '@/components/JsonTable'
import JsonSearch from '@/components/JsonSearch'
import JsonDialog from '@/components/JsonDialog'
import JsonForm from '@/components/JsonForm'
import type { TableSchema, FetchDataParams, FetchDataResult } from '@/components/JsonTable'
import type { SearchSchema } from '@/components/JsonSearch'
import type { FormSchema } from '@/components/JsonForm'
import type { User, UserFormData } from '@/api/user/types'
import { getUserList, createUser, updateUser, deleteUser } from '@/api/user'
import { getDeptList } from '@/api/department'

// -----------------------------------------------------------------------------
// 1. 状态定义
// -----------------------------------------------------------------------------

const tableRef = ref()
const formRef = ref()

const queryParams = reactive<Record<string, any>>({
  deptId: '' // 当前选中的部门 ID
})
const selectedRows = ref<User[]>([])

// 部门列表（供表单下拉选择）
const deptOptions = ref<{label: string, value: string}[]>([])

// 编辑弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogType = ref<'add' | 'edit'>('add')
const confirmLoading = ref(false)

// 分配角色弹窗
const assignRoleVisible = ref(false)
const assignRoleUser = ref<User | null>(null)

// 表单数据
const formData = ref<UserFormData>({
  account: '',
  name: '',
  phone: '',
  deptId: '',
  status: 'enable',
})

// -----------------------------------------------------------------------------
// 2. 初始化与基础数据拉取
// -----------------------------------------------------------------------------

const fetchDeptOptions = async () => {
  try {
    const list = await getDeptList()
    deptOptions.value = list.map(d => ({ label: d.name, value: d.id }))
  } catch (error) {
    console.error('获取部门列表用于下拉框失败', error)
  }
}

onMounted(() => {
  fetchDeptOptions()
})

// -----------------------------------------------------------------------------
// 3. 配置定义
// -----------------------------------------------------------------------------

const searchSchema: SearchSchema = {
  items: [
    { prop: 'name', label: '用户/账号', type: 'input', placeholder: '请输入姓名或账号' },
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
    { prop: 'account', label: '账号', width: 120 },
    { prop: 'name', label: '姓名', minWidth: 100 },
    { prop: 'deptName', label: '所属部门', minWidth: 120 },
    { prop: 'roleNames', label: '所属角色', minWidth: 150, showOverflowTooltip: true },
    { prop: 'phone', label: '手机号', width: 130 },
    {
      prop: 'status',
      label: '状态',
      width: 90,
      align: 'center',
      render: 'tag',
      renderOptions: {
        tagMap: {
          enable: { text: '启用', type: 'success' },
          disable: { text: '停用', type: 'info' }
        }
      }
    },
    { prop: 'createTime', label: '创建时间', width: 180 }
  ],
  actionColumn: {
    width: 210,
    fixed: 'right',
    buttons: [
      { text: '编辑', type: 'primary', link: true, event: 'edit' },
      { text: '分配角色', type: 'primary', link: true, event: 'assign' },
      { text: '删除', type: 'primary', link: true, event: 'delete', confirm: '确认删除该用户吗？' }
    ]
  }
}

const formSchema = computed<FormSchema>(() => ({
  labelWidth: '90px',
  defaultSpan: 24,
  items: [
    {
      prop: 'account',
      label: '账号',
      type: 'input',
      span: 12,
      readonly: dialogType.value === 'edit',
      rules: [{ required: true, message: '请输入账号', trigger: 'blur' }]
    },
    {
      prop: 'name',
      label: '姓名',
      type: 'input',
      span: 12,
      rules: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }]
    },
    {
      prop: 'deptId',
      label: '所属部门',
      type: 'select',
      span: 12,
      options: deptOptions.value,
      rules: [{ required: true, message: '请选择所属部门', trigger: 'change' }]
    },
    {
      prop: 'phone',
      label: '手机号',
      type: 'input',
      span: 12
    },
    {
      prop: 'status',
      label: '状态',
      type: 'radio',
      span: 12,
      options: [
        { label: '启用', value: 'enable' },
        { label: '停用', value: 'disable' }
      ],
      rules: [{ required: true, message: '请选择用户状态', trigger: 'change' }]
    }
  ]
}))

// -----------------------------------------------------------------------------
// 4. 数据交互与事件处理
// -----------------------------------------------------------------------------

// 获取表格数据
const fetchTableData = async (params: FetchDataParams): Promise<FetchDataResult<User>> => {
  const res = await getUserList({
    page: params.page,
    pageSize: params.pageSize,
    name: params.name,
    status: params.status,
    deptId: queryParams.deptId || undefined
  })
  return { list: res.list, total: res.total }
}

// 左侧树节点点击
const handleDeptClick = (deptId: string) => {
  queryParams.deptId = deptId
  // 树点击后刷新表格
  tableRef.value?.refresh()
}

const handleSearch = (params: Record<string, any>) => Object.assign(queryParams, params)

const handleReset = () => {
  // 仅删除查询参数中的字段，保留树选中的 deptId
  Object.keys(queryParams).forEach(key => {
    if (key !== 'deptId') {
      delete queryParams[key]
    }
  })
  ElMessage.success('查询条件已重置')
}

const handleAdd = () => {
  dialogType.value = 'add'
  dialogTitle.value = '新增用户'
  formData.value = { account: '', name: '', phone: '', deptId: queryParams.deptId || deptOptions.value[0]?.value || '', status: 'enable' }
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

const handleEdit = (row: User) => {
  dialogType.value = 'edit'
  dialogTitle.value = '编辑用户'
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
      await updateUser(formData.value)
    } else {
      await createUser(formData.value)
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

const handleDelete = async (row: User) => {
  try {
    await deleteUser(row.id)
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
    `确认删除选中的 ${selectedRows.value.length} 个用户吗？`,
    '警告',
    { type: 'warning' }
  ).then(async () => {
    const ids = selectedRows.value.map(r => r.id).join(',')
    try {
      await deleteUser(ids)
      ElMessage.success('批量删除成功')
      tableRef.value?.refresh()
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : '删除失败'
      ElMessage.error(msg)
    }
  })
}

const handleAction = (event: string, row: User) => {
  switch (event) {
    case 'edit':
      handleEdit(row)
      break
    case 'assign':
      assignRoleUser.value = row
      assignRoleVisible.value = true
      break
    case 'delete':
      handleDelete(row)
      break
  }
}

const handleSelectionChange = (rows: User[]) => {
  selectedRows.value = rows
}
</script>

<template>
  <div class="complex-page-container">
    <!-- 左侧部门树 -->
    <div class="left-panel">
      <DeptTree @node-click="handleDeptClick" />
    </div>

    <!-- 右侧用户列表 -->
    <div class="right-panel page-container">
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
            <el-button type="primary" @click="handleAdd">新增</el-button>
            <el-button
              type="danger"
              :disabled="selectedRows.length === 0"
              @click="handleBatchDelete"
            >批量删除</el-button>
          </template>
        </JsonTable>
      </div>
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

    <!-- 分配角色弹窗 -->
    <AssignRoleDialog
      v-model="assignRoleVisible"
      :user="assignRoleUser"
      @success="tableRef?.refresh()"
    />
  </div>
</template>

<style scoped lang="scss">
.complex-page-container {
  display: flex;
  gap: 16px;
  height: 100%;
  box-sizing: border-box;
}

.left-panel {
  width: 260px;
  flex-shrink: 0;
}

.right-panel {
  flex: 1;
  min-width: 0;
}

// 右侧本身复用 page-container 样式
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
