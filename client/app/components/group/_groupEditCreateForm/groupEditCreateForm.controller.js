import jstz from "jstimezonedetect";

class GroupEditCreateFormController {
  constructor(Geocoding, CurrentGroup) {
    "ngInject";
    Object.assign(this, {
      Geocoding,
      CurrentGroup,
      mapCenter: {},
      mapDefaults: {
        scrollWheelZoom: false,
        zoomControl: false,
        dragging: true
      }
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

  trySetLocation(item) {
    if (!item || !item.address ) return;
    this.marker = {
      p: {
        lat: item.latitude,
        lng: item.longitude,
        message: item.address,
        draggable: true
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

export default GroupEditCreateFormController;
