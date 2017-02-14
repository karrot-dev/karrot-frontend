class GroupEditCreateFormController {
  constructor(Geocoding) {
    "ngInject";
    Object.assign(this, {
      Geocoding,
      mapCenter: {},
      mapDefaults: {
        scrollWheelZoom: false,
        zoomControl: false,
        dragging: false
      }
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

export default GroupEditCreateFormController;
