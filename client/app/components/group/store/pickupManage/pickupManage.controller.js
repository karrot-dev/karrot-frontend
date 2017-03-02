class PickupManageController {
  constructor($locale, $mdDialog, $document, $stateParams) {
    "ngInject";
    Object.assign(this, {
      $locale,
      $mdDialog,
      $document,
      $stateParams,
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
        s.rule.byDay = [keys[s.start_date.getDay()]];
      }

      s.$byDayLong = s.rule.byDay.map((d) => this.$locale.DATETIME_FORMATS.DAY[this.dayLookup[d]]);
    });

    // select pickups without series
    this.pickups = this.pickups.filter((p) => !p.series);
  }

  openPanel($event, config) {
    let DialogController = function (data) {
      "ngInject";
      this.data = data;
    };

    this.$mdDialog.show({
      parent: this.$document.body,
      targetEvent: $event,
      template: "<create-pickup data='$ctrl.data'></create-pickup>",
      locals: {
        data: {
          storeId: this.$stateParams.storeId,
          series: config.series,
          editData: angular.copy(config.data)
        }
      },
      controller: DialogController,
      controllerAs: "$ctrl"
    }).then((data) => {
      if (config.data) {
        // edited, update entry
        angular.copy(data, config.data);
      } else {
        // new entry, add to list
        if (angular.isUndefined(data.date)) {
          this.series.push(data);
        } else {
          this.pickups.push(data);
        }
      }
      this.$onInit();
    });
  }
}

export default PickupManageController;
