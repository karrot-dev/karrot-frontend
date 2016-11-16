class CreateGroupController {
  constructor($state, Group) {
    "ngInject";
    Object.assign(this, {
      $state,
      Group
    });
  }

  createGroup() {
    this.Group.create(this.groupData).then((data) => {
      this.$state.go("groupDetail", { id: data.id });
    }).catch((error) => {
      this.error = {
        failed: true,
        msg: error.data
      };
    });
  }
}

export default CreateGroupController;
