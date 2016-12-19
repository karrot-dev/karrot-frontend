class GroupDetailController {
  constructor(Group, $state, CurrentGroup, $mdMedia) {
    "ngInject";
    this.groupData = $state.groupData;

    let currentState = $state.current.name;
    this.currentNavItem = currentState.replace("group.groupDetail.", "");

    if (this.currentNavItem === "group.groupDetail"){
      this.currentNavItem = "pickups";
      $state.go("group.groupDetail.pickups");
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

export default GroupDetailController;
