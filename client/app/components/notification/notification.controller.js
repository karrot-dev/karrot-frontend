class NotificationController {
  constructor(User, Authentication, $state, $injector, $translate) {
    "ngInject";
    Object.assign(this, {
      User,
      Authentication,
      $state,
      $injector
    });
    this.$translate = $translate;
    this.$mdToast = this.$injector.get("$mdToast");
  }

  isVerified() {
    return this.userdata.mail_verified;
  }
  sendVerification() {
    this.Authentication.resendVerificationRequest().then(() => {
      this.$translate("NOTIFICATIONS.VERIFICATION_EMAIL_SENT").then((message) => {
        this.$mdToast.showSimple(message);
      });
      return false;
    });
  }
}

export default NotificationController;
