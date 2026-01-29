<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  width?: string | number
  top?: string
  fullscreen?: boolean
  modal?: boolean
  appendToBody?: boolean
  lockScroll?: boolean
  customClass?: string
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  center?: boolean
  destroyOnClose?: boolean
  confirmLoading?: boolean
  confirmText?: string
  cancelText?: string
}>(), {
  title: '提示',
  width: '50%',
  top: '15vh',
  fullscreen: false,
  modal: true,
  appendToBody: false,
  lockScroll: true,
  closeOnClickModal: false, // 默认改为 false，防止误触关闭
  closeOnPressEscape: true,
  showClose: true,
  center: false,
  destroyOnClose: false,
  confirmLoading: false,
  confirmText: '保存', // 遵循计划，默认“保存”
  cancelText: '取消'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'open'): void
  (e: 'opened'): void
  (e: 'close'): void
  (e: 'closed'): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  visible.value = false
  emit('cancel')
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :top="top"
    :fullscreen="fullscreen"
    :modal="modal"
    :append-to-body="appendToBody"
    :lock-scroll="lockScroll"
    :class="customClass"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="showClose"
    :center="center"
    :destroy-on-close="destroyOnClose"
    @open="emit('open')"
    @opened="emit('opened')"
    @close="emit('close')"
    @closed="emit('closed')"
  >
    <div class="json-dialog-body">
      <slot />
    </div>

    <template #footer>
      <slot name="footer">
        <div class="dialog-footer">
          <el-button @click="handleCancel">
            {{ cancelText }}
          </el-button>
          <el-button 
            type="primary" 
            :loading="confirmLoading"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </el-button>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
