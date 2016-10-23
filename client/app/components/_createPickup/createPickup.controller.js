class CreatePickupController {
  constructor($mdDialog) {
    "ngInject";
    this.$mdDialog = $mdDialog;
  }

  createPickup() {
    // mix datefield and timefield to one date
    let newDate = new Date(this.pickupData.date);
    newDate.setHours(this.pickupData.time.getHours());
    newDate.setMinutes(this.pickupData.time.getMinutes());

    let dataToSend = {
      max_collectors: this.pickupData.maxCollectors,
      date: newDate,
      store: this.storeId
    };

    //yPostReq.req('/api/pickup-dates/', dataToSend, thisDialog.refreshPage, thisDialog.closeDialog);
    this.$mdDialog.hide();
  }

  closePanel() {
    this.$mdDialog.hide();
  }
}

export default CreatePickupController;