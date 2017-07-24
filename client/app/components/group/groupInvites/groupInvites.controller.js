class GroupInvitesController {
  constructor(Invitation, $stateParams, $scope, $q) {
    "ngInject";
    Object.assign(this, {
      Invitation,
      $stateParams,
      $scope,
      $q,
      groupInvitations: []
    });
  }

  $onInit() {
    // I decided against using a directive to add this validator 
    // because our code is barely using any custom directives so far
    this.$scope.$watch("inviteForm.email", (form) => {
      form.$validators.unique = this.isEMailNotInvitedYet.bind(this);
    });
  }

  isEMailNotInvitedYet(modelValue, viewValue) {
    let value = modelValue || viewValue;
    return this.groupInvitations.findIndex((e) => value === e.email) < 0;
  }

  sendInvite() {
    return this.Invitation.create({
      email: this.email,
      group: this.$stateParams.groupId
    })
    .then((invite) => {
      this.groupInvitations.unshift(invite);
    })
    .catch((error) => {
      this.error = error;
      return this.$q.reject(error);
    });
  }
}

export default GroupInvitesController;
