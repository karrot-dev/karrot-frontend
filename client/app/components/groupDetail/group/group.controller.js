class GroupController {
  constructor(Group, $state, CurrentGroup, $mdMedia) {
    "ngInject";
    this.groupData = $state.groupData;

    let currentState = $state.current.name;
    this.currentNavItem = currentState.replace("groupDetail.group.", "");

    if (this.currentNavItem === "groupDetail.group"){
      this.currentNavItem = "pickups";
      $state.go("groupDetail.group.pickups");
    }

    Object.assign(this, {
      Group,
      $state,
      CurrentGroup,
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

export default GroupController;
