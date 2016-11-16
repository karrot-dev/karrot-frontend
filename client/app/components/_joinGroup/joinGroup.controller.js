class JoinGroupController {
  constructor($mdDialog, Group) {
    "ngInject";
    Object.assign(this, {
      $mdDialog,
      Group
    });
    this.Group.list().then((data) => {
      this.groups = data.sort((a,b) => b.members.length - a.members.length);
    });
  }

  joinGroup (groupId) {
    this.Group.join(groupId).then(() => {
      this.$mdDialog.hide(groupId);
    });
  }
}

export default JoinGroupController;
