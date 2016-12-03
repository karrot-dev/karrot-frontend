class StoreDetailController {
  constructor(Store) {
    "ngInject";
    Object.assign(this, {
      Store
    });
    this.pickupListOptions = {
      showCreateButton: true,
      filter: {
        showJoined: true,
        showOpen: true,
        showFull: true
      }
    };
  }

  updateStoredata() {
    return this.Store.save(this.storedata);
  }
}

export default StoreDetailController;
