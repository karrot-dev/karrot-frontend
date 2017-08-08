class VerifyMailController {
  constructor(User, Authentication, $stateParams) {
    "ngInject";
    Object.assign(this, {
      User,
      Authentication,
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
    this.Authentication.update().then((user) => this.user = user);
  }
}

export default VerifyMailController;
