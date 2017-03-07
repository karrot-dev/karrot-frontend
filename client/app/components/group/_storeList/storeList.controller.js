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
      showMap: false,
      searchQuery: ""
    });
  }

  $onChanges(changes) {
    if (changes.groupId && angular.isDefined(changes.groupId.currentValue)) {
      this.Store.listByGroupId(changes.groupId.currentValue).then((data) => this.CurrentStores.set(data));
    }
  }

  toggleMap(){
    this.showMap = !this.showMap;
  }
}

export default StoreListController;
