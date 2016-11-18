class SignupController {
  constructor(User, $state) {
    "ngInject";
    Object.assign(this, {
      name: "signup",
      User,
      $state,
      username: "",
      email: "",
      password: "",
      error: {
        failed: false,
        msg: ""
      }
    });
  }

  signup() {
    // TODO: handle camelcase <-> snakecase conversion elsewhere
    /* eslint-disable camelcase */
    let user = {
      display_name: this.username,
      email: this.email,
      password: this.password
    };
    /* eslint-enable camelcase */
    this.User.create(user)
    .then(() => {
      this.$state.go("login");
    }, (data) => {
      if (data.email) {
        this.email = "";
        this.error.msg = data.email[0];
      } else {
        this.password = "";
      }

      // TODO do better/complete error handling, e.g. when username exists
      this.error.failed = true;
    });
  }
}

export default SignupController;
