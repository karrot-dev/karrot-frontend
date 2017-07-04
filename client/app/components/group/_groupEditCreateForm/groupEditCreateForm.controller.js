import jstz from "jstimezonedetect";

class GroupEditCreateFormController {
  constructor(Geocoding, CurrentGroup, GroupService, $scope) {
    "ngInject";
    Object.assign(this, {
      Geocoding,
      CurrentGroup,
      GroupService,
      $scope,
      mapCenter: {},
      mapDefaults: {
        scrollWheelZoom: false,
        zoomControl: true,
        dragging: true
      },
      allTimezones: []
    });
  }
  $onInit() {
    if (angular.isUndefined(this.data)) {
      Object.assign(this, {
        isCreate: true,
        data: {
          timezone: jstz.determine().name()
        }
      });
    } else {
      this.trySetLocation(this.data);
    }

    this.GroupService.timezones().then((response) => {
      this.allTimezones = response.all_timezones;
    });

    this.$scope.$on("leafletDirectiveMap.click", (event, e) => {
      let item = {
        latitude: e.leafletEvent.latlng.lat,
        longitude: e.leafletEvent.latlng.lng
      };
      this.setMarker(item);
    });
  }

  submit() {
    // update data if marker has been dragged around
    if (this.marker) {
      Object.assign(this.data, {
        latitude: this.marker.p.lat,
        longitude: this.marker.p.lng
      });
    }

    // set locals to evaluate against in the parent expression
    // data="parent_submit(data)" takes the locals.data object
    let locals = { data: this.data };
    return this.onSubmit(locals).then((data) => {
      this.CurrentGroup.set(data);
      return data;
    })
    .catch((err) => {
      Object.assign(this, {
        error: err.data
      });
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
      draggable: true
    }, this.marker.p);
  }

  trySetLocation(item) {
    if (!item || !item.address ) return;
    this.setMarker(item);
    this.query = item.address;
    this.mapCenter.zoom = 10;
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

  filterTimezones(search) {
    return this.allTimezones.filter((tz) => tz.toLowerCase().includes(search.toLowerCase()));
  }
}

export default GroupEditCreateFormController;
