# 部门管理 API 文档

本文档仅用于开发联调，真实接口以 Swagger 或 YApi 为准。

## 1. 数据结构 (Data Structure)

### Department 实体
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | string | 部门ID (唯一标识) |
| parentId | string \| null | 父部门ID (根节点为 null) |
| name | string | 部门名称 |
| code | string | 部门编码 (唯一) |
| leader | string | 负责人 |
| status | 'enable' \| 'disable' | 状态 (启用/禁用) |
| sort | number | 排序字段 |
| createTime | string | 创建时间 |
| description | string (optional) | 描述 |
| children | Department[] | 子部门列表 (树形结构) |

---

## 2. 接口列表 (Interface List)

### 2.1 获取部门列表
获取全量部门数据（树形结构）。

- **URL**: `/system/dept/list`
- **Method**: `GET`
- **Params**:
  | 参数名 | 类型 | 必填 | 说明 |
  | :--- | :--- | :--- | :--- |
  | name | string | 否 | 部门名称 (模糊查询) |
  | status | string | 否 | 状态过滤 |

- **Response**:
    ```json
    {
        "code": 200,
        "data": [
            {
                "id": "1",
                "name": "总部",
                "children": [...]
            }
        ],
        "msg": "success"
    }
    ```

### 2.2 创建部门
新增一个新的部门节点。

- **URL**: `/system/dept`
- **Method**: `POST`
- **Body**:
  | 参数名 | 类型 | 必填 | 说明 |
  | :--- | :--- | :--- | :--- |
  | parentId | string | 否 | 父部门ID |
  | name | string | 是 | 部门名称 |
  | code | string | 是 | 部门编码 |
  | leader | string | 是 | 负责人 |
  | status | string | 是 | enable / disable |
  | sort | number | 是 | 排序 |
  | description | string | 否 | 描述 |

### 2.3 更新部门
更新现有部门信息。

- **URL**: `/system/dept/{id}`
- **Method**: `PUT`
- **Body**:
  | 参数名 | 类型 | 必填 | 说明 |
  | :--- | :--- | :--- | :--- |
  | name | string | 否 | 部门名称 |
  | leader | string | 否 | 负责人 |
  | ... | ... | ... | 其他可更新字段 |

### 2.4 删除部门
删除指定部门（通常需要校验是否有子部门）。

- **URL**: `/system/dept/{id}`
- **Method**: `DELETE`
- **Params**:
  - `id`: 路径参数
