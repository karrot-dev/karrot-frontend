class GroupMenuController {
  constructor($document, $mdDialog, $state, GroupService, CurrentGroup) {
    "ngInject";
    Object.assign(this, {
      $document,
      $mdDialog,
      $state,
      GroupService,
      groups: [],
      activeGroup: CurrentGroup.value
    });
  }

  openMenu($mdOpenMenu) {
    this.GroupService.listMy().then((data) => {
      this.groups = data;
    });
    $mdOpenMenu();
  }

  openJoinGroupDialog($event) {
    this.$mdDialog.show({
      parent: this.$document.body,
      targetEvent: $event,
      template: "<join-group></join-group>"
    }).then((groupId) => {
      this.$state.go("group", { groupId });
    });
  }
}

export default GroupMenuController;
