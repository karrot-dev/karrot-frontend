class UserService {

  constructor($http) {
    "ngInject";
    this.$http = $http;
  }

  create(user) {
    return this.$http.post("/api/users/", user)
      .then((res) => res.data);
  }

  get(userId) {
    return this.$http.get(`/api/users/${userId}/`)
      .then((res) => res.data);
  }

  list() {
    return this.$http.get("/api/users/")
      .then((res) => res.data);
  }

  search(query) {
    return this.$http.get("/api/users/", { params: { search: query } })
      .then((res) => res.data);
  }

  save(user) {
    let userId = user.id;
    return this.$http.patch(`/api/users/${userId}/`, user)
      .then((res) => res.data);
  }

  delete(userId) {
    return this.$http.delete(`/api/users/${userId}/`);
  }
}

export default UserService;
