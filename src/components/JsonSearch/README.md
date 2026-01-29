# JsonSearch 搜索组件

基于 JSON 配置驱动的搜索表单组件，支持自动折叠、响应式布局和多种表单控件。

## 基础用法

```vue
<script setup lang="ts">
import JsonSearch from '@/components/JsonSearch'
import type { SearchSchema } from '@/components/JsonSearch'

const schema: SearchSchema = {
  items: [
    { prop: 'name', label: '名称', type: 'input' },
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

const handleSearch = (params) => {
  console.log('查询参数:', params)
}

const handleReset = () => {
  console.log('重置')
}
</script>

<template>
  <JsonSearch 
    :schema="schema" 
    @search="handleSearch"
    @reset="handleReset"
  />
</template>
```

## SearchSchema 配置

| 属性 | 类型 | 说明 |
|Data | Type | Description |
| items | `SearchItem[]` | 搜索项配置数组 |
| labelWidth | `string` | 标签宽度 |
| defaultExpand | `boolean` | 是否默认展开（默认 false） |
| searchText | `string` | 查询按钮文案 |
| resetText | `string` | 重置按钮文案 |

## SearchItem 配置

| 属性 | 类型 | 说明 |
|Data | Type | Description |
| prop | `string` | 字段名 |
| label | `string` | 标签名 |
| type | `string` | `input` / `select` / `date` / `daterange` / `cascader` / `slot` |
| placeholder | `string` | 占位符 |
| defaultValue | `any` | 默认值 |
| width | `string/number` | 控件宽度 |
| options | `SelectOption[]` | 选项数据 (select/cascader) |
| hidden | `boolean` | 是否隐藏 |

## Events

| 事件名 | 说明 | 回调参数 |
|Event | Description | Callback Params |
| search | 点击查询时触发 | `(params: Record<string, any>)` |
| reset | 点击重置时触发 | `-` |
