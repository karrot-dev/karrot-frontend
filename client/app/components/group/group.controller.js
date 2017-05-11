class GroupController {
  constructor($state, $mdMedia, $stateParams, Store, CurrentStores, User, CurrentUsers) {
    "ngInject";
    Object.assign(this, {
      $state,
      $mdMedia,
      $stateParams,
      User,
      CurrentUsers,
      Store,
      CurrentStores,
      // for breadcrumb service in store
      // breadcrumb has only access to topmost controller, so we need to save it here
      selectedStore: CurrentStores.selected
    });
  }

  $onInit() {
    this.User.list().then((list) => {
      this.CurrentUsers.set(list);
    });
    this.Store.listByGroupId(this.$stateParams.groupId).then((data) => {
      this.CurrentStores.set(data);
    });
  }
}

export default GroupController;
