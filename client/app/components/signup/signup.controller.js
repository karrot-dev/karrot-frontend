class SignupController {
  constructor(User, $state) {
    "ngInject";
    Object.assign(this, {
      name: "signup",
      User,
      $state,
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      error: {
        failed: false
      }
    });
  }

  signup() {
    // TODO: handle camelcase <-> snakecase conversion elsewhere
    /* eslint-disable camelcase */
    let user = {
      display_name: this.username,
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      password: this.password
    };
    /* eslint-enable camelcase */
    this.User.create(user)
    .then(() => {
      this.$state.go("login");
    }, () => {
      // TODO do better error handling, e.g. when username exists
      this.password = "";
      this.error.failed = true;
    });
  }
}

export default SignupController;
