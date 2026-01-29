import type { FormItemRule } from 'element-plus'

// 表单项类型
export type FormItemType =
    | 'input'       // 输入框
    | 'password'    // 密码框
    | 'textarea'    // 文本域
    | 'select'      // 下拉选择
    | 'cascader'    // 级联选择
    | 'date'        // 日期选择
    | 'daterange'   // 日期范围
    | 'time'        // 时间选择
    | 'datetime'    // 日期时间
    | 'datetimerange' // 日期时间范围
    | 'number'      // 数字输入
    | 'switch'      // 开关
    | 'checkbox'    // 多选框
    | 'radio'       // 单选框
    | 'slot'        // 自定义插槽

// 选项配置
export interface SelectOption {
    label: string
    value: string | number | boolean
    disabled?: boolean
    children?: SelectOption[]
}

// 表单项配置
export interface FormItem {
    // 字段名
    prop: string
    // 标签
    label: string
    // 类型
    type: FormItemType
    // 栅格占据的列数 (24)
    span?: number
    // 验证规则
    rules?: FormItemRule | FormItemRule[]

    // 通用属性
    placeholder?: string
    defaultValue?: any
    disabled?: boolean
    readonly?: boolean
    hidden?: boolean

    // 选项（用于 select, cascader, checkbox, radio）
    options?: SelectOption[]

    // 组件特定属性
    clearable?: boolean
    multiple?: boolean
    filterable?: boolean
    format?: string
    valueFormat?: string
    min?: number
    max?: number
    step?: number
    rows?: number // textarea

    // 自定义插槽名称
    slotName?: string
}

// 表单配置
export interface FormSchema {
    // 表单项列表
    items: FormItem[]
    // 标签宽度
    labelWidth?: number | string
    // 标签位置
    labelPosition?: 'left' | 'right' | 'top'
    // 默认栅格占据列数 (默认24)
    defaultSpan?: number
    // 是否显示操作按钮（提交/重置）
    showActions?: boolean
    submitText?: string
    resetText?: string
}
