import type { User, UserQueryParams, UserListResponse, UserFormData } from './types';

// Mock 数据
const mockUsers: User[] = [
    { id: '1', account: 'admin', name: '管理员', phone: '13800138000', deptId: '1', deptName: '总公司', status: 'enable', createTime: '2023-01-01 10:00:00' },
    { id: '2', account: 'zhangsan', name: '张三', phone: '13900139000', deptId: '4', deptName: '前端开发组', status: 'enable', createTime: '2023-01-05 14:30:00' },
    { id: '3', account: 'lisi', name: '李四', phone: '13700137000', deptId: '5', deptName: '后端开发组', status: 'enable', createTime: '2023-02-10 09:00:00' },
    { id: '4', account: 'wangwu', name: '王五', phone: '13600136000', deptId: '3', deptName: '销售部', status: 'disable', createTime: '2023-03-15 16:45:00' },
];

/**
 * 获取用户列表
 */
export function getUserList(params: UserQueryParams): Promise<UserListResponse> {
    return new Promise((resolve) => {
        setTimeout(() => {
            let filtered = [...mockUsers];
            if (params.name) {
                filtered = filtered.filter((u) => u.name.includes(params.name!) || u.account.includes(params.name!));
            }
            if (params.status) {
                filtered = filtered.filter((u) => u.status === params.status);
            }
            if (params.deptId) {
                // 如果后端支持根据当前部门拉取所有子孙部门用户，可这里模拟简化只匹配等于该部门的
                filtered = filtered.filter((u) => u.deptId === params.deptId);
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
 * 创建用户
 */
export function createUser(data: UserFormData): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newUser: User = {
                id: String(Date.now()),
                account: data.account,
                name: data.name,
                phone: data.phone,
                deptId: data.deptId,
                deptName: '未分配', // 实际需要查表补充
                status: data.status,
                createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
            };
            mockUsers.unshift(newUser);
            resolve();
        }, 200);
    });
}

/**
 * 更新用户
 */
export function updateUser(data: UserFormData): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const idx = mockUsers.findIndex((u) => u.id === data.id);
            if (idx !== -1) {
                mockUsers[idx] = { ...mockUsers[idx], ...data };
            }
            resolve();
        }, 200);
    });
}

/**
 * 删除用户
 */
export function deleteUser(ids: string): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const idArr = ids.split(',');
            idArr.forEach((id) => {
                const idx = mockUsers.findIndex((u) => u.id === id);
                if (idx !== -1) mockUsers.splice(idx, 1);
            });
            resolve();
        }, 200);
    });
}
