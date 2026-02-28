<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { getDeptTree } from '@/api/department'
import type { Department } from '@/api/department/types'
import { Search } from '@element-plus/icons-vue'

const emit = defineEmits<{
  (e: 'node-click', deptId: string): void
}>()

const treeRef = ref()
const deptList = ref<Department[]>([])
const filterText = ref('')

// 获取部门树数据
const fetchDeptTree = async () => {
  try {
    const res = await getDeptTree()
    deptList.value = res
  } catch (error) {
    console.error('获取部门树失败:', error)
  }
}

// 供 Element Plus tree 过滤使用的函数
const filterNode = (value: string, data: Department) => {
  if (!value) return true
  return data.name.includes(value)
}

// 监听输入，触发过滤
const handleFilter = () => {
  treeRef.value?.filter(filterText.value)
}

const handleNodeClick = (data: Department) => {
  emit('node-click', data.id)
}

onMounted(() => {
  fetchDeptTree()
})
</script>

<template>
  <el-card class="tree-card" shadow="never">
    <div class="tree-header">
      <el-input
        v-model="filterText"
        placeholder="搜索部门"
        clearable
        :prefix-icon="Search"
        @input="handleFilter"
      />
    </div>
    
    <div class="tree-body">
      <el-tree
        ref="treeRef"
        :data="deptList"
        :props="{ children: 'children', label: 'name' }"
        :filter-node-method="filterNode"
        default-expand-all
        highlight-current
        node-key="id"
        @node-click="handleNodeClick"
      />
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.tree-card {
  height: 100%;
  border: none;
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;

  ::v-deep(.el-card__body) {
    padding: 16px;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }
}

.tree-header {
  margin-bottom: 16px;
}

.tree-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  
  // 自定义一点滚动条，使其更美观
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #dcdfe6;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
}
</style>
