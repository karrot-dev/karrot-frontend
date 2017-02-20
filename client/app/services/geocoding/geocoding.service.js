class GeocodingService {
  constructor($http, $translate) {
    "ngInject";
    Object.assign(this, {
      $http,
      $translate
    });
  }

  lookupAddress(address, lang = false) {
    if (!lang) lang = this.$translate.use();
    return this.$http.get("https://nominatim.openstreetmap.org/search", {
      params: { "accept-language": lang, format: "json", q: address },
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
