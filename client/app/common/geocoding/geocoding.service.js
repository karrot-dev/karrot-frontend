class GeocodingService {
  constructor($http) {
    "ngInject";
    Object.assign(this, {
      $http
    });
  }

  lookupAddress(address) {
    return this.$http.get("https://nominatim.openstreetmap.org/search", {
      params: { format: "json", limit: 1, q: address }
    }).then((data) => {
      let hit = data.data[0];
      return {
        latitude: parseFloat(hit.lat),
        longitude: parseFloat(hit.lon),
        name: hit.display_name
      };
    });
  }
}

export default GeocodingService;
