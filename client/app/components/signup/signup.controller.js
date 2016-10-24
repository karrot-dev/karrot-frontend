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
      passwordrepeat: "",
      error: {
        password: false,
        failed: false
      }
    });
  }

  signup() {
    if (!this.password || this.password !== this.passwordrepeat || this.password.length < 1) {
      this.error.password = true;
      return;
    }
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
      // TODO show toast
      this.password = "";
      this.passwordrepeat = "";
      this.error.failed = true;
    });
  }
}

export default SignupController;
