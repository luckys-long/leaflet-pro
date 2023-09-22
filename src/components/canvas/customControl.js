
export default class CustomControl {
    constructor(options) {
      this.control = L.control(options);
    }
  
    addTo(map) {
      this.control.addTo(map);
    }
  
    remove() {
      this.control.remove();
    }
  
    setPosition(position) {
      this.control.setPosition(position);
    }
  
    setZIndex(zIndex) {
      this.control.setZIndex(zIndex);
    }
  
    onAdd(map) {
      const container = L.DomUtil.create('div', 'custom-control-container');
      container.innerHTML = '<div class="custom-control-content">Custom Control</div>';
      return container;
    }
  
    onRemove(map) {
      // Nothing to do here
    }
  }