// 部门实体
export interface Department {
    id: string;
    parentId: string;
    name: string;
    sort: number;
    status: 'enable' | 'disable';
    createTime: string;
    children?: Department[];
}

// 部门列表请求参数
export interface DeptQueryParams {
    name?: string;
    status?: string;
}

// 部门的创建/更新参数
export interface DeptFormData {
    id?: string;
    parentId?: string;
    name: string;
    sort: number;
    status: 'enable' | 'disable';
}
