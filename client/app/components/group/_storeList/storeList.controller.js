class StoreListController {
  constructor(Store, $state, $document, ScreenSize, CurrentStores) {
    "ngInject";
    Object.assign(this, {
      Store,
      CurrentStores,
      storeList: CurrentStores.list,
      $state,
      $document,
      ScreenSize,
      showMap: false,
      searchQuery: ""
    });
  }

  $onChanges(changes) {
    if (changes.groupId && angular.isDefined(changes.groupId.currentValue)) {
      this.Store.listByGroupId(changes.groupId.currentValue).then((data) => {
        this.CurrentStores.set(data);
      });
    }
  }

  toggleMap(){
    this.showMap = !this.showMap;
  }
}

export default StoreListController;
