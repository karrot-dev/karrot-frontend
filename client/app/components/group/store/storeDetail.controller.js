class StoreDetailController {
  constructor($state, CurrentStores, CurrentGroup, $timeout) {
    "ngInject";
    Object.assign(this, {
      $state,
      selectedStore: CurrentStores.selected,  // for breadcrumb
      CurrentGroup, // for group breadcrumb
      $timeout
    });
  }

  $onInit() {
    // set navbar selection on page load
    this.currentNavItem = this.$state.current.name;
    this.$timeout(() => {
      this.CurrentGroup.map.showLatLngZ(this.selectedStore.latitude, this.selectedStore.longitude, 15);
    }, 1000);
  }
}

export default StoreDetailController;
