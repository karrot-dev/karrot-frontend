class HistoryController {
  constructor() {
    "ngInject";
    Object.assign(this, {
    });
  }
  $onChanges(changes) {
    if (changes && changes.data) {
      angular.forEach(this.data, (entry) => {
        entry.translate = "HISTORY." + entry.typus;
        entry.compareDate = entry.date.toISOString().substr(0,10);
        return entry;
      });
    }
  }
}

export default HistoryController;
