class GroupController {
  constructor($state, $mdMedia, $stateParams, Store, CurrentStores, User, CurrentUsers, CurrentGroup) {
    "ngInject";
    Object.assign(this, {
      $state,
      $mdMedia,
      $stateParams,
      User,
      CurrentUsers,
      Store,
      CurrentStores,

      // for breadcrumb service
      // we need to give it the data where it looks, which also sometimes happens in this controller
      selectedStore: CurrentStores.selected,
      CurrentGroup
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
