<template>
  <div class="wrap">
    <ScreenHeader />
    <div class="main-wrap">
      <left-nav></left-nav>
      <div class="center-wrap">
        <SearchForm v-show="searchCardShow"></SearchForm>
        <CenterMap></CenterMap>
      </div>
      <!-- @transitionend="transitionend" 控制滞后的W  H -->
      <div
        :class="`right-bar ${
          changeRightBarWidth ? 'change-right-bar-width' : ''
        }`"
      >
        <RightCard />
        <img
          class="img-retract"
          :src="arrow"
          alt="箭头"
          @click="handleRetractRight"
        />
      </div>
      <img
        class="img-expand"
        v-show="changeRightBarWidth"
        :src="arrow"
        alt="箭头"
        @click="handleExpandRight"
      />
      <PersonnelDetail
        v-show="personCardShow"
        :personInfo="personInfo"
      ></PersonnelDetail>
      <StationCard
        :stationInfo="stationInfo"
        v-show="stationCardShow"
      ></StationCard>
    </div>
    <ScreenBottom></ScreenBottom>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ScreenHeader from "@/layout/components/bigScreenHeader.vue";
import LeftNav from "./components/leftnav.vue";
import CenterMap from "@/views/centerMap";
import RightCard from "@/views/components/right.vue";
import SearchForm from "@/views/components/filterForm.vue";
import ScreenBottom from "@/views/components/screenBottom.vue";
import PersonnelDetail from "@/views/components/personnelDetail.vue";
import StationCard from "@/views/components/stationCard.vue";
import arrow from "@/assets/icon_map/arrow.png";
import {
  SINGLE_SELECT_SHAPE,
  SINGLE_SELECT_STATION,
  SINGLE_SELECT_DEVICES,
} from "@/constants/eventbus";
import { useMitt } from "@/hooks/utils";
import { useGlobalStore } from "@/store/global";
import { getAlldsInfo } from "@/api/longrmap";

const globalStore = useGlobalStore();
const changeRightBarWidth = ref(true);
const personInfo = ref({});
const stationInfo = ref({});
const personCardShow = ref(false);
const stationCardShow = ref(false);
const searchCardShow = ref(true);
const emitter = useMitt();

// 获取后台配置的系统信息
// globalStore.getSysInfos();

const handleRetractRight = () => {
  changeRightBarWidth.value = true;
  searchCardShow.value = true;
  personCardShow.value = false;
  stationCardShow.value = false;
};

const handleExpandRight = () => {
  changeRightBarWidth.value = false;
  searchCardShow.value = false;
  personCardShow.value = false;
  stationCardShow.value = false;
};

emitter.on(SINGLE_SELECT_SHAPE, (info) => {
  changeRightBarWidth.value = true;
  stationCardShow.value = false;
  searchCardShow.value = false;
  personCardShow.value = true;
  personInfo.value = info;
});


emitter.on(SINGLE_SELECT_STATION, (info) => {
  changeRightBarWidth.value = true;
  stationCardShow.value = true;
  searchCardShow.value = false;
  personCardShow.value = false;
  stationInfo.value = info;
});

emitter.on(SINGLE_SELECT_DEVICES, () => {
  changeRightBarWidth.value = false;
  searchCardShow.value = false;
  personCardShow.value = false;
  stationCardShow.value = false;
});
</script>
<style lang="scss">
.wrap {
  width: vw(1920);
  height: vh(1080);
  @include setBgByUrl("@/assets/icon_map/home-bg.png");
  color: #ffffff;
  .main-wrap {
    display: flex;
    .center-wrap {
      flex: 1;
    }
    .img-expand {
      position: fixed;
      right: 1vw;
      top: 52.2vh;
      transform: rotate(180deg);
      cursor: pointer;
    }
    .right-bar {
      position: relative;
      transition: all 0.8s;
      .img-retract {
        position: absolute;
        left: -1vw;
        top: 46vh;
        z-index: 9999;
        cursor: pointer;
      }
    }
    .change-right-bar-width {
      margin-right: -18vw;
      cursor: pointer;
      animation: hiddenTransition 600ms ease-in;
      animation-fill-mode: forwards;
      will-change: opacity, transform, display;
    }
    @keyframes hiddenTransition {
      0% {
        opacity: 1;
        transform: none;
      }
      99% {
        opacity: 0;
        transform: translateX(20%);
      }
      100% {
        opacity: 0;
        transform: translateX(20%);
      }
    }
  }
}
</style>
