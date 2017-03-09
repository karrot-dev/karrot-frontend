class NotificationController {
  constructor(User, Authentication, $state) {
    "ngInject";
    Object.assign(this, {
      User,
      Authentication,
      $state
    });
  }

  isVerified() {
    return this.userdata.mail_verified;
  }
  sendVerification(email) {
    this.Authentication.update().then((data) => {
      if (data.mail_verified === false) {
        this.Authentication.verify(email).then(() => {
          return false;
        });
      } else {
        return true;
      }
    });
  }
}

export default NotificationController;
