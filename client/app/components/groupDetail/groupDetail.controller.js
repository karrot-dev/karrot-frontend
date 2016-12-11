class GroupDetailController {
  constructor(Group, CurrentGroup, $state) {
    "ngInject";
    Object.assign(this, {
      Group,
      CurrentGroup,
      $state,
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
