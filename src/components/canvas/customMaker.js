
export default class CustomMarker {
    constructor(latlng, options) {
      this.marker = L.marker(latlng, options);
    }
  
    addTo(map) {
      this.marker.addTo(map);
    }

    on(event,handler){
      this.marker.on(event, handler);
    }

    remove() {
      this.marker.remove();
    }
  
    setLatLng(latlng) {
      this.marker.setLatLng(latlng);
    }
  
    setIcon(icon) {
      this.marker.setIcon(icon);
    }
  
    setOpacity(opacity) {
      this.marker.setOpacity(opacity);
    }
  
    setZIndexOffset(offset) {
      this.marker.setZIndexOffset(offset);
    }
  
    bindPopup(content, options) {
      this.marker.bindPopup(content, options);
    }
    unbindPopup(){
      this.marker.unbindPopup();
    }
    openPopup() {
      this.marker.openPopup();
    }
  
    closePopup() {
      this.marker.closePopup();
    }
   
  }