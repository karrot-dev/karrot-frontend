class StorePickupsController {
  constructor(CurrentStores) {
    "ngInject";
    Object.assign(this, {
      CurrentStores,
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

export default StorePickupsController;
