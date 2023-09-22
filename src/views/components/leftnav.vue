<template>
  <div class="left-nav">
    <div class="open-icon" @click="handleLeftPutAway">
      <el-icon :size="20" v-if="isExpandAll"> <DArrowLeft /></el-icon>
      <el-icon :size="20" v-else><DArrowRight /></el-icon>
    </div>
    <div
      v-for="item in navList"
      :class="`nav-item ${activeItem === item.name ? 'active-item' : ''}`"
      @click="handleActive(item)"
    >
      <el-icon :size="20" style="margin-top: 1vw">
        <Edit />
      </el-icon>
      <p>{{ item.name }}</p>
    </div>
  </div>
    <div :class="`left-wrap ${isExpandAll ? '' : 'change-left-wrap-width'}`">
      <div
        class="ehart-wrap-1"
        v-if="isExpandAll && activeList.includes('井下数据统计')"
      >
        <div class="title">井下数据统计</div>
        <my-ecarts :options="options"></my-ecarts>
      </div>
      <div
        style="margin-top: 10px"
        v-if="isExpandAll && activeList.includes('视频监控')"
      >
        <MyCard :title="'视频监控'">
          <template #content>
            <VideoMonitor></VideoMonitor>
          </template>
        </MyCard>
      </div>
      <MyCard
        :title="'基站状态'"
        @jump="$router.push('/base-station')"
        v-if="isExpandAll && activeList.includes('基站状态')"
      >
        <template #content>
          <div class="ehart-wrap-2">
            <PieCharts :chartData="chartData || []"></PieCharts>
          </div>
        </template>
      </MyCard>
      <TerminalStatus
        v-if="isExpandAll && activeList.includes('终端状态')"
        @jump="$router.push('/terminal-details')"
      />
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { ElIcon } from "element-plus";
import { Edit, DArrowRight, DArrowLeft } from "@element-plus/icons-vue";
import MyEcarts from "@/components/myEchart.vue";
import PieCharts from "@/views/components/pieCharts.vue";
import MyCard from "@/components/myCard.vue";
import TerminalStatus from "@/views/components/terminalStatus.vue";
import { $echarts } from "@/utils/echarts";
import VideoMonitor from "@/views/videoMonitor/index.vue";
import { getStationPercentage, getNumOfDifferentTypes } from "@/api";
// import { getUserList } from "@/api/longrmap";

const activeItem = ref("");
const isExpandAll = ref(false);

const mapData = new Set();
const activeList = ref([]);
const chartData = ref([]);
const histogramData = ref();

const navList = [
  { name: "井下数据统计" },
  { name: "视频监控" },
  { name: "基站状态" },
  { name: "终端状态" },
];

const initPieChartData = async () => {
  const res = await getStationPercentage();
  // mock数据
  // const res=[{nodeType:'定位基站',num:4},{nodeType:'WIFI6基站',num:6},{nodeType:'5G基站',num:13},{nodeType:'其他类型',num:1}]
  let arr = [];
  res.map((item) => {
    arr.push({ value: item.num, name: item.nodeType });
  });
  chartData.value = arr;
};



const handleLeftPutAway = () => {
  isExpandAll.value = !isExpandAll.value;
  activeItem.value = "";
  if (isExpandAll.value) {
    navList.forEach((item) => {
      mapData.add(item.name);
    });
    activeList.value = Array.from(mapData);
  } else {
    activeList.value = [];
  }
};

const handleActive = (item) => {
  isExpandAll.value = true;
  activeItem.value = item.name;
  if (!activeList.value.includes("item.name")) {
    activeList.value.push(item.name);
  }
};
// station = 0, // 人员总数 基站总数 终端总数的统计
const initHistogramData = async () => {
  // const res1 = await getUserList();
  const res2 = await getNumOfDifferentTypes();
  
  histogramData.value.totalTerminals = res2.total;
  histogramData.value.totalStation = dealTotalStation(res2.numList);
  histogramData.value.totalPersonnel = res1?.length;

};

const dealTotalStation = (numList = []) => {
  let sum = 0;
  for (let i = 0; i < numList.length; i++) {
    if (numList[i].deviceType === 0) {
      sum += numList[i].num;
    }
  }
  return sum;
};

initHistogramData();

const errorTypesColor = {
  personnel: {
    startColor: "rgba(56, 160, 214, 1)",
    endColor: "rgba(109, 205, 230, 1)",
    topStartColor: "rgba(56, 160, 214, 1)",
    topEndColor: "rgba(109, 205, 230, 1)",
  },
  baseStation: {
    startColor: "rgba(67, 102, 243, 1)",
    endColor: "rgba(29, 67, 243, 1)",
    topStartColor: "rgba(67, 102, 243, 1)",
    topEndColor: "rgba(29, 67, 243, 1)",
  },
  terminal: {
    startColor: "rgba(71, 33, 202, 1)",
    endColor: "rgba(134, 81, 244, 1)",
    topStartColor: "rgba(71, 33, 202, 1)",
    topEndColor: "rgba(134, 81, 244, 1)",
  },
};
// 根据后端数据进行选择  color: getEnumColorById(tag, selected)

let options = {};

const initOptions = (chartData) => {
  const { totalPersonnel, totalTerminals, totalStation } = chartData;
  console.log("井下数据统计", totalPersonnel, totalTerminals, totalStation);
  const data = [
    {
      value: totalPersonnel,
      label: `${totalPersonnel}人 人员总数`,
      startColor: errorTypesColor.personnel.startColor,
      endColor: errorTypesColor.personnel.endColor,
      topStartColor: errorTypesColor.personnel.endColor,
      topEndColor: errorTypesColor.personnel.topEndColor,
    },
    {
      value: totalStation,
      label: `${totalStation}个 基站总数`,
      startColor: errorTypesColor.baseStation.startColor,
      endColor: errorTypesColor.baseStation.endColor,
      topStartColor: errorTypesColor.baseStation.endColor,
      topEndColor: errorTypesColor.baseStation.topEndColor,
    },
    {
      value: totalTerminals,
      label: `${totalTerminals}个 终端总数`,
      startColor: errorTypesColor.terminal.startColor,
      endColor: errorTypesColor.terminal.endColor,
      topStartColor: errorTypesColor.terminal.endColor,
      topEndColor: errorTypesColor.terminal.topEndColor,
    },
  ];
  options = {
    xAxis: {
      type: "category",
      data: data.map((str) => str.label.replace(" ", "\n\n")),
      // x坐标轴为虚线
      axisLine: {
        lineStyle: {
          color: "rgba(11, 73, 125, 0.33)",
          opacity: 0.8,
        },
      },
      axisTick: {
        show: true,
      },

      axisLabel: {
        show: true,
        color: "#B0E1FF",
        nameTextStyle: {
          fontFamily: "MicrosoftYaHei",
          fontSize: "12",
        },
        showMaxLabel: true,
      },
      // boundaryGap: false,
    },
    yAxis: {
      type: "value",
      // 不展示刻度线
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
        color: "#B0E1FF",
        fontSize: 12, // 字体大小
      },
    },
    // 栅格
    grid: {
      left: "0",
      right: "0",
      bottom: "0%",
      top: "22px",
      containLabel: true,
    },
    series: [
      // 数据低下的圆片
      {
        name: "",
        type: "pictorialBar",
        symbol: "diamond",
        symbolSize: [16, 9], // 宽，高
        symbolOffset: [0, 5], // 左 上
        symbolPosition: "start",
        z: 1,
        data: data,
        itemStyle: {
          color: (params) => {
            return new $echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: params.data.topStartColor },
              { offset: 1, color: params.data.topEndColor },
            ]);
          },
        },
      },
      // 数据的柱状图
      {
        name: "",
        type: "bar",
        barWidth: 8, // 柱条的宽度，不设时自适应。
        data: data,
        itemStyle: {
          color: (params) => {
            return new $echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: params.data.startColor },
              { offset: 1, color: params.data.endColor },
            ]);
          },
        },
      },
      {
        name: "",
        type: "bar",
        barWidth: 8, // 柱条的宽度，不设时自适应。
        barGap: 0, // 不同系列的柱间距离
        data: data,
        itemStyle: {
          color: (params) => {
            return new $echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: params.data.startColor },
              { offset: 1, color: params.data.endColor },
            ]);
          },
          borderWidth: 0.1,
          borderColor: "transparent",
        },
      },
      // 数据顶部的样式
      {
        name: "",
        type: "pictorialBar",
        symbol: "diamond",
        symbolSize: [16, 9],
        symbolOffset: [0, -4],
        symbolPosition: "end",
        z: 3,
        itemStyle: {
          color: (params) => {
            return new $echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: params.data.topStartColor },
              { offset: 1, color: params.data.topEndColor },
            ]);
          },
          label: {
            show: true, // 开启显示
            position: "top", // 在上方显示
            fontSize: "12",
            color: "#B0E1FF",
          },
          offset: [0, -2],
        },
        data: data,
      },
    ],
  };
};

initPieChartData();

// mock数据
initOptions({totalTerminals:45,totalStation:33,totalPersonnel:112})

watch(()=>
  histogramData.value,
  (newHistogramData) => {

    initOptions(newHistogramData);
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.left-wrap {
  @include transparent;
  display: flex;
  flex-direction: column;
  width: vw(376);
  position: absolute;
  transition: all 0.8s;
  z-index: 9999999;
  left:  vw(60);
  .ehart-wrap-1 {
    margin: vh(38) vw(20);
    width: vw(344);
    height: vh(135);
    .title {
      @include flexCenter;
      margin-left: vw(116);
      width: vw(110);
      height: vh(28);
      background: rgba(54, 150, 218, 0.25);
      border: 1px solid #3696d9;
      border-radius: 4px;
      font-size: 12px;
    }
  }
  .ehart-wrap-2 {
    margin: vh(30) vw(20);
    width: vw(344);
    height: vh(182);
  }
}
.change-left-wrap-width {
  margin-right: -17vw;
  cursor: pointer;
  animation: hiddenTransition 480ms ease-in;
  animation-fill-mode: forwards;
  will-change: opacity, transform, display;
}
@keyframes hiddenLeftTransition {
  0% {
    opacity: 1;
    transform: none;
  }
  99% {
    opacity: 0;
    transform: translateX(-1%);
  }
  100% {
    opacity: 0;
    transform: translateX(-1%);
  }
}

.left-nav {
  width: vw(60);
  height: 93.7vh;
  display: flex;
  flex-direction: column;
  position: relative;
  color: #ccd5e0;
  .open-icon {
    @include flexCenter;
    position: absolute;
    cursor: pointer;
    width: vw(60);
    height: vh(42);
    border-bottom: 1px solid rgba($color: #fff, $alpha: 0.67);
  }
  .nav-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
    height: 24.5%;
    flex: 1;
    background: #4f555b;
    box-shadow: 0px 1px 0px 0px rgba(255, 255, 255, 0.34);
    border-bottom: 1px solid rgba($color: #fff, $alpha: 0.67);
    p {
      margin-top: 5px;
      writing-mode: tb-rl;
    }
  }
  .active-item {
    background: #2a4a6b;
  }
}
</style>
