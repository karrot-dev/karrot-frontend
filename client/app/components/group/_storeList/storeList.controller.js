class StoreListController {
  constructor(Store, $state, $document, $mdMedia, CurrentStores) {
    "ngInject";
    Object.assign(this, {
      Store,
      CurrentStores,
      storeList: CurrentStores.list,
      $state,
      $document,
      $mdMedia,
      showMap: false
    });
  }

  $onChanges(changes) {
    if (changes.groupId && angular.isDefined(changes.groupId.currentValue)) {
      this.Store.listByGroupId(changes.groupId.currentValue).then((data) => {
        this.CurrentStores.set(data);
        this.storeList = angular.copy(this.CurrentStores.list);
      });
    }
  }

  toggleMap(){
    this.showMap = !this.showMap;
  }
}

export default StoreListController;
