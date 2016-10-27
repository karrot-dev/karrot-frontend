class GroupMenuController {
  constructor(Group, CurrentGroup) {
    "ngInject";
    Object.assign(this, {
      Group,
      groups: [],
      activeGroup: CurrentGroup.value
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
