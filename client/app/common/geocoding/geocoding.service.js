class GeocodingService {
  constructor($http) {
    "ngInject";
    Object.assign(this, {
      $http
    });
  }

  lookupAddress(address) {
    return this.$http.get("https://nominatim.openstreetmap.org/search", {
      params: { format: "json", q: address }
    }).then((res) => {
      console.log(res)
      return res.data.map(p => {
        return {
          lat: parseFloat(p.lat),
          lng: parseFloat(p.lon),
          name: p.display_name
        }
      })
    });
  }
}

export default GeocodingService;
