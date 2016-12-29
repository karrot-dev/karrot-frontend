class JoinGroupPreviewController {
  constructor($scope) {
    "ngInject";
    Object.assign(this, {
      $scope
    });
  }

  joinGroup() {
    this.onJoinGroup().catch(() => {
      this.$scope.form.password.$setValidity("check", false);
    });
  }
}

export default JoinGroupPreviewController;
