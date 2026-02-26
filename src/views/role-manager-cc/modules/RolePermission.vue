<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { Role } from '@/api/role/types'
import { getRolePermissions, updateRolePermissions, getMenuTree } from '@/api/role'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    roleId: string
  }>(),
  {
    modelValue: false,
    roleId: ''
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const loading = ref(false)
const saving = ref(false)
const menuTree = ref<any[]>([])
const checkedKeys = ref<string[]>([])
const treeRef = ref()

// 抽屉标题
const drawerTitle = computed(() => {
  return '权限配置'
})

// 加载数据
const loadData = async () => {
  if (!props.roleId) return

  loading.value = true
  try {
    const [menuData, permissions] = await Promise.all([
      getMenuTree(),
      getRolePermissions(props.roleId)
    ])
    menuTree.value = menuData
    checkedKeys.value = permissions
  } catch (error) {
    console.error('加载权限数据失败:', error)
    ElMessage.error('加载权限数据失败')
  } finally {
    loading.value = false
  }
}

// 监听抽屉打开
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      loadData()
    }
  }
)

// 全选/取消全选
const handleCheckAll = (checked: boolean) => {
  if (checked) {
    const getAllKeys = (nodes: any[]): string[] => {
      const keys: string[] = []
      nodes.forEach((node) => {
        keys.push(node.id)
        if (node.children) {
          keys.push(...getAllKeys(node.children))
        }
      })
      return keys
    }
    checkedKeys.value = getAllKeys(menuTree.value)
  } else {
    checkedKeys.value = []
  }
}

// 展开/折叠
const expandAll = ref(false)
const handleExpandAll = () => {
  expandAll.value = !expandAll.value
  const nodes = treeRef.value?.store.nodesMap
  if (nodes) {
    Object.values(nodes).forEach((node: any) => {
      node.expanded = expandAll.value
    })
  }
}

// 保存权限
const handleSave = async () => {
  if (!props.roleId) return

  saving.value = true
  try {
    // 获取半选状态的父节点
    const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys() || []
    // 获取全选状态的节点
    const fullyCheckedKeys = treeRef.value?.getCheckedKeys() || []
    // 合并所有选中的节点
    const allCheckedKeys = [...fullyCheckedKeys, ...halfCheckedKeys]

    await updateRolePermissions(props.roleId, allCheckedKeys)
    ElMessage.success('保存成功')
    visible.value = false
  } catch (error) {
    console.error('保存权限失败:', error)
    ElMessage.error('保存权限失败')
  } finally {
    saving.value = false
  }
}

// 树形配置
const treeProps = {
  children: 'children',
  label: 'label'
}
</script>

<template>
  <el-drawer
    v-model="visible"
    :title="drawerTitle"
    size="500px"
    :close-on-click-modal="false"
  >
    <div v-loading="loading" class="permission-drawer">
      <!-- 工具栏 -->
      <div class="toolbar">
        <el-button size="small" @click="handleCheckAll(true)">
          全选
        </el-button>
        <el-button size="small" @click="handleCheckAll(false)">
          取消全选
        </el-button>
        <el-button size="small" @click="handleExpandAll">
          {{ expandAll ? '全部折叠' : '全部展开' }}
        </el-button>
      </div>

      <!-- 权限树 -->
      <div class="tree-wrapper">
        <el-tree
          ref="treeRef"
          :data="menuTree"
          :props="treeProps"
          :default-checked-keys="checkedKeys"
          :default-expand-all="false"
          show-checkbox
          node-key="id"
        />
      </div>

      <!-- 底部按钮 -->
      <div class="footer">
        <el-button @click="visible = false">
          取消
        </el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">
          保存
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped lang="scss">
.permission-drawer {
  height: 100%;
  display: flex;
  flex-direction: column;

  .toolbar {
    flex-shrink: 0;
    margin-bottom: 16px;
  }

  .tree-wrapper {
    flex: 1;
    overflow-y: auto;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    padding: 12px;

    :deep(.el-tree) {
      background: transparent;
    }

    :deep(.el-tree-node__content) {
      &:hover {
        background-color: var(--el-fill-color-light);
      }
    }
  }

  .footer {
    flex-shrink: 0;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 16px;
    border-top: 1px solid var(--el-border-color);
    margin-top: 16px;
  }
}
</style>
