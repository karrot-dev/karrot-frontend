class GeocodingService {
  constructor($http) {
    "ngInject";
    Object.assign(this, {
      $http
    });
  }

  lookupAddress(address) {
    return this.$http.get("https://nominatim.openstreetmap.org/search", {
      params: { format: "json", q: address },
      ignoreLoadingBar: true
    }).then((res) => {
      return res.data.map((p) => {
        return {
          latitude: parseFloat(p.lat),
          longitude: parseFloat(p.lon),
          address: p.display_name
        };
      });
    });
  }
}

export default GeocodingService;
