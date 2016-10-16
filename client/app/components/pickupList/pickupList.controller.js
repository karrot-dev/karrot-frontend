class PickupListController {

  constructor(Authentication, PickupDate, Store) {
    "ngInject";
    this.reversed = false;
    this.Authentication = Authentication;
    this.PickupDate = PickupDate;
    this.Store = Store;


    this.pickupList = {
      showJoined: false,
      showOpen: true,
      showFull: false
    };

    // need to update first, so that Authentication.credentials are set
    this.Authentication.update().then(() => this.updatePickups());
  }

    /**
     * adds following infos to a list of pickups:
     * - isUserMember
     * - isFull
     * - store (returns name if showDetail == store)
     */
  addPickuplistInfos(pickups) {
    angular.forEach(pickups, (currentPickup) => {
      currentPickup.isUserMember = currentPickup.collector_ids.indexOf(this.Authentication.credentials.id) !== -1;
      currentPickup.isFull = !(currentPickup.collector_ids.length < currentPickup.max_collectors);

      if (this.showDetail === "store") {
        currentPickup.store = this.Store.get(currentPickup.store);
      }
    });
    this.allPickups = pickups;
    this.filterPickups();
  }

    /*
     * Filters pickups, so that only the ones specified by the criteria in the menu are shown
     */
  filterPickups() {
    let pickups = [];
    angular.forEach(this.allPickups, (currentPickup) => {
      if (   currentPickup.isUserMember && this.pickupList.showJoined
                        || currentPickup.isFull && this.pickupList.showFull
                        || !currentPickup.isFull && this.pickupList.showOpen) {
        pickups.push(currentPickup);
      }
    });
    this.pickups = pickups;
  }

  toggleReversed() {
    this.reversed = !this.reversed;
  }


    /**
     * update function that should be called every time something is changed in the list
     */
  updatePickups() {
    let filter = {};
    if (angular.isDefined(this.groupId)) {
      filter = { group: this.groupId };
    } else if (angular.isDefined(this.storeId)) {
      filter = { store: this.storeId };
    }

        //TODO: Get correct pickup-dates
    this.PickupDate.get(filter).then((data) => this.addPickuplistInfos(data));
        //apiPickups.query(filter, this.addPickuplistInfos);
  }
}

export default PickupListController;
