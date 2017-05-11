class PickupListController {

  constructor(Authentication, PickupDate, PickupDateSeries, Store, $filter, $mdDialog, $document) {
    "ngInject";
    Object.assign(this, {
      Authentication,
      PickupDate,
      PickupDateSeries,
      Store,
      $filter,
      $mdDialog,
      $document
    });
  }

  $onInit() {
    this.defaultOptions = {
      header: "Pickups",
      showCreateButton: false,
      showDetail: "date",
      showTopbar: true,
      showStickyHeaders: !(angular.isUndefined(this.options.showDetail) || this.options.showDetail === "date"),
      filter: {
        showJoined: false,
        showOpen: true,
        showFull: false
      },
      reversed: false
    };
    this.isInitialized = false;
    this.options = angular.merge(this.defaultOptions, this.options);

    this.Authentication.update().then((data) => {
      this.userId = data.id;
      this.updatePickups();
    });
  }

    /**
     * adds following infos to a list of pickups:
     * - store (if showDetail == store)
     */
  addPickupInfosAndDisplay(pickups) {
    let stores = {};
    angular.forEach(pickups, (currentPickup) => {
      if (this.options.showDetail === "store") {
        if (angular.isUndefined(stores[currentPickup.store])) {
          stores[currentPickup.store] = this.Store.get(currentPickup.store);
        }
        currentPickup.storePromise = stores[currentPickup.store];
      }
    });
    this.allPickups = pickups;
    this.filterAndDisplayPickups();
  }

/**
 * checks if a pickup is already full
 * @param {Object} pickup - pickup to check
 * @return true or false
 */
  isFull(pickup) {
    return  !(pickup.collector_ids.length < pickup.max_collectors);
  }

/**
 * checks if user is member of this pickup
 * @param {Object} pickup - pickup to check
 * @return true or false
 */
  isUserMember(pickup){
    return pickup.collector_ids.indexOf(this.userId) !== -1;
  }

    /*
     * Filters pickups, so that only the ones specified by the criteria in the header menu are shown
     * @return filtered pickups
     */
  filterAndDisplayPickups() {
    let pickups = [];
    angular.forEach(this.allPickups, (currentPickup) => {
      if (this.isUserMember(currentPickup) && this.options.filter.showJoined
        || this.isFull(currentPickup) && this.options.filter.showFull
        || !this.isFull(currentPickup) && this.options.filter.showOpen) {
        pickups.push(currentPickup);
      }
    });
    this.groupedPickups = this.groupByDate(pickups);
    this.isInitialized = true;
    return pickups;
  }

  /*
   * groups pickups by date
   * @return array with items like: {"date": "yyyy-MM-dd", "items", [pickups]}
   */
  groupByDate(arr){
    let getArrayItem = (date, arr) => {
      for (let i = 0; i < arr.length; i++){
        if (arr[i].date === date){
          return arr[i];
        }
      }
      return undefined;
    };

    let retArr = [];
    angular.forEach(arr, (pickup) => {
      let pickupDay = this.$filter("date")(pickup.date, "yyyy-MM-dd", "");
      let arrayItem = getArrayItem(pickupDay, retArr);
      if (angular.isDefined(arrayItem)){
        arrayItem.items.push(pickup);
      } else {
        retArr.push({ "date": pickupDay, "items": [pickup] });
      }
    });
    return retArr;
  }

  toggleReversed() {
    this.options.reversed = !this.options.reversed;
  }

    /**
     * update function that should be called every time something is changed in the list
     */
  updatePickups() {
    let promise = {};
    if (angular.isDefined(this.groupId)) {
      promise = this.PickupDate.listByGroupId(this.groupId);
    } else if (angular.isDefined(this.storeId)) {
      promise = this.PickupDate.listByStoreId(this.storeId);
    }
    promise.then((data) => this.addPickupInfosAndDisplay(data));
  }

  delete(pickup, $event) {
    this.pickupToDelete = pickup;
    return this.$mdDialog.show({
      contentElement: "#confirmDeleteDialog",
      parent: angular.element(this.$document.body),
      targetEvent: $event
    })
    .then(() => {
      if (this.isDeleteSeries) {
        return this.PickupDateSeries.delete(pickup.series);
      } else {
        return this.PickupDate.delete(pickup.id);
      }
    }).then(
    () => {
      if (this.isDeleteSeries) {
        this.allPickups = this.allPickups.filter((pickup) => {
          return pickup.series !== this.pickupToDelete.series;
        });
      } else {
        let index = this.allPickups.indexOf(this.pickupToDelete);
        this.allPickups.splice(index, 1);
      }
      this.filterAndDisplayPickups();
      this.isDeleteSeries = false;
    })
    .catch(() => {});
  }

  openCreatePickupPanel($event) {
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
          storeId: this.storeId,
          series: false
        }
      },
      controller: DialogController,
      controllerAs: "$ctrl"
    }).then((data) => {
      if (data.start_date) {
        // workaround: reload complete list if series was created
        this.updatePickups();
      } else {
        this.allPickups.push(data);
        this.filterAndDisplayPickups();
      }
    });
  }

  joinPickup(pickupId) {
    this.allPickups.find((e) => e.id === pickupId).collector_ids.push(this.userId);
  }

  leavePickup(pickupId){
    let pickupToLeave = this.allPickups.find((e) => e.id === pickupId);
    let userIndexToDelete = pickupToLeave.collector_ids.indexOf(this.userId);
    pickupToLeave.collector_ids.splice(userIndexToDelete,1);
  }
}

export default PickupListController;
