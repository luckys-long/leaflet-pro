import light from "@/assets/images/红绿灯.png"

import light1 from "@/assets/images/红绿灯 (1).png"

export default class TrafficLight {
    constructor(map) {
    this.map = map;
      this.redIcon = L.icon({
        iconUrl: light,
        iconRetinaUrl: light,
        iconSize: [40, 40],
        iconAnchor: [15, 15],
        popupAnchor: [-15, -25],
        labelAnchor: [-3, -5],
      });
      this.greenIcon = L.icon({
        iconUrl: light1,
        iconRetinaUrl: light1,
        iconSize: [40, 40],
        iconAnchor: [15, 15],
        popupAnchor: [-15, -25],
        labelAnchor: [-3, -5],
      });
      this.marker = L.marker([173.8607, 9.7148], { icon: this.redIcon }).addTo(this.map);
      this.timer = null;
      this.countdown = 11;
      this.isRed = true;
    }
  
    addMarkerTooltip(){
      // this.marker.unbindTooltip()
      const tooltip = new L.tooltip({
        className: "custom-light-tooltip",
        permanent: true,
        direction: "right",
        opacity: 1,
      }).setContent(`${this.countdown}秒`);
      this.marker.bindTooltip(tooltip).openTooltip();
    }

    startCountdown() {
      this.timer = setInterval(() => {
        this.countdown--;
        this.addMarkerTooltip()
        if (this.countdown === 0) {
          this.toggleLight();
          this.countdown = 11;
        }
      }, 1000);
    }
  
    toggleLight() {
      if (this.isRed) {
        this.marker.setIcon(this.greenIcon);
        this.isRed = false;
      } else {
        this.marker.setIcon(this.redIcon);
        this.isRed = true;
      }
    }

    removeTimer(){
      clearInterval(this.timer);
    }
    
  }