class CreatePickupController {
  constructor($mdDialog, PickupDate) {
    "ngInject";
    this.$mdDialog = $mdDialog;
    this.PickupDate = PickupDate;
    this.date = {};
    this.pickupData = {
      date: new Date(),
      maxCollectors: 2
    };
  }

  assembleDate() {
    let newDate = new Date(this.pickupData.date);
    newDate.setHours(this.pickupData.time.getHours());
    newDate.setMinutes(this.pickupData.time.getMinutes());
    this.date = newDate;
  }

  createPickup() {
    this.assembleDate();
    let dataToSend = {
      max_collectors: this.pickupData.maxCollectors, // eslint-disable-line
      date: this.date,
      store: this.storeId
    };

    this.PickupDate.create(dataToSend).then(() => {
      this.pickuplistCtrl.updatePickups();
    });
    this.$mdDialog.hide();
  }

  closePanel() {
    this.$mdDialog.hide();
  }
}

export default CreatePickupController;
