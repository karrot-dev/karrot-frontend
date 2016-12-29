class JoinGroupController {
  constructor($mdDialog, Group, Authentication) {
    "ngInject";
    Object.assign(this, {
      $mdDialog,
      Group,
      Authentication,
      groups: []
    });
  }

  $onInit() {
    this.Group.list().then((allGroups) => {
      let sortedGroups = allGroups.sort((a,b) => b.members.length - a.members.length);
      this.Authentication.update().then((data) => {
        angular.forEach(sortedGroups, (curGroup) => {
          if (curGroup.members.indexOf(data.id) === -1){
            this.groups.push(curGroup);
          }
        });
      });
    });
  }

  joinGroup (group) {
    return this.Group.join(group.id, { password: group.password })
    .then(() => {
      this.$mdDialog.hide(group.id);
    });
  }
}

export default JoinGroupController;
