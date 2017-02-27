class CreateGroupController {
  constructor($state, GroupService) {
    "ngInject";
    Object.assign(this, {
      $state,
      GroupService
    });
  }

  createGroup(data) {
    return this.GroupService.create(data).then((data) => {
      this.$state.go("group", { groupId: data.id });
      return data;
    });
  }
}

export default CreateGroupController;
