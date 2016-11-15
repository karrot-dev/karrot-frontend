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
    this.Store.create(this.storeData).then(() => {
      // TODO: reload page
    });
    this.$mdDialog.hide();
  }

  closePanel() {
    this.$mdDialog.hide();
  }
}

export default CreateStoreController;
