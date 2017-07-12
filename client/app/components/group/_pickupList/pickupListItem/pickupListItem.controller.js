class PickupListItemController {
  constructor(PickupDate, CurrentUsers, CurrentStores) {
    "ngInject";
    Object.assign(this, {
      PickupDate,
      CurrentUsers,
      CurrentStores
    });
  }

  $onInit() {
    this.showStoreDetail = this.showDetail === "store";
    this.storeData = this.CurrentStores.get(this.data.store);
    this.isEmpty = this.data.collector_ids.length === 0;
  }

  join() {
    // TODO: error handling
    return this.PickupDate.join(this.data.id).then(() => {
      this.onJoin({ "pickupId": this.data.id });
      this.meta.isUserMember = true;
      this.isEmpty = false;
    });
  }

  leave() {
    // TODO: error handling
    return this.PickupDate.leave(this.data.id).then(() => {
      this.onLeave({ "pickupId": this.data.id });
      this.meta.isUserMember = false;
      this.isEmpty = this.data.collector_ids.length === 0;
    });
  }

}

export default PickupListItemController;
