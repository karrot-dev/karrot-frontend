class CreateStoreMapController {
  constructor() {
    "ngInject";
    Object.assign(this, {
      markers: {},
      bounds: {},
      center: {
        zoom: 12
      },
      defaults: {
        scrollWheelZoom: false,
        zoomControl: false
      },
      $onChanges: (change) => {
        if (change.latitude || change.longitude || change.address) {
          this.setMarker(
            change.latitude.currentValue,
            change.longitude.currentValue,
            change.address.currentValue);
        }
      }
    });
  }

  setMarker(lat, lng, message) {
    this.markers = {
      pin: {
        lat,
        lng,
        draggable: true,
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

export default CreateStoreMapController;
