class UserService {

  constructor($http) {
    "ngInject";
    this.$http = $http;
  }

  users() {
    return this.$http.get("/api/users/").then((res) => res.data);
  }

  create(user) {
    return this.$http.post("/api/users/", user).then((res) => res.data);
  }

  get(pk) {
    return this.$http.get(`/api/users/${pk}/`).then((res) => res.data);
  }

  save(user) {
    return this.$http.patch(`/api/users/${user.id}/`, user).then((res) => res.data);
  }

  delete(pk) {
    return this.$http.delete(`/api/users/${pk}/`);
  }
}

export default UserService;
