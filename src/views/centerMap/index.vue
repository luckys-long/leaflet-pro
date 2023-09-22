<template>
  <div class="map-wrap">
    <div class="canvas-wrap">
      <div
        id="map"
        ref="canvas"
        style="height: 80vh; background: transparent"
      ></div>
    </div>
    <div class="dialog-wrap">
      <el-dialog v-model="dialogVisible" v-if="dialogVisible" draggable>
       <p class="video-info">摄像头名称:&nbsp;&nbsp;&nbsp; {{ videoInfo?.videoNameNew }}</p>
       <p class="video-info">摄像头IP: &nbsp;&nbsp;&nbsp;{{ videoInfo?.videoIp }}</p>
        <iframe
          ref="iframeDom"
          :src="iframeSrc"
          frameborder="0"
          scrolling="no"
          style="
            width: 100%;
            height: 100%;
            position: absolute;
            top: 56px;
            left: 0px;
          "
        ></iframe>
      </el-dialog>
    </div>
  </div>
</template>
<script setup>

import CanvasManager from "@/components/canvas/canvasManager";
// import jhJson from "@/assets/JHGeoJson/jh.json";
import hatches from "@/assets/JHGeoJson/hatches.json";
import polylines from "@/assets/JHGeoJson/polylines.json";
import lines from "@/assets/JHGeoJson/lines.json";
import texts from "@/assets/JHGeoJson/texts.json";
import { ElDialog } from "element-plus";
import { MAP_USED_IMG, MAP_USED_OffLINE_IMG } from "@/constants/category";
import { useMitt } from "@/hooks/utils";
import {
  SINGLE_SELECT_SHAPE,
  SINGLE_SELECT_DEVICES,
  HANDLE_CLICK_SEARCH,
  HANDLE_SEARCH_USER,
  SINGLE_SELECT_STATION,
  HANDLE_CLICK_FULLSCREEN,
  SINGLE_SELECT_VIDEO,
} from "@/constants/eventbus";
// import { dsInfo,peopleAndCarInfo } from "@/mock";
import person from "@/assets/posIcon/person50.png";
import {
  getAlldsInfo,
  getUserList,
  getVideoByIp,
} from "@/api/longrmap";

import { getDeviceLocation } from '@/api/jinhe'

const emitter = useMitt();

const canvas = ref();


// 地图中摄像头的
const dialogVisible = ref(false);
const iframeSrc = ref("");
const videoInfo=ref({})
let mapManager;




onMounted(() => {
  mapManager = new CanvasManager(canvas.value, {
    center: [4028394 / 1000, 593398 / 100],
    zoom: 13,
  });
  initGeoJson();
  // getDeviceList();
  // showPersonOnMap()
  initList()
});

const initList=async()=>{
  const deviceInfoRes =await getDeviceLocation()
  console.log("--->",deviceInfoRes);
  const dsList = deviceInfoRes.filter(
    (item) =>
      [0, 1, 2, 3, 6, 8].includes(item.deviceType) && item.posX && item.posY
  );
  console.log("--->dsList",dsList);
  showDeviceOnMap(dsList);
}

// const showPersonOnMap=()=>{
//   mapManager.personGroup.clearLayers();
//   const list =peopleAndCarInfo
//   list.map(item=>{
//     mapManager.addPeopleAndCarsMark([item.posx, item.posy],{
//       ...item,
//       icon:person
//     })
//   })
// }

// const getDeviceList = async () => {
//   const deviceInfoRes = await getAlldsInfo();
//   const dsList = deviceInfoRes.filter(
//     (item) =>
//       [0, 1, 2, 3, 6, 8].includes(item.deviceType) && item.posx && item.posx
//   );
//   showDeviceOnMap(dsList);
// };

const showDeviceOnMap = (dsList) => {
  const _dsList = dsList;
  _dsList.map((item) => {
    mapManager.addCustomMarker([item.posX / 10000, item.posY / 10000], {
      ...item,
      icon: item.online
        ? MAP_USED_IMG[item.deviceType]
        : MAP_USED_OffLINE_IMG[item.deviceType],
    });
  });
};

// 过滤map 中的设备展示
emitter.on(HANDLE_CLICK_SEARCH, (searchRes) => {
  mapManager.deviceGroup.clearLayers();
  showDeviceOnMap(searchRes);
});

const setVideoShow = async (info) => {
  iframeSrc.value = "";
  const videoRes = await getVideoByIp({ ip: info.ip });
  videoInfo.value={...videoRes,videoName:videoRes.videoUser,videoNameNew:videoRes.videoName}
  console.log(" videoInfo.value==>", videoInfo.value);
  localStorage.setItem("vedioDetail", JSON.stringify([ videoInfo.value]));
  iframeSrc.value = "/hkws-vedio/mapVedio/map.html";
  dialogVisible.value = true;

};

emitter.on(SINGLE_SELECT_VIDEO, (info) => {
  console.log("点击了摄像头", info);
  setVideoShow(info);
});

const initGeoJson = () => {
  mapManager.addGeoJsonLayer(hatches, {
    coordsToLatLng: function (coords) {
      return L.latLng(coords[1] / 1000, coords[0] / 1000);
    },
  });
  mapManager.addGeoJsonLayer(polylines, {
    coordsToLatLng: function (coords) {
      return L.latLng(coords[1] / 1000, coords[0] / 1000);
    },
  });
  mapManager.addGeoJsonLayer(lines, {
    coordsToLatLng: function (coords) {
      return L.latLng(coords[1] / 1000, coords[0] / 1000);
    },
  });
  // mapManager.addGeoJsonLayer(texts, {
  //   coordsToLatLng: function (coords) {
  //     return L.latLng(coords[1] / 12300, coords[0] / 12300);
  //   },
  // });
  mapManager.fitBounds();
};





// 监听全屏
emitter.on(HANDLE_CLICK_FULLSCREEN, () => {
  mapManager.toggleFullscreen();
});
emitter.on(HANDLE_SEARCH_USER, (res) => {
  mapManager.setView(res.posx, res.posy, 8);
});


onUnmounted(() => {
  emitter.off(HANDLE_CLICK_FULLSCREEN);
  emitter.off(SINGLE_SELECT_SHAPE);
  emitter.off(SINGLE_SELECT_DEVICES);
  emitter.off(HANDLE_SEARCH_USER);
  emitter.off(SINGLE_SELECT_STATION);
  emitter.off(SINGLE_SELECT_VIDEO);
  mapManager.destroy();
});
</script>

<style>
.leaflet-popup-content-wrapper,
.leaflet-popup-tip {
  background: none !important;
  box-shadow: none !important;
}
.leaflet-popup-close-button {
  display: none !important;
}
</style>
<style lang="scss" >
.map-wrap {
  .canvas-wrap {
    position: relative;
    .leaflet-control {
      color: #fff;
    }
    .leaflet-control-zoom {
      left: 20vw !important;
    }
  }
}
  
.my-custom-tooltip{
  background-image: url("@/assets/posIcon/name.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border: none;
  background-color: transparent;
  color: #fff;
  // font-weight: 500;
}
.my-custom-tooltip::before{
  display: none;
}

.custom-light-tooltip{
  background: transparent;
  border: none;
  margin-left: 35px;
  color: #fff;
  font-size: 20px;
}
.leaflet-draw.leaflet-control {
  a {
    color: #000 !important;
  }
  left: 20vw;
  background: transparent;
}
.leaflet-container {
  border: none !important;
  outline: none !important;
}
.map-ds-modal {
  width: vw(288);
  height: vh(208);
  background-image: url("@/assets/tankuang.png");
  font-weight: bold;
  color: #081632;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: relative;
  padding: 15px;
  p {
    font-size: 12px;
    position: absolute;
    left: 6.8vw;
    top: -1vh;
  }
  .map-ds-content {
    margin-top: vh(40);
    font-size: 14px;
    line-height: vh(26);
    font-weight: bold;
  }
}
</style>
<style scoped lang="scss">
.dialog-wrap {
  :deep(.el-dialog) {
    height: 360px;
    width: 500px;
    background: rgba(35, 43, 66, 0.5);
  }
  :deep(.el-dialog__title) {
    color: #fff !important;
  }
  :deep(.el-dialog__body) {
    padding: 0;
  }
}
</style>