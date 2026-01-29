---
name: crud_page
description: 创建增删改查(CRUD)页面 (触发词: 增删改查, CRUD, 列表页)
---

# 创建 CRUD 页面规范

本 Skill 用于指导如何使用项目中的 `JsonSearch`, `JsonTable`, `JsonDialog` 和 `JsonForm` 组件快速构建标准化的后台管理 CRUD 页面。

## 1. 页面结构概览

标准 CRUD 页面由三部分组成：
1. **顶部查询区 (`JsonSearch`)**：支持自适应折叠、多种控件类型。
2. **主体表格区 (`JsonTable`)**：支持自动分页、API 联动、自适应高度。
3. **弹窗表单区 (`JsonDialog` + `JsonForm`)**：用于新增和编辑数据的标准化弹窗。

## 2. 标准代码模板

创建新页面时，请复制并根据需求修改以下模板：

```vue
<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import JsonTable from '@/components/JsonTable'
import JsonSearch from '@/components/JsonSearch'
import JsonDialog from '@/components/JsonDialog'
import JsonForm, { type FormSchema } from '@/components/JsonForm'
import type { TableSchema, FetchDataParams, FetchDataResult } from '@/components/JsonTable'
import type { SearchSchema } from '@/components/JsonSearch'

// -----------------------------------------------------------------------------
// 1. 状态定义
// -----------------------------------------------------------------------------

// 组件引用
const tableRef = ref()
const formRef = ref()

// 查询参数
const queryParams = reactive<Record<string, any>>({})

// 选中行
const selectedRows = ref<any[]>([])

// 弹窗状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogType = ref<'add' | 'edit'>('add')
const confirmLoading = ref(false)

// 表单数据
const formData = ref<Record<string, any>>({})

// -----------------------------------------------------------------------------
// 2. 配置定义
// -----------------------------------------------------------------------------

// Search Schema: 查询配置
const searchSchema: SearchSchema = {
  items: [
    { prop: 'name', label: '名称', type: 'input', placeholder: '请输入名称' },
    { 
      prop: 'status', 
      label: '状态', 
      type: 'select',
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
    }
  ]
}

// Table Schema: 表格配置
const tableSchema: TableSchema = {
  columns: [
    { type: 'selection', prop: 'selection' },
    { type: 'index', prop: 'index', label: '序号' },
    { prop: 'name', label: '名称', width: 150 },
    { 
      prop: 'status', 
      label: '状态', 
      width: 100, 
      render: 'tag',
      renderOptions: {
        tagMap: {
          0: { text: '禁用', type: 'danger' },
          1: { text: '启用', type: 'success' }
        }
      }
    },
    { prop: 'createTime', label: '创建时间', width: 180 },
  ],
  actionColumn: {
    width: 200,
    fixed: 'right',
    buttons: [
      { text: '编辑', type: 'primary', icon: 'Edit', event: 'edit' },
      { text: '删除', type: 'danger', icon: 'Delete', event: 'delete', confirm: '确认删除？' }
    ]
  }
}

// Form Schema: 表单配置
const formSchema: FormSchema = {
  labelWidth: '80px',
  items: [
    { 
      prop: 'name', 
      label: '名称', 
      type: 'input', 
      rules: [{ required: true, message: '请输入名称', trigger: 'blur' }] 
    },
    { 
      prop: 'status', 
      label: '状态', 
      type: 'switch',
      defaultValue: 1
    },
    { 
      prop: 'remark', 
      label: '备注', 
      type: 'textarea',
      rows: 3 
    }
  ]
}

// -----------------------------------------------------------------------------
// 3. 数据交互 (API)
// -----------------------------------------------------------------------------

// 获取数据 API
const fetchTableData = async (params: FetchDataParams): Promise<FetchDataResult> => {
  // TODO: 替换为真实 API
  // const res = await api.getList(params)
  // return { list: res.data, total: res.total }
  console.log('Fetching data with params:', params)
  return { list: [], total: 0 }
}

// -----------------------------------------------------------------------------
// 4. 事件处理
// -----------------------------------------------------------------------------

// 查询与重置
const handleSearch = (params: Record<string, any>) => Object.assign(queryParams, params)

const handleReset = () => {
  Object.keys(queryParams).forEach(key => delete queryParams[key])
  ElMessage.success('查询条件已重置')
}

// 打开新增弹窗
const handleAdd = () => {
  dialogType.value = 'add'
  dialogTitle.value = '新增数据'
  formData.value = {} // 重置数据
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

// 打开编辑弹窗
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  dialogTitle.value = '编辑数据'
  formData.value = { ...row } // 回填数据
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

// 保存数据
const handleSave = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  confirmLoading.value = true
  try {
    // TODO: 调用保存/更新 API
    await new Promise(resolve => setTimeout(resolve, 500)) // 模拟延迟
    ElMessage.success(dialogType.value === 'add' ? '新增成功' : '编辑成功')
    dialogVisible.value = false
    tableRef.value?.refresh()
  } finally {
    confirmLoading.value = false
  }
}

// 表格操作
const handleAction = (event: string, row: any) => {
  switch (event) {
    case 'edit':
      handleEdit(row)
      break
    case 'delete':
      // TODO: 调用删除 API
      ElMessage.success('删除成功')
      tableRef.value?.refresh()
      break
  }
}

const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows
}

const handleExport = () => ElMessage.success('导出数据')

const handleBatchDelete = () => {
  ElMessageBox.confirm(`确认删除选中的 ${selectedRows.value.length} 条数据吗？`, '警告', {
    type: 'warning'
  }).then(() => {
    // TODO: 调用批量删除 API
    ElMessage.success('批量删除成功')
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
        <template #toolbar-left>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增
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

    <!-- 弹窗表单 -->
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
```

## 3. 关键配置说明

### SearchSchema (查询配置)
- `items`: 数组，每项包含 `prop`, `label`, `type` (`input`, `select`, `date` 等)。

### TableSchema (表格配置)
- `columns`: 数组，定义列属性及渲染方式。
- `actionColumn`: 定义右侧操作按钮。

### FormSchema (表单配置)
- `items`: 数组，定义表单项及验证规则。
  - `type`: `input`, `number`, `select`, `switch`, `radio`, `checkbox`, `textarea`, `date` 等。
  - `rules`: Element Plus 验证规则数组。
  - `span`: 栅格占位 (默认 24)。

## 4. 最佳实践提醒

1. **统一交互**: 新增和编辑尽量复用同一个弹窗和表单，通过 `dialogType` 区分逻辑。
2. **表单重置**: 每次打开弹窗时，记得清空表单数据并调用 `clearValidate()`。
3. **类型安全**: 充分利用 TS 类型提示，避免拼写错误。
