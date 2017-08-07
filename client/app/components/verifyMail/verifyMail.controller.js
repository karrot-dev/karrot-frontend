class VerifyMailController {
  constructor(User, SessionUser, $stateParams) {
    "ngInject";
    Object.assign(this, {
      User,
      SessionUser,
      $stateParams
    });
  }

  $onInit() {
    this.User.verifyMail(this.$stateParams.key)
      .then(() => {
        this.error = false;
        this.loadUser(); // don't return as Promise
      })
      .catch((err) => {
        this.error = err;
        this.loadUser();
      });
  }

  loadUser() {
    this.SessionUser.loaded.then((user) => this.user = user);
  }
}

export default VerifyMailController;
