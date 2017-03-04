import moment from "moment";

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
      timeExample: moment(new Date()).format("LT"),
      timeChoices: this.getTimeChoices(false),
      allTimeChoices: this.getTimeChoices(true)
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

      // shared pickup data
      // note that we do partial updates on the server, so we don't need to copy *all* values
      this.pickupData = {
        id: this.data.editData.id,
        "max_collectors": this.data.editData.max_collectors,
        store: this.data.editData.store
      };

      this.time = new Date();
      // splitted pickup data and copy time to autocomplete input
      if (this.data.series) {
        this.seriesData = {
          "start_date": this.data.editData.start_date,
          rule: this.data.editData.rule
        };
        this.copyTime(this.seriesData.start_date, this.time);
      } else {
        this.singleData = {
          date: this.data.editData.date
        };
        this.copyTime(this.singleData.date, this.time);
      }
      this.time = {
        moment: moment(this.time),
        text: moment(this.time).format("LT")
      };
    // otherwise set default data for creation
    } else {
      Object.assign(this, {
        // shared data
        pickupData: {
          store: this.data.storeId,
          "max_collectors": 2
        },
        singleData: {
          date: moment().add(1, "days").toDate()
        },
        seriesData: {
          "start_date": new Date(),
          rule: {
            freq: "WEEKLY",
            byDay: [keys[(new Date()).getDay()]]
          }
        },
        time: this.timeChoices[40]
      });
    }
  }

  copyTime(source, dest) {
    dest.setHours(source.getHours());
    dest.setMinutes(source.getMinutes());
  }

  timeLookup(text) {
    if (!text) {
      return this.timeChoices;
    } else {
      return this.allTimeChoices.filter((e) => e.text.startsWith(text));
    }
  }

  getTimeChoices(all) {
    let list = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += all ? 1 : 15) {
        let suggestion = moment().hour(h).minute(m);
        list.push({
          moment: suggestion,
          text: suggestion.format("LT")
        });
      }
    }
    return list;
  }

  handleSubmit() {
    let response;
    if (this.isSeries) {
      this.copyTime(this.time.moment.toDate(), this.seriesData.start_date);
      let outgoing = angular.merge({}, this.pickupData, this.seriesData);
      if (this.isCreate) {
        response = this.PickupDateSeries.create(outgoing);
      } else {
        response = this.PickupDateSeries.save(outgoing);
      }
    } else {
      this.copyTime(this.time.moment.toDate(), this.singleData.date);
      let outgoing = angular.merge({}, this.pickupData, this.singleData);
      if (this.isCreate) {
        response = this.PickupDate.create(outgoing);
      } else {
        response = this.PickupDate.save(outgoing);
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
