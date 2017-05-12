class HistoryDetailController {
  constructor($mdDialog) {
    "ngInject";
    Object.assign(this, {
      $mdDialog
    });
  }

  closePanel() {
    this.$mdDialog.cancel();
  }
}

export default HistoryDetailController;
