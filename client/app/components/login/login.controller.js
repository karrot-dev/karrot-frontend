class LoginController {
  constructor(Authentication, $state) {
    "ngInject";
    Object.assign(this, {
      Authentication,
      $state,
      email: "",
      password: ""
    });
  }

  login() {
    this.Authentication.login(this.email, this.password)
    .then(() => {
      this.$state.go("home");
    })
    .catch(() => {
      this.password = "";
      // TODO error handling
    });
  }
}

export default LoginController;
