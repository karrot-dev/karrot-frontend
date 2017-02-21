class StoreDetailController {
  constructor(Store, $scope) {
    "ngInject";
    Object.assign(this, {
      Store,
      $scope,
      pickupListOptions: {
        showCreateButton: true,
        filter: {
          showJoined: true,
          showOpen: true,
          showFull: true
        }
      }
    });
  }
}

export default StoreDetailController;
