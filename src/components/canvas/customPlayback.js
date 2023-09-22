
import person from "@/assets/posIcon/person50.png";
import { useMitt } from "@/hooks/utils";
import {
  TRACK_PROGRESSING,
} from "@/constants/eventbus";
import "leaflet-rotatedmarker";
import car from "@/assets/posIcon/car.png";

// import * as GeometryUtil from "leaflet-geometryutil";

const emitter = useMitt();

// let coords_arr
export default class CustomPlayback {
  constructor(map, options) {
    this.map = map;
    this.options = options;
    this.playing = options.isPlay;
    this.currentStep = 0;
    this.steps = [];
    this.polyline = null;
    this.marker = null;
    this.speed = 1;
    this.timer = null;
    this.bounds=this.options.bounds
    this.init();
  }

  init() {
    this.createPolyline();
    this.createMarker();
    this.createSteps();
  }

  createPolyline() {
    const polyline = L.polyline([], {
      color: "red",
      weight: 5,
      opacity: 0.5,
    });
    polyline.addTo(this.map);
    this.polyline = polyline;
  }

  createMarker() {
    const marker = L.marker(this.options.makerLngs, {
      icon: L.icon({
        iconUrl: person,
        iconRetinaUrl: person,
        iconSize: [40, 40],
        iconAnchor: [15, 15],
        popupAnchor: [-15, -25],
        labelAnchor: [-3, -5],
      }),
      rotationAngle: 0,
    });
    marker.addTo(this.map);
    this.marker = marker;
  }

  createSteps() {
    const steps = [];
    const latlngs = this.options.latlngs;
    for (let i = 0; i < latlngs.length; i++) {
      const latlng = latlngs[i];
      // 显示在地图上的时间。它被设置为currentStep乘以1000，表示自播放开始以来的毫秒数。这个值在step（）函数中用于确定在播放过程中的任何给定时间都应该在地图上显示哪个步骤。
      const step = {
        latlng: L.latLng(latlng),
        time: i * 1000,
      };
      this.polyline.addLatLng(latlng);
      steps.push(step);
    }
      // 加入部分轨迹平滑的算法使移动更顺畅
    this.steps = this.smoothPlayback(steps);
  }

  // 平滑算法
  smoothPlayback(_steps) {
    const steps = _steps;
    const smoothSteps = [];
    for (let i = 0; i < steps.length - 1; i++) {
      const currentStep = steps[i];
      const nextStep = steps[i + 1];
      const distance = currentStep.latlng.distanceTo(nextStep.latlng);
      const time = nextStep.time - currentStep.time;
      const speed = distance / time;
      const interval = 1000 / speed;
      let currentTime = currentStep.time;
      while (currentTime < nextStep.time) {
        const latlng = L.latLng([
          currentStep.latlng.lat +
            (nextStep.latlng.lat - currentStep.latlng.lat) *
              ((currentTime - currentStep.time) /
                (nextStep.time - currentStep.time)),
          currentStep.latlng.lng +
            (nextStep.latlng.lng - currentStep.latlng.lng) *
              ((currentTime - currentStep.time) /
                (nextStep.time - currentStep.time)),
        ]);
        smoothSteps.push({
          latlng: latlng,
          time: currentTime,
        });
        currentTime += interval;
      }
    }
    smoothSteps.push(steps[steps.length - 1]);
    return smoothSteps;
  }


  // bindEvents() {
  //   this.map.on("click", this.onMapClick.bind(this));
  // }

  // onMapClick(event) {
  //   if (this.playing) {
  //     return;
  //   }
  //   const latlng = event.latlng;
  //   const step = {
  //     latlng: latlng,
  //     time: this.currentStep * 1000,
  //   };
  //   this.steps.push(step);
  //   this.currentStep++;
  //   this.polyline.addLatLng(latlng);
  //   this.marker.setLatLng(latlng);
  // }

  setMarkerLatLng(sliderVal){
    this.currentStep= parseInt((this.steps.length-1)*(sliderVal/100))
    this.marker.setLatLng(this.steps[this.currentStep]?.latlng);
  }

  // 控制Marker direction

   updateMarkerDirection(currentStep, nextStep) {
    const currentLatLng = currentStep.latlng;
    const nextLatLng = nextStep.latlng;
    const currentAngle = Math.atan2(nextLatLng.lng - currentLatLng.lng, nextLatLng.lat - currentLatLng.lat);
    const nextAngle = Math.atan2(nextLatLng.lng - currentLatLng.lng, nextLatLng.lat - currentLatLng.lat);
    const turningAngle = nextAngle - currentAngle;
    const markerIcon = this.marker.options.icon;
    const markerRotation = markerIcon.options.rotation;
    const newRotation = markerRotation + turningAngle;
    markerIcon.options.rotation = newRotation;
    this.marker.setIcon(markerIcon);
  }
  
  play() {
    this.playing = true;
    this.timer = setInterval(this.step.bind(this), 1000 / this.speed);
  }

  pause() {
    this.playing = false;
    clearInterval(this.timer);
  }

  stop() {
    if (!this.playing) {
      return;
    }
    this.playing = false;
    clearInterval(this.timer);
    this.currentStep = 0;
    // this.polyline.setLatLngs([]);
    // this.marker.setLatLng([]);
  }

  changeSpeed(speedValue) {
    this.speed = speedValue||1;
    if (this.playing) {
      clearInterval(this.timer);
      this.timer = setInterval(this.step.bind(this), 1000 / this.speed);
    }
  }

  step() {
    const step = this.steps[this.currentStep];
    if (!step) {
      this.stop();
      return;
    }
    const curProgress=(this.currentStep/(this.steps.length-1))*100
    emitter.emit(TRACK_PROGRESSING, curProgress); 
    const _bounds = this.bounds
    const latlng=step.latlng
    console.log("_bounds===>",_bounds,_bounds.contains([40,-57]));
    if (!_bounds.contains(latlng)) {
      const nearestPoint = L.GeometryUtil.closest(this.map, this.polyline, latlng, true);
      console.log("nearestPoint===>",nearestPoint);
      // this.currentStep = nearestPoint.index;
      // this.marker.setLatLng(nearestPoint.latlng);
      debugger
    } else {
      this.marker.setLatLng(latlng);
      this.currentStep++;
    }
    this.marker.setLatLng(latlng);
    this.currentStep++;
  }

  destroy() {
    // 清除定时器
    this.pause();
    this.polyline.remove();
    this.marker.remove();
  }

}

