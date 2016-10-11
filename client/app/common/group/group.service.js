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

  getByUser(member) {
    return this.$http.get("/api/groups/", { member }).then((res) => res.data);
  }

  search(search) {
    return this.$http.get("/api/groups/", { search }).then((res) => res.data);
  }

  get(groupId) {
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
