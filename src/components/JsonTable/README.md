# JsonTable 表格组件

基于 JSON 配置驱动的通用表格组件，集成了分页、工具栏、操作列和数据加载逻辑。

## 基础用法

```vue
<script setup lang="ts">
import JsonTable from '@/components/JsonTable'
import type { TableSchema } from '@/components/JsonTable'

const schema: TableSchema = {
  columns: [
    { prop: 'name', label: '名称' },
    { prop: 'date', label: '日期', width: 180 }
  ],
  actionColumn: {
    buttons: [{ text: '编辑', event: 'edit' }]
  }
}

const fetchData = async (params) => {
  // 返回 { list: [], total: 0 }
  return await api.getList(params)
}
</script>

<template>
  <JsonTable 
    :schema="schema" 
    :fetch-data="fetchData" 
  />
</template>
```

## TableSchema 配置

| 属性 | 类型 | 说明 |
|Data | Type | Description |
| columns | `TableColumn[]` | 列配置数组 |
| actionColumn | `ActionColumn` | 操作列配置 |
| pagination | `Pagination` | 分页配置 (pageSize 等) |
| rowKey | `string` | 行唯一键 (默认 'id') |

## TableColumn 配置

| 属性 | 类型 | 说明 |
|Data | Type | Description |
| prop | `string` | 字段名 |
| label | `string` | 表头名称 |
| width | `number` | 列宽 |
| type | `string` | `selection` / `index` / `expand` |
| render | `string` | `tag` / `image` / `link` / `switch` |
| sortable | `boolean` | 是否可排序 |

## Slots 插槽

- `toolbar-left`: 表格左上角工具栏 (常用于放“新增”按钮)
- `toolbar-right`: 表格右上角工具栏 (常用于放“导出”按钮)
- `col-[prop]`: 自定义列内容插槽
