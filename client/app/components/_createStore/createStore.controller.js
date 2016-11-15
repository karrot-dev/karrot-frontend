class CreateStoreController {
  constructor($mdDialog, Store) {
    "ngInject";
    Object.assign(this, {
      $mdDialog,
      Store,
      storeData: {
        group: this.groupId
      }
    });
  }

  createStore() {
    // TODO show spinning wheel
    this.Store.create(this.storeData).then((data) => {
      this.$mdDialog.hide(data);
    }).catch((err) => {
      console.log(err);
    });
  }

  closePanel() {
    this.$mdDialog.cancel();
  }
}

export default CreateStoreController;
