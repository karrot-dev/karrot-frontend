class GroupInfoController {
  constructor() {
    "ngInject";
    Object.assign(this, {
      map: {
        markers: {},
        center: {},
        defaults: {
          scrollWheelZoom: false
        }
      }
    });
  }

  $onChanges(changes) {
    if (changes.groupData && changes.groupData.currentValue) {
      this.updateWith(changes.groupData.currentValue);
    }
  }

  hasMarkers() {
    return Object.keys(this.map.markers).length > 0;
  }

  hasLocation(data) {
    return data.latitude && data.longitude && data.address;
  }

  updateWith(data) {
    if (this.hasLocation(data)) {
      this.setMarker(
        data.latitude,
        data.longitude,
        data.address);
    }
  }

  setMarker(lat, lng, message) {
    this.map.markers = {
      pin: {
        lat,
        lng,
        draggable: false,
        message
      }
    };
    this.map.center = {
      lat,
      lng,
      zoom: 16
    };
  }
}

export default GroupInfoController;
