class StoreListController {
  constructor(Store, $state, $document, $mdDialog) {
    "ngInject";
    Object.assign(this, {
      Store,
      $state,
      $document,
      $mdDialog
    });
  }

  $onChanges(changes) {
    if (changes.groupId && angular.isDefined(changes.groupId.currentValue)) {
      this.Store.listByGroupId(changes.groupId.currentValue).then((data) => this.storeList = data);
    }
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
      // use a copy to trigger change detection
      let t = angular.copy(this.storeList);
      t.push(data);
      this.storeList = t;
    });
  }
}

export default StoreListController;
