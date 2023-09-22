import onlineBroadcast from "@/assets/posIcon/online-broadcast.png";
import onlineCamera from "@/assets/posIcon/online-camera.png";
import onlineLineTel from "@/assets/posIcon/online-line-tel.png";
import onlineStation from "@/assets/posIcon/online-station.png";
import onlineWirelessTel from "@/assets/posIcon/online-wireless-tel.png";
import onlineups from "@/assets/posIcon/ups-online.png";
import unonlineups from "@/assets/posIcon/ups-unonline.png";
import unonlineBroadcast from "@/assets/posIcon/unonline-broadcast.png";
import unonlineCamera from "@/assets/posIcon/unonline-camera.png";
import unonlineLineTel from "@/assets/posIcon/unonline-line-tel.png";
import unonlineStation from "@/assets/posIcon/unonline-station.png";
import unonlineWirelessTel from "@/assets/posIcon/unonline-wireless-tel.png";

// 电话分类-typeCode
export enum PHONE_TYPE_KEY {
  wired = 2, // 有线
  out_line = 8, // 外线
  broadcast = 6, //广播电话
  station = 0, //基站
  camera = 1, //摄像头
  ups = 3, //电源
}

//在线 0基站 1摄像头 2电话 3电源  6广播电话 8外线电话
export const MAP_USED_IMG = {
  [PHONE_TYPE_KEY.wired]: onlineLineTel,
  [PHONE_TYPE_KEY.out_line]: onlineWirelessTel,
  [PHONE_TYPE_KEY.broadcast]: onlineBroadcast,
  [PHONE_TYPE_KEY.station]: onlineStation,
  [PHONE_TYPE_KEY.camera]: onlineCamera,
  [PHONE_TYPE_KEY.ups]: onlineups,
};

//离线 0基站 1摄像头 2电话 3电源  6广播电话 8外线电话
export const MAP_USED_OffLINE_IMG = {
  [PHONE_TYPE_KEY.wired]: unonlineLineTel,
  [PHONE_TYPE_KEY.out_line]: unonlineWirelessTel,
  [PHONE_TYPE_KEY.broadcast]: unonlineBroadcast,
  [PHONE_TYPE_KEY.station]: unonlineStation,
  [PHONE_TYPE_KEY.camera]: unonlineCamera,
  [PHONE_TYPE_KEY.ups]: unonlineups,
};


export const MAP_DEVICE_NAME = {
  [PHONE_TYPE_KEY.wired]: '有线',
  [PHONE_TYPE_KEY.out_line]: '外线',
  [PHONE_TYPE_KEY.broadcast]: '广播电话',
  [PHONE_TYPE_KEY.station]: '基站',
  [PHONE_TYPE_KEY.camera]: '摄像头',
  [PHONE_TYPE_KEY.ups]: '电源',
};
