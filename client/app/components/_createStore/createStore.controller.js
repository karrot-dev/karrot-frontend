class CreateStoreController {
  constructor($mdDialog, Store) {
    "ngInject";
    Object.assign(this, {
      $mdDialog,
      Store,
      storeData: {
        group: this.groupId
      },
      ongoing: false
    });
  }

  createStore() {
    this.ongoing = true;
    this.error = "";
    this.Store.create(this.storeData).then((data) => {
      this.$mdDialog.hide(data);
    }).catch((err) => {
      this.error = err.data;
      this.ongoing = false;
    });
  }

  closePanel() {
    this.$mdDialog.cancel();
  }
}

export default CreateStoreController;
