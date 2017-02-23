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
    return this.$http.get(`/api/conversations/${id}`)
      .then((res) => res.data);
  }
}
