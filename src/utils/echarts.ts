// 解决打包后echarts体积大的问题

import * as echarts from 'echarts/core'
import {
    BarChart,
    // 系列类型的定义后缀都为 SeriesOption
    BarSeriesOption,
    // LineChart,
    LineSeriesOption,
    PieChart,
    TreeChart,
    TreeSeriesOption,
    PictorialBarChart,
    PieSeriesOption
} from 'echarts/charts'
import {
    TitleComponent,
    // 组件类型的定义后缀都为 ComponentOption
    TitleComponentOption,
    TooltipComponent,
    TooltipComponentOption,
    GridComponent,
    GridComponentOption,
    // 数据集组件
    DatasetComponent,
    DatasetComponentOption,
    // 内置数据转换器组件 (filter, sort)
    TransformComponent,
    LegendComponent,
    VisualMapComponent , 
    DataZoomComponent 
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
 
// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
export type ECOption = echarts.ComposeOption<
    | BarSeriesOption
    | LineSeriesOption
    | PieSeriesOption
    | TitleComponentOption
    | TooltipComponentOption
    | GridComponentOption
    | DatasetComponentOption
    | TreeSeriesOption
    
   
>
 
// 注册必须的组件
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    BarChart,
    PieChart,
    TreeChart,
    PictorialBarChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    LegendComponent,
    VisualMapComponent,
    DataZoomComponent
])
 
// eslint-disable-next-line no-unused-vars
const option: ECOption = {
    // ...
}
 
export const $echarts = echarts