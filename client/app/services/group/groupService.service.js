class GroupService {

  constructor($q, $http, Authentication) {
    "ngInject";
    this.$q = $q;
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
    return this.$http.get("/api/groups/", { params: { "include_empty": "False" } })
      .then((res) => res.data);
  }

  listByMemberId(memberId) {
    // TODO: backend supports filtering by multiple IDs, combined with OR
    return this.$http.get("/api/groups/", { params: { members: memberId } })
      .then((res) => res.data);
  }

  listByGroupName(groupName) {
    return this.$http.get("/api/groups/", { params: { name: groupName } })
      .then((res) => res.data);
  }

  listMy() {
    if (angular.isUndefined(this.Authentication.data)) {
      return this.$q.resolve([]);
    }
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

  join(groupId, data) {
    return this.$http.post(`/api/groups/${groupId}/join/`, data ? data : {})
      .then((res) => res.data);
  }

  leave(groupId) {
    return this.$http.post(`/api/groups/${groupId}/leave/`, {})
      .then((res) => res.data);
  }
}

export default GroupService;
