class PickupDateComService {
  constructor($http) {
    "ngInject";
    this.$http = $http;
  }

  create(pickup) {
    return this.$http.post("/api/pickup-dates/", this.$serialize(pickup))
      .then((res) => this.$parse(res.data));
  }

  get(pickupId) {
    return this.$http.get(`/api/pickup-dates/${pickupId}/`)
      .then((res) => this.$parse(res.data));
  }

  list() {
    return this.$http.get("/api/pickup-dates/", { params: { "date_0": new Date() } })
      .then((res) => this.$parseList(res.data));
  }

  listByGroupId(groupId) {
    return this.$http.get("/api/pickup-dates/", { params: { group: groupId, "date_0": new Date() } })
      .then((res) => this.$parseList(res.data));
  }

  listByStoreId(storeId) {
    return this.$http.get("/api/pickup-dates/", { params: { store: storeId, "date_0": new Date() } })
      .then((res) => this.$parseList(res.data));
  }

  listBySeriesId(seriesId) {
    return this.$http.get("/api/pickup-dates/", { params: { series: seriesId, "date_0": new Date() } })
      .then((res) => this.$parseList(res.data));
  }

  save(pickup) {
    let pickupId = pickup.id;
    return this.$http.patch(`/api/pickup-dates/${pickupId}/`, this.$serialize(pickup))
      .then((res) => this.$parse(res.data));
  }

  delete(pickupId) {
    return this.$http.delete(`/api/pickup-dates/${pickupId}/`);
  }

  join(pickupId) {
    return this.$http.post(`/api/pickup-dates/${pickupId}/add/`, {})
      .then((res) => this.$parse(res.data));
  }

  leave(pickupId) {
    return this.$http.post(`/api/pickup-dates/${pickupId}/remove/`, {})
      .then((res) => this.$parse(res.data));
  }

  // conversion methods for this service

  $parse(external) {
    let incoming = angular.copy(external);
    Object.assign(incoming, {
      date: new Date(incoming.date)
    });
    return incoming;
  }

  $parseList(external) {
    return external.map((entry) => this.$parse(entry));
  }

  $serialize(internal) {
    return internal;
  }
}

export default PickupDateComService;
