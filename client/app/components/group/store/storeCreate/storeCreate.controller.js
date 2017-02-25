class StoreCreateController {
  constructor(Store, $state) {
    "ngInject";
    Object.assign(this, {
      Store,
      $state
    });
  }

  submit(data) {
    return this.Store.create(data).then((data) => {
      this.$state.go("^.store", { storeId: data.id });
    });
  }
}

export default StoreCreateController;
