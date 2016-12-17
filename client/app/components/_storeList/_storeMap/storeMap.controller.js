class StoreMapController {
  constructor() {
    "ngInject";
    Object.assign(this, {
      markers: {},
      bounds: {},
      defaults: {
        scrollWheelZoom: false
      }
    });
  }

  $onChanges(changes) {
    if (changes.storeList) {
      this.update();
    }
  }

  update() {
    this.markers = this.getMarkers(this.storeList);
    if (this.hasMarkers()) {
      let bounds = new L.latLngBounds(Object.values(this.markers)).pad(0.2); // eslint-disable-line
      this.bounds = {
        northEast: bounds._northEast,
        southWest: bounds._southWest,
        options: {
          maxZoom: 12
        }
      };
    }
  }

  hasMarkers() {
    return Object.keys(this.markers).length > 0;
  }

  getMarkers(fromArray) {
    let markers = {};
    angular.forEach(fromArray, (e) => {
      if (e.latitude === null || e.longitude === null) return;
      markers[e.id] = {
        lat: e.latitude,
        lng: e.longitude,
        message: `<a ui-sref='storeDetail({ storeId: ${e.id}, groupId: ${e.group} })'>${e.name}</a>`,
        draggable: false
      };
    });
    return markers;
  }
}

export default StoreMapController;
