class JoinGroupController {
  constructor($mdDialog, GroupService, Authentication) {
    "ngInject";
    Object.assign(this, {
      $mdDialog,
      GroupService,
      Authentication,
      groups: []
    });
  }

  $onInit() {
    this.GroupService.list().then((allGroups) => {
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
    return this.GroupService.join(group.id, { password: group.password })
    .then(() => {
      this.$mdDialog.hide(group.id);
    });
  }
}

export default JoinGroupController;
