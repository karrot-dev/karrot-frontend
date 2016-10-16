class PickupListItemController {
  constructor($http, PickupDate) {
    "ngInject";
    this.$http = $http;
    this.PickupDate = PickupDate;
  }

  join() {
    this.PickupDate.join(this.data.id).then(this.parentCtrl.updatePickups(), null);
  }

  leave() {
    this.PickupDate.leave(this.data.id).then(this.parentCtrl.updatePickups(), null);
  }
}

export default PickupListItemController;
