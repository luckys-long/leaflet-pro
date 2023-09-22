<!-- 轨迹回放 -->
<template>
  <div class="play-wrap">
    <ScreenHeader />
    <SearchForm></SearchForm>
    <div
      ref="canvasPlay"
      style="height: 90vh; background: transparent"
    ></div>
     <div class="leaflet-control-play" v-if="isShowPlayControl">
      <el-icon
        v-if="!isPlay"
        :size="30"
        @click.stop="handlePlay"
        style="margin-left: 1vw; cursor: pointer"
      >
        <VideoPlay />
      </el-icon>
      <el-icon
        v-else="isPlay"
        :size="30"
        @click.stop="handlePlay"
        style="margin-left: 1vw; cursor: pointer"
      >
        <VideoPause />
      </el-icon>
      <el-slider
        v-model="sliderVal"
        style="margin-left: 1vw; margin-right: 0.6vw"
        @input="hanleSlider"
      ></el-slider>
      <div
        @click.stop="handleSpeed"
        style="margin-right: 0.2vw"
        class="play-speed"
      >
        {{ speed }}X
      </div>
    </div>
  </div>
</template>

<script setup>
import ScreenHeader from "@/layout/components/bigScreenHeader.vue";
import CanvasManager from "@/components/canvas/canvasManager";
import CustomPlayback from "@/components/canvas/customPlayback";
import { ElIcon, ElSlider } from "element-plus";
import { VideoPlay, VideoPause } from "@element-plus/icons-vue";
import { useMitt } from "@/hooks/utils";
import hatches from "@/assets/hbGeoJson/hatches.json";
import polylines from "@/assets/hbGeoJson/polylines.json";
import lines from "@/assets/hbGeoJson/liness.json";
import { TRACK_PROGRESSING } from "@/constants/eventbus";
import SearchForm from "./components/searchForm.vue";

const emitter = useMitt();

// 轨迹回放相关的
const isPlay = ref(false);
const isShowPlayControl = ref(true);
const sliderVal = ref(0);
const speed = ref(1);

const canvasPlay = ref();

let customPlayback;
let mapManager;
const latlngs = [
  [60.9018, 4.032],
  [60.87603, 3.986002],
  [60.94748, 3.98875],
  [60.99969, 3.9914],
  [61.04915, 3.99974],
  [61.126105, 4.01623],
  [61.170074, 4.01898002],
  [61.197555, 4.02172852],
  [61.2442, 4.0272248],
  [61.299233, 4.029972],
  [61.3459505, 4.029972],
  [61.862586337, 4.0354692],
  [62.9810478, 4.084935],
  [63.692796, 4.112416],
  [64.05554034, 4.109668],
  [64.346834, 4.12342],
  [64.58316837, 4.12340912],
];

onMounted(() => {
  mapManager = new CanvasManager(canvasPlay.value, {
    center: [1624184 / 12300, 425201 / 12300],
    zoom: 13,
  });
  initGeoJson();
  customPlayback = new CustomPlayback(mapManager.map, {
    controlContainer: document.querySelector(".leaflet-control-play"),
    latlngs: latlngs,
    makerLngs: [60.9018,4.032],
    bounds:mapManager._bounds
  });
});

const initGeoJson = () => {
  mapManager.addGeoJsonLayer(hatches, {
    coordsToLatLng: function (coords) {
      return L.latLng(coords[1] / 12300, coords[0] / 12300);
    },
  });
  mapManager.addGeoJsonLayer(polylines, {
    coordsToLatLng: function (coords) {
      return L.latLng(coords[1] / 12300, coords[0] / 12300);
    },
  });
  mapManager.addGeoJsonLayer(lines, {
    coordsToLatLng: function (coords) {
      return L.latLng(coords[1] / 12300, coords[0] / 12300);
    },
  });
  // mapManager.fitBounds();
  mapManager.setView(60.9018, 4.032, 7);
};

// 轨迹回放 暂停 || 播放
const handlePlay = () => {
  if (isPlay.value) {
    customPlayback.pause();
  } else {
    customPlayback.play();
  }
  isPlay.value = !isPlay.value;
};

// 轨迹回放  速率
const handleSpeed = () => {
  speed.value += 1;
  if (speed.value === 11) {
    speed.value = 1;
  }
  customPlayback.changeSpeed(speed.value);
};

// 轨迹回放  拖动滑块
const hanleSlider = () => {
  customPlayback.setMarkerLatLng(sliderVal.value);
};
// 轨迹回放相关的功能
emitter.on(TRACK_PROGRESSING, (val) => {
  sliderVal.value = val || 0;
});

onUnmounted(() => {
  mapManager.destroy();
  customPlayback.destroy()
  emitter.off(TRACK_PROGRESSING);
});
</script>

<style lang="scss">
.leaflet-container {
  border: none !important;
  outline: none !important;
}
.play-wrap {
  width: vw(1920);
  height: vh(1080);
  background-image: url("@/assets/icon_map/plan-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .leaflet-control-zoom {
    left: 20vw !important;
  }
  .leaflet-control {
    color: #fff;
  }
  .leaflet-draw.leaflet-control {
  a {
    color: #000 !important;
  }
  left: 20vw;
  background: transparent;
}
  .leaflet-control-play {
    z-index: 9999;
    position: absolute;
    bottom: 13px;
    left: 35vw;
    display: flex;
    align-items: center;
    background: bisque;
    border-radius: 45px;
    overflow: hidden;
    width: 23vw;
    height: 45px;
    padding-right: 1vw;
    .play-speed {
      font-weight: 700;
      font-size: 18px;
      color: rgb(96, 65, 198);
      cursor: pointer;
    }
  }
}
</style>
