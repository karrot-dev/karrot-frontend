class GroupDetailController {
  constructor(Group, CurrentGroup, $state, $mdDialog, $document) {
    "ngInject";
    Object.assign(this, {
      Group,
      CurrentGroup,
      $state,
      $document,
      $mdDialog,
      error: {
        leaveGroup: false
      }
    });

    this.pickupListOptions = {
      showDetail: "store",
      showTopbar: false,
      filter: {
        showJoined: true,
        showOpen: true,
        showFull: false
      }
    };
  }

  leaveGroup($event) {
    this.$mdDialog.show({
      contentElement: "#confirmLeaveDialog",
      parent: angular.element(this.$document.body),
      targetEvent: $event
    })
    .then(() => this.Group.leave(this.groupData.id))
    .then(() => {
      if (this.CurrentGroup.value.id === this.groupData.id) {
        this.CurrentGroup.clear();
      }
      this.$state.go("home");
    })
    .catch(() => {
      this.error.leaveGroup = true;
    });
  }

  updateGroupData() {
    return this.Group.save(this.groupData);
  }
}

export default GroupDetailController;
