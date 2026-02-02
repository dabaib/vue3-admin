<script setup lang="ts">
/**
 * 角色表单组件
 * @description 用于新增/编辑角色的弹窗表单
 */
import { ref, watch, nextTick, computed } from 'vue'
import { ElMessage } from 'element-plus'
import JsonDialog from '@/components/JsonDialog'
import JsonForm from '@/components/JsonForm'
import type { FormSchema } from '@/components/JsonForm'
import { createRole, updateRole } from '@/api/role'
import type { Role, RoleFormData } from '@/api/role'

// Props
const props = defineProps<{
  modelValue: boolean
  editData?: Role | null
}>()

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}>()

// 组件引用
const formRef = ref()

// 状态
const confirmLoading = ref(false)
const formData = ref<RoleFormData>({
  name: '',
  code: '',
  status: 'enable',
  sort: 0,
  remark: ''
})

// 计算属性 - 弹窗标题
const dialogTitle = computed(() => props.editData ? '编辑角色' : '新增角色')

// 表单配置
const formSchema: FormSchema = {
  labelWidth: '100px',
  items: [
    {
      prop: 'name',
      label: '角色名称',
      type: 'input',
      placeholder: '请输入角色名称',
      rules: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
    },
    {
      prop: 'code',
      label: '角色编码',
      type: 'input',
      placeholder: '请输入角色编码，如 ROLE_ADMIN',
      rules: [{ required: true, message: '请输入角色编码', trigger: 'blur' }]
    },
    {
      prop: 'sort',
      label: '排序',
      type: 'number',
      min: 0,
      defaultValue: 0
    },
    {
      prop: 'status',
      label: '状态',
      type: 'radio',
      options: [
        { label: '启用', value: 'enable' },
        { label: '禁用', value: 'disable' }
      ],
      defaultValue: 'enable'
    },
    {
      prop: 'remark',
      label: '备注',
      type: 'textarea',
      rows: 3,
      placeholder: '请输入备注信息'
    }
  ]
}

// 监听编辑数据变化，回填表单
watch(() => props.editData, (data) => {
  if (data) {
    formData.value = {
      id: data.id,
      name: data.name,
      code: data.code,
      status: data.status,
      sort: data.sort,
      remark: data.remark || ''
    }
  } else {
    // 重置表单
    formData.value = {
      name: '',
      code: '',
      status: 'enable',
      sort: 0,
      remark: ''
    }
  }
}, { immediate: true })

// 弹窗打开时清除验证
watch(() => props.modelValue, (visible) => {
  if (visible) {
    nextTick(() => formRef.value?.clearValidate())
  }
})

// 保存角色
const handleSave = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  confirmLoading.value = true
  try {
    if (props.editData) {
      // 编辑
      await updateRole(props.editData.id, formData.value)
      ElMessage.success('角色更新成功')
    } else {
      // 新增
      await createRole(formData.value)
      ElMessage.success('角色创建成功')
    }
    emit('update:modelValue', false)
    emit('success')
  } catch (error) {
    // 错误已在拦截器中处理
  } finally {
    confirmLoading.value = false
  }
}
</script>

<template>
  <JsonDialog
    :model-value="modelValue"
    :title="dialogTitle"
    :confirm-loading="confirmLoading"
    width="500px"
    @update:model-value="emit('update:modelValue', $event)"
    @confirm="handleSave"
  >
    <JsonForm
      ref="formRef"
      :schema="formSchema"
      v-model="formData"
    />
  </JsonDialog>
</template>

<style scoped lang="scss">
/* 组件样式 */
</style>
