class NotificationController {
  constructor(User, Authentication, $state, $injector) {
    "ngInject";
    Object.assign(this, {
      User,
      Authentication,
      $state,
      $injector
    });
  }

  isVerified() {
    return this.userdata.mail_verified;
  }
  sendVerification(email) {
    const $mdToast = this.$injector.get("$mdToast");
    this.Authentication.update().then((data) => {
      if (data.mail_verified === false) {
        this.Authentication.verify(email).then(() => {
          $mdToast.show($mdToast.simple()
            .textContent("Verification Email Sent")
            .highlightAction(false));
          return false;
        });
      } else {
        return true;
      }
    });
  }
}

export default NotificationController;
