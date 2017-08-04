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
    if (storeData.latitude && storeData.longitude) {
      this.setMarker(
        storeData.latitude,
        storeData.longitude,
        storeData.address);
    }
  }

  hasMarker() {
    return Object.keys(this.markers).length > 0;
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
      zoom: 16
    };
  }
}

export default StoreDetailMapController;
