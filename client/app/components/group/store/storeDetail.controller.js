class StoreDetailController {
  constructor(Store, $scope, $state) {
    "ngInject";
    Object.assign(this, {
      Store, // needed?
      $scope, // needed?
      $state
    });
  }

  $onInit() {
    // set currentNavItem on redirect
    this.currentNavItem = this.$state.current.name;
  }
}

export default StoreDetailController;
