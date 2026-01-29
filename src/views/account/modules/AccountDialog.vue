<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import JsonDialog from '@/components/JsonDialog'
import JsonForm, { type FormSchema } from '@/components/JsonForm'

const emit = defineEmits(['success'])

// -----------------------------------------------------------------------------
// 状态定义
// -----------------------------------------------------------------------------
const visible = ref(false)
const title = ref('')
const type = ref<'add' | 'edit'>('add')
const loading = ref(false)
const formData = ref<Record<string, any>>({})
const formRef = ref()

// -----------------------------------------------------------------------------
// 表单配置
// -----------------------------------------------------------------------------
const formSchema: FormSchema = {
  labelWidth: '80px',
  items: [
    { 
      prop: 'username', 
      label: '用户名', 
      type: 'input', 
      rules: [{ required: true, message: '请输入用户名', trigger: 'blur' }] 
    },
    { 
      prop: 'realName', 
      label: '真实姓名', 
      type: 'input',
      rules: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }]
    },
    { 
      prop: 'phone', 
      label: '手机号', 
      type: 'input',
      rules: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
      ]
    },
    { 
      prop: 'role', 
      label: '角色', 
      type: 'select',
      options: [
        { label: '管理员', value: 'admin' },
        { label: '编辑', value: 'editor' },
        { label: '普通用户', value: 'user' }
      ],
      rules: [{ required: true, message: '请选择角色', trigger: 'change' }]
    },
    { 
      prop: 'department', 
      label: '部门', 
      type: 'select',
      options: [
        { label: '研发部', value: '研发部' },
        { label: '市场部', value: '市场部' },
        { label: '运营部', value: '运营部' }
      ],
      rules: [{ required: true, message: '请选择部门', trigger: 'change' }]
    },
    { 
      prop: 'status', 
      label: '状态', 
      type: 'switch',
      defaultValue: 1
    }
  ]
}

// -----------------------------------------------------------------------------
// 方法暴露
// -----------------------------------------------------------------------------
const open = (operationType: 'add' | 'edit', row?: any) => {
  type.value = operationType
  title.value = operationType === 'add' ? '新增用户' : '编辑用户'
  
  if (operationType === 'add') {
    formData.value = {}
  } else {
    formData.value = { ...row }
  }
  
  visible.value = true
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

defineExpose({ open })

// -----------------------------------------------------------------------------
// 事件处理
// -----------------------------------------------------------------------------
const handleConfirm = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  loading.value = true
  try {
    // 模拟 API 请求
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 将数据回传给父组件处理，或者在这里直接调用 API
    // 既然重构，建议保持数据流单纯，这里只负责收集数据传出，或者这里作为业务单元处理完通知刷新
    // 鉴于原逻辑是在父组件处理 mockData，这里我们传出数据让父组件更新 mockData (模拟)
    // 实际项目中通常是这里调用 add/update API，然后 emit('success') 让父组件刷新列表
    
    emit('success', { type: type.value, data: formData.value })
    
    visible.value = false
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <JsonDialog
    v-model="visible"
    :title="title"
    :confirm-loading="loading"
    width="500px"
    @confirm="handleConfirm"
  >
    <JsonForm
      ref="formRef"
      :schema="formSchema"
      v-model="formData"
    />
  </JsonDialog>
</template>
