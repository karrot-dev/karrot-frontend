class PickupListItemController {
  constructor($http, PickupDate, $filter, User) {
    "ngInject";
    this.$http = $http;
    this.PickupDate = PickupDate;
    this.User = User;
    this.$filter = $filter;

    this.collectors = [];

    this.setInfo();
    this.setCollectors();
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

  setCollectors(){
    angular.forEach(this.data.collector_ids, (userID) => {
      this.User.get(userID).then((data) => this.collectors.push(data));
    });
  }

  setInfo(){
    this.setInfoText("Loading...", "");

    if (this.showDetail === "store") {
      this.data.storePromise.then((storeData) => {
        this.setInfoText(storeData.name, "#!/store/" + storeData.id);
      });
    } else {
      let newInfoText = this.$filter("date")(this.data.date, "EEEE, dd.MM.yyyy");
      this.setInfoText(newInfoText, "");
    }
  }

  setInfoText(text, href){
    this.info = { text, href };
  }
}

export default PickupListItemController;
