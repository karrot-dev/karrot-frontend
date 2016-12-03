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

  updateGroupData() {
    return this.Group.save(this.groupData);
  }
}

export default GroupDetailController;
