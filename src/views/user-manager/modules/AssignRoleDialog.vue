<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getUserRoles, assignUserRoles, getRoleOptions, type RoleOption } from '@/api/user/role'
import type { User } from '@/api/user/types'

// -----------------------------------------------------------------------
// Props & Emits
// -----------------------------------------------------------------------
interface Props {
    modelValue: boolean
    user: User | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'update:modelValue', val: boolean): void
    (e: 'success'): void
}>()

// -----------------------------------------------------------------------
// 状态
// -----------------------------------------------------------------------
const loading = ref(false)
const saving = ref(false)
const roleOptions = ref<RoleOption[]>([])
const selectedRoleIds = ref<number[]>([])

// -----------------------------------------------------------------------
// 监听弹窗打开
// -----------------------------------------------------------------------
watch(
    () => props.modelValue,
    async (visible) => {
        if (visible && props.user) {
            await loadData()
        }
    }
)

async function loadData() {
    loading.value = true
    try {
        const [options, assigned] = await Promise.all([
            getRoleOptions(),
            getUserRoles(props.user!.id)
        ])
        roleOptions.value = options
        selectedRoleIds.value = assigned
    } catch {
        ElMessage.error('加载角色数据失败')
    } finally {
        loading.value = false
    }
}

// -----------------------------------------------------------------------
// 保存
// -----------------------------------------------------------------------
async function handleSave() {
    saving.value = true
    try {
        await assignUserRoles(props.user!.id, selectedRoleIds.value)
        ElMessage.success('角色分配成功')
        emit('success')
        handleClose()
    } catch {
        ElMessage.error('角色分配失败')
    } finally {
        saving.value = false
    }
}

function handleClose() {
    emit('update:modelValue', false)
    selectedRoleIds.value = []
}
</script>

<template>
    <el-dialog
        :model-value="modelValue"
        :title="`分配角色 - ${user?.name ?? ''}`"
        width="480px"
        :close-on-click-modal="false"
        @close="handleClose"
    >
        <div v-loading="loading" class="role-assign-body">
            <p class="tip">请选择要为该用户分配的角色（可多选）</p>

            <el-checkbox-group v-model="selectedRoleIds" class="role-list">
                <el-checkbox
                    v-for="role in roleOptions"
                    :key="role.id"
                    :value="role.id"
                    class="role-item"
                >
                    <div class="role-info">
                        <span class="role-name">{{ role.name }}</span>
                        <el-tag size="small" type="info">{{ role.code }}</el-tag>
                    </div>
                </el-checkbox>
            </el-checkbox-group>

            <el-empty v-if="!loading && roleOptions.length === 0" description="暂无可用角色" />
        </div>

        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" :loading="saving" @click="handleSave">
                保存分配
            </el-button>
        </template>
    </el-dialog>
</template>

<style scoped lang="scss">
.role-assign-body {
    min-height: 120px;

    .tip {
        margin: 0 0 16px;
        font-size: 13px;
        color: var(--el-text-color-secondary);
    }

    .role-list {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .role-item {
            height: auto;
            padding: 10px 14px;
            border-radius: 8px;
            border: 1px solid var(--el-border-color-lighter);
            width: 100%;
            transition: all 0.2s;
            margin-right: 0;

            &:hover {
                border-color: var(--el-color-primary-light-5);
                background-color: var(--el-color-primary-light-9);
            }

            :deep(.el-checkbox__label) {
                width: 100%;
            }
        }

        .role-info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;

            .role-name {
                font-size: 14px;
                font-weight: 500;
                color: var(--el-text-color-primary);
            }
        }
    }
}
</style>
