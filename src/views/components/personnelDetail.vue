<template>
  <div class="person-wrap">
    <div class="person-top">
      <img :src="imgUrl" alt="暂未得到人像信息" class="photo" />
      <div class="info">
        <div v-for="item in personInfos">
          <p>{{ item.label }}</p>
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
    <div class="play-btn" @click="$router.push('/play-back')">轨迹回放</div>
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
import phoneIcon from "@/assets/images/phone.png";
import monitorIcon from "@/assets/images/monitor.png";
import personIcon from "@/assets/images/person.png";
import intercomIcon from "@/assets/images/Intercom.png";
import broadcastIcon from "@/assets/images/broadcast.png";
import landlineIcon from "@/assets/images/landline.png";
import personPhoto from "@/assets/kuanggong.png";
import CommonTitle from "@/components/commonTitle.vue";
import { getUserDetail } from "@/api/longrmap";
import { dayjs } from "element-plus";
// const personPhoto = "@/assets/long.jpg";

const props = defineProps({
  personInfo: {},
});
const personInfos = ref([
  { label: "姓名", value: "高迎辉" },
  { label: "部门", value: "机电队" },
  { label: "职务", value: "技术员" },
  { label: "井下时长", value: "1679时3分" },
  { label: "下井时间", value: "2023-02-08 17:18:34" },
  { label: "当前所在区域", value: "" },
]);
const imgUrl = ref(personPhoto);
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
  { monitorPro: "甲烷", monitorNum: "2.2%", isNormal: false },
  { monitorPro: "一氧化碳", monitorNum: "0.3%", isNormal: true },
];

const handlePanalClick = (val) => {
  console.log(val);
};

watch(
  () => props.personInfo,
  async (newVal) => {
    const res = await getUserDetail({ tagId: newVal.id });
    // const res = {
    //   userName: newVal.userName,
    //   deptName: "综采队",
    //   duty: "队长",
    //   sumMinu: `${~~(Math.random() * 1000)}时`,
    //   dwTime: `${dayjs()
    //     .subtract(~~(Math.random() * 10), "day")
    //     .format("YYYY-MM-DD hh:mm:ss")}`,
    //   regionName: `辅运巷${~~(Math.random() * 1000)}米`,
    // };
    imgUrl.value =
      res.imgUrl && res.imgUrl !== ":8080" ? res.imgUrl : personPhoto;
    personInfos.value = [
      { label: "姓名", value: res?.userName },
      { label: "部门", value: res?.deptName },
      { label: "职务", value: res?.duty },
      { label: "井下时长", value: res?.sumMinu },
      { label: "下井时间", value: res?.dwTime },
      { label: "当前所在区域", value: res?.regionName },
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
  width: 18vw;
  height: 83vh;
  background-image: url("@/assets/images/mullion.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .person-top {
    display: flex;
    justify-content: space-between;
    img {
      width: 35%;
      height: vh(180);
    }
    .info {
      font-size: 12px;
      color: #ffffff;
      div {
        display: flex;
        line-height: vh(30);
      }
      span {
        margin-left: 0.5vw;
        display: inline-block;
        @include single-line;
      }
    }
  }
  .play-btn {
    @include flexCenter;
    cursor: pointer;
    height: 3.5vh;
    width: 13vw;
    border: 0.5px solid #47686b;
    background: rgb(10, 32, 32, 0.5);
    margin: 1vh;
    margin-left: 2vw;
    font-size: 14px;
    font-weight: bold;
    position: relative;
    outline: none;
  }
  .play-btn::before,
  .play-btn::after {
    box-sizing: inherit;
    position: absolute;
    content: "";
    border: 0.5px solid transparent;
    width: 0;
    height: 0;
  }

  .play-btn::after {
    bottom: 0;
    right: 0;
  }

  .play-btn::before {
    top: 0;
    left: 0;
  }

  .play-btn:hover::before,
  .play-btn:hover::after {
    width: 100%;
    height: 100%;
  }

  .play-btn:hover::before {
    border-top-color: #4361ee;
    border-right-color: #4361ee;
    transition: width 0.3s ease-out, height 0.3s ease-out 0.3s;
  }

  .play-btn:hover::after {
    border-bottom-color: #4361ee;
    border-left-color: #4361ee;
    transition: border-color 0s ease-out 0.6s, width 0.3s ease-out 0.6s,
      height 0.3s ease-out 1s;
  }

  .middle-content {
    margin-top: vh(20);
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 1px 1px;
    align-items: center;
    justify-items: center;
    .middle-item {
      cursor: pointer;
    }
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
