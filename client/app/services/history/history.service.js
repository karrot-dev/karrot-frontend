import fixtures from "./history.fixtures.json";

class HistoryService {
  constructor($q) {
    "ngInject";
    Object.assign(this, {
      $q
    });
  }
  get(filter = {}) {
    let deferred = this.$q.defer();

    deferred.resolve(fixtures.map( (entry) => {
      entry.date = new Date(entry.date)
      return entry;
    }));

    return deferred.promise;
  }
}

export default HistoryService;
