class GroupDetailController {
  constructor(Group, CurrentGroup, $mdMedia, $state, $stateParams) {
    "ngInject";
    this.screenIsSmall = !$mdMedia("gt-sm");
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
      showTopbar: true,
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
}

export default GroupDetailController;
