class MapPickerController {
  constructor(Geocoding, CurrentGroup, $scope) {
    "ngInject";
    Object.assign(this, {
      Geocoding,
      CurrentGroup,
      $scope,
      mapCenter: {},
      mapDefaults: {
        scrollWheelZoom: false,
        zoomControl: true,
        dragging: true
      }
    });
  }

  $onInit() {
    if (angular.isUndefined(this.data) || angular.isUndefined(this.data.latitude)) {
      Object.assign(this, {
        mapCenter: {
          lat: this.CurrentGroup.value.latitude,
          lng: this.CurrentGroup.value.longitude,
          zoom: 12
        }
      });
    } else {
      this.trySetLocation(this.data);
    }

    this.$scope.$on("leafletDirectiveMap.click", (event, e) => {
      let item = {
        latitude: e.leafletEvent.latlng.lat,
        longitude: e.leafletEvent.latlng.lng
      };
      this.setMarker(item);
    });
  }

  geoLookup() {
    return this.Geocoding.lookupAddress(this.query);
  }

  setMarker(item) {
    if (!this.marker || !this.marker.p) this.marker = { p: {} };
    angular.copy({
      lat: item.latitude,
      lng: item.longitude,
      message: item.address,
      draggable: false
    }, this.marker.p);
    this.data.latitude = item.latitude;
    this.data.longitude = item.longitude;
  }

  trySetLocation(item) {
    if (!item || !item.address ) return;
    this.setMarker(item);
    this.query = item.address;
    this.mapCenter.zoom = 15;
    this.mapCenter.lat = item.latitude;
    this.mapCenter.lng = item.longitude;
    Object.assign(this.data, item);
  }

  updateOrDeleteIfEmpty(text) {
    this.data.address = text;
    if (!text) {
      Object.assign(this.data, {
        latitude: null,
        longitude: null,
        address: null
      });
    }
  }

}

export default MapPickerController;
