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
      if (angular.isUndefined(s.rule.byDay)) {
        s.rule.byDay = [keys[s.startDate.getDay()]];
      }

      s.$byDayLong = s.rule.byDay.map((d) => this.$locale.DATETIME_FORMATS.DAY[this.dayLookup[d]]);
    });

    // select pickups without series
    this.pickups = this.pickups.filter((p) => !p.series);
  }
}

export default PickupManageController;
