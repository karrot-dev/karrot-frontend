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

  joinGroup (groupId) {
    this.Group.join(groupId).then(() => {
      this.$mdDialog.hide(groupId);
    });
  }
}

export default JoinGroupController;
