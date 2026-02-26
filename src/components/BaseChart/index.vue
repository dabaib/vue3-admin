<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts';
import { useResizeObserver } from '@vueuse/core';

// 定义 Props
interface Props {
  options: echarts.EChartsOption;
  theme?: string | object;
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'default',
});

// 定义 Emits
const emits = defineEmits<{
  (e: 'chart-click', params: any): void;
}>();

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return;
  
  // 销毁旧实例
  if (chartInstance) {
    chartInstance.dispose();
  }

  // 初始化新实例
  chartInstance = echarts.init(chartRef.value, props.theme);

  // 设置配置项
  setOptions(props.options);

  // 绑定事件
  chartInstance.on('click', (params) => {
    emits('chart-click', params);
  });
};

// 设置/更新配置项
const setOptions = (options: echarts.EChartsOption) => {
  if (!chartInstance) return;

  // 默认透明 Tooltip 配置
  const defaultTooltip = {
    backgroundColor: 'rgba(50, 50, 50, 0.7)', // 半透明背景
    borderColor: 'transparent',
    textStyle: {
      color: '#fff',
    },
    axisPointer: {
      type: 'line',
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)',
      },
    },
    // 将 tooltip 限制在图表容器内，避免溢出
    confine: true, 
  };

  // 深度合并 tooltip 配置 (简易合并，用户配置优先)
  const finalOptions = {
    ...options,
    tooltip: {
      ...defaultTooltip,
      ...(options.tooltip || {}),
    },
  };

  chartInstance.setOption(finalOptions, true); // true 表示不合并，完全替换 (可选，视需求而定，这里暂用 true 防止残留)
};

// 监听 options 变化
watch(
  () => props.options,
  (newOptions) => {
    setOptions(newOptions);
  },
  { deep: true }
);

// 监听 resize
useResizeObserver(chartRef, () => {
  chartInstance?.resize();
});

// 生命周期
onMounted(() => {
  nextTick(() => {
    initChart();
  });
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
});

// 暴露实例给父组件 (如有特殊需求)
defineExpose({
  getInstance: () => chartInstance,
});
</script>

<template>
  <div ref="chartRef" class="base-chart"></div>
</template>

<style scoped lang="scss">
.base-chart {
  width: 100%;
  height: 100%;
  min-height: 0; // Allow parent layout to fully control constraints
}
</style>
