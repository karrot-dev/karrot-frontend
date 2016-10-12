import base from "../base/service";

class StoreComService extends base {
  constructor($http) {
    "ngInject";
    super();
    this.$http = $http;
  }

  stores() {
    return this.$http.get("/api/stores/")
      .then((res) => res.data);
  }

  create(group) {
    return this.$http.post("/api/stores/", group)
      .then((res) => res.data);
  }

  get(params) {
    if (params && params.id){
      return this.getById(params.id);
    } else {
      return this.$http.get("/api/stores/", { params })
        .then((res) => res.data);
    }
  }

  getById(storeId){
    return this.$http.get(`/api/stores/${storeId}/`)
      .then((res) => res.data);
  }

  save(storeId, updates) {
    return this.$http.patch(`/api/stores/${storeId}/`, updates)
      .then((res) => res.data);
  }

  delete(storeId) {
    return this.$http.delete(`/api/stores/${storeId}/`);
  }
}

export default StoreComService;
