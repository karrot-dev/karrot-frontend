class HistoryController {
  constructor(History) {
    "ngInject";
    Object.assign(this, {
      History,
      list: []
    });
  }
  $onInit() {
    this.History.get().then( (res) => {
      this.list = res
        .sort( (a, b) => a.date < b.date)
        .map( (entry) => {
          entry.translate = "HISTORY." + entry.typus;
          entry.compareDate = entry.date.toISOString().substr(0,10);
          return entry;
        });
    });
  }
}

export default HistoryController;
