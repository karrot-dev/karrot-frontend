class StoreDetailController {
  constructor(Store, Geocoding, $scope) {
    "ngInject";
    Object.assign(this, {
      Store,
      Geocoding,
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

  $onChanges(changes) {
    if (changes.storedata && changes.storedata.currentValue) {
      this.storeEdit = angular.copy(changes.storedata.currentValue);
      this.mapData = angular.copy(changes.storedata.currentValue);
    }
  }

  addressLookup() {
    this.lookupOngoing = true;
    this.Geocoding.lookupAddress(this.storeEdit.address).then((data) => {
      // use a copy to trigger change detection
      this.mapData = this.storeEdit = Object.assign(angular.copy(this.storeEdit), {
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.name
      });
      this.lookupOngoing = false;
    }).catch(() => {
      // TODO: show that nothing was found
      this.lookupOngoing = false;
    });
  }

  updateStoredata() {
    return this.Store.save(this.storeEdit).then((data) => {
      this.storedata = data;
      return data;
    });
  }

  reset() {
    this.$scope.editableStore.$cancel();
    this.mapData = this.storedata;
  }
}

export default StoreDetailController;
