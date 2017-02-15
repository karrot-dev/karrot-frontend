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

  $onInit() {
    this.trySetLocation(this.editData);
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
    Object.assign(this.editData, item);
  }

  deleteIfEmpty(text) {
    if (!text) Object.assign(this.editData, {
      latitude: null,
      longitude: null,
      address: null
    });
  }
}

export default GroupEditCreateFormController;
