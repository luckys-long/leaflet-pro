<template>
  <div class="wrap">
    <ScreenHeader />
    <div class="content">
      <div class="left">
        <div class="left-title">
          <span>{{ title || "预案类别" }}</span>
        </div>
        <div class="img-wrap">
          <div class="img-item" v-for="item in warnType" :style="item?.styles"  @click="handleActive(item)">
            <img
              :src="item.planId=== activePlanId ? item.activeSrc : item.src"
              alt="#"
             
            />
            <span
              class="wran-text"
              :style="`color:${
                item.planId === activePlanId ? '#F4AC55' : '#6dfaf9'
              }`"
              >{{ item.name+'预案' }}</span
            >
          </div>
        </div>
      </div>
      <div class="right">
        <div class="right-title">
          <span>预案步骤</span>
          <img :src="arrow" alt="箭头" />
        </div>
        <div class="title-line"></div>
        <div class="btn" @click="handleStartPlan"></div>
        <div class="right-list">
          <div v-for="(item, index) in stepList" class="item">
            <img :src="circle" alt="圆" class="item-img" />
            <span class="step-line"> 一 </span>
            <span class="step-num">Step{{ index + 1 }}</span>
            <div class="item-text">
              {{ item }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElNotification  } from "element-plus";
import ScreenHeader from "@/layout/components/bigScreenHeader.vue";
import blueWater from "@/assets/icon_map/plan-blue-water.png";
import orangeWater from "@/assets/icon_map/plan-orange-warter.png";
import fire from "@/assets/icon_map/plan-blue-fire.png";
import orangefire from "@/assets/icon_map/plan-orange-fire.png";
import fall from "@/assets/icon_map/plan-blue-fall.png";
import orangefall from "@/assets/icon_map/plan-orange-fall.png";
import gas from "@/assets/icon_map/plan-blue-gas.png";
import orangegas from "@/assets/icon_map/plan-orange-gas.png";
import flow from "@/assets/icon_map/plan-blue-flow.png";
import orangeflow from "@/assets/icon_map/plan-orange-flow.png";
import arrow from "@/assets/icon_map/arrow.png";
import circle from "@/assets/icon_map/circle.png";
import { reservePlanList } from '@/mock'

import { getPlanList, startPlan } from "@/api";

const activePlanId = ref();
const broadcastNumber=ref('')
const title = ref(undefined);
const planList=ref([])
const stepList = ref([
  "调度室员接到报警电话",
  "启动《阳煤矿井下发生火灾应急救援预案》同时要 记录清楚汇报人的姓名，事故发生的时间，现场情况；",
  "立即通知矿值班领导、救护队、各科室行政正职到调 度室待命，记录到达调度室的报到时间；",
  "汇报公司调度，同时准备好和相关必备图纸；",
  "接到矿长命令后通知井下受本次灾害威胁人员迅速撤离， 并通知井巷施工队等单位，同时要求机电科、通风科及 人事科协同统计入井人数和升井人数及人员撤离情况。",
]);

const warnType = ref([
  {
    type: "water",
    src: blueWater,
    activeSrc: orangeWater,
    name: "水灾预案",
    planId: "5",
  },
  {
    type: "fire",
    src: fire,
    activeSrc: orangefire,
    name: "火灾预案",
    styles: {
      "margin-left": "-2.8vw",
      transform: "translateY(15vh)",
    },
    planId: "4",
  },
  {
    type: "puking",
    src: fall,
    activeSrc: orangefall,
    name: "冒顶预案",
    styles: {
      "margin-left": "10.15vw",
      transform: "translateY(24vh)",
    },
    planId: "3",
  },
  {
    type: "gas",
    src: gas,
    activeSrc: orangegas,
    name: "瓦斯预案",
    styles: {
      "margin-left": "8.91vw",
      transform: "translateY(15vh)",
    },
    planId: "2",
  },
  {
    type: "flow",
    src: flow,
    activeSrc: orangeflow,
    name: "反风预案",
    planId: "1",
  },
]);

const dealData = (item) => {
  const _item = item;
  _item.stepList = [
    item.stepOne,
    item.stepTwo,
    item.stepThree,
    item.stepFour,
    item.stepFive,
  ];
};

const initPlanList = async () => {
  const res = await getPlanList({ pageNum: 1, pageSize: 10 });
  const { list } = res;
  // mock 数据 
  // const list =reservePlanList
  list.map((item) => {
    dealData(item);
  });
  planList.value=list
  activePlanId.value=list[0].planId
  // 只取前5项 多了图片不够用
  for (let i = 0; i < 5; i++) {
    const { planId, planName } = list[i];
    warnType.value[i] = {...warnType.value[i], planId, name: planName };
  }
  getCurPlan(activePlanId.value)
};


const getCurPlan=(activePlanId)=>{
  const result = planList.value.find((item) => item.planId === activePlanId);
  stepList.value=result.stepList
  title.value=result.planName
  broadcastNumber.value=result.broadcastNumber
};

const handleStartPlan = async () => {
  try{
    await startPlan({ number: broadcastNumber.value, content: String(stepList.value) });
    ElNotification({
    title: title.value,
    message: `${title.value}预案，启动成功`,
    type: 'success',
  })
  }catch{
    ElNotification({
    title: title.value,
    message: `${title.value}预案，启动失败`,
    type: 'Error',
  })
  }
};


const handleActive = (item) => {
  title.value = item.name;
  activePlanId.value=item.planId
  getCurPlan(item.planId)
};
initPlanList();
</script>

<style lang="scss">
.wrap {
  width: vw(1920);
  height: vh(1080);
  background-image: url("@/assets/icon_map/plan-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .content {
    position: relative;
    display: flex;
    .left {
      display: flex;
      flex-direction: column;
      flex: 1;
      .left-title {
        @include flexCenter;
        margin-left: vw(257);
        margin-top: vh(98);
        width: vw(761);
        height: vh(53);
        border: 2px solid rgba(85, 187, 246, 0.26);
        border-left: none;
        border-right: none;
        background: rgba(85, 187, 246, 0.26);
        span {
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #f0f1f7;
        }
      }
      .img-wrap {
        display: flex;
        justify-content: flex-start;
        margin-top: vh(246);
        margin-left: vw(149);
        .img-item {
          position: relative;
          img {
            cursor: pointer;
            width: vw(144);
            height: vh(188);
            // transform: translateY(30px);
          }
          .wran-text {
            position: absolute;
            display: inherit;
            font-size: 14px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #6dfaf9;
            left: vw(35);
            top: vh(95);
          }
        }
      }
    }
    .right {
      display: flex;
      flex: 1;
      position: relative;
      .right-title {
        position: absolute;
        top: vh(65);
        right: vw(145);
        width: vw(480);
        height: vh(52);
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #f0f1f7;
        border-bottom: 2px solid #2a3954;
      }
      .title-line {
        position: absolute;
        top: vh(118);
        left: vw(110);
        width: 120px;
        height: 2px;
        background: #70f9fe;
      }
      .btn {
        cursor: pointer;
        position: absolute;
        top: vh(153);
        right: vw(105);
        width: vw(129);
        height: vh(43);
        background-image: url("@/assets/icon_map/plan-start.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      .right-list {
        position: absolute;
        top: vh(208);
        right: vw(105);
        .item {
          position: relative;
          display: flex;
          .item-img {
            position: absolute;
            left: -4.4vw;
            top: 1.2vh;
            margin-top: 3.5vh;
            width: vw(106);
            height: vh(105);
            z-index: 2;
          }
          .step-line {
            position: absolute;
            left: -2.25vw;
            top: 15vh;
            color: #6efcfe;
            font-weight: bold;
            transform: rotate(90deg);
          }
          .step-num {
            position: absolute;
            left: -3.3vw;
            top: 7.9vh;
            font-size: 16px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #6af4fe;
          }
          .item-text {
            @include single-line;
            width: vw(442);
            height: vh(80);
            line-height: vh(80);
            padding-left: vw(34);
            padding-right: vw(34);
            color: #bbe1fd;
            font-weight: 400;
            font-size: 12px;
            margin-top: 5.9vh;
            background-image: url("@/assets/yuanjiaojuxing.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
          }
        }

        .item:first-child {
          .item-img {
            margin-top: 0;
            position: absolute;
            left: -4.4vw;
            top: -1.2vh;
          }
          .step-line {
            position: absolute;
            left: -2.25vw;
            top: 9.3vh;
          }
          .step-num {
            position: absolute;
            left: -3.3vw;
            top: 2.2vh;
          }
          div {
            margin-top: 0;
          }
        }
        .item:last-child {
          .step-line {
            display: none;
          }
        }
      }
    }
  }
}
</style>
