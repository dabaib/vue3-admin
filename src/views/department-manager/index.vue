<script setup lang="ts">
import { ref, reactive, nextTick, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import JsonTable from '@/components/JsonTable'
import JsonSearch from '@/components/JsonSearch'
import JsonDialog from '@/components/JsonDialog'
import JsonForm from '@/components/JsonForm'
import type { TableSchema, FetchDataParams, FetchDataResult } from '@/components/JsonTable'
import type { SearchSchema } from '@/components/JsonSearch'
import type { FormSchema } from '@/components/JsonForm'
import type { Department, DeptFormData } from '@/api/department/types'
import { getDeptTree, createDept, updateDept, deleteDept, getDeptList } from '@/api/department'

// -----------------------------------------------------------------------------
// 1. 状态定义
// -----------------------------------------------------------------------------

const tableRef = ref()
const formRef = ref()

const queryParams = reactive<Record<string, any>>({})

// 平铺的所有部门数据供上级选择使用
const flatDeptList = ref<{label: string, value: string}[]>([])

// 弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogType = ref<'add' | 'edit'>('add')
const confirmLoading = ref(false)

// 表单数据
const formData = ref<DeptFormData>({
  parentId: '0',
  name: '',
  sort: 1,
  status: 'enable',
})

// -----------------------------------------------------------------------------
// 2. 配置定义
// -----------------------------------------------------------------------------

const searchSchema: SearchSchema = {
  items: [
    { prop: 'name', label: '部门名称', type: 'input', placeholder: '请输入部门名称' },
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
  // 必须开启 row-key，告诉 ElTable 这是树形结构
  tableProps: { 'row-key': 'id', 'default-expand-all': true },
  pageSize: 999, // 树形一般直接请求所有不分页，此属性是为了向 JsonTable 表明我们暂时想查多点
  // 也可以关闭 JsonTable 内部的分页功能
  pagination: false,
  columns: [
    { prop: 'name', label: '部门名称', minWidth: 200 },
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
    { prop: 'createTime', label: '创建时间', width: 180 }
  ],
  actionColumn: {
    width: 200,
    fixed: 'right',
    buttons: [
      { text: '新增下级', type: 'primary', link: true, event: 'append' },
      { text: '编辑', type: 'primary', link: true, event: 'edit' },
      { text: '删除', type: 'primary', link: true, event: 'delete', confirm: '确认删除该部门吗？(包含子部门将无法删除)' }
    ]
  }
}

const formSchema = computed<FormSchema>(() => ({
  labelWidth: '80px',
  defaultSpan: 24,
  items: [
    {
      prop: 'parentId',
      label: '上级部门',
      type: 'select',
      span: 24,
      options: [{ label: '顶级部门', value: '0' }, ...flatDeptList.value],
      // 编辑顶级部门时禁止修改它的父节点（当然也可以允许它移动位置）
      readonly: false, 
      rules: [{ required: true, message: '请选择上级部门', trigger: 'change' }]
    },
    {
      prop: 'name',
      label: '部门名称',
      type: 'input',
      span: 24,
      rules: [{ required: true, message: '请输入部门名称', trigger: 'blur' }]
    },
    {
      prop: 'sort',
      label: '显示排序',
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
    }
  ]
}))

// -----------------------------------------------------------------------------
// 3. 数据交互与事件处理
// -----------------------------------------------------------------------------

// 获取表格数据
const fetchTableData = async (params: FetchDataParams): Promise<FetchDataResult<Department>> => {
  // 对树形结构我们通常不使用它的 page / pageSize
  const res = await getDeptTree({
    name: params.name,
    status: params.status
  })
  // 更新可用下拉
  const flat = await getDeptList()
  flatDeptList.value = flat.map(d => ({ label: d.name, value: d.id }))

  return { list: res, total: res.length }
}

const handleSearch = (params: Record<string, any>) => Object.assign(queryParams, params)

const handleReset = () => {
  Object.keys(queryParams).forEach(key => delete queryParams[key])
  ElMessage.success('查询条件已重置')
}

// 顶部的全局新增顶级部门
const handleAdd = () => {
  dialogType.value = 'add'
  dialogTitle.value = '新增部门'
  formData.value = { parentId: '0', name: '', sort: 1, status: 'enable' }
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

// 行上的新增下级
const handleAppend = (row: Department) => {
  dialogType.value = 'add'
  dialogTitle.value = '新增下级部门'
  formData.value = { parentId: row.id, name: '', sort: 1, status: 'enable' }
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

const handleEdit = (row: Department) => {
  dialogType.value = 'edit'
  dialogTitle.value = '编辑部门'
  formData.value = { 
    id: row.id, 
    parentId: row.parentId, 
    name: row.name, 
    sort: row.sort, 
    status: row.status 
  }
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

const handleSave = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  confirmLoading.value = true
  try {
    if (dialogType.value === 'edit') {
      await updateDept(formData.value)
    } else {
      await createDept(formData.value)
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

const handleDelete = async (row: Department) => {
  try {
    await deleteDept(row.id)
    ElMessage.success('删除成功')
    tableRef.value?.refresh()
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : '删除失败'
    ElMessage.error(msg)
  }
}

const handleAction = (event: string, row: Department) => {
  switch (event) {
    case 'append':
      handleAppend(row)
      break
    case 'edit':
      handleEdit(row)
      break
    case 'delete':
      handleDelete(row)
      break
  }
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
        @action="handleAction"
      >
        <template #toolbar-left>
          <el-button type="primary" @click="handleAdd">
            新增顶级部门
          </el-button>
        </template>
      </JsonTable>
    </div>

    <!-- 新增 / 编辑弹窗 -->
    <JsonDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :confirm-loading="confirmLoading"
      width="500px"
      @confirm="handleSave"
    >
      <JsonForm
        ref="formRef"
        :schema="formSchema"
        v-model="formData"
      />
    </JsonDialog>
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
