class HistoryController {
  constructor($mdDialog, $document) {
    "ngInject";
    Object.assign(this, {
      $mdDialog,
      $document
    });
  }

  $onChanges(changes) {
    if (changes && changes.data) {
      angular.forEach(this.data.results, (entry) => {
        entry.translate = "HISTORY." + entry.typus;
        entry.compareDate = entry.date.toISOString().substr(0,10);
        return entry;
      });
    }
  }

  loadMore() {
    return this.data.next().then((data) => {
      angular.forEach(data.results, (e) => {
        this.data.results.push(e);
      });
      this.data.next = data.next;
      return data;
    });
  }

  openHistoryDetail($event, item) {
    let DialogController = function (data) {
      "ngInject";
      this.data = data;
    };

    this.$mdDialog.show({
      parent: this.$document.body,
      targetEvent: $event,
      template: "<history-detail data='$ctrl.data'></history-detail>",
      locals: {
        data: item
      },
      controller: DialogController,
      controllerAs: "$ctrl"
    });
  }
}

export default HistoryController;
