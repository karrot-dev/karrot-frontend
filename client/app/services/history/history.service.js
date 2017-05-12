
class HistoryService {
  constructor($http) {
    "ngInject";
    Object.assign(this, {
      $http
    });
  }

  processResponse(res, _this) {
    let getNext = undefined;
    if (res.data.next) {
      getNext = () => {
        let url = res.data.next.substr(res.data.next.indexOf("/api"));
        return _this.$http.get(url).then((res) => {
          return _this.processResponse(res, _this);
        });
      };
    }
    return {
      next: getNext,
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
