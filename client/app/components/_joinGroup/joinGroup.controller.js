class JoinGroupController {
  constructor($mdDialog, Group, Authentication, $scope) {
    "ngInject";
    Object.assign(this, {
      $mdDialog,
      Group,
      Authentication,
      $scope,
      groups: [],
      active: null,
      check: false,
      password: ""
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
  toggle(group) {
    if (this.active && this.active.id === group.id) this.active = null;
    else this.active = group;
  }
  toggleCheck() {
    if (this.active.protected) {
      this.check = true;
    } else {
      this.joinGroup();
    }
  }

  joinGroup(scope) {
    return this.Group.join(this.active.id, { password: this.password })
    .then(() => {
      this.$mdDialog.hide(this.active.id);
    })
    .catch(() => {
      if (scope && scope.form) {
        scope.form.password.$setValidity("check", false);
      }
    });
  }
}

export default JoinGroupController;
