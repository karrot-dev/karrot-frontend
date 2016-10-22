/**
 * TODOs
 *  open Edit Panel
 *  open Store Page
 */

class StoreListController {
  constructor(Store, $state) {
    "ngInject";

    this.StoreService = Store;
    this.$state = $state;

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
      this.StoreService.get(storeID).then((data) => this.storeData.push(data));
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
}

export default StoreListController;
