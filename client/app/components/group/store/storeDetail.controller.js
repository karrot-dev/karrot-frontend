class StoreDetailController {
  constructor($state, $stateParams, CurrentStores, Store, CurrentGroup, $mdMedia) {
    "ngInject";
    Object.assign(this, {
      $state,
      $stateParams,
      Store,
      CurrentStores,
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

    // refresh all stores, maybe other users added/changed them
    this.Store.listByGroupId(this.$stateParams.groupId).then((data) => {
      this.CurrentStores.set(data);
    });
  }
}

export default StoreDetailController;
