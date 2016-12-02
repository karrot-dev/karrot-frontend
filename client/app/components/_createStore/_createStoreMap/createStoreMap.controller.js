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
        if ( (change.latitude || change.longitude || change.address)
              && (angular.isDefined(this.latitude)
                  && angular.isDefined(this.longitude)
                  && angular.isDefined(this.address))
            ) {
          this.setMarker(
            this.latitude,
            this.longitude,
            this.address);
        }
      }
    });
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

export default CreateStoreMapController;
