class CreateStoreController {
  constructor($scope, $mdDialog, Store, Geocoding) {
    "ngInject";
    Object.assign(this, {
      $scope,
      $mdDialog,
      Store,
      Geocoding,
      storeData: {
        group: this.groupId
      },
      ongoing: false
    });
  }

  createStore() {
    this.ongoing = true;
    this.error = "";
    this.Store.create(this.storeData).then((data) => {
      this.$mdDialog.hide(data);
    }).catch((err) => {
      this.error = err.data;
      this.ongoing = false;
    });
  }

  closePanel() {
    this.$mdDialog.cancel();
  }

  addressLookup() {
    this.lookupOngoing = true;
    this.Geocoding.lookupAddress(this.storeData.address).then((data) => {
      this.storeData.latitude = data.latitude;
      this.storeData.longitude = data.longitude;
      this.storeData.lookedUpAddress = data.name;
      this.lookupOngoing = false;
    }).catch(() => {
      // TODO: show that nothing was found
      this.lookupOngoing = false;
    });
  }
}

export default CreateStoreController;
