class StoreComService {
  constructor($http) {
    "ngInject";
    this.$http = $http;
  }

  create(store) {
    return this.$http.post("/api/stores/", store)
      .then((res) => res.data);
  }

  get(storeId){
    return this.$http.get(`/api/stores/${storeId}/`)
      .then((res) => res.data);
  }

  list() {
    return this.$http.get("/api/stores/")
      .then((res) => res.data);
  }

  listByGroupId(groupId) {
    return this.$http.get("/api/stores/", { params: { group: groupId } })
      .then((res) => res.data);
  }

  search(query) {
    return this.$http.get("/api/stores/", { params: { search: query } })
      .then((res) => res.data);
  }

  save(store) {
    let storeId = store.id;
    return this.$http.patch(`/api/stores/${storeId}/`, store)
      .then((res) => res.data);
  }

  delete(storeId) {
    return this.$http.delete(`/api/stores/${storeId}/`);
  }
}

export default StoreComService;
