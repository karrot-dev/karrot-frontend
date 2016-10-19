class PickupListItemController {
  constructor($http, PickupDate, $filter) {
    "ngInject";
    this.$http = $http;
    this.PickupDate = PickupDate;

    this.info = {
      text: "Loading...",
      href: ""
    };

    if (this.showDetail === "store"){
      this.data.storePromise.then((storeData) => {
        this.info.text = storeData.name;
        this.info.href = "#/stores/" + storeData.id;
      });
    } else {
      this.info.text = $filter("date")(this.data.date, "EEEE, dd.MM.yyyy");
    }
  }

  join() {
    this.PickupDate.join(this.data.id).then(this.parentCtrl.updatePickups(), null);
  }

  leave() {
    this.PickupDate.leave(this.data.id).then(this.parentCtrl.updatePickups(), null);
  }
}

export default PickupListItemController;
