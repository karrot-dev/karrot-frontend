class GroupDetailController {
  constructor(GroupService, $state, CurrentGroup, $mdMedia) {
    "ngInject";
    Object.assign(this, {
      GroupService,
      $state,
      CurrentGroup,
      groupData: $state.groupData,
      error: {
        leaveGroup: false
      },
      $mdMedia
    });

    // set currentNavItem on redirect
    this.currentNavItem = $state.current.name.replace("group.groupDetail.", "");
  }

  leaveGroup() {
    this.GroupService.leave(this.groupData.id)
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
    return this.GroupService.save(this.groupData);
  }

}

export default GroupDetailController;
