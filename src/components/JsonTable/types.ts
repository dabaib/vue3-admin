// 表格列配置
export interface TableColumn {
    // 列的唯一标识，对应数据字段名
    prop: string
    // 列标题
    label: string
    // 列宽度
    width?: number | string
    // 最小宽度
    minWidth?: number | string
    // 是否固定列 (left/right)
    fixed?: boolean | 'left' | 'right'
    // 对齐方式
    align?: 'left' | 'center' | 'right'
    // 是否可排序
    sortable?: boolean | 'custom'
    // 是否显示溢出提示
    showOverflowTooltip?: boolean
    // 列类型 (selection/index/expand)
    type?: 'selection' | 'index' | 'expand'
    // 自定义格式化函数
    formatter?: (row: any, column: TableColumn, cellValue: any, index: number) => string
    // 自定义渲染类型
    render?: 'tag' | 'image' | 'link' | 'switch' | 'progress' | 'slot'
    // 渲染配置
    renderOptions?: {
        // tag 类型映射 { value: { text, type } }
        tagMap?: Record<string, { text: string; type?: 'success' | 'warning' | 'danger' | 'info' }>
        // image 配置
        imageWidth?: number
        imageHeight?: number
        // link 配置
        linkText?: string
        // switch 配置
        activeValue?: any
        inactiveValue?: any
    }
    // 插槽名称 (当 render 为 'slot' 时使用)
    slotName?: string
    // 是否隐藏
    hidden?: boolean
    // 子列（多级表头）
    children?: TableColumn[]
}

// 操作按钮配置
export interface ActionButton {
    // 按钮文字
    text: string
    // 按钮类型
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
    // 按钮图标
    icon?: string
    // 是否为文字按钮
    link?: boolean
    // 是否禁用（可以是函数）
    disabled?: boolean | ((row: any) => boolean)
    // 是否隐藏（可以是函数）
    hidden?: boolean | ((row: any) => boolean)
    // 确认提示文字（设置后点击会弹出确认框）
    confirm?: string
    // 点击事件名称
    event: string
}

// 操作列配置
export interface ActionColumn {
    // 列宽度
    width?: number | string
    // 固定位置
    fixed?: boolean | 'left' | 'right'
    // 列标题
    label?: string
    // 按钮列表
    buttons: ActionButton[]
}

// 分页配置
export interface PaginationConfig {
    // 是否显示分页
    show?: boolean
    // 当前页
    currentPage?: number
    // 每页条数
    pageSize?: number
    // 总条数
    total?: number
    // 每页条数选项
    pageSizes?: number[]
    // 布局
    layout?: string
    // 背景色
    background?: boolean
}

// 表格配置
export interface TableSchema {
    // 列配置
    columns: TableColumn[]
    // 操作列配置
    actionColumn?: ActionColumn
    // 分页配置
    pagination?: PaginationConfig
    // 表格属性
    tableProps?: {
        // 行键
        rowKey?: string
        // 是否显示边框
        border?: boolean
        // 是否显示斑马纹
        stripe?: boolean
        // 表格尺寸
        size?: 'large' | 'default' | 'small'
        // 高度
        height?: number | string
        // 最大高度
        maxHeight?: number | string
        // 是否高亮当前行
        highlightCurrentRow?: boolean
        // 空数据提示文字
        emptyText?: string
        [key: string]: any
    }
}

// 获取数据的参数
export interface FetchDataParams {
    // 当前页码
    page: number
    // 每页条数
    pageSize: number
    // 其他查询参数
    [key: string]: any
}

// 获取数据的返回结果
export interface FetchDataResult<T = any> {
    // 数据列表
    list: T[]
    // 总条数
    total: number
}

// API 获取数据函数类型
export type FetchDataFn<T = any> = (params: FetchDataParams) => Promise<FetchDataResult<T>>

