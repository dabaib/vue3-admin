<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import JsonForm, { type FormSchema } from '@/components/JsonForm'

const formData = ref({})
const formRef = ref()

const schema: FormSchema = {
  labelWidth: '120px',
  items: [
    { prop: 'name', label: '姓名', type: 'input', rules: [{ required: true, message: '必填' }] },
    { prop: 'age', label: '年龄', type: 'number', min: 0, max: 100 },
    { 
      prop: 'role', 
      label: '角色', 
      type: 'select', 
      options: [
        { label: '管理员', value: 'admin' },
        { label: '用户', value: 'user' }
      ]
    },
    { prop: 'enable', label: '启用', type: 'switch' }
  ],
  showActions: true
}

const handleSubmit = (data: any) => {
  ElMessage.success('提交成功: ' + JSON.stringify(data))
}
</script>

<template>
  <div class="demo-card">
    <h3>JsonForm 演示</h3>
    <JsonForm
      ref="formRef"
      :schema="schema"
      v-model="formData"
      @submit="handleSubmit"
    />
  </div>
</template>

<style scoped>
.demo-card {
  padding: 20px;
  background: #fff;
}
</style>
