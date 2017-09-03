import moment from "moment";

class PickupListController {

  constructor(SessionUser, PickupDate, PickupDateSeries, Store, $mdDialog, $document, ScreenSize) {
    "ngInject";
    Object.assign(this, {
      SessionUser,
      PickupDate,
      PickupDateSeries,
      Store,
      $mdDialog,
      $document,
      ScreenSize
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

    this.updatePickups();
  }

  updatePickups() {
    let promise;
    if (angular.isDefined(this.groupId)) {
      promise = this.PickupDate.listByGroupId(this.groupId);
    } else if (angular.isDefined(this.storeId)) {
      promise = this.PickupDate.listByStoreId(this.storeId);
    }
    promise.then((data) => {
      this.allPickups = data;
      this.isInitialized = true;
    });
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
    return pickup.collector_ids.indexOf(this.SessionUser.value.id) !== -1;
  }

  getPickups() {
    return this.allPickups.filter((currentPickup) => {
      return this.options.filter.showJoined && this.isUserMember(currentPickup)
        || this.options.filter.showFull && this.isFull(currentPickup)
        || this.options.filter.showOpen && !this.isFull(currentPickup);
    });
  }

  showDateHeaderBefore($index, pickups) {
    if ($index === 0) return true;
    return this.onDifferentDay(pickups[$index], pickups[$index - 1]);
  }

  onDifferentDay(a, b) {
    return !moment(a.date).isSame(b.date, "day");
  }

  toggleReversed() {
    this.options.reversed = !this.options.reversed;
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
        this.isDeleteSeries = false;
      })
    .catch(() => {});
  }

  openEditPickupPanel($event, pickup) {
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
          series: false,
          editData: angular.copy(pickup)
        }
      },
      controller: DialogController,
      controllerAs: "$ctrl"
    }).then((response) => {
      angular.copy(response, pickup);
    }).catch();
  }

  joinPickup(pickupId) {
    this.allPickups.find((e) => e.id === pickupId).collector_ids.push(this.SessionUser.value.id);
  }

  leavePickup(pickupId){
    let pickupToLeave = this.allPickups.find((e) => e.id === pickupId);
    let userIndexToDelete = pickupToLeave.collector_ids.indexOf(this.SessionUser.value.id);
    pickupToLeave.collector_ids.splice(userIndexToDelete,1);
  }
}

export default PickupListController;
