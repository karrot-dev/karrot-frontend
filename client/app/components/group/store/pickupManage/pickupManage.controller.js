class PickupManageController {
  constructor($locale, $mdDialog, $document, $stateParams, PickupDate, PickupDateSeries) {
    "ngInject";
    Object.assign(this, {
      $locale,
      $mdDialog,
      $document,
      $stateParams,
      PickupDate,
      PickupDateSeries,
      days: {}
    });

    this.keys = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
    this.dayLookup = {};
    for (let i = 0; i < 7; i++) {
      this.dayLookup[this.keys[i]] = i;
    }
  }

  $onInit() {
    this.sortLists();

    angular.forEach(this.series, (s) => {
      // expand pickups for series per default
      s.$expanded = true;

      // handle old creation behavior where byDay can be undefined
      // -> can be removed after a while
      if (angular.isUndefined(s.rule.byDay)) {
        s.rule.byDay = [this.keys[s.start_date.getDay()]];
      }
    });
  }

  sortLists() {
    this.series.sort((a, b) => {
      return a.start_date.getHours() * 60 + a.start_date.getMinutes() -
        (b.start_date.getHours() * 60 + b.start_date.getMinutes());
    });
    this.pickups.sort((a, b) => {
      return a.date - b.date;
    });
  }

  getDayNames(series) {
    return series.rule.byDay.map((d) => this.$locale.DATETIME_FORMATS.DAY[this.dayLookup[d]]);
  }

  getSinglePickups() {
    return this.pickups.filter((p) => !p.series);
  }

  getPickupsInSeries(series) {
    return this.pickups.filter((p) => p.series === series.id);
  }

  hasSameTime(series, pickup) {
    return series.start_date.getMinutes() === pickup.date.getMinutes() &&
      series.start_date.getSeconds() === pickup.date.getSeconds();
  }

  hasSameMaxCollectors(series, pickup) {
    return series.max_collectors === pickup.max_collectors;
  }

  hasCollectors(pickup) {
    return pickup.collector_ids.length > 0;
  }

  reloadPickupsInSeries(series) {
    this.PickupDate.listBySeriesId(series.id).then((pickups) => {
      this.deletePickupsInSeries(series);
      angular.forEach(pickups, (p) => {
        this.pickups.push(p);
      });
    });
  }

  deletePickupsInSeries(series) {
    angular.forEach(this.getPickupsInSeries(series), (pickup) => {
      let i = this.pickups.indexOf(pickup);
      this.pickups.splice(i, 1);
    });
  }

  toggle(series) {
    series.$expanded = !series.$expanded;
  }

  isSeries(data) {
    // detect a series through missing date
    return angular.isUndefined(data.date);
  }

  openEditCreatePanel($event, config) {
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
      if (this.isSeries(data)) {
        data.$expanded = true;
        this.reloadPickupsInSeries(data);
      }
      if (config.data) {
        // edited, update entry
        angular.copy(data, config.data);
      } else {
        // new entry, add to list
        if (this.isSeries(data)) {
          this.series.push(data);
        } else {
          this.pickups.push(data);
        }
      }
      this.sortLists();
    }).catch(() => {});
  }

  openDeletePanel($event, config) {
    return this.$mdDialog.show({
      contentElement: "#confirmDeleteDialog",
      parent: angular.element(this.$document.body),
      targetEvent: $event
    }).then(() => {
      if (config.series) {
        return this.PickupDateSeries.delete(config.data.id);
      } else {
        return this.PickupDate.delete(config.data.id);
      }
    }).then(() => {
      if (config.series) {
        let i = this.series.indexOf(config.data);
        this.series.splice(i, 1);
        this.deletePickupsInSeries(config.data);
      } else {
        let i = this.pickups.indexOf(config.data);
        this.pickups.splice(i, 1);
      }
    }).catch(() => {});
  }
}

export default PickupManageController;
