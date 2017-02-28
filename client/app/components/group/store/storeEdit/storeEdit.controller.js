class StoreEditController {
  constructor($state, Store, CurrentStores) {
    "ngInject";
    Object.assign(this, {
      $state,
      Store,
      CurrentStores
    });
  }

  submit(data) {
    return this.Store.save(data).then((data) => {
      this.$state.go("group.store", { "storeId": data.id });
      this.CurrentStores.replaceItem(data);
      return data;
    });
  }
}

export default StoreEditController;
