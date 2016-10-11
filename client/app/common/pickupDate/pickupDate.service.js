class PickupDateComService {
  constructor($http) {
    "ngInject";
    this.$http = $http;
  }

  create(pickup) {
    return this.$http.post("/api/pickup-dates/", pickup).then((res) => res.data);
  }

  get(params) {
    if (params && params.id){
      return this.getById(params.id);
    } else {
      return this.$http.get("/api/pickup-dates/", { params }).then((res) => res.data);
    }
  }

  getById(pickupId) {
    return this.$http.get(`/api/pickup-dates/${pickupId}/`).then((res) => res.data);
  }

  save(pickupId, updates) {
    return this.$http.patch(`/api/pickup-dates/${pickupId}/`, updates).then((res) => res.data);
  }

  delete(pickupId) {
    return this.$http.delete(`/api/pickup-dates/${pickupId}/`);
  }

  join(pickupId) {
    return this.$http.post(`/api/pickup-dates/${pickupId}/add/`, {}).then((res) => res.data);
  }

  leave(pickupId) {
    return this.$http.post(`/api/pickup-dates/${pickupId}/remove/`, {}).then((res) => res.data);
  }
}

export default PickupDateComService;
