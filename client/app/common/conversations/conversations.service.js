export default class ConversationsService {
  constructor($http) {
    "ngInject";
    this.$http = $http;
  }
  list() {
    return this.$http.get("/api/conversations/")
      .then((res) => res.data);
  }
  get(id) {
    return this.$http.get(`/api/conversations/${id}/`)
      .then((res) => res.data);
  }
  createGroup(topic, participants, message) {
    return this.$http.post("/api/conversations/", {
      type: "MULTICHAT",
      topic,
      "with_participants": participants,
      message
    }).then((res) => res.data);
  }
  createPrivate(user, message) {
    return this.$http.post("/api/conversations/", {
      type: "ONE_TO_ONE",
      "with_participants": [user],
      message
    }).then((res) => res.data);
  }
  sendMessage(conversationId, message) {
    return this.$http.put(`/api/conversations/${conversationId}/`, {
      message
    }).then((res) => res.data);
  }
}
