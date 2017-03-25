class PickupListItemController {
  constructor(PickupDate, User) {
    "ngInject";
    Object.assign(this, {
      PickupDate,
      User,
      collectors: []
    });
  }

  $onInit() {
    this.showStoreDetail = this.showDetail === "store";
    if (angular.isDefined(this.data)) {
      this.setStoreInfo();
      this.setCollectors();
    }
  }

  join() {
    // TODO: error handling
    return this.PickupDate.join(this.data.id).then(() => {
      this.parentCtrl.updatePickups();
    });
  }

  leave() {
    // TODO: error handling
    return this.PickupDate.leave(this.data.id).then(() => {
      this.parentCtrl.updatePickups();
    });
  }

  setCollectors(){
    angular.forEach(this.data.collector_ids, (userID) => {
      this.User.get(userID).then((data) => this.collectors.push(data));
    });
  }

  setStoreInfo(){
    if (this.showStoreDetail) {
      this.data.storePromise.then((storeData) => {
        this.storeData = storeData;
      });
    }
  }

}

export default PickupListItemController;
