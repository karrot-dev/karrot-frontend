class CreatePickupController {
  constructor($mdDialog, PickupDate, PickupDateSeries, $locale) {
    "ngInject";
    Object.assign(this, {
      $mdDialog,
      PickupDate,
      PickupDateSeries,
      $locale,
      pickupData: {
        date: new Date(),
        maxCollectors: 2
      },
      isSeries: true,
      mode: "series",
      days: {}
    });
  }

  $onInit() {
    let keys = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
    for (let i = 0; i < 7; i++) {
      // let the week begin on Monday, because the FIRSTDAYOFWEEK value is usually set to Sunday
      this.days[(i + 6) % 7] = { key: keys[i], name: this.$locale.DATETIME_FORMATS.DAY[i] };
    }
  }

  assembleDate(date, time) {
    let newDate = new Date(date);
    newDate.setHours(time.getHours());
    newDate.setMinutes(time.getMinutes());
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
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
    return response.then((data) => {
      this.$mdDialog.hide(data);
    });
  }

  closePanel() {
    this.$mdDialog.cancel();
  }
}

export default CreatePickupController;
