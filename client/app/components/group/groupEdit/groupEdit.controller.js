class GroupEditController {
  constructor($state, GroupService) {
    "ngInject";
    Object.assign(this, {
      $state,
      GroupService,
      editData: angular.copy($state.groupData)
    });
  }

  submit() {
    this.saving = true;
    this.GroupService.save(this.editData).then((data) => {
      this.$state.groupData = data;
      this.$state.go("^");
    }).catch((err) => {
      this.error = err.data;
    });
  }
}

export default GroupEditController;
