class NotificationsController {
  constructor(User, $state, $translate, $mdToast) {
    "ngInject";
    Object.assign(this, {
      User,
      $state,
      $translate,
      $mdToast
    });
  }

  isVerified() {
    return this.userdata.mail_verified;
  }
  sendVerification() {
    return this.$translate("NOTIFICATIONS.VERIFICATION_EMAIL_SENT").then((message) => {
      return this.User.resendVerificationRequest().then(() => {
        this.$mdToast.showSimple(message);
      });
    });
  }
}

export default NotificationsController;
