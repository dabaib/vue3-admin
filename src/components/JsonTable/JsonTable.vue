<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import type { TableSchema, TableColumn, ActionButton, FetchDataFn, FetchDataParams } from './types'

// Props
const props = withDefaults(defineProps<{
  // 表格配置 schema
  schema: TableSchema
  // 表格数据（静态数据模式）
  data?: any[]
  // 获取数据的 API 函数（动态数据模式）
  fetchData?: FetchDataFn
  // 额外的查询参数
  queryParams?: Record<string, any>
  // 加载状态（静态数据模式使用）
  loading?: boolean
  // 选中行（v-model）
  selectedRows?: any[]
  // 是否在挂载时自动加载数据
  immediate?: boolean
}>(), {
  loading: false,
  selectedRows: () => [],
  immediate: true
})

// Emits
const emit = defineEmits<{
  // 操作按钮点击
  (e: 'action', event: string, row: any, index: number): void
  // 分页变化（静态模式向后兼容）
  (e: 'page-change', page: number): void
  // 每页条数变化（静态模式向后兼容）
  (e: 'size-change', size: number): void
  // 排序变化
  (e: 'sort-change', prop: string, order: 'ascending' | 'descending' | null): void
  // 选中行变化
  (e: 'selection-change', rows: any[]): void
  // 更新选中行
  (e: 'update:selectedRows', rows: any[]): void
  // 数据加载完成
  (e: 'loaded', data: any[], total: number): void
}>()

// 表格引用
const tableRef = ref()

// 内部状态（动态数据模式）
const internalData = ref<any[]>([])
const internalLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 判断是否为动态数据模式
const isDynamicMode = computed(() => !!props.fetchData)

// 实际使用的表格数据
const tableData = computed(() => {
  return isDynamicMode.value ? internalData.value : (props.data || [])
})

// 实际使用的加载状态
const isLoading = computed(() => {
  return isDynamicMode.value ? internalLoading.value : props.loading
})

// 过滤隐藏列
const visibleColumns = computed(() => {
  return props.schema.columns.filter(col => !col.hidden)
})

// 分页配置
const paginationConfig = computed(() => {
  const defaultConfig = {
    show: true,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
    background: true
  }
  const schemaConfig = props.schema.pagination || {}
  
  // 动态模式使用内部状态，静态模式使用 schema 配置
  if (isDynamicMode.value) {
    return {
      ...defaultConfig,
      ...schemaConfig,
      currentPage: currentPage.value,
      pageSize: pageSize.value,
      total: total.value
    }
  }
  
  return {
    ...defaultConfig,
    currentPage: 1,
    pageSize: 10,
    total: 0,
    ...schemaConfig
  }
})

// 表格属性
const tableProps = computed(() => {
  const defaultProps = {
    border: true,
    stripe: true,
    size: 'default' as const,
    highlightCurrentRow: true,
    emptyText: '暂无数据'
  }
  return { ...defaultProps, ...props.schema.tableProps }
})

// 格式化单元格值
const formatCellValue = (row: any, column: TableColumn, index: number) => {
  const value = row[column.prop]
  if (column.formatter) {
    return column.formatter(row, column, value, index)
  }
  return value ?? '-'
}

// 判断按钮是否禁用
const isButtonDisabled = (button: ActionButton, row: any): boolean => {
  if (typeof button.disabled === 'function') {
    return button.disabled(row)
  }
  return button.disabled ?? false
}

// 判断按钮是否隐藏
const isButtonHidden = (button: ActionButton, row: any): boolean => {
  if (typeof button.hidden === 'function') {
    return button.hidden(row)
  }
  return button.hidden ?? false
}

// 处理操作按钮点击
const handleActionClick = async (button: ActionButton, row: any, index: number) => {
  if (button.confirm) {
    try {
      await ElMessageBox.confirm(button.confirm, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      emit('action', button.event, row, index)
    } catch {
      // 用户取消
    }
  } else {
    emit('action', button.event, row, index)
  }
}

// 加载数据（动态模式）
const loadData = async () => {
  if (!props.fetchData) return
  
  internalLoading.value = true
  try {
    const params: FetchDataParams = {
      page: currentPage.value,
      pageSize: pageSize.value,
      ...props.queryParams
    }
    const result = await props.fetchData(params)
    internalData.value = result.list
    total.value = result.total
    emit('loaded', result.list, result.total)
  } catch (error) {
    console.error('JsonTable: 获取数据失败', error)
    internalData.value = []
    total.value = 0
  } finally {
    internalLoading.value = false
  }
}

// 处理分页变化
const handleCurrentChange = (page: number) => {
  if (isDynamicMode.value) {
    currentPage.value = page
    loadData()
  } else {
    emit('page-change', page)
  }
}

// 处理每页条数变化
const handleSizeChange = (size: number) => {
  if (isDynamicMode.value) {
    pageSize.value = size
    currentPage.value = 1 // 重置到第一页
    loadData()
  } else {
    emit('size-change', size)
  }
}

// 处理排序变化
const handleSortChange = ({ prop, order }: { prop: string; order: 'ascending' | 'descending' | null }) => {
  emit('sort-change', prop, order)
}

// 处理选中变化
const handleSelectionChange = (rows: any[]) => {
  emit('selection-change', rows)
  emit('update:selectedRows', rows)
}

// 获取 tag 配置
const getTagConfig = (column: TableColumn, value: any) => {
  const tagMap = column.renderOptions?.tagMap
  if (tagMap && tagMap[value]) {
    return tagMap[value]
  }
  return { text: value, type: 'info' as const }
}

// 刷新数据（重新请求当前页）
const refresh = () => {
  if (isDynamicMode.value) {
    loadData()
  }
}

// 重置并刷新（回到第一页）
const reset = () => {
  if (isDynamicMode.value) {
    currentPage.value = 1
    loadData()
  }
}

// 监听查询参数变化自动刷新
watch(() => props.queryParams, () => {
  if (isDynamicMode.value) {
    currentPage.value = 1
    loadData()
  }
}, { deep: true })

// 初始化加载数据
onMounted(() => {
  if (isDynamicMode.value && props.immediate) {
    // 初始化分页参数
    if (props.schema.pagination?.pageSize) {
      pageSize.value = props.schema.pagination.pageSize
    }
    loadData()
  }
})

// 暴露方法
defineExpose({
  // 清除选中
  clearSelection: () => tableRef.value?.clearSelection(),
  // 切换行选中
  toggleRowSelection: (row: any, selected?: boolean) => tableRef.value?.toggleRowSelection(row, selected),
  // 获取表格引用
  getTableRef: () => tableRef.value,
  // 刷新数据
  refresh,
  // 重置并刷新
  reset,
  // 手动加载数据
  loadData
})
</script>

<template>
  <div class="json-table">
    <!-- 工具栏 -->
    <div v-if="$slots['toolbar-left'] || $slots['toolbar-right']" class="json-table__toolbar">
      <div class="json-table__toolbar-left">
        <slot name="toolbar-left" />
      </div>
      <div class="json-table__toolbar-right">
        <slot name="toolbar-right" />
      </div>
    </div>

    <!-- 表格容器 -->
    <div class="json-table__body">
      <!-- 表格 -->
      <el-table
        ref="tableRef"
        v-loading="isLoading"
        :data="tableData"
        v-bind="tableProps"
        height="100%"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
      >
      <!-- 遍历列 -->
      <template v-for="column in visibleColumns" :key="column.prop">
        <!-- 选择列 -->
        <el-table-column
          v-if="column.type === 'selection'"
          type="selection"
          :width="column.width || 55"
          :fixed="column.fixed"
          :align="column.align || 'center'"
        />

        <!-- 索引列 -->
        <el-table-column
          v-else-if="column.type === 'index'"
          type="index"
          :label="column.label"
          :width="column.width || 60"
          :fixed="column.fixed"
          :align="column.align || 'center'"
        />

        <!-- 展开列 -->
        <el-table-column
          v-else-if="column.type === 'expand'"
          type="expand"
          :width="column.width || 50"
          :fixed="column.fixed"
        >
          <template #default="{ row, $index }">
            <slot name="expand" :row="row" :index="$index" />
          </template>
        </el-table-column>

        <!-- 普通列 -->
        <el-table-column
          v-else
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :align="column.align"
          :sortable="column.sortable"
          :show-overflow-tooltip="column.showOverflowTooltip ?? true"
        >
          <template #default="{ row, $index }">
            <!-- 自定义插槽 -->
            <slot
              v-if="column.render === 'slot' && column.slotName"
              :name="column.slotName"
              :row="row"
              :column="column"
              :index="$index"
              :value="row[column.prop]"
            />

            <!-- Tag 渲染 -->
            <el-tag
              v-else-if="column.render === 'tag'"
              :type="getTagConfig(column, row[column.prop]).type"
            >
              {{ getTagConfig(column, row[column.prop]).text }}
            </el-tag>

            <!-- 图片渲染 -->
            <el-image
              v-else-if="column.render === 'image'"
              :src="row[column.prop]"
              :style="{
                width: (column.renderOptions?.imageWidth || 60) + 'px',
                height: (column.renderOptions?.imageHeight || 60) + 'px'
              }"
              fit="cover"
              preview-teleported
              :preview-src-list="[row[column.prop]]"
            />

            <!-- 链接渲染 -->
            <el-link
              v-else-if="column.render === 'link'"
              type="primary"
              :href="row[column.prop]"
              target="_blank"
            >
              {{ column.renderOptions?.linkText || row[column.prop] }}
            </el-link>

            <!-- 开关渲染 -->
            <el-switch
              v-else-if="column.render === 'switch'"
              v-model="row[column.prop]"
              :active-value="column.renderOptions?.activeValue ?? true"
              :inactive-value="column.renderOptions?.inactiveValue ?? false"
            />

            <!-- 进度条渲染 -->
            <el-progress
              v-else-if="column.render === 'progress'"
              :percentage="Number(row[column.prop]) || 0"
              :stroke-width="10"
            />

            <!-- 默认渲染 -->
            <span v-else>{{ formatCellValue(row, column, $index) }}</span>
          </template>
        </el-table-column>
      </template>

      <!-- 操作列 -->
      <el-table-column
        v-if="schema.actionColumn"
        :label="schema.actionColumn.label || '操作'"
        :width="schema.actionColumn.width || 200"
        :fixed="schema.actionColumn.fixed ?? 'right'"
        align="center"
      >
        <template #default="{ row, $index }">
          <template v-for="button in schema.actionColumn!.buttons" :key="button.event">
            <el-button
              v-if="!isButtonHidden(button, row)"
              :type="button.type || 'primary'"
              :link="button.link ?? true"
              :disabled="isButtonDisabled(button, row)"
              @click="handleActionClick(button, row, $index)"
            >
              <el-icon v-if="button.icon">
                <component :is="button.icon" />
              </el-icon>
              {{ button.text }}
            </el-button>
          </template>
        </template>
      </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div v-if="paginationConfig.show" class="json-table__pagination">
      <el-pagination
        v-model:current-page="paginationConfig.currentPage"
        v-model:page-size="paginationConfig.pageSize"
        :total="paginationConfig.total"
        :page-sizes="paginationConfig.pageSizes"
        :layout="paginationConfig.layout"
        :background="paginationConfig.background"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<style scoped>
.json-table {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.json-table__toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 16px 0;
  flex-shrink: 0;
}

.json-table__toolbar-left,
.json-table__toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.json-table__body {
  flex: 1;
  overflow: hidden;
}

.json-table__pagination {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0 0 0;
  flex-shrink: 0;
}
</style>
