import type { Department, DeptQueryParams, DeptFormData } from './types';

// Mock 数据
const mockDepartments: Department[] = [
    { id: '1', parentId: '0', name: '总公司', sort: 1, status: 'enable', createTime: '2023-01-01 10:00:00' },
    { id: '2', parentId: '1', name: '研发中心', sort: 1, status: 'enable', createTime: '2023-01-01 10:10:00' },
    { id: '3', parentId: '1', name: '销售部', sort: 2, status: 'enable', createTime: '2023-01-01 10:20:00' },
    { id: '4', parentId: '2', name: '前端开发组', sort: 1, status: 'enable', createTime: '2023-01-01 10:30:00' },
    { id: '5', parentId: '2', name: '后端开发组', sort: 2, status: 'enable', createTime: '2023-01-01 10:40:00' },
];

/**
 * 将平铺数组转换为树形结构
 */
function buildTree(data: Department[], parentId: string = '0'): Department[] {
    const list: Department[] = [];
    data.forEach((item) => {
        if (item.parentId === parentId) {
            const children = buildTree(data, item.id);
            if (children.length > 0) {
                item.children = children;
            } else {
                item.children = [];
            }
            list.push(item);
        }
    });
    return list.sort((a, b) => a.sort - b.sort);
}

/**
 * 获取部门树
 */
export function getDeptTree(params?: DeptQueryParams): Promise<Department[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            let filtered = [...mockDepartments];
            if (params?.name) {
                // 如果有条件搜索，可能会破坏树形结构，这里简单实现过滤
                filtered = filtered.filter((d) => d.name.includes(params.name!));
            }
            if (params?.status) {
                filtered = filtered.filter((d) => d.status === params.status);
            }

            // 如果是在搜索树，我们可能直接以平铺展示，或者找到带有父级的所有节点。Mock这里直接展示树
            const tree = buildTree(filtered);
            resolve(tree);
        }, 300);
    });
}

/**
 * 获取部门列表（平铺）
 */
export function getDeptList(params?: DeptQueryParams): Promise<Department[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            let filtered = [...mockDepartments];
            if (params?.name) {
                filtered = filtered.filter((d) => d.name.includes(params.name!));
            }
            if (params?.status) {
                filtered = filtered.filter((d) => d.status === params.status);
            }
            resolve(filtered);
        }, 300);
    });
}

/**
 * 创建部门
 */
export function createDept(data: DeptFormData): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newDept: Department = {
                id: String(Date.now()),
                parentId: data.parentId || '0',
                name: data.name,
                sort: data.sort,
                status: data.status,
                createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
            };
            mockDepartments.push(newDept);
            resolve();
        }, 200);
    });
}

/**
 * 更新部门
 */
export function updateDept(data: DeptFormData): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const idx = mockDepartments.findIndex((d) => d.id === data.id);
            if (idx !== -1) {
                mockDepartments[idx] = { ...mockDepartments[idx], ...data } as Department;
            }
            resolve();
        }, 200);
    });
}

/**
 * 删除部门
 */
export function deleteDept(ids: string): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const idArr = ids.split(',');
            // 简单检查是否有子部门，如果有不能删除
            let hasChild = false;
            for (let id of idArr) {
                if (mockDepartments.some(d => d.parentId === id)) {
                    hasChild = true;
                    break;
                }
            }
            if (hasChild) {
                reject(new Error("包含子部门，无法删除"));
                return;
            }

            idArr.forEach((id) => {
                const idx = mockDepartments.findIndex((d) => d.id === id);
                if (idx !== -1) mockDepartments.splice(idx, 1);
            });
            resolve();
        }, 200);
    });
}
