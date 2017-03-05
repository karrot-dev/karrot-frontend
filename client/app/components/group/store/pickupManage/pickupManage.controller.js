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

    this.keys = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
    this.dayLookup = {};
    for (let i = 0; i < 7; i++) {
      this.dayLookup[this.keys[i]] = i;
    }
  }

  $onInit() {
    angular.forEach(this.series, (s) => {
      // handle old creation behavior where byDay can be undefined
      // -> can be removed after a while
      if (angular.isUndefined(s.rule.byDay)) {
        s.rule.byDay = [this.keys[s.start_date.getDay()]];
      }
    });
  }

  getDayNames(series) {
    return series.rule.byDay.map((d) => this.$locale.DATETIME_FORMATS.DAY[this.dayLookup[d]]);
  }

  getSinglePickups() {
    return this.pickups.filter((p) => !p.series);
  }

  openPanel($event, config) {
    let DialogController = function (data) {
      "ngInject";
      this.data = data;
    };

    this.$mdDialog.show({
      parent: this.$document.body,
      targetEvent: $event,
      template: "<pickup-edit-create data='$ctrl.data'></pickup-edit-create>",
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
          // detected a series through missing date
          this.series.push(data);
        } else {
          this.pickups.push(data);
        }
      }
    });
  }
}

export default PickupManageController;
