<template>
  <div class="right-wrap">
    <div class="right-top">
      <el-input
        v-model="searchVal"
        class="search-input"
        placeholder="请输入:人员姓名"
        :prefix-icon="Search"
      />
      <el-button type="primary" class="query-btn" @click="handleSeachUser"
        >搜索</el-button
      >
    </div>
    <div class="work-wrap">
      <CommonTitle title="运行时长" style="margin-bottom: 1.42vh"></CommonTitle>
      <div class="time-content">
        <div v-for="item in times">
          <span v-if="isNaN(Number(item, 10))"> {{ item }}</span>
          <div class="item-time" v-else>{{ item }}</div>
        </div>
      </div>
    </div>

    <div class="sound-wrap">
      <CommonTitle title="录音时长" style="margin-bottom: 1.42vh"></CommonTitle>
      <div class="sound-content">
        <div class="sound-item">
          <div class="cirle">
            <p>{{ ~~soundRecordInfo?.count || 0 }}</p>
            <p>个</p>
          </div>
          <p class="sound-type">录音总数</p>
        </div>
        <div style="margin-left: 1.77vw" class="sound-item">
          <div class="cirle">
            <p style="color: #fadab5">
              {{ ~~(soundRecordInfo?.duration / 3600) || 0 }}
            </p>
            <p style="color: #fadab5">小时</p>
          </div>
          <p class="sound-type">录音总时长</p>
        </div>
      </div>
    </div>
    <CommonTitle
      title="拨号盘"
      style="margin-top: 3vh; margin-bottom: 3.42vh"
    ></CommonTitle>
    <div class="num-wrap">
      <div class="total-num">
        <el-input
          v-model="inputVal"
          placeholder="请输入号码"
          @input="handleInput"
        >
          <template #suffix>
            <div @click="handleDel" style="cursor: pointer">
              <img :src="deleteIcon" alt="#" />
            </div>
          </template>
        </el-input>
      </div>
      <div class="phone-wrap">
        <div v-for="item in numList" class="item-wrap" @click="handleNum(item)">
          <span v-if="item.phone" class="phone-icon" ></span>
          <span v-else-if="item.camera" class="camera-icon"></span>
          <span v-else> {{ item.num }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElInput, ElButton, ElMessage } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { getSystemRunInfo, getNumOfRecordings, ringUp, callVideo } from "@/api";
import CommonTitle from "@/components/commonTitle.vue";
import deleteIcon from "@/assets/delete.png";
import { findduser } from "@/api/longrmap";
import { useMitt,isEmptyObject } from "@/hooks/utils";
import { HANDLE_SEARCH_USER } from "@/constants/eventbus";
import { SINGLE_SELECT_DEVICES } from "@/constants/eventbus";
import { peopleAndCarInfo } from '@/mock'

const emitter = useMitt();

let curList = [];
const inputVal = ref("");
const searchVal = ref("");
const soundRecordInfo = ref();

const times = ref("42天12时35分55秒");

// 获取
const getRunTime = async () => {
  const res = await getSystemRunInfo();
  times.value = res?.sysRunningTime;
};
const getRecordings = async () => {
  const res = await getNumOfRecordings();
  soundRecordInfo.value = res;
};

// 3.录音数量统计
getRecordings();
getRunTime();

const numList = [
  { num: 1 },
  { num: 2 },
  { num: 3 },
  { num: 4 },
  { num: 5 },
  { num: 6 },
  { num: 7 },
  { num: 8 },
  { num: 9 },
  { phone: true },
  { num: 0 },
  { camera: true },
];

const handleNum = async (item) => {
  if (item.phone) {
    if (!inputVal.value) {
      return ElMessage({
        message: "请输入号码后重试",
        type: "warning",
      });
    }
      await ringUp({ calledNumber: inputVal.value, callerNumber: "8001" });
    ElMessage({
        message: "呼叫成功",
        type: "success",
      });
  
  } else if (item.camera) {
    if (!inputVal.value) {
      return ElMessage({
        message: "请输入号码后重试",
        type: "warning",
      });
    }
    await callVideo({ calledNumber: inputVal.value, callerNumber: "8001" });
    ElMessage({
        message: "呼叫成功",
        type: "success",
      });
  } else {
    curList.push(item.num);
    inputVal.value = curList.join("");
  }
};

const handleDel = () => {
  curList.pop();
  inputVal.value = curList.join("");
};
const handleInput = () => {
  curList = inputVal.value.split("");
};

const handleSeachUser = async () => {
  // 查询后思路

  // userName sipId
  if (searchVal.value) {
    // mock数据
    const res = await findduser({
      userName: searchVal.value,
      pageNum: 1,
      pageSize: 10,
    });
   if(!isEmptyObject(res)){
    emitter.emit(HANDLE_SEARCH_USER, res);
   }
   
  }
};

emitter.on(SINGLE_SELECT_DEVICES, (options) => {
  inputVal.value = options.extensionNum;
});

onUnmounted(() => {
  emitter.off(SINGLE_SELECT_DEVICES);
});

</script>

<style lang="scss" scoped>
.right-wrap {
  position: relative;
  width: 17.864vw;
  height: 89.6vh;
  background: rgba(41, 50, 60, 0.61);
  box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  margin-top: vh(37);
  margin-right: vw(72);
  color: #ffffff;
  .right-top {
    position: relative;
    top: vh(25);
    left: vw(11);
    display: flex;
    justify-content: space-between;
    :deep(.el-input__inner) {
      width: vw(219);
      height: vh(42);
      background: rgba(84, 103, 141, 0.3);
      border: 1px solid #ffffff;
      border-radius: 6px;
      color: #dedede;
      font-weight: 400;
    }
    :deep(.el-input__prefix) {
      top: 0px !important;
    }
    .query-btn {
      position: relative;
      right: 18px;
      width: vw(93);
      height: vh(42);
      background: #2a4a6b;
      border-radius: 6px;
    }
  }
  .work-wrap {
    margin-top: vh(50);
    .time-content {
      width: vw(281);
      height: vh(46);
      margin-top: vh(20);
      margin-left: vw(30);
      border: 2px solid #b5f7fe;
      border-left: none;
      border-right: none;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .item-time {
        @include flexCenter;
        width: vw(21);
        height: vh(34);
        border: 1px solid #b5f7fe;
        background: rgba(53, 78, 89, 0.5);
        font-size: 18px;
        font-weight: 400;
        color: #fff;
      }
    }
  }
  .sound-wrap {
    margin-top: vh(50);
    .sound-content {
      @include flexStart;
      margin-top: vh(41);
      .sound-item {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin-left: 2.92vw;
      }
      .sound-type {
        margin-top: 2vh;
        font-weight: 400;
        color: #bbe1fd;
        font-size: 14px;
      }
      .cirle {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: vw(104);
        height: vw(104);
        background-image: url("@/assets/circle1.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        p {
          color: #f29894;
          font-weight: 400;
        }
      }
    }
  }
}
.num-wrap {
  box-sizing: border-box;
  padding: vh(30) vw(24);
  background: rgba(0, 0, 0, 0.34);
  border-radius: 10px;
  margin: 0 auto;
  width: 14.68vw;
  height: 30vh;
  .total-num {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 11.9vw;
    img {
      width: vw(28);
      height: vw(28);
    }
    :deep(.el-input__inner) {
      font-size: 17px;
      font-weight: 400;
      background: rgba(0, 0, 0, 0.34);
      height: vh(42);
      color: #fff;
    }
    :deep(.el-input__suffix) {
      top: 0px !important;
    }
  }
  .phone-wrap {
    margin-top: 1.94vh;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px 1px;
    align-items: center;
    justify-items: center;
    /* justify-content属性是整个内容区域在容器里面的水平位置（左中右），align-content属性是整个内容区域的垂直位置（上中下）。 */
    justify-content: center;
    align-content: center;
    .item-wrap {
      @include flexCenter;
      cursor: pointer;
      width: 3.9vw;
      height: 3.8vh;
      background: linear-gradient(
        0deg,
        rgba(31, 43, 58, 0.9),
        rgba(53, 74, 101, 0.9)
      );
      color: #fff;
      border-radius: 5px;
      .phone-icon {
        display: block;
        width: vw(25);
        height: vh(26);
        background-image: url("@/assets/phonecolor.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      .camera-icon {
        display: block;
        width: vw(25);
        height: vh(26);
        background-image: url("@/assets/camera.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
