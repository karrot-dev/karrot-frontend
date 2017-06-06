class StoreDetailController {
  constructor(Store, $scope, $state, CurrentStores, CurrentGroup) {
    "ngInject";
    Object.assign(this, {
      Store, // needed?
      $scope, // needed?
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
