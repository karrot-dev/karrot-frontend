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
      template: "<md-dialog style='height:80%'><join-group></join-group></md-dialog>"
    }).then((groupId) => {
      this.$state.go("groupDetail", { groupId });
    });
  }
}

export default GroupMenuController;
