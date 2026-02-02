# 角色管理 API 文档

本文档仅用于开发联调，真实接口以 Swagger 或 YApi 为准。

## 1. 数据结构 (Data Structure)

### Role 实体
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | string | 角色ID |
| name | string | 角色名称 |
| code | string | 角色编码 (唯一，如 ADMIN) |
| status | 'enable' \| 'disable' | 状态 |
| sort | number | 排序 |
| remark | string | 备注 |
| createTime | string | 创建时间 |

---

## 2. 接口列表 (Interface List)

### 2.1 获取角色列表
分页获取角色数据。

- **URL**: `/system/role/list`
- **Method**: `GET`
- **Params**:
  | 参数名 | 类型 | 必填 | 说明 |
  | :--- | :--- | :--- | :--- |
  | page | number | 是 | 页码 |
  | pageSize | number | 是 | 每页条数 |
  | name | string | 否 | 角色名称 |
  | status | string | 否 | 状态 |

- **Response**:
    ```json
    {
        "code": 200,
        "data": {
            "list": [
                {
                    "id": "1",
                    "name": "超级管理员",
                    "code": "SUPER_ADMIN",
                    "status": "enable",
                    "createTime": "2023-01-01"
                }
            ],
            "total": 100
        },
        "msg": "success"
    }
    ```

### 2.2 创建角色
新增角色。

- **URL**: `/system/role`
- **Method**: `POST`
- **Body**:
  | 参数名 | 类型 | 必填 | 说明 |
  | :--- | :--- | :--- | :--- |
  | name | string | 是 | 角色名称 |
  | code | string | 是 | 角色编码 |
  | status | string | 是 | 状态 |
  | remark | string | 否 | 备注 |

### 2.3 更新角色
更新角色基本信息。

- **URL**: `/system/role/{id}`
- **Method**: `PUT`
- **Body**: 同创建接口

### 2.4 删除角色
单个或批量删除角色。

- **URL**: `/system/role/{ids}`
- **Method**: `DELETE`
- **Params**:
  - `ids`: 多个ID用逗号分隔

### 2.5 获取角色权限
获取指定角色的菜单权限ID集合（用于 Tree 回显）。

- **URL**: `/system/role/{id}/permissions`
- **Method**: `GET`
- **Response**:
    ```json
    {
        "code": 200,
        "data": ["menu_1", "menu_1_1", "btn_add"], // 选中的菜单/按钮ID列表
        "msg": "success"
    }
    ```

### 2.6 更新角色权限
保存角色的菜单权限。

- **URL**: `/system/role/{id}/permissions`
- **Method**: `PUT`
- **Body**:
    ```json
    {
        "menuIds": ["menu_1", "menu_1_1"]
    }
    ```

---

## 3. Mock 说明
后端开发完成前，请在 `src/api/role.ts` 中使用本地 Mock 数据，涵盖以上所有用例。
