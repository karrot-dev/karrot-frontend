class PickupListItemController {
  constructor($http, PickupDate, $filter) {
    "ngInject";
    this.$http = $http;
    this.PickupDate = PickupDate;

    this.info = {
      text: "Loading...",
      href: ""
    };

    if (this.showDetail === "store") {
      this.pickupdata.storePromise.then((storeData) => {
        this.info.text = storeData.name;
        this.info.href = "#!/store/" + storeData.id;
      });
    } else {
      this.info.text = $filter("date")(this.pickupdata.date, "EEEE, dd.MM.yyyy");
    }

    this.pickupdata.collectorsPromise.then((datas) => {
      this.pickupdata.collectors = datas;
    });
  }

  join() {
    // TODO: error handling
    this.PickupDate.join(this.pickupdata.id).then(() => {
      this.parentCtrl.updatePickups();
    });
  }

  leave() {
    // TODO: error handling
    this.PickupDate.leave(this.pickupdata.id).then(() => {
      this.parentCtrl.updatePickups();
    });
  }
}

export default PickupListItemController;
