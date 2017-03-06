class GroupController {
  constructor($state, $mdMedia, CurrentStores) {
    "ngInject";
    Object.assign(this, {
      $state,
      $mdMedia,
      // for breadcrumb service in store
      // breadcrumb has only access to topmost controller, so we need to save it here
      selectedStore: CurrentStores.selected
    });
  }
}

export default GroupController;
