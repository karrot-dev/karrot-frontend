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
      this.data.storePromise.then((storeData) => {
        this.info.text = storeData.name;
        this.info.href = "#!/store/" + storeData.id;
      });
    } else {
      this.info.text = $filter("date")(this.data.date, "EEEE, dd.MM.yyyy");
    }
  }

  join() {
    // TODO: error handling
    this.PickupDate.join(this.data.id).then(() => {
      this.parentCtrl.updatePickups();
    });
  }

  leave() {
    // TODO: error handling
    this.PickupDate.leave(this.data.id).then(() => {
      this.parentCtrl.updatePickups();
    });
  }
}

export default PickupListItemController;
