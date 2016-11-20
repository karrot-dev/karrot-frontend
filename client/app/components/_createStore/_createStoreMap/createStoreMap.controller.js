class CreateStoreMapController {
  constructor($http) {
    "ngInject";
    Object.assign(this, {
      $http,
      markers: {},
      bounds: {},
      center: {
        zoom: 12
      },
      defaults: {
        scrollWheelZoom: false,
        zoomControl: false
      }
    });
  }

  update() {
    this.$http.get("https://nominatim.openstreetmap.org/search", {
      params: { format: "json", limit: 1, q: this.address }
    }).then((data) => {
      let hit = data.data[0];
      this.latitude = parseFloat(hit.lat);
      this.longitude = parseFloat(hit.lon);
      this.markers = {
        pin: {
          lat: this.latitude,
          lng: this.longitude,
          draggable: true,
          message: hit.display_name
        }
      };
      this.center = {
        lat: this.latitude,
        lng: this.longitude,
        zoom: 12
      };
    });


  }
}

export default CreateStoreMapController;
