class CreatePickupController {
  constructor($mdDialog, PickupDate, PickupDateSeries) {
    "ngInject";
    Object.assign(this, {
      $mdDialog,
      PickupDate,
      PickupDateSeries,
      pickupData: {
        date: new Date(),
        maxCollectors: 2
      },
      isSeries: true,
      mode: "series"
    });
  }

  assembleDate(date, time) {
    let newDate = new Date(date);
    newDate.setHours(time.getHours());
    newDate.setMinutes(time.getMinutes());
    newDate.setSeconds(0);
    return newDate;
  }

  createPickup() {
    let response;
    if (this.isSeries) {
      response = this.PickupDateSeries.create({
        "max_collectors": this.pickupData.maxCollectors,
        "start_date": this.assembleDate(new Date(), this.pickupData.time),
        store: this.storeId,
        rule: `FREQ=WEEKLY;BYDAY=${this.byDay.join()}`
      });
    } else {
      response = this.PickupDate.create({
        "max_collectors": this.pickupData.maxCollectors,
        date: this.assembleDate(this.pickupData.date, this.pickupData.time),
        store: this.storeId
      });
    }
    response.then((data) => {
      this.$mdDialog.hide(data);
    });
  }

  closePanel() {
    this.$mdDialog.cancel();
  }
}

export default CreatePickupController;
