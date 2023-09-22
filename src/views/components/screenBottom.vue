<template>
  <div class="screen-bottom">
    <div class="img-area" @click="open">
      <img :src="broadcast" alt="广播" />
      <span>广播</span>
    </div>
    <div class="img-area" @click="handleVideo">
      <img
        :src="video"
        alt="视频"
        style="
          width: 2vw;
          height: 2vw;
          margin-top: 4px;
          transform: translateY(8vw);
          filter: drop-shadow(#39afff 0 -8vw);
        "
      />

      <span style="margin-top: 2px">视频</span>
    </div>
    <div class="img-area" @click="handleRingUp">
      <img :src="Intercom" alt="语音" />
      <span>语音</span>
    </div>
    <div class="img-area" @click.stop="() => $router.push('/pre-warn')">
      <img
        :src="yuan"
        alt="预案"
        style="
          width: 1.8vw;
          height: 1.8vw;
          margin-top: 5px;
          transform: translateY(8vw);
          filter: drop-shadow(#39afff 0 -8vw);
        "
      />
      <span style="margin-top: 4px">预案</span>
    </div>
  </div>
  <div class="broad-dialog">
    <el-dialog
      v-model="dialogVisible"
      title="区域广播"
      width="35%"
      :modal="false"
      :before-close="() => (dialogVisible = false)"
    >
    <div class="broad-dialog-wrap">
      <div class="broad-num">
        <p style="color: #009CE7;">选中号码</p>
        <el-tag
        style="margin-right: 5px;margin-top: 5px"
        v-for="tag in tags"
        :key="tag"
        closable
        hit
        class="mx-1"
        type="info"
        @close="handleClose(tag)"
      >
        {{ tag }}
      </el-tag>
      </div>
      <div class="broad-des">
        <p style="color: #009CE7;">广播内容</p>
        <p style="margin-top: 5px">{{ globalStore.sysInfo.broadcastContent }}</p>
      </div>
    </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="dialogVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="handleSubmit"> 开始广播 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { startPlan } from "@/api";
import { ref } from "vue";
import {
  ElMessage,
  ElNotification,
  ElTag,
  ElDialog,
  ElButton,
} from "element-plus";
import { useWebSocketStore } from "@/store/webSocket";
import { useGlobalStore } from "@/store/global";
import { SINGLE_SELECT_DEVICES } from "@/constants/eventbus";
import Intercom from "@/assets/images/Intercom.png";
import broadcast from "@/assets/images/broadcast.png";
import video from "@/assets/images/视屏通话.png";
import yuan from "@/assets/images/应急预案库.png";
import { ringUp, callVideo } from "@/api";

const globalStore = useGlobalStore();

const webSocketStore = useWebSocketStore();
const { selectedShapList } = storeToRefs(webSocketStore);
const tags = ref([]);
const dialogVisible = ref(false);
const num = ref();

import { useMitt } from "@/hooks/utils";

const emitter = useMitt();

const handleClose = (tag) => {
  tags.value.splice(tags.value.indexOf(tag), 1);
};

const handleRingUp = async () => {
  if (!num.value) {
    return ElMessage({
      type: "warning",
      message: "请选择设备",
    });
  }
  await ringUp({ calledNumber: num.value, callerNumber: "8001" });
  ElMessage({
    type: "success",
    message: `呼叫号码${num.value}成功`,
  });
};
const handleVideo = async () => {
  if (!num.value) {
    return ElMessage({
      type: "warning",
      message: "请选择设备",
    });
  }
  await callVideo({ calledNumber: num.value, callerNumber: "8001" });
  ElMessage({
    type: "success",
    message: `呼叫号码${num.value}成功`,
  });
};

emitter.on(SINGLE_SELECT_DEVICES, (options) => {
  num.value = options.extensionNum;
});

const handleSubmit = async () => {
  const setPhoneNums = tags.value.join(",");
  if (setPhoneNums) {
    await startPlan({
      number: setPhoneNums,
      content: globalStore.sysInfo.broadcastContent,
    });
    ElNotification({
      title: "广播",
      message: `广播成功`,
      type: "success",
    });
    dialogVisible.value = false;
  }else{
    ElNotification({
      title: "广播",
      message: `该区域内并无支持广播的设备`,
      type: "warning",
    });
    dialogVisible.value = false;
  }
};

const open = () => {
  // 外线 有线 广播  取:extensionNum
  const setPhoneNums = selectedShapList.value
    .filter((j) => [2, 8, 6].includes(j.deviceType))
    .map((item) => item.extensionNum)
    .filter((_i) => _i !== "");
  tags.value = setPhoneNums;
  if (setPhoneNums.length) {
    dialogVisible.value = true;
  } else {
    ElMessage({
      type: "warning",
      message: "请选择广播设备",
    });
  }
};
</script>

<style scoped lang="scss">
.screen-bottom {
  position: fixed;
  z-index: 999;
  width: 65vw;
  left: 18vw;
  height: 6vh;
  bottom: 0.5vh;
  background-image: url("@/assets/images/bottompanel.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .img-area {
    @include flexCenter;
    cursor: pointer;
    width: 5.5vw;
    height: 5.5vw;
    margin-top: -1.5vw;
    background-image: url("@/assets/images/rect-click-icon.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    img {
      margin-top: -10px;
      width: 3vw;
      height: 3vw;
    }
    span {
      margin-top: -8px;
      font-size: 12px;
    }
  }
}
.broad-dialog {
  .broad-dialog-wrap{
    display: flex;
    .broad-num{
      flex: 1;
    
      padding: 18px;
      padding-top: 10px;
      border-right: 2px dashed #0A81B9;
      border-bottom: 2px dashed #0A81B9;
    }
    .broad-des{
      flex: 1;
      padding: 18px;
      padding-top: 10px;
      border-bottom: 2px dashed #0A81B9;
    }
  }
  .dialog-footer{
    margin-top: 10px;
  }

  :deep(.el-dialog) {
    width: 500px;
    background: rgba(40,50,60, 1);
  }
  
  :deep(.el-dialog__header){
     background-color: #1F4B6E;
     margin-right: 0;
     padding-top: 10px;
  }

  :deep(.el-dialog__body){
    padding: 0 !important;
  }
  :deep(.el-dialog__title) {
    color: #fff !important;
  }
  :deep(.el-dialog__headerbtn){
    top: -1px;
    
  }
  :deep(.el-dialog__close){
    color: #fff !important;
  }
  :deep(.el-dialog__body) {
    padding: 20px 20px;
    color: #fff !important;
  }
  :deep(.el-dialog__footer){
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
