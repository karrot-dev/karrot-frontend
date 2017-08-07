class MessageService {

  constructor($http) {
    "ngInject";
    this.$http = $http;
  }

  create(message) {
    return this.$http.post("/api/messages/", message)
      .then((res) => res.data);
  }

  list(conversationId) {
    return this.$http.get("/api/messages/", {
      params: { conversation: conversationId }
    })
      .then((res) => res.data);
  }

}

export default MessageService;
