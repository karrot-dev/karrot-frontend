class PasswordresetController {
  constructor(User) {
    "ngInject";
    Object.assign(this, {
      User,
      successful: false,
      ongoing: false
    });
  }

  doReset() {
    this.ongoing = true;
    this.User.resetPassword(this.email).then(() => {
      this.ongoing = false;
      this.successful = true;
    }).catch((err) => {
      this.ongoing = false;
      this.successful = false;
      this.error = err.data;
    });
  }
}

export default PasswordresetController;
