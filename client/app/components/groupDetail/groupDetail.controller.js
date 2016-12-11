class GroupDetailController {
  constructor(Group, CurrentGroup, $state, $stateParams, marked) {
    "ngInject";
    Object.assign(this, {
      Group,
      CurrentGroup,
      $state,
      marked,
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

  $onChanges(changes) {
    if (changes.groupData && changes.groupData.currentValue) {
      this.updateDescriptionHTML(changes.groupData.currentValue.description);
    }
  }

  updateDescriptionHTML(source) {
    this.descriptionHTML = this.marked(source);
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
    return this.Group.save(this.groupData).then((data) => {
      this.updateDescriptionHTML(data.description);
      return data;
    });
  }
}

export default GroupDetailController;
