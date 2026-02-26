<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getMenuTree, getRolePermissions, updateRolePermissions } from '@/api/role'

// Props & Emits
const props = defineProps<{
  roleId: string
}>()

const visible = defineModel<boolean>({ default: false })

// 状态
const treeRef = ref()
const loading = ref(false)
const saveLoading = ref(false)
const menuTreeData = ref<any[]>([])
const checkedKeys = ref<string[]>([])
const expandAll = ref(true)
const checkAll = ref(false)

// Tree 配置
const treeProps = {
  children: 'children',
  label: 'label'
}

// 加载菜单树和角色权限
const loadData = async () => {
  if (!props.roleId) return
  loading.value = true
  try {
    const [tree, permissions] = await Promise.all([
      getMenuTree(),
      getRolePermissions(props.roleId)
    ])
    menuTreeData.value = tree
    checkedKeys.value = permissions
    // 设置选中状态（仅设置叶子节点）
    treeRef.value?.setCheckedKeys(permissions)
  } finally {
    loading.value = false
  }
}

// 监听抽屉打开
watch(visible, (val) => {
  if (val) loadData()
})

// 全选 / 取消全选
const handleCheckAll = (val: boolean) => {
  if (val) {
    const allKeys = getAllKeys(menuTreeData.value)
    treeRef.value?.setCheckedKeys(allKeys)
  } else {
    treeRef.value?.setCheckedKeys([])
  }
}

// 展开 / 折叠
const handleExpandAll = (val: boolean) => {
  const nodes = treeRef.value?.store?.nodesMap || {}
  Object.values(nodes).forEach((node: any) => {
    node.expanded = val
  })
}

// 获取所有节点 key
const getAllKeys = (data: any[]): string[] => {
  const keys: string[] = []
  const traverse = (items: any[]) => {
    items.forEach(item => {
      keys.push(item.id)
      if (item.children) traverse(item.children)
    })
  }
  traverse(data)
  return keys
}

// 保存权限
const handleSave = async () => {
  const checkedNodes = treeRef.value?.getCheckedKeys(false) || []
  const halfChecked = treeRef.value?.getHalfCheckedKeys() || []
  const allKeys = [...checkedNodes, ...halfChecked]

  saveLoading.value = true
  try {
    await updateRolePermissions(props.roleId, allKeys)
    ElMessage.success('权限保存成功')
    visible.value = false
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : '保存失败'
    ElMessage.error(msg)
  } finally {
    saveLoading.value = false
  }
}
</script>

<template>
  <el-drawer
    v-model="visible"
    title="权限配置"
    size="400px"
    :close-on-click-modal="false"
    :destroy-on-close="false"
  >
    <!-- 操作栏 -->
    <div class="permission-toolbar">
      <el-checkbox v-model="expandAll" @change="handleExpandAll">展开/折叠</el-checkbox>
      <el-checkbox v-model="checkAll" @change="handleCheckAll">全选/取消</el-checkbox>
    </div>

    <!-- 权限树 -->
    <div v-loading="loading" class="permission-tree">
      <el-tree
        ref="treeRef"
        :data="menuTreeData"
        :props="treeProps"
        node-key="id"
        show-checkbox
        :default-expand-all="true"
        :default-checked-keys="checkedKeys"
        :check-strictly="false"
      />
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="saveLoading" @click="handleSave">
        保存
      </el-button>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss">
.permission-toolbar {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.permission-tree {
  min-height: 200px;
}
</style>
