class InvitationService {
  constructor($http) {
    "ngInject";
    Object.assign(this, {
      $http
    });
  }

  create(invitation) {
    return this.$http.post("/api/invitations/", invitation)
      .then((res) => res.data);
  }

  get(invitationId) {
    return this.$http.get(`/api/invitations/${invitationId}/`)
      .then((res) => res.data);
  }

  list() {
    return this.$http.get("/api/invitations/")
      .then((res) => res.data);
  }

  listByGroupId(groupId) {
    return this.$http.get("/api/invitations/", { params: { group: groupId } })
      .then((res) => res.data);
  }

  accept(token) {
    return this.$http.post(`/api/invitations/${token}/accept/`)
      .then((res) => res.data);
  }
}

export default InvitationService;
