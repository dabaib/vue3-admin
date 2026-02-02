import { findNode, removeNode } from '@/utils/tree'

export interface Department {
    id: string
    parentId: string | null
    name: string
    code: string
    leader: string
    status: 'enable' | 'disable'
    sort: number
    createTime: string
    description?: string
    children?: Department[]
}

// #region MOCK_DATA (待联调真实接口时删除)
let mockData: Department[] = [
    {
        id: '1',
        parentId: null,
        name: '总部',
        code: 'HEADQUARTER',
        leader: 'Admin',
        status: 'enable',
        sort: 1,
        createTime: '2023-01-01 00:00:00',
        children: [
            {
                id: '2',
                parentId: '1',
                name: '研发中心',
                code: 'RND',
                leader: 'CTO',
                status: 'enable',
                sort: 1,
                createTime: '2023-01-02 00:00:00',
                children: [
                    {
                        id: '3',
                        parentId: '2',
                        name: '后端开发组',
                        code: 'BACKEND',
                        leader: 'Backend Lead',
                        status: 'enable',
                        sort: 1,
                        createTime: '2023-01-03 00:00:00'
                    },
                    {
                        id: '4',
                        parentId: '2',
                        name: '前端开发组',
                        code: 'FRONTEND',
                        leader: 'Frontend Lead',
                        status: 'enable',
                        sort: 2,
                        createTime: '2023-01-03 00:00:00'
                    }
                ]
            },
            {
                id: '5',
                parentId: '1',
                name: '市场部',
                code: 'MARKETING',
                leader: 'CMO',
                status: 'enable',
                sort: 2,
                createTime: '2023-01-02 00:00:00'
            }
        ]
    }
]
// #endregion

/**
 * 获取部门列表
 * @param params 查询参数
 */
export const getDepartmentList = async (params?: any) => {
    // [REAL-API-RESERVED] 待真实接口就绪后替换
    // return request.get('/system/dept/list', params)

    // [MOCK] 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
        code: 200,
        data: mockData,
        msg: 'success'
    }
}

/**
 * 创建部门
 * @param data 部门数据
 */
export const createDepartment = async (data: Omit<Department, 'id' | 'createTime' | 'children'>) => {
    // [REAL-API-RESERVED]
    // return request.post('/system/dept', data)

    await new Promise(resolve => setTimeout(resolve, 300))
    const newDept: Department = {
        ...data,
        id: String(Date.now()),
        createTime: new Date().toLocaleString(),
        children: []
    }

    if (data.parentId) {
        const parent = findNode(mockData, data.parentId)
        if (parent) {
            if (!parent.children) parent.children = []
            parent.children.push(newDept)
        }
    } else {
        mockData.push(newDept)
    }

    return { code: 200, data: newDept, msg: 'success' }
}

/**
 * 更新部门
 * @param id 部门ID
 * @param data 更新数据
 */
export const updateDepartment = async (id: string, data: Partial<Department>) => {
    // [REAL-API-RESERVED]
    // return request.put(`/system/dept/${id}`, data)

    await new Promise(resolve => setTimeout(resolve, 300))
    const node = findNode(mockData, id)
    if (node) {
        Object.assign(node, data)
        return { code: 200, data: node, msg: 'success' }
    }
    return { code: 404, msg: 'not found' }
}

/**
 * 删除部门
 * @param id 部门ID
 */
export const deleteDepartment = async (id: string) => {
    // [REAL-API-RESERVED]
    // return request.delete(`/system/dept/${id}`)

    await new Promise(resolve => setTimeout(resolve, 300))
    if (removeNode(mockData, id)) {
        return { code: 200, msg: 'success' }
    }
    return { code: 404, msg: 'not found' }
}
