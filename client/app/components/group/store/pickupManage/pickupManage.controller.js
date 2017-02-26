class PickupManageController {
  constructor($locale) {
    "ngInject";
    Object.assign(this, {
      $locale,
      days: {}
    });
  }

  $onInit() {
    let keys = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
    this.dayLookup = {};
    for (let i = 0; i < 7; i++) {
      this.dayLookup[keys[i]] = i;
    }

    angular.forEach(this.series, (s) => {
      // parse date
      s.startDate = new Date(s.start_date);
      delete s.start_date;

      // parse rule into array
      if (s.rule.indexOf("BYDAY") >= 0) {
        s.$byDay = s.rule.split(";").find((e) => e.substr(0, 5) === "BYDAY").substr(6).split(",");
      } else {
        s.$byDay = [keys[s.startDate.getDay()]];
      }

      s.$byDayLong = s.$byDay.map((d) => this.$locale.DATETIME_FORMATS.DAY[this.dayLookup[d]]);
    });

    // select pickups without series
    this.pickups = this.pickups.filter((p) => !p.series);
  }
}

export default PickupManageController;
