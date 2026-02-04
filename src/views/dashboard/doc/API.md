# 数据可视化大屏 - 接口规范文档 (API Specification)

**Base URL**: `/api/dashboard`
**Response Format**: JSON

所有接口统一返回格式：
```json
{
  "code": 200,
  "msg": "success",
  "data": { ... }
}
```

---

## 1. 顶部数据 (Header)
### GET `/header/config`
获取顶部配置信息（如时间筛选选项），系统时间建议由前端实时计算或仅首次同步。
```json
{
  "timeFilters": [
    { "label": "近一月", "value": "last_month" },
    { "label": "近一周", "value": "last_week" },
    { "label": "近一年", "value": "last_year" }
  ]
}
```

---

## 2. 左侧区域 (Left Column)

### 2.1 获取服务器统计 (Left-Top)
**GET** `/left/server-stats`
```json
{
  "totalServers": 198,
  "events": [
    { "label": "违规事件总数", "value": 1234, "id": "event_1" },
    { "label": "违规事件总数", "value": 567, "id": "event_2" },
    { "label": "违规事件总数", "value": 4568, "id": "event_3" }
  ]
}
```

### 2.2 获取流量柱状图数据 (Left-Middle)
**GET** `/left/traffic-bar`
```json
{
  "categories": ["标题1", "标题2", "标题3", "标题4", "标题5", "标题6", "标题7"],
  "series": [
    {
      "name": "数据标题1",
      "data": [30, 80, 50, 90, 40, 60, 85]
    },
    {
      "name": "数据标题2",
      "data": [20, 60, 40, 70, 30, 50, 75]
    }
  ]
}
```

### 2.3 获取人员状态列表 (Left-Bottom)
**GET** `/left/staff-list`
```json
{
  "list": [
    { "name": "李雷雷", "dept": "产品研究中心", "phone": "15080001340", "status": "已处理", "statusType": "success" },
    { "name": "孙北芙", "dept": "人事资源中心", "phone": "--", "status": "待处理", "statusType": "danger" },
    { "name": "孙北芙", "dept": "产品研发中心", "phone": "15400030400", "status": "处理中", "statusType": "warning" },
    { "name": "李雷", "dept": "数字交流", "phone": "1540030400", "status": "已处理", "statusType": "success" },
    { "name": "赵勇勇", "dept": "科技成果展示", "phone": "15080001340", "status": "待处理", "statusType": "danger" }
  ]
}
```

---

## 3. 中间区域 (Center Column)

### 3.1 获取拓扑图/机构数据 (Center-Top)
**GET** `/center/topology`
```json
{
  "centerNode": { "name": "XXXXX", "status": "active" },
  "nodes": [
    { "id": 1, "name": "机构总数(家)", "value": 18, "ip": "1.1.1.94" },
    { "id": 2, "name": "机构总数(家)", "value": 22 },
    { "id": 3, "name": "网络攻击(3个)", "details": ["1.1.1.94", "172.160.0.1", "1567.87.5"] },
    { "id": 4, "name": "异常访问(5个)", "details": ["172.160.0.1", "172.1620.0.1"] }
  ],
  "connections": [
    { "source": "center", "target": 1 },
    { "source": "center", "target": 2 }
  ]
}
```

### 3.2 获取分类占比 (Center-Bottom-Left)
**GET** `/center/category-pie`
```json
{
  "data": [
    { "name": "绝密", "value": 213 },
    { "name": "秘密", "value": 213 },
    { "name": "内部", "value": 213 },
    { "name": "公开", "value": 213 } // 截图中第四个颜色"内部"重复或为"公开"
  ]
}
```

### 3.3 获取访问趋势 (Center-Bottom-Right)
**GET** `/center/access-trend`
```json
{
  "xAxis": ["标题1", "标题2", "标题3", "标题4", "标题5", "标题6", "标题7", "标题8", "标题9"],
  "series": [
    { "name": "访问正常", "data": [10, 50, 30, 80, 40, 60, 50, 45, 30] },
    { "name": "访问异常", "data": [5, 20, 10, 40, 20, 30, 20, 15, 10] }
  ]
}
```

---

## 4. 右侧区域 (Right Column)

### 4.1 获取设备总览 (Right-Top)
**GET** `/right/device-overview`
```json
{
  "totalDevices": 3452,
  "details": [
    { "label": "应用", "value": 30 },
    { "label": "交换机", "value": 46 },
    { "label": "防火墙", "value": 12 },
    { "label": "路由器", "value": 155 }
  ]
}
```

### 4.2 获取国产化进度 (Right-Middle)
**GET** `/right/localization`
```json
{
  "stat1": { "label": "这里是文字", "value": 548 },
  "stat2": { "label": "这里是文字", "value": 456 },
  "progress": {
    "total": 112,
    "current": 80,
    "label": "国产化",
    "percentage": 71.4
  }
}
```

### 4.3 获取通知列表 (Right-Bottom)
**GET** `/right/notifications`
```json
{
  "list": [
    { "title": "此处是标题内容", "content": "此处是内容此处处理内容此处是内容..." },
    { "title": "此处是标题内容", "content": "此处是内容此处处理内容此处是内容..." },
    { "title": "此处是标题内容", "content": "此处是内容此处处理内容此处是内容..." }
  ]
}
```
