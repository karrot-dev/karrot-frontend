
class HistoryService {
  constructor($http) {
    "ngInject";
    Object.assign(this, {
      $http
    });
  }

  processResponse(res, _this) {
    return {
      next: () => {
        let url = res.data.next.substr(res.data.next.indexOf("/api"));
        return _this.$http.get(url).then((res) => {
          return _this.processResponse(res, _this);
        });
      },
      results: res.data.results.map((entry) => {
        entry.date = new Date(entry.date);
        return entry;
      })
    };
  }

  list(filter) {
    return this.$http.get("/api/history/", { params: filter })
      .then((res) => this.processResponse(res, this));
  }
}

export default HistoryService;
