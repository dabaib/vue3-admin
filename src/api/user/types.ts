// 用户实体
export interface User {
    id: string;
    account: string;      // 账号
    name: string;         // 姓名
    phone?: string;       // 手机号
    deptId?: string;      // 所属部门ID
    deptName?: string;    // 所属部门名称
    roleNames?: string;   // 角色名称（逗号分隔）
    status: 'enable' | 'disable';
    createTime: string;
}

// 查询参数
export interface UserQueryParams {
    page: number;
    pageSize: number;
    name?: string;
    status?: string;
    deptId?: string;
}

// 分页响应
export interface UserListResponse {
    list: User[];
    total: number;
}

// 创建/更新参数
export interface UserFormData {
    id?: string;
    account: string;
    name: string;
    phone?: string;
    deptId?: string;
    status: 'enable' | 'disable';
    password?: string; // 新增时可能需要密码
}
