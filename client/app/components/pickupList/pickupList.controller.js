class PickupListController {
    
  constructor(Authentication, PickupDate, Store, $filter) {
    "ngInject";
    this.reversed = false;
    this.Authentication = Authentication;
    this.PickupDate = PickupDate;
    this.Store = Store;
    this.userId = -1;
    this.$filter = $filter;
        
        
        this.pickupList = {
            showJoined: false,
            showOpen: true,
            showFull: false
        };
        
        this.Authentication.update().then(() => this.updatePickups()); // need to update first, so that Authentication.credentials are set        
    }
    
    /**
     * adds following infos to a list of pickups:
     * - isUserMember
     * - isFull
     * - store (returns name if showDetail == store) 
     */
    addPickuplistInfos(pickups) {
        angular.forEach(pickups, (currentPickup) => {
            currentPickup.isUserMember = currentPickup.collector_ids.indexOf(this.Authentication.credentials.id) !== -1;
            currentPickup.isFull = !(currentPickup.collector_ids.length < currentPickup.max_collectors);

            if (this.showDetail === 'store') {
                currentPickup.store = this.Store.get(currentPickup.store);
            }
        });
        this.allPickups = pickups;
        this.filterPickups();
    }
    
    /*
     * Filters pickups, so that only the ones specified by the criteria in the header menu are shown
     * @return filtered pickups
     */
  filterPickups() {
    let pickups = [];
    angular.forEach(this.allPickups, (currentPickup) => {
      if (currentPickup.isUserMember && this.pickupList.showJoined
        || currentPickup.isFull && this.pickupList.showFull
        || !currentPickup.isFull && this.pickupList.showOpen) {
        pickups.push(currentPickup);
      }
    });
    this.groupedPickups = this.groupByDate(pickups);
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
    
    
    /**
     * update function that should be called every time something is changed in the list
     */
    updatePickups() {
        var filter = {};
        if (this.groupId !== undefined) {
            filter = {group: this.groupId};
        } else if (this.storeId !== undefined) {
            filter = {store: this.storeId};
        }
        
        //TODO: Get correct pickup-dates
        this.PickupDate.get(filter).then((data) => this.addPickuplistInfos(data));
        //apiPickups.query(filter, this.addPickuplistInfos);
    }
}

export default PickupListController;
