class StoreCreateController {
  constructor(Store, CurrentStores, $state) {
    "ngInject";
    Object.assign(this, {
      Store,
      CurrentStores,
      $state
    });
  }

  submit(data) {
    return this.Store.create(data).then((data) => {
      this.$state.go("^.store", { storeId: data.id });
      this.CurrentStores.pushItem(data);
      return data;
    });
  }
}

export default StoreCreateController;
