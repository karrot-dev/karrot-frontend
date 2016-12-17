class GroupDetailController {
  constructor(Group, CurrentGroup, $state, $mdMedia) {
    "ngInject";
    let currentState = $state.current.name;
    this.currentNavItem = currentState.replace("groupDetail.", "");

    Object.assign(this, {
      Group,
      CurrentGroup,
      $state,
      error: {
        leaveGroup: false
      },
      $mdMedia
    });
  }

  leaveGroup() {
    this.Group.leave(this.groupData.id)
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
