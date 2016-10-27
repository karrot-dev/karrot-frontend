class GroupDetailController {
  constructor(Group, $state, $stateParams) {
    "ngInject";
    Object.assign(this, {
      Group,
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
        this.$state.go("home");
      })
      .catch(() => {
        this.error.leaveGroup = true;
      });
  }
}

export default GroupDetailController;
