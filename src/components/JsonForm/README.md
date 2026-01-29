# JsonForm 表单组件

基于 JSON Schema 驱动的动态表单组件，内置了布局控制和常用的表单验证逻辑，通常与 `JsonDialog` 配合使用实现弹窗编辑。

## 基础用法

```vue
<script setup lang="ts">
import JsonForm, { type FormSchema } from '@/components/JsonForm'
import { ref } from 'vue'

const formData = ref({})
const schema: FormSchema = {
  items: [
    { 
      prop: 'username', 
      label: '用户名', 
      type: 'input', 
      rules: [{ required: true, message: '必填' }] 
    },
    {
      prop: 'age',
      label: '年龄',
      type: 'number',
      min: 0
    }
  ]
}

const formRef = ref()
const submit = async () => {
  const valid = await formRef.value.validate()
  if (valid) {
    console.log(formData.value)
  }
}
</script>

<template>
  <JsonForm
    ref="formRef"
    :schema="schema"
    v-model="formData"
  />
</template>
```

## FormSchema 配置

| 属性 | 类型 | 说明 |
|Data | Type | Description |
| items | `FormItem[]` | 表单项配置 |
| labelWidth | `string` | 标签宽度 (默认 '100px') |
| labelPosition | `string` | 标签位置 (left/right/top) |
| showActions | `boolean` | 是否显示底部按钮 (默认 false) |

## FormItem 配置

| 属性 | 类型 | 说明 |
|Data | Type | Description |
| prop | `string` | 字段名 |
| label | `string` | 标签名 |
| type | `string` | `input` / `number` / `select` / `radio` / `switch` / `date` / `slot` |
| rules | `Rule[]` | 验证规则 |
| span | `number` | 栅格占位 (1-24) |
| options | `SelectOption[]` | 选项数据 |
| slotName | `string` | 自定义插槽名 |

## Methods (Expose)

| 方法名 | 说明 |
|Method | Description |
| validate | 执行表单验证，返回 Promise<boolean> |
| resetFields | 重置表单并移除校验结果 |
| clearValidate | 清除校验结果 |
