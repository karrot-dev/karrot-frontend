class CreatePickupController {
  constructor($mdDialog, PickupDate) {
    "ngInject";
    this.$mdDialog = $mdDialog;
    this.PickupDate = PickupDate;
  }

  createPickup() {
    // mix datefield and timefield to one date
    let newDate = new Date(this.pickupData.date);
    newDate.setHours(this.pickupData.time.getHours());
    newDate.setMinutes(this.pickupData.time.getMinutes());


    let dataToSend = {
      max_collectors: this.pickupData.maxCollectors, // eslint-disable-line
      date: newDate,
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