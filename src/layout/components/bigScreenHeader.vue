<template>
  <div class="header">
    <div class="left">
      <span class="date1"> {{ date1 }} </span>
      <span class="date2"> {{ getWeek() }} </span>
      <span class="date3"> {{ date3 }} </span>
    </div>
  
    <div class="center">超融合调度平台</div>
    <div class="right">
      <el-icon class="icon1" v-show="$route.name !== 'home'" @click="$router.push('/home')">
        <HomeFilled/>
      </el-icon>
      <el-icon class="icon1"  v-show="$route.name === 'home'" @click="handleFull" >
        <FullScreen/>
      </el-icon>
      <el-icon class="icon2" @click="hanldeRefresh"><Refresh /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElIcon, dayjs } from "element-plus";
import { HomeFilled,Refresh,FullScreen } from "@element-plus/icons-vue";
import { useIntervalFn } from '@vueuse/core'
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  HANDLE_CLICK_FULLSCREEN
} from "@/constants/eventbus";

import { useMitt } from "@/hooks/utils";

const router = useRouter();
const emitter = useMitt();




const handleFull=()=>{
  emitter.emit(HANDLE_CLICK_FULLSCREEN);
}
const getWeek = () => {
  const datas = dayjs().day();
  const week = ["日", "一", "二", "三", "四", "五", "六"];
  return "星期" + week[datas];
};

const hanldeRefresh=()=>{
  router.go(0)
}

const date1=ref(dayjs().format("YYYY-MM-DD"));
const date3 = ref(dayjs().format("hh:mm:ss"));


useIntervalFn(()=>{
  date1.value = dayjs().format("YYYY-MM-DD");
  date3.value = dayjs().format("hh:mm:ss");
},1000)

</script>

<style lang="scss">
.header {
  width: vw(1920);
  height: vh(68.2);
  display: flex;
  align-items: center;
 
  .left {
    display: flex;
    flex: 1;
    justify-content: flex-start;
    font-size: 20px;
    font-weight: 400;
    font-family: Source Han Sans CN;
    color: #ffffff;
    .date1 {
      opacity: 0.6;
      margin-left: vw(24);
    }
    .date2 {
      color: #80c2ff;
      opacity: 0.6;
      margin-left: vw(29);
    }
    .date3 {
      opacity: 0.6;
      margin-left: vw(24);
    }
  }
  .center {
    display: flex;
    flex: 1;
    font-family: Source Han Sans CN;
    justify-content: center;
    font-size: 28px;
    font-weight: 400;
    color: #ffffff;
    text-shadow: 0px 3px 0px rgba(73, 108, 220, 0.63);
  }
  .right {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    .icon1 {
      margin-right: vw(60);
      font-size: 29px;
      color: #3293ed;
      cursor: pointer;
    }
    .icon2 {
      margin-right: vw(60);
      font-size: 29px;
      color: #3293ed;
      cursor: pointer;
    }
  }
}
</style>
