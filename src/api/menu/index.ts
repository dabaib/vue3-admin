import request from '@/utils/request'

/**
 * 前端路由同步到后端 sys_menu 的 DTO
 */
export interface MenuSyncItem {
    code: string        // 路由 name
    label: string       // 菜单显示标题
    parentCode: string  // 父级 code，顶级为 ''
    sort: number        // 排列顺序
}

/**
 * 同步菜单（仅超管调用）
 * 将前端路由树上报到后端，触发自动 UPSERT
 */
export function syncMenus(items: MenuSyncItem[]): Promise<void> {
    return request.post('/menu/sync', items)
}
