<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
</script>

<template>
  <el-config-provider :locale="zhCn">
    <RouterView />
  </el-config-provider>
</template>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  height: 100%;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* 隐藏滚动条但保持可滚动 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #a8a8a8;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

/* Element Plus 菜单覆盖样式 */
.el-menu {
  border-right: none !important;
}
</style>
