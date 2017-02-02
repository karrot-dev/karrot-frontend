class GroupDetailController {
  constructor(Group, $state, CurrentGroup, $mdMedia) {
    "ngInject";
    this.groupData = $state.groupData;

    Object.assign(this, {
      Group,
      $state,
      CurrentGroup,
      error: {
        leaveGroup: false
      },
      $mdMedia
    });

    let currentState = $state.current.name;
    this.currentNavItem = currentState.replace("group.groupDetail.", "");

    if (this.currentNavItem === "" ||
        $mdMedia("gt-sm") && (this.currentNavItem === "stores" || this.currentNavItem === "description" )){
      this.currentNavItem = "pickups";
      $state.go("group.groupDetail.pickups");
    }
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
