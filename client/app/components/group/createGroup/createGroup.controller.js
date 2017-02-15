class CreateGroupController {
  constructor($state, GroupService) {
    "ngInject";
    Object.assign(this, {
      $state,
      GroupService,
      groupData: {}
    });
  }
  createGroup() {
    this.GroupService.create(this.groupData).then((data) => {
      this.$state.go("group", { groupId: data.id });
    }).catch((error) => {
      this.error = error.data;
    });
  }
}

export default CreateGroupController;
