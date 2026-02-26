import type { Role, RoleQueryParams, RoleListResponse, RoleFormData } from './types';

// --- Mock 数据 ---
const mockRoles: Role[] = [
    { id: '1', name: '超级管理员', code: 'SUPER_ADMIN', sort: 1, status: 'enable', remark: '拥有所有权限', createTime: '2023-01-01 10:00:00' },
    { id: '2', name: '普通用户', code: 'USER', sort: 2, status: 'enable', remark: '基础用户角色', createTime: '2023-01-05 14:30:00' },
    { id: '3', name: '游客', code: 'GUEST', sort: 3, status: 'disable', remark: '仅浏览权限', createTime: '2023-02-10 09:00:00' },
    { id: '4', name: '测试角色', code: 'TESTER', sort: 4, status: 'enable', remark: '用于测试', createTime: '2023-03-15 16:45:00' },
];

// Mock 菜单权限树
const mockMenuTree = [
    {
        id: 'system',
        label: '系统管理',
        children: [
            { id: 'user', label: '用户管理' },
            { id: 'role', label: '角色管理' },
            { id: 'menu', label: '菜单管理' },
        ],
    },
    {
        id: 'monitor',
        label: '系统监控',
        children: [
            { id: 'online', label: '在线用户' },
            { id: 'job', label: '定时任务' },
        ],
    },
];

// Mock 角色权限（roleId -> menuIds）
const mockRolePermissions: Record<string, string[]> = {
    '1': ['system', 'user', 'role', 'menu', 'monitor', 'online', 'job'],
    '2': ['system', 'user'],
    '3': [],
    '4': ['monitor', 'online'],
};

// --- API 函数 ---

/**
 * 获取角色列表
 */
export function getRoleList(params: RoleQueryParams): Promise<RoleListResponse> {
    return new Promise((resolve) => {
        setTimeout(() => {
            let filtered = [...mockRoles];
            if (params.name) {
                filtered = filtered.filter((r) => r.name.includes(params.name!));
            }
            if (params.status) {
                filtered = filtered.filter((r) => r.status === params.status);
            }
            const start = (params.page - 1) * params.pageSize;
            const end = start + params.pageSize;
            resolve({
                list: filtered.slice(start, end),
                total: filtered.length,
            });
        }, 300);
    });
}

/**
 * 创建角色
 */
export function createRole(data: RoleFormData): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newRole: Role = {
                id: String(Date.now()),
                name: data.name,
                code: data.code,
                sort: data.sort,
                status: data.status,
                remark: data.remark,
                createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
            };
            mockRoles.unshift(newRole);
            resolve();
        }, 200);
    });
}

/**
 * 更新角色
 */
export function updateRole(data: RoleFormData): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const idx = mockRoles.findIndex((r) => r.id === data.id);
            if (idx !== -1) {
                mockRoles[idx] = { ...mockRoles[idx], ...data };
            }
            resolve();
        }, 200);
    });
}

/**
 * 删除角色
 */
export function deleteRole(ids: string): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const idArr = ids.split(',');
            idArr.forEach((id) => {
                const idx = mockRoles.findIndex((r) => r.id === id);
                if (idx !== -1) mockRoles.splice(idx, 1);
            });
            resolve();
        }, 200);
    });
}

/**
 * 获取菜单树
 */
export function getMenuTree(): Promise<typeof mockMenuTree> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(mockMenuTree), 100);
    });
}

/**
 * 获取角色权限
 */
export function getRolePermissions(roleId: string): Promise<string[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockRolePermissions[roleId] || []);
        }, 100);
    });
}

/**
 * 更新角色权限
 */
export function updateRolePermissions(roleId: string, menuIds: string[]): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            mockRolePermissions[roleId] = menuIds;
            resolve();
        }, 200);
    });
}
