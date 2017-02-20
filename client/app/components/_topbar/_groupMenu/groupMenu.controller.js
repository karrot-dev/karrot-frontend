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

  openMenu($mdMenu, $event) {
    this.GroupService.listMy().then((data) => {
      this.groups = data;
    });
    $mdMenu.open($event);
  }

  openJoinGroupDialog($event) {
    this.$mdDialog.show({
      parent: this.$document.body,
      targetEvent: $event,
      template: "<md-dialog style='height:80%'><join-group></join-group></md-dialog>"
    }).then((groupId) => {
      this.$state.go("group", { groupId });
    });
  }
}

export default GroupMenuController;
