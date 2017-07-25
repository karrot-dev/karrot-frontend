class StoreDetailController {
  constructor($state, CurrentStores, CurrentGroup, $mdMedia) {
    "ngInject";
    Object.assign(this, {
      $state,
      selectedStore: CurrentStores.selected,  // for breadcrumb
      CurrentGroup, // for group breadcrumb
      $mdMedia
    });
  }

  $onInit() {
    // set navbar selection on page load
    this.currentNavItem = this.$state.current.name;
    this.CurrentGroup.map.center = {
      lat: this.selectedStore.latitude,
      lng: this.selectedStore.longitude,
      zoom: 13
    };
  }
}

export default StoreDetailController;
