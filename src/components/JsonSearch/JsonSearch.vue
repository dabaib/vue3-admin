<script setup lang="ts">
import { computed, ref, reactive, watch, onMounted, onUnmounted, nextTick } from 'vue'
import type { SearchSchema, SearchItem, SelectOption } from './types'

// Props
const props = withDefaults(defineProps<{
  // 查询配置
  schema: SearchSchema
  // 表单数据（v-model）
  modelValue?: Record<string, any>
}>(), {
  modelValue: () => ({})
})

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void
  (e: 'search', value: Record<string, any>): void
  (e: 'reset'): void
}>()

// 内部表单数据
const formData = reactive<Record<string, any>>({})

// 是否展开
const isExpanded = ref(props.schema.defaultExpand ?? false)

// 是否需要显示展开按钮（超过一行）
const showExpandBtn = ref(false)

// 折叠状态下最多显示的 item 数量
const maxVisibleItems = ref(Infinity)

// 查询区域引用
const searchFormRef = ref<HTMLElement>()
const formItemsRef = ref<HTMLElement>()
const actionsRef = ref<HTMLElement>()

// 所有可见的查询项配置
const allVisibleItems = computed(() => {
  return props.schema.items.filter(item => !item.hidden)
})

// 实际渲染的查询项（根据折叠状态截断）
const renderItems = computed(() => {
  if (isExpanded.value) {
    return allVisibleItems.value
  }
  // 折叠状态下，只显示计算出的最大数量
  // 如果 maxVisibleItems 为 0 (极端情况)，至少显示 1 个，除非真没空间
  return allVisibleItems.value.slice(0, Math.max(1, maxVisibleItems.value))
})

// 是否显示重置按钮（2个以上查询项）
const showResetBtn = computed(() => {
  return allVisibleItems.value.length >= 2
})

// 计算折叠逻辑
const checkNeedCollapse = () => {
  nextTick(() => {
    if (!formItemsRef.value || !searchFormRef.value) return
    
    // 获取容器宽度 (减去 padding)
    const containerWidth = searchFormRef.value.clientWidth - 32 
    
    // 获取操作按钮区域宽度 (估算或实际获取)
    // 即使在隐藏状态下，我们也需要知道它大概多宽
    let actionsWidth = 0
    if (actionsRef.value) {
      actionsWidth = actionsRef.value.offsetWidth
    }
    // 如果获取不到（比如被隐藏），给一个预估值：查询(70) + 重置(70) + 展开(50) + gap(16)
    if (actionsWidth === 0) {
      actionsWidth = 70 + (showResetBtn.value ? 78 : 0) + 60
    }
    
    // 加上安全余量
    actionsWidth += 20 

    let currentWidth = 0
    let count = 0
    let hasMultiLine = false
    
    // 遍历所有 items 计算第一行能放几个
    for (const item of allVisibleItems.value) {
      // 获取 item 宽度
      const itemWidthStr = getItemWidth(item)
      const itemWidth = parseInt(itemWidthStr as string) || 220
      
      // 加上 gap (16px)
      const itemTotalWidth = itemWidth + 16
      
      // 检查加入这个 item 后，是否还能放下 actions
      if (currentWidth + itemTotalWidth + actionsWidth > containerWidth) {
        // 放不下了，说明这行满了
        hasMultiLine = true
        // 如果是第一个都放不下，那也得放一个
        if (count === 0) count = 1
        break
      }
      
      currentWidth += itemTotalWidth
      count++
    }
    
    // 如果没遍历完 items 就停了，说明需要折叠
    if (count < allVisibleItems.value.length) {
      hasMultiLine = true
    } else {
      // 如果 items 都放得下，检查加上 actions 是否换行
      // 其实上面的循环已经涵盖了大部分情况，但这里再次确认
      if (currentWidth + actionsWidth > containerWidth) {
        hasMultiLine = true
      }
    }

    showExpandBtn.value = hasMultiLine
    
    // 更新折叠时显示的个数
    // 如果需要折叠，就只显示算出来的 count 个
    // 如果不需要折叠，就显示所有
    if (hasMultiLine) {
      maxVisibleItems.value = count
    } else {
      maxVisibleItems.value = allVisibleItems.value.length
    }
  })
}

// 初始化表单数据
const initFormData = () => {
  props.schema.items.forEach(item => {
    if (item.defaultValue !== undefined) {
      formData[item.prop] = item.defaultValue
    } else if (props.modelValue[item.prop] !== undefined) {
      formData[item.prop] = props.modelValue[item.prop]
    } else {
      // 设置默认空值
      switch (item.type) {
        case 'select':
          formData[item.prop] = item.multiple ? [] : undefined
          break
        case 'cascader':
          formData[item.prop] = []
          break
        case 'switch':
          formData[item.prop] = false
          break
        case 'daterange':
        case 'datetimerange':
          formData[item.prop] = []
          break
        default:
          formData[item.prop] = undefined
      }
    }
  })
}

// 监听外部 modelValue 变化
watch(() => props.modelValue, (newVal) => {
  Object.assign(formData, newVal)
}, { deep: true })

// 同步内部数据到外部
watch(formData, (newVal) => {
  emit('update:modelValue', { ...newVal })
}, { deep: true })

// 处理查询
const handleSearch = () => {
  emit('search', { ...formData })
}

// 处理重置
const handleReset = () => {
  props.schema.items.forEach(item => {
    if (item.defaultValue !== undefined) {
      formData[item.prop] = item.defaultValue
    } else {
      switch (item.type) {
        case 'select':
          formData[item.prop] = item.multiple ? [] : undefined
          break
        case 'cascader':
          formData[item.prop] = []
          break
        case 'switch':
          formData[item.prop] = false
          break
        case 'daterange':
        case 'datetimerange':
          formData[item.prop] = []
          break
        default:
          formData[item.prop] = undefined
      }
    }
  })
  emit('reset')
}

// 切换展开/折叠
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// 获取项宽度
const getItemWidth = (item: SearchItem): string => {
  if (item.width) {
    return typeof item.width === 'number' ? `${item.width}px` : item.width
  }
  // 日期范围类型默认更宽
  if (item.type === 'daterange' || item.type === 'datetimerange') {
    return '360px'
  }
  return '220px'
}

// 获取占位符
const getPlaceholder = (item: SearchItem): string => {
  if (item.placeholder) return item.placeholder
  
  switch (item.type) {
    case 'input':
    case 'number':
      return `请输入${item.label}`
    case 'select':
    case 'cascader':
    case 'date':
    case 'datetime':
      return `请选择${item.label}`
    case 'daterange':
    case 'datetimerange':
      return ''
    default:
      return ''
  }
}

// 窗口大小变化时重新计算
const resizeObserver = ref<ResizeObserver>()

onMounted(() => {
  initFormData()
  checkNeedCollapse()
  
  // 监听容器大小变化
  if (searchFormRef.value) {
    resizeObserver.value = new ResizeObserver(() => {
      checkNeedCollapse()
    })
    resizeObserver.value.observe(searchFormRef.value)
  }
})

onUnmounted(() => {
  resizeObserver.value?.disconnect()
})

// 监听 items 变化
watch(() => props.schema.items, () => {
  checkNeedCollapse()
}, { deep: true })

// 暴露方法
defineExpose({
  search: handleSearch,
  reset: handleReset,
  getFormData: () => ({ ...formData })
})
</script>

<template>
  <div class="json-search" ref="searchFormRef">
    <div class="json-search__form">
      <div class="json-search__items" ref="formItemsRef">
        <!-- 渲染计算后的 items -->
        <template v-for="item in renderItems" :key="item.prop">
          <div 
            class="search-form-item"
            :style="{ width: getItemWidth(item) }"
          >
            <span class="search-form-item__label">{{ item.label }}</span>
            <div class="search-form-item__content">
              <!-- 输入框 -->
              <el-input
                v-if="item.type === 'input'"
                v-model="formData[item.prop]"
                :placeholder="getPlaceholder(item)"
                :clearable="item.clearable ?? true"
                @keyup.enter="handleSearch"
              />

              <!-- 数字输入 -->
              <el-input-number
                v-else-if="item.type === 'number'"
                v-model="formData[item.prop]"
                :placeholder="getPlaceholder(item)"
                :min="item.min"
                :max="item.max"
                :step="item.step ?? 1"
                controls-position="right"
                style="width: 100%"
              />

              <!-- 下拉选择 -->
              <el-select
                v-else-if="item.type === 'select'"
                v-model="formData[item.prop]"
                :placeholder="getPlaceholder(item)"
                :clearable="item.clearable ?? true"
                :multiple="item.multiple"
                :filterable="item.filterable"
                style="width: 100%"
              >
                <el-option
                  v-for="opt in item.options"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                  :disabled="opt.disabled"
                />
              </el-select>

              <!-- 级联选择 -->
              <el-cascader
                v-else-if="item.type === 'cascader'"
                v-model="formData[item.prop]"
                :options="item.options"
                :placeholder="getPlaceholder(item)"
                :clearable="item.clearable ?? true"
                :filterable="item.filterable"
                style="width: 100%"
              />

              <!-- 日期选择 -->
              <el-date-picker
                v-else-if="item.type === 'date'"
                v-model="formData[item.prop]"
                type="date"
                :placeholder="getPlaceholder(item)"
                :clearable="item.clearable ?? true"
                :format="item.format ?? 'YYYY-MM-DD'"
                :value-format="item.valueFormat ?? 'YYYY-MM-DD'"
                style="width: 100%"
              />

              <!-- 日期范围 -->
              <el-date-picker
                v-else-if="item.type === 'daterange'"
                v-model="formData[item.prop]"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="item.clearable ?? true"
                :format="item.format ?? 'YYYY-MM-DD'"
                :value-format="item.valueFormat ?? 'YYYY-MM-DD'"
                style="width: 100%"
              />

              <!-- 日期时间 -->
              <el-date-picker
                v-else-if="item.type === 'datetime'"
                v-model="formData[item.prop]"
                type="datetime"
                :placeholder="getPlaceholder(item)"
                :clearable="item.clearable ?? true"
                :format="item.format ?? 'YYYY-MM-DD HH:mm:ss'"
                :value-format="item.valueFormat ?? 'YYYY-MM-DD HH:mm:ss'"
                style="width: 100%"
              />

              <!-- 日期时间范围 -->
              <el-date-picker
                v-else-if="item.type === 'datetimerange'"
                v-model="formData[item.prop]"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :clearable="item.clearable ?? true"
                :format="item.format ?? 'YYYY-MM-DD HH:mm:ss'"
                :value-format="item.valueFormat ?? 'YYYY-MM-DD HH:mm:ss'"
                style="width: 100%"
              />

              <!-- 开关 -->
              <el-switch
                v-else-if="item.type === 'switch'"
                v-model="formData[item.prop]"
              />

              <!-- 自定义插槽 -->
              <slot
                v-else-if="item.type === 'slot' && item.slotName"
                :name="item.slotName"
                :item="item"
                :value="formData[item.prop]"
                :form-data="formData"
              />
            </div>
          </div>
        </template>

        <!-- 操作按钮（紧跟查询框后面） -->
        <div class="json-search__actions" ref="actionsRef">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            {{ schema.searchText || '查询' }}
          </el-button>
          <el-button v-if="showResetBtn" @click="handleReset">
            <el-icon><Refresh /></el-icon>
            {{ schema.resetText || '重置' }}
          </el-button>
          <el-button 
            v-if="showExpandBtn" 
            link 
            type="primary"
            @click="toggleExpand"
          >
            {{ isExpanded ? '收起' : '展开' }}
            <el-icon>
              <ArrowUp v-if="isExpanded" />
              <ArrowDown v-else />
            </el-icon>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.json-search {
  background-color: #fff;
  padding: 16px 16px 16px;
  border-radius: 8px 8px 0 0;
  flex-shrink: 0;
}

.json-search__form {
  display: flex;
  align-items: flex-start;
}

.json-search__items {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 16px;
}

.search-form-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.search-form-item__label {
  flex-shrink: 0;
  color: #606266;
  font-size: 14px;
  white-space: nowrap;
}

.search-form-item__content {
  flex: 1;
  min-width: 0;
}

.json-search__actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.json-search__actions .el-button + .el-button {
  margin-left: 8px;
}

/* 确保日期选择器不超出容器 */
:deep(.el-date-editor) {
  --el-date-editor-width: 100% !important;
}
</style>
