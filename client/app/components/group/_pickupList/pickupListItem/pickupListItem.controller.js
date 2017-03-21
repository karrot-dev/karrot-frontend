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
    this.setStoreInfo();
    this.setCollectors();
  }

  join() {
    // TODO: error handling
    return this.PickupDate.join(this.data.id).then(() => {
      this.onJoin({ "pickupId": this.data.id });
      this.meta.isUserMember = true;
    });
  }

  leave() {
    // TODO: error handling
    return this.PickupDate.leave(this.data.id).then(() => {
      this.onLeave({ "pickupId": this.data.id });
      this.meta.isUserMember = false;
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
