<template>
  <div class="wrap-left">
    <div class="left-top"></div>
    <div class="left-middle">
      <div class="title">当前井下各区域人数</div>
      <my-ecarts
        :handle-click="handleClickBar"
        :options="barOptions"
        style="width: 18.5vw; height: 23vh; left: 10px"
      ></my-ecarts>
    </div>
    <div class="left-bottom">
      <div class="bottom-title">当前{{ info?.name || "区域" }}人数</div>
      <div class="scroll-herader">
        <span>姓名</span><span>部门</span><span>入井时间</span
        ><span>井下时长</span>
      </div>
      <SeamlessScroll class="the-demo-list" :delay="1" :duration="1.5">
        <div class="the-demo-list__item" v-for="(item, index) in scrollList">
          <span style="display: inline-block; width: 2.5vw">{{
            item.userName
          }}</span>
          <span style="display: inline-block; width: 3vw">{{
            item.deptName
          }}</span>
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="item.entryTime"
            placement="top"
          >
            <span
              style="
                display: inline-block;
                width: 5vw;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
              >{{ item.entryTime }}</span
            >
          </el-tooltip>
          <span
            style="
              display: inline-block;
              width: 3vw;
              display: inline-block;
              width: 5vw;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
            >{{ item.dstayTime }}</span
          >
        </div>
      </SeamlessScroll>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { dayjs } from "element-plus";
import { ElTooltip } from "element-plus";
import SeamlessScroll from "@/components/autoScrollTable.vue";
import MyEcarts from "@/components/myEchart.vue";
import { $echarts } from "@/utils/echarts";
import { findduser } from "@/api/longrmap";
import { underground_personnel_list } from '@/mock'
import {
  IS_HAVE_LOC
} from '@/constants/api';

const info = ref();
const barOptions = ref();
const underPerson = ref([]);
const scrollList = ref([]);

let res=underground_personnel_list

const handleClickBar = (params) => {
  console.log("===>?", params);
  info.value = params;
  const list = underPerson.value.filter(
    (item) => params.name === item.regionName
  );
  scrollList.value = list;
};

const initBarData = async () => {
 
  if(IS_HAVE_LOC){
    res = await findduser();
  }
  const groups = {};
  res.forEach((i) => {
    const key = i.regionName;
    if (!groups[key]) {
      groups[key] = 0;
    }
    groups[key] += 1;
  });
  underPerson.value = res;
  scrollList.value = res;
  const xData = Object.keys(groups) || [
    "区域1",
    "区域2",
    "区域3",
    "区域4",
    "区域5",
    "区域6",
  ];
  const yData = Object.values(groups) || [22, 13, 42, 34, 28, 7];
  barOptions.value = initOptions(xData, yData);
};


const initOptions = (xData, yData) => {
  let options = {
    backgroundColor: "#061326",
    grid: {
      top: "13%",
      left: "5%",
      bottom: "15%",
      right: "10%",
      containLabel: true,
    },
    tooltip: {
      show: true,
    },
    animation: false,
    xAxis: [
      {
        type: "category",
        data: xData,
        axisTick: {
          alignWithLabel: true,
        },
        nameTextStyle: {
          color: "#82b0ec",
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: "#82b0ec",
          },
        },
        axisLabel: {
          textStyle: {
            color: "#fff",
          },
          margin: 25,
        },
      },
    ],
   
    yAxis: [
      {
        show: true,
        type: "value",
        axisLabel: {
          textStyle: {
            color: "#fff",
          },
        },
        splitLine: {
          lineStyle: {
            color: "#19538E",
          },
        },
        axisLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: "",
        type: "pictorialBar",
        symbolSize: [30, 10],
        symbolOffset: [0, -6],
        symbolPosition: "end",
        z: 12,
        label: {
          normal: {
            show: true,
            position: "top",
            // "formatter": "{c}%"
            fontSize: 15,
            fontWeight: "bold",
            color: "#34DCFF",
          },
        },
        color: "#2DB1EF",
        data: yData,
      },
      {
        name: "",
        type: "pictorialBar",
        symbolSize: [30, 10],
        symbolOffset: [0, 7],
        // "barWidth": "20",
        z: 12,
        color: "#2DB1EF",
        data: yData,
      },
      {
        name: "",
        type: "pictorialBar",
        symbolSize: [50, 15],
        symbolOffset: [0, 12],
        z: 10,
        itemStyle: {
          normal: {
            color: "transparent",
            borderColor: "#2EA9E5",
            borderType: "solid",
            borderWidth: 1,
          },
        },
        data: yData,
      },
      {
        name: "",
        type: "pictorialBar",
        symbolSize: [70, 20],
        symbolOffset: [0, 18],
        z: 10,
        itemStyle: {
          normal: {
            color: "transparent",
            borderColor: "#19465D",
            borderType: "solid",
            borderWidth: 2,
          },
        },
        data: yData,
      },
      {
        type: "bar",
        barWidth: "30",
        barGap: "10%",
        barCateGoryGap: "10%",
        itemStyle: {
          normal: {
            color: new $echarts.graphic.LinearGradient(0, 0, 0, 0.7, [
              {
                offset: 0,
                color: "#38B2E6",
              },
              {
                offset: 1,
                color: "#0B3147",
              },
            ]),
            opacity: 0.8,
          },
        },
        data: yData,
        // 添加点击事件
        emphasis: {
          itemStyle: {
            color: "#38B2E6",
          },
        },
      },
    ],
  };
  if(xData.length>6){
    options.dataZoom=[
    {
        type: 'slider',
        xAxisIndex: 0,
        filterMode: 'empty',
        start: 0,
        end: 28,
        bottom: '2%',
        left: '5%',
        right: '5%',
    },
    {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty',
        start: 0,
        end: 6
    }
  ]
  }
  return options;
};
initBarData();
</script>

<style lang="scss" scoped>
.wrap-left {
  width: 26vw;
  height: 96vh;
  display: flex;
  flex-direction: column;

  .left-top {
    margin-top: 3vh;
    width: 96%;
    height: 26vh;
    @include setBgByUrl("@/assets/teminal/left-top.png");
  }

  .left-middle {
    .title {
      color: #6fbfd6;
      margin-left: 6vw;
      margin-top: 1vh;
      font-size: 16px;
    }

    margin-top: 1vh;
    width: 77%;
    height: 28vh;
    @include setBgByUrl("@/assets/teminal/left-center.png");
  }

  .left-bottom {
    @include setBgByUrl("@/assets/teminal/left-bottom.png");
    margin-top: 1vh;
    width: 86%;
    padding: 22px;
    height: 28vh;

    .bottom-title {
      color: #6fbfd6;
      margin-left: -2vw;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      margin-bottom: 1vh;
      font-size: 16px;
    }

    .scroll-herader {
      display: flex;
      color: #01abd8;
      font-weight: bold;
      justify-content: space-around;
      height: 36px;
      line-height: 36px;
      width: 80%;
      font-size: 14px;
    }

    .the-demo-list {
      color: #fff;
      height: 19vh;
      width: 80%;

      &__item {
        height: 34px;
        font-size: 12px;
        line-height: 34px;
        display: flex;
        justify-content: space-around;

        :first-child {
          width: 30px;
          @include flexCenter;
        }
      }

      :deep(
          .seamless-scroll__box--odd
            .seamless-scroll__box-top
            > *:nth-child(2n + 1)
        ) {
        background-color: rgba(20, 68, 122, 0.6);
      }

      :deep(
          .seamless-scroll__box--odd
            .seamless-scroll__box-bottom
            > *:nth-child(2n)
        ) {
        background-color: rgba(20, 68, 122, 0.6);
      }

      :deep(
          .seamless-scroll__box--even
            .seamless-scroll__box-top
            > *:nth-child(2n + 1)
        ) {
        background-color: rgba(20, 68, 122, 0.6);
      }

      :deep(
          .seamless-scroll__box--even
            .seamless-scroll__box-bottom
            > *:nth-child(2n + 1)
        ) {
        background-color: rgba(20, 68, 122, 0.6);
      }
    }
  }
}
</style>
