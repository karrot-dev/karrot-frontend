class StoreListController {
  constructor(Store, $state, $document, $mdMedia) {
    "ngInject";
    Object.assign(this, {
      Store,
      $state,
      $document,
      $mdMedia,
      showMap: false
    });
  }

  $onChanges(changes) {
    if (changes.groupId && angular.isDefined(changes.groupId.currentValue)) {
      this.Store.listByGroupId(changes.groupId.currentValue).then((data) => this.storeList = data);
    }
  }

  toggleMap(){
    this.showMap = !this.showMap;
  }
}

export default StoreListController;
