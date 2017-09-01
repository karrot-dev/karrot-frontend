
class ActivityService {
  constructor($http) {
    "ngInject";
    Object.assign(this, {
      $http
    });
  }

  processResponse(res) {
    let getNext = undefined;
    if (res.data.next) {
      getNext = () => {
        let url = res.data.next.substr(res.data.next.indexOf("/api"));
        return this.$http.get(url).then((res) => {
          return this.processResponse.bind(this)(res);
        });
      };
    }
    return {
      next: getNext,
      results: res.data.results.map((entry) => {
        entry.date = new Date(entry.date);
        return entry;
      }),
      count: res.data.count
    };
  }

  list(filter) {
    return this.$http.get("/api/history/", { params: filter })
      // to support recursive promise callback calls, we need to bind 'this'
      .then((res) => this.processResponse.bind(this)(res));
  }
}

export default ActivityService;
