/**
 * TODOs
 *  open Edit Panel
 *  open Store Page
 */

class StoreListController {
  constructor(Store, $state, $document, $mdDialog) {
    "ngInject";
    Object.assign(this, {
      Store,
      $state,
      $document,
      $mdDialog
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
    let parentEl = this.$document.body;

    let DialogController = function (groupId) {
      "ngInject";
      this.groupId = groupId;
    };

    this.$mdDialog.show({
      parent: parentEl,
      targetEvent: $event,
      template: `{{storeId}}<create-store group-id='$ctrl.groupId'></create-store>`,
      locals: {
        groupId: this.groupId
      },
      controller: DialogController,
      controllerAs: "$ctrl"
    });
  }
}

export default StoreListController;
