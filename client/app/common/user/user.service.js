class UserService {

  constructor($http) {
    "ngInject";
    this.$http = $http;
  }

  create(user) {
    return this.$http.post("/api/users/", user)
      .then((res) => res.data);
  }

  get(params) {
    if (params && params.id){
      return this.getById(params.id);
    } else {
      return this.$http.get("/api/users/", { params })
        .then((res) => res.data);
    }
  }

  getById(userId) {
    return this.$http.get(`/api/users/${userId}/`)
      .then((res) => res.data);
  }

  save(userId, updates) {
    return this.$http.patch(`/api/users/${userId}/`, updates)
      .then((res) => res.data);
  }

  delete(userId) {
    return this.$http.delete(`/api/users/${userId}/`);
  }
}

export default UserService;
