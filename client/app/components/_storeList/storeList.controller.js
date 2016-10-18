/**
 * TODOs
 *  open Edit Panel
 *  open Store Page
 */

class StoreListController {
  constructor(Store) {
    "ngInject";
    
    this.Store = Store;
    
    // check if stores it's a list of IDs or Stores
    if (angular.isNumber(this.stores[0])){
      this.storeData = [];
      this.getStores();
    } else {
      this.storeData = this.stores;
    }
  }
  
  /*
   * gets all stores in this.stores id-array, and saves the result in storeData
   */
  getStores(){
    angular.forEach(this.stores, (storeID) => {
      this.Store.getById(storeID).then((data) => this.storeData.push(data));
    });
  }
  
  onClick(store){
    if (angular.isDefined(this.callback)){
      this.callback(store);
    } else {
      //TODO: open store page
    }
  }
  
  editStore(){
    //TODO: Open Edit Panel
  }
}

export default StoreListController;
