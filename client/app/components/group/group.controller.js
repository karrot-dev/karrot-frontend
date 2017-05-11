class GroupController {
  constructor($state, $mdMedia, CurrentStores, User, CurrentUsers) {
    "ngInject";
    Object.assign(this, {
      $state,
      $mdMedia,
      User,
      CurrentUsers,
      // for breadcrumb service in store
      // breadcrumb has only access to topmost controller, so we need to save it here
      selectedStore: CurrentStores.selected
    });
  }

  $onInit() {
    this.User.list().then((list) => {
      this.CurrentUsers.set(list);
    });
  }
}

export default GroupController;
