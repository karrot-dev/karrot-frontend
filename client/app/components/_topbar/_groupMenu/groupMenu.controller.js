class GroupMenuController {
  constructor($document, $mdDialog, $state, GroupService, CurrentGroup, Authentication) {
    "ngInject";
    Object.assign(this, {
      $document,
      $mdDialog,
      $state,
      GroupService,
      groups: [],
      CurrentGroup,
      Authentication
    });
  }
  $onInit() {
    this.GroupService.listMy().then((data) => {
      this.groups = data;
    });
  }

  getGroupName() {
    if (angular.isDefined(this.CurrentGroup.value.name)) {
      return this.CurrentGroup.value.name;
    }
    let candidate = this.groups.find((e) => {
      return e.id === this.Authentication.data.current_group;
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
