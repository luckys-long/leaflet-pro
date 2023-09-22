<template>
  <div class="wrap-right">
    <div class="right-top"></div>
    <div class="right-middle">
      <div class="title">5G 模组</div>
      <div class="num">
        <span style="margin-left: 14px">在线数:</span>
        <span style="
            font-weight: bold;
            color: #f8c300;
            font-size: 15px;
            margin-left: 8px;
          ">{{ Modulechartdata.onlineModule }}</span>
      </div>
      <div class="num">
        <span style="margin-left: 14px">离线数:</span>
        <span style="
            font-weight: bold;
            color: #f8c300;
            font-size: 15px;
            margin-left: 8px;
          ">{{ Modulechartdata.offlineModule }}</span>
      </div>
      <my-ecarts :options="ModulechartOptions" class="middle-chart"></my-ecarts>
    </div>
    <div class="right-bottom">
      <div class="title">5G CPE</div>
      <div class="num-1">
        <span style="margin-left: 14px">在线数:</span>
        <span style="
            font-weight: bold;
            color: #f8c300;
            font-size: 15px;
            margin-left: 8px;
          ">{{ CPEchartdata.onlineCpe }}</span>
      </div>
      <div class="num-1">
        <span style="margin-left: 14px">离线数:</span>
        <span style="
            font-weight: bold;
            color: #f8c300;
            font-size: 15px;
            margin-left: 8px;
          ">{{ CPEchartdata.offlineCpe }}</span>
      </div>
      <my-ecarts :options="CPEchartOptions" class="bottom-chart"></my-ecarts>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import MyEcarts from "@/components/myEchart.vue";
import { getNumOf5GDevice } from "@/api/longrmap";
import { numOf5GDeviceInfo } from '@/mock'
const CPEchartdata = ref({});
const Modulechartdata = ref({});
let CPEchartOptions;
let ModulechartOptions;
const initChartData = async () => {
  const res = await getNumOf5GDevice();
  // const res =numOf5GDeviceInfo
  CPEchartdata.value = { onlineCpe: res.onlineCpe, offlineCpe: res.offlineCpe };
  Modulechartdata.value = {
    onlineModule: res.onlineModule,
    offlineModule: res.offlineModule,
  };

  CPEchartOptions = initOptions({ onlineCpe: res.onlineCpe, offlineCpe: res.offlineCpe },"CPE");
ModulechartOptions = initOptions({
    onlineModule: res.onlineModule,
    offlineModule: res.offlineModule,
  },"Module");
};


const initOptions = (data,flag) => {
  const options = {
    // 15,220,157
    title: {
      left: "center",
      textStyle: {
        color: "#6fbfd6",
      },
    },
    tooltip: {
      trigger: "item",
    },

    series: [
      {
        name: flag=='CPE'?"5G CPE":"5G 模组",
        type: "pie",
        radius: "55%",
        center: ["50%", "50%"],
        data: [
          { value:flag=='CPE'? data.onlineCpe:data.onlineModule, name: "在线数" },
          { value:flag=='CPE'? data.offlineCpe:data.offlineModule, name: "离线数" },
        ].sort(function (a, b) {
          return a.value - b.value;
        }),
        roseType: "radius",
        label: {
          color: "rgba(255, 255, 255, 0.3)",
        },
        labelLine: {
          lineStyle: {
            color: "rgba(255, 255, 255, 0.3)",
          },
          smooth: 0.2,
          length: 10,
          length2: 20,
        },
        itemStyle: {
          shadowBlur: 200,
          shadowColor: "rgba(0, 0, 0, 0.5)",
          color: function (params) {
            var colorList =flag=='CPE'?["#02B3F7","#EF8052"]:[ "#007AF4","#0FDC9D"];
            return colorList[params.dataIndex];
          },
        },
        animationType: "scale",
        animationEasing: "elasticOut",
        animationDelay: function (idx) {
          return Math.random() * 200;
        },
      },
    ],
  };
  return options;
};

initChartData();
</script>

<style lang="scss" scoped>
.wrap-right {
  width: 26vw;
  height: 96vh;
  display: flex;
  flex-direction: column;
  align-items: end;

  .right-top {
    margin-top: 3vh;
    width: 96%;
    height: 26vh;
    background-image: url("@/assets/teminal/right-top.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .right-middle {
    margin-top: 1vh;
    width: 77%;
    height: 28vh;
    position: relative;
    @include setBgByUrl("@/assets/teminal/right-center.png");
    .middle-chart {
      position: absolute;
      top: 5vh;
      width: 25vw;
      height: 20vh;
      left: 1vw;
    }

    .title {
      color: #6fbfd6;
      margin-left: 9vw;
      margin-top: 1vh;
      font-size: 16px;
    }

    .num {
      @include setBgByUrl("@/assets/teminal/rect-circle.png");
      @include flexStart;
      width: 10vw;
      height: 3.8vh;
      margin-top: 1.5vh;
      margin-left: 2vw;
      font-size: 12px;
      color: #fff;
    }
  }

  .right-bottom {
    margin-top: 1vh;
    width: 86%;
    padding: 22px;
    height: 28vh;
    background-image: url("@/assets/teminal/right-bottom.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: relative;

    .bottom-chart {
      position: absolute;
      width: 28vw;
      height: 23vh;
      top: 8vh;
      left: 3vw;
    }

    .title {
      color: #6fbfd6;
      margin-left: 12vw;
      margin-top: 1vh;
      font-size: 16px;
    }

    .num-1 {
      @include setBgByUrl("@/assets/teminal/rect-circle.png");
      @include flexStart;
      width: 10vw;
      height: 3.8vh;
      margin-top: 1.5vh;
      margin-left: 4vw;
      font-size: 12px;
      color: #fff;
    }
  }
}
</style>
