import base from "../base/service";

class UserService extends base {

  constructor($http) {
    "ngInject";
    super();
    this.$http = $http;
  }

  create(user) {
    return this.$http.post("/api/users/", user).then((res) => res.data);
  }

  get(params) {
    if (params && params.id){
      return this.getById(params.id);
    } else {
      return this.$http.get("/api/users/", { params }).then((res) => res.data);
    }
  }

  getById(userId) {
    return this.$http.get(`/api/users/${userId}/`).then((res) => res.data);
  }

  save(id, updates) {
    return this.$http.patch(`/api/users/${id}/`, updates).then((res) => res.data);
  }

  delete(pk) {
    return this.$http.delete(`/api/users/${pk}/`);
  }
}

export default UserService;
