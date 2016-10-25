class GroupService {

  constructor($http, Authentication) {
    "ngInject";
    this.$http = $http;
    this.Authentication = Authentication;
  }

  create(group) {
    return this.$http.post("/api/groups/", group)
      .then((res) => res.data);
  }

  get(groupId) {
    return this.$http.get(`/api/groups/${groupId}/`)
      .then((res) => res.data);
  }

  list() {
    return this.$http.get("/api/groups/")
      .then((res) => res.data);
  }

  listByMemberId(memberId) {
    // TODO: backend supports filtering by multiple IDs, combined with OR
    return this.$http.get("/api/groups/", { params: { members: memberId } })
      .then((res) => res.data);
  }

  listMy() {
    let myUserId = this.Authentication.data.id;
    return this.listByMemberId(myUserId);
  }

  search(query) {
    return this.$http.get("/api/groups/", { params: { search: query } })
      .then((res) => res.data);
  }

  save(group) {
    let groupId = group.id;
    return this.$http.patch(`/api/groups/${groupId}/`, group)
      .then((res) => res.data);
  }
}

export default GroupService;
