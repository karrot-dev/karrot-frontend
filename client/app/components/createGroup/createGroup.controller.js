import jstz from "jstimezonedetect";

class CreateGroupController {
  constructor($state, Group) {
    "ngInject";
    Object.assign(this, {
      $state,
      Group,
      groupData: {
        timezone: jstz.determine().name()
      }
    });
  }

  createGroup() {
    this.Group.create(this.groupData).then((data) => {
      this.$state.go("groupDetail", { groupId: data.id });
    }).catch((error) => {
      this.error = error.data;
    });
  }
}

export default CreateGroupController;
