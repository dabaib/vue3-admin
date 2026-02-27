import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

export const useTagsViewStore = defineStore('tagsView', () => {
    const visitedViews = ref<RouteLocationNormalized[]>([])

    const addVisitedView = (view: RouteLocationNormalized) => {
        if (visitedViews.value.some(v => v.path === view.path)) return
        // deep clone is not necessary, just shadow copy or Push directly
        visitedViews.value.push(Object.assign({}, view))
    }

    const delVisitedView = (view: RouteLocationNormalized) => {
        return new Promise((resolve) => {
            const index = visitedViews.value.findIndex(v => v.path === view.path)
            if (index > -1) {
                visitedViews.value.splice(index, 1)
            }
            resolve([...visitedViews.value])
        })
    }

    const delOthersViews = (view: RouteLocationNormalized) => {
        return new Promise((resolve) => {
            visitedViews.value = visitedViews.value.filter(v => {
                return v.meta.affix || v.path === view.path
            })
            resolve([...visitedViews.value])
        })
    }

    const delAllViews = () => {
        return new Promise((resolve) => {
            const affixTags = visitedViews.value.filter(tag => tag.meta.affix)
            visitedViews.value = affixTags
            resolve([...visitedViews.value])
        })
    }

    return {
        visitedViews,
        addVisitedView,
        delVisitedView,
        delOthersViews,
        delAllViews
    }
})
