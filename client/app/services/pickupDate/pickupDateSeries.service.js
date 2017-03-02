class PickupDateSeriesService {
  constructor($http) {
    "ngInject";
    this.$http = $http;
  }

  create(series) {
    return this.$http.post("/api/pickup-date-series/", this.$serialize(series))
      .then((res) => this.$parse(res.data));
  }

  get(seriesId) {
    return this.$http.get(`/api/pickup-date-series/${seriesId}/`)
      .then((res) => this.$parse(res.data));
  }

  list() {
    return this.$http.get("/api/pickup-date-series/")
      .then((res) => this.$parseList(res.data));
  }

  listByStoreId(storeId) {
    return this.$http.get("/api/pickup-date-series/", { params: { store: storeId } })
      .then((res) => this.$parseList(res.data));
  }

  save(series) {
    let seriesId = series.id;
    return this.$http.patch(`/api/pickup-date-series/${seriesId}/`, this.$serialize(series))
      .then((res) => this.$parse(res.data));
  }

  delete(seriesId) {
    return this.$http.delete(`/api/pickup-date-series/${seriesId}/`);
  }

  // conversion methods for this service

  $parse(external) {
    let incoming = angular.copy(external);
    Object.assign(incoming, {
      start_date: new Date(incoming.start_date), //eslint-disable-line
      rule: this.$parseRule(incoming.rule)
    });
    return incoming;
  }

  $parseList(external) {
    return external.map((entry) => this.$parse(entry));
  }

  $serialize(internal) {
    let outgoing = angular.copy(internal);
    Object.assign(outgoing, {
      rule: this.$serializeRule(outgoing.rule)
    });
    return outgoing;
  }

  $parseRule(rule) {
    // takes rule string and returns object
    let parts = rule.split(";");
    let obj = {};
    angular.forEach(parts, (part) => {
      if (part.substr(0, 5) === "BYDAY") {
        obj.byDay = part.substr(6).split(",");
      } else if (part.substr(0, 4) === "FREQ") {
        obj.freq = part.substr(5);
      }
    });
    return obj;
  }

  $serializeRule(obj) {
    // takes rule object and return string
    return `FREQ=${obj.freq};BYDAY=${obj.byDay.join()}`;
  }
}

export default PickupDateSeriesService;
