import base from "../base/service";

class GroupService extends base {

  constructor($http) {
    "ngInject";
    super();
    this.$http = $http;
  }

  create(group) {
    return this.$http.post("/api/groups/", group).then((res) => res.data);
  }

  get(params) {
    if (params && params.id) {
      return this.getById(params.id);
    } else {
      return this.$http.get("/api/groups/", { params }).then((res) => res.data);
    }
  }

  getById(groupId) {
    return this.$http.get(`/api/groups/${groupId}/`).then((res) => res.data);
  }

  save(groupId, updates) {
    return this.$http.patch(`/api/groups/${groupId}/`, updates).then((res) => res.data);
  }

  delete(groupId) {
    return this.$http.delete(`/api/groups/${groupId}/`);
  }
}

export default GroupService;
