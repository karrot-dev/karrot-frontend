class pickupEditCreateController {
  constructor($mdDialog, PickupDate, PickupDateSeries, $locale) {
    "ngInject";
    Object.assign(this, {
      $mdDialog,
      PickupDate,
      PickupDateSeries,
      $locale,
      isCreate: true,
      days: {},
      time: new Date()
    });
  }

  $onInit() {
    Object.assign(this, {
      isSeries: this.data.series,
      mode: this.data.series ? "series" : "single"
    });

    let keys = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
    for (let i = 0; i < 7; i++) {
      // let the week begin on Monday, because the FIRSTDAYOFWEEK value is usually set to Sunday
      this.days[(i + 6) % 7] = { key: keys[i], name: this.$locale.DATETIME_FORMATS.DAY[i] };
    }

    // check if we get incoming data
    if (angular.isDefined(this.data.editData)) {
      this.isCreate = false;
      // create a shortcut
      this.pickupData = this.data.editData;

      if (this.data.series) {
        this.copyTime(this.pickupData.start_date, this.time);
      } else {
        this.copyTime(this.pickupData.date, this.time);
      }
    // otherwise set default data for creation
    } else {
      Object.assign(this, {
        pickupData: {
          store: this.data.storeId,
          date: new Date(),
          "max_collectors": 2,
          "start_date": new Date(),
          rule: {
            freq: "WEEKLY",
            byDay: [keys[(new Date()).getDay()]]
          }
        }
      });
    }
  }

  copyTime(source, dest) {
    dest.setHours(source.getHours());
    dest.setMinutes(source.getMinutes());
  }

  handleSubmit() {
    let response;
    if (this.isSeries) {
      this.copyTime(this.time, this.pickupData.start_date);
      if (this.isCreate) {
        response = this.PickupDateSeries.create(this.pickupData);
      } else {
        response = this.PickupDateSeries.save(this.pickupData);
      }
    } else {
      this.copyTime(this.time, this.pickupData.date);
      if (this.isCreate) {
        response = this.PickupDate.create(this.pickupData);
      } else {
        response = this.PickupDate.save(this.pickupData);
      }
    }
    return response.then((data) => {
      this.$mdDialog.hide(data);
    });
  }

  closePanel() {
    this.$mdDialog.cancel();
  }
}

export default pickupEditCreateController;
