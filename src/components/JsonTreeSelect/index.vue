<script setup lang="ts">
import { computed } from 'vue'

interface Option {
  label: string
  value: string | number | boolean
  children?: Option[]
  disabled?: boolean
  [key: string]: any
}

const props = withDefaults(defineProps<{
  modelValue?: string | number | boolean | string[] | number[] | boolean[]
  data?: Option[]
  placeholder?: string
  multiple?: boolean
  clearable?: boolean
  disabled?: boolean
  checkStrictly?: boolean
  filterable?: boolean
}>(), {
  data: () => [],
  placeholder: '请选择',
  clearable: true,
  checkStrictly: true // 默认 true，允许选择任意节点
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | boolean | string[] | number[] | boolean[]): void
  (e: 'change', value: string | number | boolean | string[] | number[] | boolean[]): void
}>()

const value = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val!)
    emit('change', val!)
  }
})
</script>

<template>
  <el-tree-select
    v-model="value"
    :data="data"
    :render-after-expand="false"
    :placeholder="placeholder"
    :multiple="multiple"
    :clearable="clearable"
    :disabled="disabled"
    :check-strictly="checkStrictly"
    :filterable="filterable"
    style="width: 100%"
  />
</template>
