# 首页接口文档

## 1. 获取仪表盘统计数据

- **接口地址**: `/home/stats`
- **请求方式**: `GET`
- **数据结构**: `DashboardStats`

### 返回参数说明

| 参数名    | 类型   | 说明       |
| :-------- | :----- | :--------- |
| userCount | number | 总用户数量 |
| roleCount | number | 总角色数量 |
| menuCount | number | 总菜单数量 |
| deptCount | number | 总部门数量 |

---

## 2. 获取最近动态

- **接口地址**: `/home/activities`
- **请求方式**: `GET`
- **数据结构**: `Activity[]`

### 返回参数说明

返回数组格式，单个对象说明如下：

| 参数名 | 类型   | 说明                        |
| :----- | :----- | :-------------------------- |
| user   | string | 产生动态的用户名称          |
| action | string | 执行的具体操作描述          |
| time   | string | 操作发生的时间              |
| type   | string | 动态显示标签级别（颜色控制）|
