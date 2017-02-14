class GroupEditController {
  constructor($state, GroupService, Geocoding) {
    "ngInject";
    Object.assign(this, {
      $state,
      GroupService,
      Geocoding,
      editData: angular.copy($state.groupData),
      mapCenter: {},
      mapDefaults: {
        scrollWheelZoom: false,
        zoomControl: false,
        dragging: false
      }
    });
  }

  submit() {
    this.saving = true;
    this.GroupService.save(this.editData).then((data) => {
      this.$state.groupData = data;
      this.$state.go("^");
    }).catch((err) => {
      this.error = err.data;
    });
  }

  geoLookup(query) {
    return this.Geocoding.lookupAddress(query);
  }

  setGeo(item) {
    if (!item) return;
    this.mapCenter.zoom = 10;
    this.editData.lat = item.lat;
    this.editData.lng = item.lng;
    this.editData.address = item.name;
    this.mapCenter.lat = item.lat;
    this.mapCenter.lng = item.lng;
  }
}

export default GroupEditController;
