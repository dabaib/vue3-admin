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
  labelWidth: '100px',
  items: [
    { 
      prop: 'roleName', 
      label: '角色名称', 
      type: 'input',
      rules: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
    },
    { 
      prop: 'roleKey', 
      label: '角色标识', 
      type: 'input',
      placeholder: '用于权限验证，如 admin',
      rules: [
        { required: true, message: '请输入角色标识', trigger: 'blur' },
        { pattern: /^[a-z_]+$/, message: '只能包含小写字母和下划线', trigger: 'blur' }
      ]
    },
    { 
      prop: 'sort', 
      label: '显示顺序', 
      type: 'number',
      min: 0,
      defaultValue: 0
    },
    { 
      prop: 'status', 
      label: '状态', 
      type: 'radio',
      options: [
        { label: '正常', value: 1 },
        { label: '停用', value: 0 }
      ],
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
// 方法暴露
// -----------------------------------------------------------------------------
const open = (operationType: 'add' | 'edit', row?: any) => {
  type.value = operationType
  title.value = operationType === 'add' ? '新增角色' : '编辑角色'
  
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
      @submit="handleConfirm"
    />
  </JsonDialog>
</template>
