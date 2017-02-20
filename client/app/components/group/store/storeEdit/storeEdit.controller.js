class StoreEditController {
  constructor($state, Store) {
    "ngInject";
    Object.assign(this, {
      $state,
      Store
    });
  }

  submit() {
    this.saving = true;
    this.Store.save(this.storedata).then((data) => {
      this.$state.go("group.store", { "storeId": data.id });
    }).catch((err) => {
      this.error = err.data;
    });
  }
}

export default StoreEditController;
