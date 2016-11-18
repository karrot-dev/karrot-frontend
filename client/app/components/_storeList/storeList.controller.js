/**
 * TODOs
 *  open Edit Panel
 */

class StoreListController {
  constructor(Store, $state, $document, $mdDialog, $scope) {
    "ngInject";
    Object.assign(this, {
      Store,
      $state,
      $document,
      $mdDialog,
      $scope
    });

    // check if stores it's a list of IDs or Stores
    if (angular.isNumber(this.stores[0])) {
      this.storeData = [];
      this.getStores();
    } else {
      this.storeData = this.stores;
    }
  }

  /*
   * gets all stores in this.stores id-array, and saves the result in storeData
   */
  getStores() {
    angular.forEach(this.stores, (storeID) => {
      this.Store.get(storeID).then((data) => this.storeData.push(data));
    });
  }

  onClick(store) {
    if (angular.isDefined(this.callback)) {
      this.callback(store);
    } else {
      this.$state.go( "storeDetail", { id: store.id } );
    }
  }

  editStore() {
    //TODO: Open Edit Panel
  }

  openCreateStorePanel($event) {
    let DialogController = function (groupId) {
      "ngInject";
      this.groupId = groupId;
    };

    this.$mdDialog.show({
      parent: this.$document.body,
      targetEvent: $event,
      template: "<create-store group-id='$ctrl.groupId'></create-store>",
      locals: {
        groupId: this.groupId
      },
      controller: DialogController,
      controllerAs: "$ctrl"
    }).then((data) => {
      this.storeData.push(data);
      this.$scope.$broadcast("storeDataChange");
    });
  }
}

export default StoreListController;
