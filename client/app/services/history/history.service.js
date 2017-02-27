
class HistoryService {
  constructor($http) {
    "ngInject";
    Object.assign(this, {
      $http
    });
  }
  get(filter) {
    return this.$http.get("/api/history/", { params: filter })
      .then((res) => {
        return res.data.results.map( (entry) => {
          entry.date = new Date(entry.date);
          return entry;
        });
      });
  }
}

export default HistoryService;
