<template>
  <div class="person-wrap">
    <div class="person-top">
      <div class="info">
        <div v-for="item in stationInfos">
          <div class="label-left">
            <img
              :src="item.labelImgSrc"
              alt="#"
              srcset=""
              style="width: 18px; height: 18px; margin-right: 10px"
            />
            <p>{{ item.label }} :</p>
          </div>
          <span>{{ item.value }}</span>
        </div>
      </div>
    </div>
    <div class="middle-content">
      <div
        class="middle-item"
        v-for="item in controlPanelList"
        @click="handlePanalClick(item.name)"
      >
        <img :src="item.icon" alt="#" />
      </div>
    </div>
    <div class="repair-btn" @click="handleRepair">一键报修</div>
    <CommonTitle title="环境监测"></CommonTitle>
    <div class="person-table">
      <div class="table-title">
        <span>监测项目</span>
        <span>监测数值</span>
        <span>是否正常</span>
      </div>
      <div class="table-content">
        <div class="row" v-for="item in monitorList">
          <span>{{ item.monitorPro }}</span>
          <span>{{ item.monitorNum }}</span>
          <span :style="{ color: item.isNormal ? 'green' : 'red' }">{{
            item.isNormal ? "正常" : "异常"
          }}</span>
        </div>
      </div>
    </div>
    <div class="person-bottom-bg"></div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import {  ElMessage } from 'element-plus';
import phoneIcon from "@/assets/images/phone.png";
import monitorIcon from "@/assets/images/monitor.png";
import personIcon from "@/assets/images/person.png";
import intercomIcon from "@/assets/images/Intercom.png";
import broadcastIcon from "@/assets/images/broadcast.png";
import landlineIcon from "@/assets/images/landline.png";
import CommonTitle from "@/components/commonTitle.vue";

import nameIcon from "@/assets/images/setting.png";
import areaIcon from "@/assets/images/area.png";
import ipIcon from "@/assets/images/ip.png";
import statusIcon from "@/assets/images/status.png";
import typeIcon from "@/assets/images/type.png";
import { ringUp } from "@/api";
import { useGlobalStore } from "@/store/global";

const globalStore = useGlobalStore();

const props = defineProps({
  stationInfo: {},
});

const stationInfos = ref([
  { labelImgSrc: nameIcon, label: "名称", value: "变电所10米基站" },
  { labelImgSrc: areaIcon, label: "所在区域", value: "机运工区" },
  { labelImgSrc: ipIcon, label: "IP地址", value: "192.163.120.3" },
  { labelImgSrc: statusIcon, label: "基站状态", value: "离线" },
  { labelImgSrc: typeIcon, label: "基站类型", value: "WI-FI6基站" },
]);
const controlPanelList = [
  {
    icon: phoneIcon,
    name: "电话",
  },
  {
    icon: monitorIcon,
    name: "视频",
  },
  {
    icon: personIcon,
    name: "人员",
  },
  {
    icon: intercomIcon,
    name: "语音",
  },
  {
    icon: broadcastIcon,
    name: "广播",
  },
  {
    icon: landlineIcon,
    name: "广播",
  },
];
const monitorList = [
  { monitorPro: "甲烷", monitorNum: "2.2%", isNormal: true },
  { monitorPro: "一氧化碳", monitorNum: "0.3%", isNormal: true },
];

const handleRepair = async () => {
  ElMessage({
      message:`呼叫${globalStore.sysInfo.maintenanceName}-${globalStore.sysInfo.maintenanceNumber}成功`,
      type: "success",
    });
  await ringUp({
    calledNumber: globalStore.sysInfo.maintenanceNumber,
    callerNumber: "8001",
  });
};
const handlePanalClick = (val) => {
  console.log(val);
};

watch(
  () => props.stationInfo,
  (newVal) => {
    console.log("==>stationInfo", newVal);
    stationInfos.value = [
      { labelImgSrc: nameIcon, label: "名称", value: newVal?.nodeName },
      {
        labelImgSrc: areaIcon,
        label: "所在区域",
        value: newVal?.location || "",
      },
      { labelImgSrc: ipIcon, label: "IP地址", value: newVal?.nodeIp },
      {
        labelImgSrc: statusIcon,
        label: "基站状态",
        value: newVal.nodeStatus ? "在线" : "离线",
      },
      { labelImgSrc: typeIcon, label: "基站类型", value: newVal?.nodeType },
    ];
  }
);
</script>

<style lang="scss" scoped>
.person-wrap {
  animation: showTransition 400ms ease-in-out;
  animation-fill-mode: forwards;
  will-change: opacity, transform;
  margin-top: 2vh;
  margin-right: 0.5vw;
  padding: 20px;
  width: 15vw;
  height: 82vh;
  background-image: url("@/assets/images/mullion.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .person-top {
    display: flex;
    justify-content: space-between;
    .info {
      margin-left: 1.3vw;
      font-size: 14px;
      color: #ffffff;
      .label-left {
        @include flexCenter;
      }
      div {
        display: flex;
        line-height: vh(30);
      }
      span {
        margin-left: 0.8vw;
        display: inline-block;
        @include single-line;
      }
    }
  }
  .middle-content {
    margin-top: vh(20);
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px 1px;
    align-items: center;
    justify-items: center;
    .middle-item {
      cursor: pointer;
    }
  }
  .repair-btn {
    @include flexCenter;
    cursor: pointer;
    height: 4vh;
    width: 13vw;
    border: 0.5px solid #47686b;
    background: rgb(10, 32, 32, 0.5);
    margin: 1vw;
  }
  .person-table {
    margin-top: vh(20);
    font-size: 12px;
    .table-title {
      margin-top: vh(20);
      color: #28a5b3;
      font-weight: bold;
      display: flex;
      justify-content: space-around;
    }
    .table-content {
      margin-top: 1vw;
      .row {
        line-height: 3vh;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        align-items: center;
        justify-items: center;
      }
    }
  }
  .person-bottom-bg {
    margin-top: vh(40);
    width: 100%;
    height: vh(115);
    background-image: url("@/assets/images/environment.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}

@keyframes showTransition {
  0% {
    opacity: 0;
    transform: none;
  }
  99% {
    opacity: 1;
    transform: translateX(-20%);
  }
  100% {
    opacity: 1;
    transform: translateX(-20%);
  }
}
</style>
