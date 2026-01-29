// 查询项类型
export type SearchItemType =
    | 'input'       // 输入框
    | 'select'      // 下拉选择
    | 'cascader'    // 级联选择
    | 'date'        // 日期选择
    | 'daterange'   // 日期范围
    | 'datetime'    // 日期时间
    | 'datetimerange' // 日期时间范围
    | 'number'      // 数字输入
    | 'switch'      // 开关
    | 'slot'        // 自定义插槽

// 选项配置
export interface SelectOption {
    label: string
    value: string | number
    disabled?: boolean
    children?: SelectOption[]  // 用于级联选择
}

// 查询项配置
export interface SearchItem {
    // 字段名
    prop: string
    // 标签
    label: string
    // 类型
    type: SearchItemType
    // 占位符
    placeholder?: string
    // 默认值
    defaultValue?: any
    // 宽度（默认 200px）
    width?: number | string
    // 选项（用于 select, cascader）
    options?: SelectOption[]
    // 是否可清空
    clearable?: boolean
    // 是否多选（用于 select）
    multiple?: boolean
    // 是否可搜索（用于 select, cascader）
    filterable?: boolean
    // 日期格式
    format?: string
    // 值格式
    valueFormat?: string
    // 数字最小值
    min?: number
    // 数字最大值
    max?: number
    // 数字步长
    step?: number
    // 自定义插槽名称
    slotName?: string
    // 是否隐藏
    hidden?: boolean
    // 联动配置：当某字段值变化时触发
    depend?: {
        prop: string
        handler: (value: any, formData: Record<string, any>) => void
    }
}

// 查询配置
export interface SearchSchema {
    // 查询项列表
    items: SearchItem[]
    // 标签宽度
    labelWidth?: number | string
    // 每行显示数量（默认自适应）
    columns?: number
    // 是否默认展开
    defaultExpand?: boolean
    // 查询按钮文字
    searchText?: string
    // 重置按钮文字
    resetText?: string
}
