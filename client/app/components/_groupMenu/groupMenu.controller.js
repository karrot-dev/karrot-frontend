class GroupMenuController {
  constructor(Group) {
    "ngInject";
    Object.assign(this, {
      Group,
      groups: []
    });
  }

  openMenu($mdOpenMenu) {
    this.Group.listMy().then((data) => {
      this.groups = data;
    });
    $mdOpenMenu();
  }
}

export default GroupMenuController;
