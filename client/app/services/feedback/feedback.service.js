class FeedbackService {
  constructor($http) {
    "ngInject";
    Object.assign(this, {
      $http
    });
  }

  create(feedback) {
    return this.$http.post("/api/feedback/", feedback)
      .then((res) => res.data);
  }

  list() {
    return this.$http.get("/api/feedback/")
    .then((res) => res.data);
  }
}

export default FeedbackService;
