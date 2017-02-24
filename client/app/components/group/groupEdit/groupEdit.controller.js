class GroupEditController {
  constructor($state, GroupService) {
    "ngInject";
    Object.assign(this, {
      $state,
      GroupService
    });
  }

  submit(data) {
    return this.GroupService.save(data).then((data) => {
      this.$state.groupData = data;
      this.$state.go("^");
    });
  }
}

export default GroupEditController;
