class PickupDateComService {
  constructor($http) {
    "ngInject";
    this.$http = $http;
  }

  create(pickup) {
    return this.$http.post("/api/pickup-dates/", pickup)
      .then((res) => res.data);
  }

  get(pickupId) {
    return this.$http.get(`/api/pickup-dates/${pickupId}/`)
      .then((res) => res.data);
  }

  list() {
    return this.$http.get("/api/pickup-dates/")
      .then((res) => res.data);
  }

  listByGroupId(groupId) {
    return this.$http.get("/api/pickup-dates/", { params: { group: groupId } })
      .then((res) => res.data);
  }

  listByStoreId(storeId) {
    return this.$http.get("/api/pickup-dates/", { params: { store: storeId } })
      .then((res) => res.data);
  }

  search(query) {
    return this.$http.get("/api/pickup-dates/", { params: { search: query } })
      .then((res) => res.data);
  }

  save(pickup) {
    let pickupId = pickup.id;
    return this.$http.patch(`/api/pickup-dates/${pickupId}/`, pickup)
      .then((res) => res.data);
  }

  delete(pickupId) {
    return this.$http.delete(`/api/pickup-dates/${pickupId}/`);
  }

  join(pickupId) {
    return this.$http.post(`/api/pickup-dates/${pickupId}/add/`, {})
      .then((res) => res.data);
  }

  leave(pickupId) {
    return this.$http.post(`/api/pickup-dates/${pickupId}/remove/`, {})
      .then((res) => res.data);
  }
}

export default PickupDateComService;
