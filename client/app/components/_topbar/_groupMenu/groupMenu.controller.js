class GroupMenuController {
  constructor($document, $mdDialog, $state, GroupService, CurrentGroup, SessionUser) {
    "ngInject";
    Object.assign(this, {
      $document,
      $mdDialog,
      $state,
      GroupService,
      groups: [],
      CurrentGroup,
      SessionUser
    });
  }
  $onInit() {
    this.GroupService.listMy().then((data) => {
      this.groups = data;
    });
  }

  open($mdMenu, $event) {
    this.GroupService.listMy().then((data) => {
      this.groups = data;
    });
    $mdMenu.open($event);
  }

  getGroups() {
    return this.groups.filter((el) => el.id !== this.CurrentGroup.value.id);
  }

  getGroupName() {
    if (angular.isDefined(this.CurrentGroup.value.name)) {
      return this.CurrentGroup.value.name;
    }
    let candidate = this.groups.find((e) => {
      return e.id === this.SessionUser.value.current_group;
    });
    if (candidate) {
      return candidate.name;
    }
    return undefined;
  }

  groupButton() {
    if (angular.isDefined(this.CurrentGroup.value.id)) {
      this.$state.go("group", { groupId: this.CurrentGroup.value.id });
    } else {
      this.$state.go("home");
    }
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
