class StoreDetailController {
  constructor($state, CurrentStores, CurrentGroup) {
    "ngInject";
    Object.assign(this, {
      $state,
      selectedStore: CurrentStores.selected,  // for breadcrumb
      CurrentGroup // for group breadcrumb
    });
  }

  $onInit() {
    // set navbar selection on page load
    this.currentNavItem = this.$state.current.name;
  }
}

export default StoreDetailController;
