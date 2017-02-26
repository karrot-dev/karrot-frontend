class GroupDetailController {
  constructor(GroupService, $state, CurrentGroup, $mdMedia, $document, $mdDialog) {
    "ngInject";
    Object.assign(this, {
      GroupService,
      $state,
      $document,
      $mdDialog,
      CurrentGroup,
      groupData: CurrentGroup.value,
      $mdMedia
    });

    // set currentNavItem on redirect
    this.currentNavItem = $state.current.name.replace("group.groupDetail.", "");
  }

  leaveGroup($event) {
    this.$mdDialog.show({
      contentElement: "#confirmLeaveDialog",
      parent: angular.element(this.$document.body),
      targetEvent: $event
    })
    .then(() => this.GroupService.leave(this.groupData.id))
    .then(() => {
      if (this.CurrentGroup.value.id === this.groupData.id) {
        this.CurrentGroup.clear();
      }
      this.$state.go("home");
    })
    .catch(() => {
      // click on cancel or server request failed
    });
  }
}

export default GroupDetailController;
