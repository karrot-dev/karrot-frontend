class PasswordresetController {
  constructor(User) {
    "ngInject";
    Object.assign(this, {
      User,
      successful: false
    });
  }

  doReset() {
    return this.User.resetPassword(this.email).then(() => {
      this.successful = true;
    }).catch((err) => {
      this.successful = false;
      this.error = err.data;
    });
  }
}

export default PasswordresetController;
