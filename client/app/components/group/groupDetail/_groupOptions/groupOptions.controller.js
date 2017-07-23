class GroupOptionsController {
  constructor(GroupService, CurrentGroup, $state, $document, $mdDialog, $mdMedia, $mdMenu) {
    "ngInject";
    Object.assign(this, {
      GroupService,
      CurrentGroup,
      $state,
      $document,
      $mdDialog,
      $mdMedia,
      $mdMenu
    });
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

export default GroupOptionsController;
