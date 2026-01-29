<script setup lang="ts">
import { reactive, watch, ref, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'
import type { FormSchema, FormItem, SelectOption } from './types'

const props = withDefaults(defineProps<{
  schema: FormSchema
  modelValue?: Record<string, any>
}>(), {
  modelValue: () => ({})
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void
  (e: 'submit', value: Record<string, any>): void
  (e: 'reset'): void
}>()

const formRef = ref<FormInstance>()
const formData = reactive<Record<string, any>>({})

// 初始化数据
const initFormData = () => {
  props.schema.items.forEach(item => {
    if (item.defaultValue !== undefined) {
      formData[item.prop] = item.defaultValue
    } else if (props.modelValue[item.prop] !== undefined) {
      formData[item.prop] = props.modelValue[item.prop]
    } else {
      // 默认空值策略
      switch (item.type) {
        case 'checkbox':
        case 'cascader':
        case 'daterange':
        case 'datetimerange':
          formData[item.prop] = []
          break
        case 'select':
          formData[item.prop] = item.multiple ? [] : undefined
          break
        case 'switch':
          formData[item.prop] = false
          break
        default:
          formData[item.prop] = undefined
      }
    }
  })
}

// 监听外部数据
watch(() => props.modelValue, (newVal) => {
  // 只更新不一样的值，避免循环
  Object.keys(newVal).forEach(key => {
    if (formData[key] !== newVal[key]) {
      formData[key] = newVal[key]
    }
  })
}, { deep: true })

// 同步内部数据
watch(formData, (newVal) => {
  emit('update:modelValue', { ...newVal })
}, { deep: true })

onMounted(() => {
  initFormData()
})

const getPlaceholder = (item: FormItem) => {
  if (item.placeholder) return item.placeholder
  if (['select', 'cascader', 'date', 'datetime', 'time'].includes(item.type)) {
    return `请选择${item.label}`
  }
  return `请输入${item.label}`
}

// 暴露方法
const validate = async () => {
  if (!formRef.value) return false
  return await formRef.value.validate()
}

const resetFields = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  emit('reset')
}

const clearValidate = (props?: string | string[]) => {
  formRef.value?.clearValidate(props)
}

defineExpose({
  ref: formRef,
  validate,
  resetFields,
  clearValidate,
  getFormData: () => ({ ...formData })
})

const handleSubmit = async () => {
  const valid = await validate()
  if (valid) {
    emit('submit', { ...formData })
  }
}
</script>

<template>
  <el-form
    ref="formRef"
    :model="formData"
    :label-width="schema.labelWidth ?? '100px'"
    :label-position="schema.labelPosition ?? 'right'"
    class="json-form"
  >
    <el-row :gutter="20">
      <template v-for="item in schema.items" :key="item.prop">
        <el-col 
          v-if="!item.hidden"
          :span="item.span ?? schema.defaultSpan ?? 24"
        >
          <el-form-item
            :label="item.label"
            :prop="item.prop"
            :rules="item.rules"
          >
            <!-- Input -->
            <el-input
              v-if="item.type === 'input'"
              v-model="formData[item.prop]"
              :placeholder="getPlaceholder(item)"
              :clearable="item.clearable ?? true"
              :disabled="item.disabled"
              :readonly="item.readonly"
            />
            
            <!-- Password -->
            <el-input
              v-else-if="item.type === 'password'"
              v-model="formData[item.prop]"
              type="password"
              show-password
              :placeholder="getPlaceholder(item)"
              :clearable="item.clearable ?? true"
              :disabled="item.disabled"
            />

            <!-- Textarea -->
            <el-input
              v-else-if="item.type === 'textarea'"
              v-model="formData[item.prop]"
              type="textarea"
              :rows="item.rows ?? 3"
              :placeholder="getPlaceholder(item)"
              :disabled="item.disabled"
            />

            <!-- Number -->
            <el-input-number
              v-else-if="item.type === 'number'"
              v-model="formData[item.prop]"
              :placeholder="getPlaceholder(item)"
              :min="item.min"
              :max="item.max"
              :step="item.step"
              :controls-position="'right'"
              :disabled="item.disabled"
              style="width: 100%"
            />

            <!-- Select -->
            <el-select
              v-else-if="item.type === 'select'"
              v-model="formData[item.prop]"
              :placeholder="getPlaceholder(item)"
              :multiple="item.multiple"
              :filterable="item.filterable"
              :clearable="item.clearable ?? true"
              :disabled="item.disabled"
              style="width: 100%"
            >
              <el-option
                v-for="opt in item.options"
                :key="String(opt.value)"
                :label="opt.label"
                :value="opt.value"
                :disabled="opt.disabled"
              />
            </el-select>

            <!-- Radio -->
            <el-radio-group
              v-else-if="item.type === 'radio'"
              v-model="formData[item.prop]"
              :disabled="item.disabled"
            >
              <el-radio
                v-for="opt in item.options"
                :key="String(opt.value)"
                :value="opt.value"
                :disabled="opt.disabled"
              >
                {{ opt.label }}
              </el-radio>
            </el-radio-group>
            
            <!-- Checkbox -->
             <el-checkbox-group
              v-else-if="item.type === 'checkbox'"
              v-model="formData[item.prop]"
              :disabled="item.disabled"
            >
              <el-checkbox
                v-for="opt in item.options"
                :key="String(opt.value)"
                :value="opt.value"
                :disabled="opt.disabled"
              >
                {{ opt.label }}
              </el-checkbox>
            </el-checkbox-group>

            <!-- Switch -->
            <el-switch
              v-else-if="item.type === 'switch'"
              v-model="formData[item.prop]"
              :disabled="item.disabled"
            />

            <!-- Date -->
            <el-date-picker
              v-else-if="item.type === 'date'"
              v-model="formData[item.prop]"
              type="date"
              :placeholder="getPlaceholder(item)"
              :format="item.format ?? 'YYYY-MM-DD'"
              :value-format="item.valueFormat ?? 'YYYY-MM-DD'"
              :clearable="item.clearable ?? true"
              :disabled="item.disabled"
              style="width: 100%"
            />

             <!-- DateTime -->
            <el-date-picker
              v-else-if="item.type === 'datetime'"
              v-model="formData[item.prop]"
              type="datetime"
              :placeholder="getPlaceholder(item)"
              :format="item.format ?? 'YYYY-MM-DD HH:mm:ss'"
              :value-format="item.valueFormat ?? 'YYYY-MM-DD HH:mm:ss'"
              :clearable="item.clearable ?? true"
              :disabled="item.disabled"
              style="width: 100%"
            />

            <!-- Slot -->
            <slot
              v-else-if="item.type === 'slot' && item.slotName"
              :name="item.slotName"
              :item="item"
              :value="formData[item.prop]"
              :form-data="formData"
            />
          </el-form-item>
        </el-col>
      </template>

      <!-- Actions -->
      <el-col v-if="schema.showActions" :span="24">
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">
            {{ schema.submitText ?? '保存' }}
          </el-button>
          <el-button @click="resetFields">
            {{ schema.resetText ?? '重置' }}
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
