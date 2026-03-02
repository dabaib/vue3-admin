import type { RouteRecordRaw } from 'vue-router'
import { routes } from '@/router'
import { syncMenus, type MenuSyncItem } from '@/api/menu'

/**
 * 将路由记录（含子路由）扁平化为 MenuSyncItem 数组
 */
function flattenRoutes(
    routeList: readonly RouteRecordRaw[],
    parentCode: string = '',
    sortStart: number = 0
): MenuSyncItem[] {
    const result: MenuSyncItem[] = []

    routeList.forEach((route, index) => {
        // 只处理有 name 和 meta.menu 的路由
        if (!route.name || route.meta?.menu === false) return

        const code = String(route.name)
        const label = (route.meta?.title as string) ?? code
        const sort = sortStart + index

        result.push({ code, label, parentCode, sort })

        // 递归处理子路由
        if (route.children?.length) {
            const childItems = flattenRoutes(route.children, code, 0)
            result.push(...childItems)
        }
    })

    return result
}

/**
 * 同步所有可见路由到后端菜单权限表
 * 仅在超管（userId === 1 或 permissions 包含全部菜单）时调用
 */
export async function useRouteSync(): Promise<void> {
    try {
        const items: MenuSyncItem[] = []

        routes.forEach((route, index) => {
            if (route.path === '/') {
                // 主布局的子路由（侧边栏菜单）
                const children = route.children ?? []
                items.push(...flattenRoutes(children, '', index))
            } else if (route.meta?.menu !== false && route.name) {
                // 顶层独立路由（如大屏）
                items.push({
                    code: String(route.name),
                    label: (route.meta?.title as string) ?? String(route.name),
                    parentCode: '',
                    sort: index + 100 // 放在侧边栏菜单之后
                })
            }
        })

        if (items.length > 0) {
            await syncMenus(items)
            console.log(`[MenuSync] 已同步 ${items.length} 条路由到数据库菜单权限表`)
        }
    } catch (error) {
        // 同步失败不影响正常使用，只记录日志
        console.warn('[MenuSync] 菜单同步失败，不影响正常功能', error)
    }
}
