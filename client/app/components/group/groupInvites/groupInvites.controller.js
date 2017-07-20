class GroupInvitesController {
  constructor(Invitation, $stateParams) {
    "ngInject";
    Object.assign(this, {
      Invitation,
      $stateParams,
      groupInvitations: []
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
