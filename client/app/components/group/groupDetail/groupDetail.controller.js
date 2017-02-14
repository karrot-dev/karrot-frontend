class GroupDetailController {
  constructor(GroupService, $state, CurrentGroup, $mdMedia) {
    "ngInject";
    Object.assign(this, {
      GroupService,
      $state,
      CurrentGroup,
      groupData: $state.groupData,
      $mdMedia,
      editEnabled: false
    });

    // set currentNavItem on redirect
    this.currentNavItem = $state.current.name.replace("group.groupDetail.", "");
  }

  editEnable() {
    this.editData = angular.copy(this.groupData);
    this.editEnabled = true;
    this.saving = false;
  }

  submitEdit() {
    this.saving = true;
    this.GroupService.save(this.editData).then((data) => {
      this.groupData = data;
      this.stopEdit();
    }).catch((err) => {
      this.error = err.data;
    });
  }

  stopEdit() {
    this.editEnabled = false;
    this.saving = false;
  }

  leaveGroup() {
    this.GroupService.leave(this.groupData.id)
      .then(() => {
        if (this.CurrentGroup.value.id === this.groupData.id) {
          this.CurrentGroup.clear();
        }
        this.$state.go("home");
      })
      .catch(() => {});
  }
}

export default GroupDetailController;
