class GroupEditController {
  constructor($state, GroupService, CurrentGroup) {
    "ngInject";
    Object.assign(this, {
      $state,
      GroupService,
      data: angular.copy(CurrentGroup.value)
    });
  }

  submit(data) {
    return this.GroupService.save(data).then((data) => {
      this.$state.go("^");
      return data;
    });
  }
}

export default GroupEditController;
