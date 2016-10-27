class GroupDetailController {
  constructor(Group, CurrentGroup, $state, $stateParams) {
    "ngInject";
    Object.assign(this, {
      Group,
      CurrentGroup,
      $state,
      groupId: $stateParams.id,
      error: {
        leaveGroup: false
      }
    });
  }

  leaveGroup() {
    this.Group.leave(this.groupId)
      .then(() => {
        if (this.CurrentGroup.value.id === this.groupId) {
          this.CurrentGroup.clear();
        }
        this.$state.go("home");
      })
      .catch(() => {
        this.error.leaveGroup = true;
      });
  }
}

export default GroupDetailController;
