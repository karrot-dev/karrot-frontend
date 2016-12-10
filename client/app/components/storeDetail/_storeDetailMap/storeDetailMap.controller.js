class StoreDetailMapController {
  constructor() {
    "ngInject";
    Object.assign(this, {
      markers: {},
      center: {},
      defaults: {
        scrollWheelZoom: false
      }
    });
  }

  $onChanges(changes) {
    if (changes.storeData) {
      this.update();
    }
  }

  update() {
    this.setMarker(
      this.storeData.latitude,
      this.storeData.longitude,
      this.storeData.address);
  }

  setMarker(lat, lng, message) {
    this.markers = {
      pin: {
        lat,
        lng,
        draggable: false,
        message
      }
    };
    this.center = {
      lat,
      lng,
      zoom: 12
    };
  }
}

export default StoreDetailMapController;
