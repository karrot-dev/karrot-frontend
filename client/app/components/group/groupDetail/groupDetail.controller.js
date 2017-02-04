class GroupDetailController {
  constructor(Group, $state, CurrentGroup, $mdMedia) {
    "ngInject";
    Object.assign(this, {
      Group,
      $state,
      CurrentGroup,
      groupData: $state.groupData,
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
