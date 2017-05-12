class HistoryController {
  constructor($mdDialog, $document) {
    "ngInject";
    Object.assign(this, {
      $mdDialog,
      $document
    });
  }

  getTranslateKey(entry) {
    return "HISTORY." + entry.typus;
  }

  showDateSubheader(index, array) {
    if (index === 0) return true;
    return this.onDifferentDay(array[index], array[index - 1]);
  }

  onDifferentDay(a, b) {
    return a.date.toISOString().substr(0,10) !== b.date.toISOString().substr(0,10);
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
