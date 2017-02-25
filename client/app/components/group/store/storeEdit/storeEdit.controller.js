class StoreEditController {
  constructor($state, Store) {
    "ngInject";
    Object.assign(this, {
      $state,
      Store
    });
  }

  submit(data) {
    return this.Store.save(data).then((data) => {
      this.$state.go("group.store", { "storeId": data.id });
    });
  }
}

export default StoreEditController;
