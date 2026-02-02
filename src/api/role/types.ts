/**
 * 角色管理相关类型定义
 */

// 角色状态枚举
export type RoleStatus = 'enable' | 'disable'

// 角色实体
export interface Role {
    id: string
    name: string        // 角色名称
    code: string        // 角色编码 (唯一，如 ADMIN)
    status: RoleStatus  // 状态
    sort: number        // 排序
    remark?: string     // 备注
    createTime: string  // 创建时间
}

// 角色表单数据（新增/编辑）
export interface RoleFormData {
    id?: string
    name: string
    code: string
    status: RoleStatus
    sort: number
    remark?: string
}

// 角色查询参数
export interface RoleQueryParams {
    page: number
    pageSize: number
    name?: string
    status?: RoleStatus
}

// 角色列表响应
export interface RoleListResult {
    list: Role[]
    total: number
}

// 菜单树节点（用于权限配置）
export interface MenuTreeNode {
    id: string
    label: string
    children?: MenuTreeNode[]
}
