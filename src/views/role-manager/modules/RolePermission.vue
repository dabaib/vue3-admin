<script setup lang="ts">
/**
 * 角色权限配置组件
 * @description 使用抽屉展示菜单树，配置角色权限
 */
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { ElTree } from 'element-plus'
import { getRolePermissions, updateRolePermissions, getMenuTree } from '@/api/role'
import type { Role, MenuTreeNode } from '@/api/role'

// Props
const props = defineProps<{
  modelValue: boolean
  role: Role | null
}>()

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}>()

// 组件引用
const treeRef = ref<InstanceType<typeof ElTree>>()

// 状态
const loading = ref(false)
const saving = ref(false)
const menuTree = ref<MenuTreeNode[]>([])
const checkedKeys = ref<string[]>([])
const expandAll = ref(true)
const checkAll = ref(false)
const filterText = ref('')

// 树形控件配置
const treeProps = {
  children: 'children',
  label: 'label'
}

// 监听抽屉打开，加载数据
watch(() => props.modelValue, async (visible) => {
  if (visible && props.role) {
    await loadData()
  }
})

// 加载菜单树和角色权限
const loadData = async () => {
  loading.value = true
  try {
    // 并行请求
    const [treeData, permissions] = await Promise.all([
      getMenuTree(),
      getRolePermissions(props.role!.id)
    ])
    menuTree.value = treeData
    checkedKeys.value = permissions
    
    // 更新全选状态
    updateCheckAllStatus()
  } catch (error) {
    // 错误已在拦截器中处理
  } finally {
    loading.value = false
  }
}

// 过滤节点
const filterNode = (value: string, data: MenuTreeNode) => {
  if (!value) return true
  return data.label.includes(value)
}

// 监听过滤文本变化
watch(filterText, (val) => {
  treeRef.value?.filter(val)
})

// 全选/取消全选
const handleCheckAllChange = (val: boolean) => {
  if (val) {
    // 获取所有节点的 key
    const allKeys = getAllKeys(menuTree.value)
    treeRef.value?.setCheckedKeys(allKeys)
  } else {
    treeRef.value?.setCheckedKeys([])
  }
}

// 获取所有节点的 key
const getAllKeys = (nodes: MenuTreeNode[]): string[] => {
  const keys: string[] = []
  const traverse = (list: MenuTreeNode[]) => {
    for (const node of list) {
      keys.push(node.id)
      if (node.children) {
        traverse(node.children)
      }
    }
  }
  traverse(nodes)
  return keys
}

// 展开/折叠全部
const handleExpandAll = (expand: boolean) => {
  expandAll.value = expand
  const nodes = treeRef.value?.store?.nodesMap
  if (nodes) {
    Object.values(nodes).forEach((node: any) => {
      node.expanded = expand
    })
  }
}

// 勾选变化时更新全选状态
const handleCheckChange = () => {
  updateCheckAllStatus()
}

// 更新全选状态
const updateCheckAllStatus = () => {
  const allKeys = getAllKeys(menuTree.value)
  const checked = treeRef.value?.getCheckedKeys() || []
  checkAll.value = allKeys.length > 0 && checked.length === allKeys.length
}

// 保存权限
const handleSave = async () => {
  if (!props.role) return
  
  saving.value = true
  try {
    // 获取选中的节点（包括半选状态的父节点）
    const checkedNodes = treeRef.value?.getCheckedKeys() as string[] || []
    const halfCheckedNodes = treeRef.value?.getHalfCheckedKeys() as string[] || []
    const menuIds = [...checkedNodes, ...halfCheckedNodes]
    
    await updateRolePermissions(props.role.id, menuIds)
    ElMessage.success('权限配置保存成功')
    emit('update:modelValue', false)
    emit('success')
  } catch (error) {
    // 错误已在拦截器中处理
  } finally {
    saving.value = false
  }
}

// 关闭抽屉
const handleClose = () => {
  emit('update:modelValue', false)
  // 重置状态
  filterText.value = ''
  checkedKeys.value = []
}
</script>

<template>
  <el-drawer
    :model-value="modelValue"
    :title="`权限配置 - ${role?.name || ''}`"
    size="400px"
    @update:model-value="emit('update:modelValue', $event)"
    @close="handleClose"
  >
    <div class="permission-container" v-loading="loading">
      <!-- 工具栏 -->
      <div class="toolbar">
        <el-input
          v-model="filterText"
          placeholder="搜索菜单"
          clearable
          prefix-icon="Search"
          class="search-input"
        />
        <div class="actions">
          <el-checkbox v-model="checkAll" @change="handleCheckAllChange">
            全选
          </el-checkbox>
          <el-button link type="primary" @click="handleExpandAll(true)">
            展开全部
          </el-button>
          <el-button link type="primary" @click="handleExpandAll(false)">
            折叠全部
          </el-button>
        </div>
      </div>

      <!-- 菜单树 -->
      <div class="tree-wrapper">
        <el-tree
          ref="treeRef"
          :data="menuTree"
          :props="treeProps"
          :default-checked-keys="checkedKeys"
          :default-expand-all="expandAll"
          :filter-node-method="filterNode"
          node-key="id"
          show-checkbox
          highlight-current
          @check-change="handleCheckChange"
        />
      </div>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="drawer-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">
          保存
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss">
.permission-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.toolbar {
  margin-bottom: 16px;

  .search-input {
    margin-bottom: 12px;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}

.tree-wrapper {
  flex: 1;
  overflow-y: auto;
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  padding: 8px;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
