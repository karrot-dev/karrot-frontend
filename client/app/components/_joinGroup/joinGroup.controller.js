class JoinGroupController {
  constructor($mdDialog, Group, Authentication) {
    "ngInject";
    Object.assign(this, {
      $mdDialog,
      Group,
      Authentication
    });

    this.groups = [];

    this.Group.list().then((data) => {
      this.allGroups = data.sort((a,b) => b.members.length - a.members.length);
      this.Authentication.update().then((data) => {
        angular.forEach(this.allGroups, (curGroup) => {
          if (curGroup.members.indexOf(data.id) === -1){
            this.groups.push(curGroup);
          }
        });
      });
    });
  }

  joinGroup (groupId) {
    this.Group.join(groupId).then(() => {
      this.$mdDialog.hide(groupId);
    });
  }
}

export default JoinGroupController;
