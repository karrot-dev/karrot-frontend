class StoreEditCreateFormController {
  constructor(Geocoding, $stateParams) {
    "ngInject";
    Object.assign(this, {
      Geocoding,
      $stateParams,
      mapCenter: {},
      mapDefaults: {
        scrollWheelZoom: false,
        zoomControl: false,
        dragging: false
      }
    });
  }

  $onInit() {
    if (angular.isUndefined(this.data)) {
      Object.assign(this, {
        isCreate: true,
        data: {
          group: this.$stateParams.groupId
        }
      });
    } else {
      this.trySetLocation(this.data);
    }
  }

  submit() {
    // set locals to evaluate against in the parent expression
    // data="parent_submit(data)" takes the locals.data object
    let locals = { data: this.data };
    return this.onSubmit(locals).catch((err) => {
      Object.assign(this, {
        error: err.data
      });
    });
  }

  geoLookup() {
    return this.Geocoding.lookupAddress(this.query);
  }

  trySetLocation(item) {
    if (!item || !item.address ) return;
    this.marker = {
      p: {
        lat: item.latitude,
        lng: item.longitude,
        message: item.address,
        draggable: false
      }
    };
    this.query = item.address;
    this.mapCenter.zoom = 10;
    this.mapCenter.lat = item.latitude;
    this.mapCenter.lng = item.longitude;
    Object.assign(this.data, item);
  }

  deleteIfEmpty(text) {
    if (!text) Object.assign(this.data, {
      latitude: null,
      longitude: null,
      address: null
    });
  }
}

export default StoreEditCreateFormController;
