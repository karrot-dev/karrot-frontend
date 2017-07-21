class SignupController {
  constructor(User, Authentication, $state, $stateParams, Invitation) {
    "ngInject";
    Object.assign(this, {
      User,
      Authentication,
      $state,
      $stateParams,
      Invitation,
      username: "",
      email: $stateParams.email ? $stateParams.email : "",
      password: "",
      error: {
        failed: false,
        msg: ""
      }
    });
  }

  signup() {
    let user = {
      "display_name": this.username,
      email: this.email,
      password: this.password
    };
    return this.User.create(user).then(() => {
      this.Authentication.login(this.email, this.password)
      .then((user) => {
        if (this.$stateParams.invite) {
          return this.Invitation.accept(this.$stateParams.invite).then(() => user);
        }
        return user;
      })
      .then(() => {
        this.$state.go("home");
      });
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
