# JsonDialog 弹窗组件

对 Element Plus `el-dialog` 的二次封装，提供统一的样式、loading 状态和确认/取消按钮逻辑。

## 基础用法

```vue
<script setup lang="ts">
import JsonDialog from '@/components/JsonDialog'
import { ref } from 'vue'

const visible = ref(false)
const loading = ref(false)

const handleConfirm = async () => {
  loading.value = true
  await saveData()
  visible.value = false
  loading.value = false
}
</script>

<template>
  <JsonDialog
    v-model="visible"
    title="编辑用户"
    :confirm-loading="loading"
    @confirm="handleConfirm"
  >
    表单内容...
  </JsonDialog>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|Data | Type | Default | Description |
| modelValue | `boolean` | - | 是否显示 (v-model) |
| title | `string` | '提示' | 弹窗标题 |
| width | `string/number` | '50%' | 弹窗宽度 |
| confirmLoading | `boolean` | false | 确认按钮 loading 状态 |
| confirmText | `string` | '保存' | 确认按钮文案 |
| cancelText | `string` | '取消' | 取消按钮文案 |
| showClose | `boolean` | true | 是否显示关闭图标 |
| closeOnClickModal | `boolean` | false | 点击遮罩是否关闭 |

## Events

| 事件名 | 说明 |
|Event | Description |
| confirm | 点击确认/保存按钮时触发 |
| cancel | 点击取消或关闭时触发 |
| open / close | element-plus 原生事件 |

## Slots

- `default`: 弹窗内容区域
- `footer`: 自定义底部按钮区域
