// 角色实体
export interface Role {
    id: string;
    name: string;       // 角色名称
    code: string;       // 角色编码 (唯一)
    sort: number;       // 排序
    status: 'enable' | 'disable';
    remark?: string;    // 备注
    createTime: string;
}

// 查询参数
export interface RoleQueryParams {
    page: number;
    pageSize: number;
    name?: string;
    status?: string;
}

// 分页响应
export interface RoleListResponse {
    list: Role[];
    total: number;
}

// 创建/更新参数
export interface RoleFormData {
    id?: string;
    name: string;
    code: string;
    sort: number;
    status: 'enable' | 'disable';
    remark?: string;
}
