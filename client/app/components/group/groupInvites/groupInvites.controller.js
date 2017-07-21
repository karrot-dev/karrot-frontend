class GroupInvitesController {
  constructor(Invitation, $stateParams, $scope) {
    "ngInject";
    Object.assign(this, {
      Invitation,
      $stateParams,
      $scope,
      groupInvitations: []
    });
  }

  $onInit() {
    // I decided against using a directive to add this validator 
    // because our code is barely using any custom directives so far
    this.$scope.$watch("inviteForm.email", (form) => {
      form.$validators.unique = (modelValue, viewValue) => {
        let value = modelValue || viewValue;
        return this.groupInvitations.findIndex((e) => value === e.email) < 0;
      };
    });
  }

  sendInvite() {
    return this.Invitation.create({
      email: this.email,
      group: this.$stateParams.groupId
    })
    .then((invite) => {
      this.groupInvitations.unshift(invite);
    });
  }
}

export default GroupInvitesController;
