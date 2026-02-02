/**
 * 树形结构通用工具函数
 * @description 用于处理具有 id 和 children 结构的树形数据
 */

export interface TreeNode {
    id: string;
    children?: TreeNode[];
    [key: string]: any;
}

/**
 * 查找节点
 * @param data 树形数据
 * @param id 目标节点ID
 */
export const findNode = <T extends TreeNode>(data: T[], id: string): T | null => {
    for (const item of data) {
        if (item.id === id) return item;
        if (item.children) {
            const found = findNode(item.children as T[], id);
            if (found) return found;
        }
    }
    return null;
};

/**
 * 删除节点
 * @param data 树形数据
 * @param id 目标节点ID
 */
export const removeNode = <T extends TreeNode>(data: T[], id: string): boolean => {
    const index = data.findIndex(item => item.id === id);
    if (index > -1) {
        data.splice(index, 1);
        return true;
    }
    for (const item of data) {
        if (item.children && removeNode(item.children as T[], id)) {
            if (item.children.length === 0) delete item.children; // 清理空数组
            return true;
        }
    }
    return false;
};
