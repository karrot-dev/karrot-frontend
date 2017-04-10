class StoreEditCreateFormController {
  constructor(Geocoding, $stateParams, CurrentGroup, $scope) {
    "ngInject";
    Object.assign(this, {
      CurrentGroup,
      Geocoding,
      $stateParams,
      mapCenter: {},
      mapDefaults: {
        scrollWheelZoom: false,
        zoomControl: true,
        dragging: true
      }
    });

    $scope.mapController = this;
    $scope.$on("leafletDirectiveMap.click", (event, e) => {
      let item = {
        latitude: e.leafletEvent.latlng.lat,
        longitude: e.leafletEvent.latlng.lng
      };
      $scope.mapController.marker = {
        p: {
          lat: item.latitude,
          lng: item.longitude,
          message: item.address,
          draggable: false
        }
      };
      Object.assign($scope.mapController.data, item);
    });
  }

  $onInit() {
    if (angular.isUndefined(this.data)) {
      Object.assign(this, {
        isCreate: true,
        mapCenter: {
          lat: this.CurrentGroup.value.latitude,
          lng: this.CurrentGroup.value.longitude,
          zoom: 12
        },
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
    this.mapCenter.zoom = 15;
    this.mapCenter.lat = item.latitude;
    this.mapCenter.lng = item.longitude;
    Object.assign(this.data, item);
  }

  updateAndDeleteIfEmpty(text) {
    if (!text) {
      Object.assign(this.data, {
        latitude: null,
        longitude: null
      });
    } else {
      this.data.address = text;
    }
  }
}

export default StoreEditCreateFormController;
