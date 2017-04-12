
class ActivityService {
  constructor($http) {
    "ngInject";
    Object.assign(this, {
      $http
    });
  }
  list(filter) {
    return this.$http.get("/api/activity/", { params: filter })
      .then((res) => {
        return res.data.results.map( (entry) => {
          entry.date = new Date(entry.date);
          return entry;
        });
      });
  }
}

export default ActivityService;
