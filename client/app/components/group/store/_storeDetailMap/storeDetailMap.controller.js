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
    if (changes.storeData && changes.storeData.currentValue) {
      this.updateWith(changes.storeData.currentValue);
    }
  }

  updateWith(storeData) {
    if (storeData.latitude && storeData.longitude && storeData.address) {
      this.setMarker(
        storeData.latitude,
        storeData.longitude,
        storeData.address);
    }
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
