class PickupListItemController {
  constructor(PickupDate, CurrentUsers) {
    "ngInject";
    Object.assign(this, {
      PickupDate,
      CurrentUsers
    });
  }

  $onInit() {
    this.showStoreDetail = this.showDetail === "store";
    this.setStoreInfo();
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

  setStoreInfo(){
    if (this.showStoreDetail) {
      this.data.storePromise.then((storeData) => {
        this.storeData = storeData;
      });
    }
  }

}

export default PickupListItemController;
