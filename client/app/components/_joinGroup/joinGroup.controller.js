class JoinGroupController {
  constructor($mdDialog, GroupService, Authentication) {
    "ngInject";
    Object.assign(this, {
      $mdDialog,
      GroupService,
      Authentication,
      groups: [],
      active: null,
      check: false,
      password: ""
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

        if (this.selectedGroup) {
          let group = this.groups.find((e) => e.id === this.selectedGroup);
          this.toggle(group);
          this.toggleCheck();
        }
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
    return this.GroupService.join(this.active.id, { password: this.password })
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
