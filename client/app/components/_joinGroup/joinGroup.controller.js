class JoinGroupController {
  constructor($mdDialog, GroupService) {
    "ngInject";
    Object.assign(this, {
      $mdDialog,
      GroupService,
      password: ""
    });
  }

  $onInit() {
    if (!this.group.protected) {
      this.joinGroup();
    }
  }

  joinGroup(scope) {
    return this.GroupService.join(this.group.id, { password: this.password })
    .then(() => {
      this.$mdDialog.hide(this.group.id);
    })
    .catch(() => {
      scope.form.password.$setValidity("check", false);
    });
  }
}

export default JoinGroupController;
