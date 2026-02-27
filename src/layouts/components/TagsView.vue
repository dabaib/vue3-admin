<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTagsViewStore } from '@/stores/tagsView'
import { Close } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsViewStore()

// Context menu state
const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref<any>({})

const addTags = () => {
  const { name } = route
  // Filter out dashboard logic from being added to tabs view inside the admin
  if (name && !route.path.includes('/dashboard')) {
    tagsViewStore.addVisitedView(route)
  }
}

watch(
  () => route.path,
  () => {
    addTags()
  },
  { immediate: true }
)

const isActive = (path: string) => {
  return path === route.path
}

const closeTag = (view: any) => {
  tagsViewStore.delVisitedView(view).then((views: any) => {
    if (isActive(view.path)) {
      toLastView(views, view)
    }
  })
}

const toLastView = (visitedViews: any[], view: any) => {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath)
  } else {
    // defaults to home
    if (view.name === 'home') {
      router.replace({ path: '/redirect' + view.fullPath })
    } else {
      router.push('/')
    }
  }
}

const openMenu = (tag: any, e: MouseEvent) => {
  const menuMinWidth = 105
  left.value = e.clientX
  top.value = e.clientY
  visible.value = true
  selectedTag.value = tag
}

const closeMenu = () => {
  visible.value = false
}

watch(visible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})

const closeOthersTags = () => {
  router.push(selectedTag.value.fullPath)
  tagsViewStore.delOthersViews(selectedTag.value).then(() => {
    // Navigate to the selected tag if closing others makes current tag invalid
    // usually the selected tag is the one user right-clicked on.
  })
}

const closeAllTags = () => {
  tagsViewStore.delAllViews().then((views: any) => {
    toLastView(views, selectedTag.value)
  })
}
</script>

<template>
  <div class="tags-view-container">
    <el-scrollbar class="tags-view-wrapper">
      <router-link
        v-for="tag in tagsViewStore.visitedViews"
        :key="tag.path"
        :class="isActive(tag.path) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        class="tags-view-item"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.meta.title || 'no-name' }}
        <el-icon
          v-if="!tag.meta.affix"
          class="el-icon-close"
          @click.prevent.stop="closeTag(tag)"
        >
          <Close />
        </el-icon>
      </router-link>
    </el-scrollbar>

    <!-- Context Menu -->
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags">全部关闭</li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;

  .tags-view-wrapper {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;

    .tags-view-item {
      display: inline-flex;
      align-items: center;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      text-decoration: none;
      border-radius: 2px;

      &:first-of-type {
        margin-left: 15px;
      }

      &:last-of-type {
        margin-right: 15px;
      }

      &.active {
        background-color: var(--el-color-primary);
        color: #fff;
        border-color: var(--el-color-primary);
        
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 4px;
        }
      }

      .el-icon-close {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        text-align: center;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        margin-left: 5px;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        &:hover {
          background-color: #b4bccc;
          color: #fff;
        }
      }
    }
  }

  /* Right-click Context Menu */
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: fixed; /* Fixed relative to viewport to handle scroll properly */
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
