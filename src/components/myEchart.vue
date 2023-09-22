<template>
  <div ref="echartsRef" class="echarts-wrap"></div>
</template>

<script setup lang="ts">
import { $echarts, ECOption } from "@/utils/echarts";
import { onMounted, ref, watch, toRefs } from "vue";

type Props = {
  options: any;
  handleClick?(params: any): void;

};
const props = withDefaults(defineProps<Props>(), {
  options: {},
  handleClick: (params: any) => {
     /* handleCancel */
  },
  
});

let myChart;

const { options } = toRefs(props);
console.log("===>",options);

const echartsRef = ref<HTMLElement>();

const initEcharts = (options: ECOption, loading: boolean) => {
  if (!myChart) {
    myChart = $echarts.init(echartsRef.value!);
  }
  if (loading === false) {
    myChart.showLoading({
      text: "loading",
      color: "#c23531",
      textColor: "#000",
      maskColor: "rgba(255, 255, 255, 0.2)",
      zlevel: 0,
    }); // 设置加载动画
  } else {
    myChart.hideLoading();
  }
  myChart.setOption(options, { notMerge: true });
  myChart.on("click", function (params) {
    if(props.handleClick){
      props.handleClick(params);
    }
  });
};

onMounted(() => {
  initEcharts(options.value, true);
});

watch(
  options,
  (newOptions) => {
    initEcharts(newOptions, true);
  },
  { deep: true }
);

window.addEventListener("resize",function(){
   myChart.resize();
});

defineExpose({
  // 提供访问 Echarts 途径
  echartsRef,
  myChart,
});
</script>

<style lang="scss">
.echarts-wrap {
  width: 100%;
  height: 100%;
}
</style>
