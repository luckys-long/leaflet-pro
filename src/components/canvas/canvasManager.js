import { useThrottle, useMitt } from "@/hooks/utils";
import CustomMarker from "./customMaker";
import { SINGLE_SELECT_DEVICES,SINGLE_SELECT_VIDEO,SINGLE_SELECT_STATION,SINGLE_SELECT_SHAPE } from "@/constants/eventbus";
import {upsInfo,stationInfo  } from '@/mock'
import { useWebSocketStore } from "@/store/webSocket";

const emitter = useMitt();
const webSocketStore = useWebSocketStore();
//leaflet-draw源码 矩形框拉框时 报错type 为定义 readableArea
window.type = true;

let editLayers;
let markers = {};
let coords_arr=[]
export default class CanvasManager {
  constructor(canvasElement, options) {
    this.map = new L.map(canvasElement, {
      crs: L.CRS.EPSG4326,
      attributionControl: false,
      ...options,
      preferCanvas: true,
    });
    this.readonly = false;
    this.layers = {};
    this.geojsonLayers = null;
    this._bounds = new L.LatLngBounds();
    this.forceRender = () => {
      /**/
    };
    // 设备group
    this.deviceGroup = L.layerGroup().addTo(this.map);
    // 人员和车辆的group
    this.personGroup = L.layerGroup().addTo(this.map);
    this._viewPadding = [20, 20];
    if (!this.readonly) {
      this.bindAllCanvasEventListener();
      this.initEventBus();
    }
    this.initEditLayers();
    this.initMapLayer();
    this.initBaseControls();
    this.initInfoBox();
    this.executePerformanceOptimizer(); // 画布性能提升
  }

  /**
   *添加辅助图层管理
   */
  initEditLayers() {
    const canvas = this.map;
    // 扩展了 LayerGroup ，使它更容易对其所有成员图层做同样的事情:
    editLayers = new L.featureGroup();
    canvas.addLayer(editLayers);
  }

  // LayerGroup
  /**
   *添加底图图层管理
   */
  initMapLayer() {
    const canvas = this.map;
    this.geojsonLayers = L.featureGroup();
    canvas.addLayer(this.geojsonLayers);
  }

  /**
   *初始化地图控件
   *map 地图对象
   *config 控件显示配置
   **/
  initBaseControls() {
    const canvas = this.map;
    const _editLayers = editLayers;
    const drawControl = new L.Control.Draw({
      edit: {
        // edit: false,
        featureGroup: _editLayers,
      },
      draw: {
        polygon: false,
        polyline: false,
        rectangle: true,
        circle: false,
        marker: false,
        circlemarker: false,
      },
    });
   
    canvas.addControl(drawControl);
    this.drawLocal();
  }

  setScale() {
    const canvas = this.map;
    const canvasWidth = window.document.documentElement.clientWidth;
    const geojsonWidth =
      canvas.latLngToLayerPoint(this._bounds.getNorthEast()).x -
      canvas.latLngToLayerPoint(this._bounds.getSouthWest()).x;
    const ratio = geojsonWidth / canvasWidth;
    //maxWidth 控件的最大宽度，单位是像素。宽度是动态设置的，以显示圆形值（如100、200、500）。
    L.control
      .scale({
        imperial: false,
        metric: true,
        maxWidth: 300,
        position: "bottomright",
        updateWhenIdle: true,
        ratio: ratio,
      })
      // 1:446062
      .addTo(canvas);
  }

  /**
   * 编辑插件国际化中文
   **/
  drawLocal() {
    L.drawLocal =  {};
    L.drawLocal = {
      draw: {
        handlers: {
          circle: {
            tooltip: {
              start: "点击并拖动绘制圆形",
            },
            radius: "半径",
          },
          circlemarker: {
            tooltip: {
              start: "点击地图放置圆形标记",
            },
          },
          marker: {
            tooltip: {
              start: "点击地图放置标记",
            },
          },
          polygon: {
            tooltip: {
              start: "点击开始绘制形状",
              cont: "点击继续绘制形状",
              end: "点击第一个点结束绘制形状",
            },
          },
          polyline: {
            error: "<strong>错误:</strong> 形状边缘不能交叉!",
            tooltip: {
              start: "点击开始绘制线条",
              cont: "点击继续绘制线条",
              end: "点击最后一个点结束绘制线条",
            },
          },
          rectangle: {
            tooltip: {
              start: "点击并拖动绘制矩形",
            },
          },
          simpleshape: {
            tooltip: {
              end: "释放鼠标完成绘制",
            },
          },
        },
        toolbar: {
          actions: {
            text: "取消",
            title: "取消绘制",
          },
          finish: {
            title: "完成绘制",
            text: "完成",
          },
          undo: {
            title: "删除最后一个绘制的点",
            text: "删除最后一个点",
          },
          buttons: {
            polyline: "绘制折线",
            polygon: "绘制多边形",
            rectangle: "绘制矩形",
            circle: "绘制圆形",
            marker: "绘制标记",
          },
        },
      },
      edit: {
        handlers: {
          edit: {
            tooltip: {
              text: "拖动手柄或标记以编辑图形",
              subtext: "点击取消撤销更改",
            },
          },
          remove: {
            tooltip: {
              text: "点击要删除的图形",
            },
          },
        },
        toolbar: {
          actions: {
            save: {
              title: "保存更改",
              text: "保存",
            },
            cancel: {
              title: "取消编辑，放弃所有更改",
              text: "取消",
            },
            clearAll: {
              title: "删除所有图形",
              text: "删除所有",
            },
          },
          buttons: {
            edit: "编辑图形",
            editDisabled: "没有可编辑的图形",
            remove: "删除图形",
            removeDisabled: "没有可删除的图形",
          },
        },
      },
    };
  }

  /**
   * 针对任意尺寸，返回推荐的缩放比例
   *
   * @param width
   * @param height
   */
  getShapeExpectedScale(shapeSize, containerSize) {
    const { width } = shapeSize;
    const { height } = shapeSize;
    const canvasWidth = containerSize.width;
    const canvasHeight = containerSize.height;
    const padding = this.getViewPadding();
    const [paddingTop, paddingRight, paddingBottom, paddingLeft] = padding;
    const viewWidth = canvasWidth - paddingLeft - paddingRight;
    const viewHeight = canvasHeight - paddingTop - paddingBottom;
    let validWidth;
    let validHeight;
    const isRow = width / height > 1;
    if (isRow) {
      validWidth = viewWidth;
      validHeight = (validWidth * height) / width;
      if (validHeight > viewHeight) {
        validHeight = viewHeight;
        validWidth = (validHeight * width) / height;
      }
    } else {
      validHeight = viewHeight;
      validWidth = (validHeight * width) / height;
      if (validWidth > viewWidth) {
        validWidth = viewWidth;
        validHeight = (validWidth * height) / width;
      }
    }
    const scale = validWidth / width;
    return {
      left: (canvasWidth + paddingLeft - paddingRight - validWidth) / 2 / scale,
      top:
        (canvasHeight + paddingTop - paddingBottom - validHeight) / 2 / scale,
      //   validWidth,
      //   validHeight,
      scale,
    };
  }

  getViewPadding() {
    return this._viewPadding;
  }

  __resetZoom() {
    let width = window.document.documentElement.clientWidth;
    let height = window.document.documentElement.clientHeight;
    const canvasRef = document.querySelector(`.${MAIN_SCENE_CLASS}`);
    if (canvasRef) {
      const bounding = canvasRef.getBoundingClientRect();
      width = bounding.width;
      height = bounding.height;
    }
    this.map.setWidth(width);
    this.map.setHeight(height);
  }

  bindAllCanvasEventListener() {
    // 绑定所有的事件
    this.bindMouseEventListener();
  }

  bindMouseEventListener() {
    const canvas = this.map;
    canvas.on("draw:created", function (e) {
      editLayers.clearLayers();
      const type = e.layerType;
      const layer = e.layer;
      if (type === "rectangle") {
        const bounds = layer.getBounds();
        const selectedMarkers = Object.values(markers).filter((marker) =>
          bounds.contains(marker.getLatLng())
        );
        console.log("editted",markers, selectedMarkers);
        if (selectedMarkers.length > 0) {
          const selectedMarkersNew = selectedMarkers.map((item) => item.options);
          webSocketStore.changSelectedShapList(selectedMarkersNew);
        }
      }
      editLayers.addLayer(layer);
    });

    canvas.on("draw:edited", function (e) {
      const layers = e.layers;
      const type = e.layerType;
      layers.eachLayer(function (layer) {
        const bounds = layer.getBounds();
        const selectedMarkers = Object.values(markers).filter((marker) =>
          bounds.contains(marker.getLatLng())
        );
        if (selectedMarkers.length > 0) {
          const selectedMarkersNew = selectedMarkers.map((item) => item.options);
          webSocketStore.changSelectedShapList(selectedMarkersNew);
        }
        console.log("editted", selectedMarkers);
      });
    });
    canvas.on("draw:deleted", function (e) {
      editLayers.clearLayers();
      webSocketStore.changSelectedShapList([]);
    });
  }

  initEventBus() {
    emitter.on("fullScreenFn", this.toggleFullscreen.bind(this));
  }

  // 右下方经纬度信息展示
  initInfoBox() {
    let infoBox = L.control({ position: "bottomright" });
    infoBox.onAdd = function () {
      this._div = L.DomUtil.create("div", "info");
      this.update();
      return this._div;
    };
    infoBox.update = function (coords, map) {
      try {
        if (coords) {
          this._div.innerHTML = `纬度：${coords.lat.toFixed(
            4
          )}<br>经度:${coords.lng.toFixed(4)}<br> 级别：${map.getZoom()}`;
        } else {
          this._div.innerHTML = "纬度：: N/A<br>经度: N/A";
        }
      } catch (error) {
        console.error(error);
      }
    };
    infoBox.addTo(this.map);
    this.map.on("mousemove", (e) => {
      infoBox.update(e.latlng, this.map);
    });
  }

  getBound() {
    return this._bounds;
  }

  toggleFullscreen() {
    const mapElement = document.getElementById('map');
    if (!document.fullscreenElement) {
      mapElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  addTileLayer(url, options) {
    const canvas = this.map;
    const layer = L.tileLayer(url, options);
    layer.addTo(canvas);
    this.layers[url] = layer;
  }

  addGeoJsonLayer(data, options) {
    const newLayer = L.geoJson(data, {
      onEachFeature: function (feature, layer) {
        if (layer instanceof L.Path) {
          layer.setStyle({
            fillColor:`rgba(0,255,255)`,
            fillOpacity: 0.8,
            color:`rgba(0,255,255)`,
            weight: 1,
            opacity: 1,
          });
        }
        // console.log("geoJSON==>",feature,layer);
      },
      ...options,

    });
    this._bounds.extend(newLayer.getBounds());
    this.geojsonLayers.addLayer(newLayer);
  }

  fitBounds() {
    const canvas = this.map;
    canvas.fitBounds(this._bounds, { padding: this.getViewPadding() });
  }

  removeLayer(url) {
    const canvas = this.map;
    const layer = this.layers[url];
    if (layer) {
      canvas.removeLayer(layer);
      delete this.layers[url];
    }
  }

  removeAllLayers() {
    Object.values(this.layers).forEach((layer) => this.map.removeLayer(layer));
    this.layers = {};
  }

  /*
  * 添加人员和车辆的marker
  */
  addPeopleAndCarsMark(latlng,options){
    let marker = markers[options.tagId];
    if (!marker) {
    const  _marker = new CustomMarker(latlng||[], options);
      const myIcon = L.icon({
        iconUrl: options.icon,
        iconRetinaUrl: options.icon,
        iconSize: [40, 40],
        iconAnchor: [15, 15],
        popupAnchor: [-15, -25],
        labelAnchor: [-3, -5],
      });
      _marker.setIcon(myIcon)
      _marker.addTo(this.personGroup);
      markers[options.tagId]=_marker.marker
    }else {
      marker.setLatLng(latlng);
    }
    markers[options.tagId].unbindTooltip()
    const customTooltip = new L.tooltip({
      className: "my-custom-tooltip",
      permanent: true,
      direction: "top",
      offset: [5, -8]
    }).setContent(`${options.userName}`);
    markers[options.tagId].bindTooltip(customTooltip).openTooltip();
    markers[options.tagId].on("click", () => {
      this.setView(latlng[0],latlng[1],3)
      emitter.emit(SINGLE_SELECT_SHAPE, options); 
    });
  }

  /*
  * 添加marker
  */ 
  addCustomMarker(latlng, options) {
    console.log("marker_options",options,latlng)
    const customMarker = new CustomMarker(latlng||[], options);
    if (options.icon) {
      const myIcon = L.icon({
        iconUrl: options.icon,
        iconRetinaUrl: options.icon,
        iconSize: [40, 40],
        iconAnchor: [15, 15],
        popupAnchor: [-15, -25],
        labelAnchor: [-3, -5],
      });
      customMarker.setIcon(myIcon);

      customMarker.on("click", async () => {
        // 有线，外线,点击 与拨号盘交互
        if ([2, 8,6].includes(options.deviceType)) {
          emitter.emit(SINGLE_SELECT_DEVICES, options);
        } else if (options.deviceType === 3) {
          customMarker.unbindPopup();
          const upsres = await getUpsByIp({ ip: options.ip });
          // const upsres=upsInfo
          if (upsres) {
            customMarker.bindPopup(
              `<div class="map-ds-modal">
        <p>ups信息</p>
        <div class="map-ds-content">
          <div style="display: flex;justify-content: space-between;font-size: 12px;">
          <div class="item-info">
            <span style="color: rgba(0, 168, 164, 1)">设备名称:</span>
            <span style="margin-left: 0.1vw; color: rgba(224, 224, 224, 1);">${
              upsres.upsName
            }</span>
          </div>
          <div class="item-info">
            <span style="color: rgba(0, 168, 164, 1)">电量:</span>
            <span style="margin-left: 0.1vw; color: rgba(224, 224, 224, 1)">${
              upsres.quantityOfElectricity
            }W</span>
          </div>
        </div>
        <div style="display: flex;justify-content: space-between;font-size: 12px;">
          <div class="item-info">
            <span style="color: rgba(0, 168, 164, 1)">工作模式:</span>
            <span style="margin-left: 0.1vw; color: rgba(224, 224, 224, 1);">${
              upsres.workMode
            }</span>
          </div>
          <div class="item-info">
            <span style="color: rgba(0, 168, 164, 1)">电压:</span>
            <span style="margin-left: 0.1vw; color: rgba(224, 224, 224, 1)">${
              upsres.vol
            }V</span>
          </div>
        </div>
        <div style="display: flex;justify-content: space-between;font-size: 12px;">
          <div class="item-info">
            <span style="color: rgba(0, 168, 164, 1)">ip地址:</span>
            <span style="margin-left: 0.1vw; color: rgba(224, 224, 224, 1);">${
              options.ip||upsres.ipAddr
            }</span>
          </div>
          <div class="item-info">
            <span style="color: rgba(0, 168, 164, 1)">电流:</span>
            <span style="margin-left: 0.1vw; color: rgba(224, 224, 224, 1)">${
              upsres.currentVal
            }A</span>
          </div>
        </div>
        <div style="display: flex;justify-content: space-between;font-size: 12px;">
          <div class="item-info">
            <span style="color: rgba(0, 168, 164, 1)">UPS状态:</span>
            <span style="margin-left: 0.1vw; color: rgba(224, 224, 224, 1);">${
              upsres.isOnline ? "在线" : "离线"
            }</span>
          </div>
          <div class="item-info">
            <span style="color: rgba(0, 168, 164, 1)">温度:</span>
            <span style="margin-left: 0.1vw; color: rgba(224, 224, 224, 1)">${
              upsres.temperate
            }℃</span>
          </div>
        </div>
        </div>
      </div>`
            );
          }
          customMarker.openPopup();
          // 基站
        } else if (options.deviceType === 0) {
          customMarker.unbindPopup();
          const stationRes = await getStationByIp({ ip: options.ip });
          // const stationRes=stationInfo
          if (stationRes) {
            emitter.emit(SINGLE_SELECT_STATION, stationRes);
            customMarker.bindPopup(
              `<div class="map-ds-modal">
        <p>基站信息</p>
        <div class="map-ds-content" style="font-size: 14px;margin-left:1vw; ">
          <div class="item-info">
            <span style="color: rgba(0, 168, 164, 1)">基站名称:</span>
            <span style="margin-left: 0.1vw; color: rgba(224, 224, 224, 1);">${
              stationRes.nodeName
            }</span>
          </div>
          <div class="item-info">
            <span style="color: rgba(0, 168, 164, 1)">所在区域:</span>
            <span style="margin-left: 0.1vw; color: rgba(224, 224, 224, 1)">${
              stationRes.location || ""
            }</span>
          </div>
          <div class="item-info">
            <span style="color: rgba(0, 168, 164, 1)">IP地址:</span>
            <span style="margin-left: 0.1vw; color: rgba(224, 224, 224, 1)">${
              options.ip||stationRes.nodeIp
            }</span>
          </div>
          <div class="item-info">
            <span style="color: rgba(0, 168, 164, 1)">基站状态:</span>
            <span style="margin-left: 0.1vw; color: rgba(224, 224, 224, 1)">${
              stationRes.nodeStatus ? "在线" : "离线"
            }</span>
          </div>
          <div class="item-info">
            <span style="color: rgba(0, 168, 164, 1)">基站类型:</span>
            <span style="margin-left: 0.1vw; color: rgba(224, 224, 224, 1)">${
              stationRes.nodeType
            }</span>
          </div>
        </div>
      </div>`
            );
          }
          customMarker.openPopup();
        } else if (options.deviceType === 1) {
          emitter.emit(SINGLE_SELECT_VIDEO,options);
          // [{"posx":3676289.0,"posy":1243228.0,"posz":1243228.0,"videoName":"admin","videoPsd":"ad123456","videoIp":"192.168.0.243","videoWs":"192.168.0.224","videoType":"海康威视"}]
          // 摄像头
          // iframeSrc.value = "";
          // const videoRes = await getVideoByIp({ ip: options.ip });
          // localStorage.setItem("vedioDetail", JSON.stringify([videoRes]));
          // iframeSrc.value = "/hkws-vedio/mapVedio/map.html";
          // dialogVisible.value = true;
        }});
      markers[options.ip||options.extensionNum] = customMarker.marker;
    }
    customMarker.addTo(this.deviceGroup);
  }


  setView(lat, lng, zoom) {
    this.map.setView([lat, lng], zoom);
  }

  getZoom() {
    const canvas = this.map;
    return canvas.getZoom();
  }

  /**
   * 高亮选中图形
   */
  initHightObj() {}

  /**
   * 放大按钮
   */
  zoomOut() {
    this.map.zoomOut();
  }

  /**
   * 缩小按钮
   */
  zoomIn() {
    this.map.zoomIn();
  }

  _renderAll() {
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  removeEventBus() {
    emitter.off("fullScreenFn", this.toggleFullscreen);
  }

  destroy() {
    const canvas = this.map;
    this.removeEventBus();
    this.deviceGroup.clearLayers();
    this.personGroup.clearLayers();
    this.geojsonLayers.clearLayers();
    editLayers = null;
    markers = {};
    coords_arr=[];
    if (canvas) {
      canvas.off();
    }
  }

  // 画布性能提升
  executePerformanceOptimizer() {
    const throttle = useThrottle();
    this.forceRender = throttle(() => {
      if (!this.map) {
        return;
      }
      this._renderAll();
    }, 80);
  }
}
