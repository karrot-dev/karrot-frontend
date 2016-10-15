class LoginController {
  constructor(Authentication, $state) {
    "ngInject";
    this.name = "login";
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
      this.loginStatus = "success";
      this.$state.go("home");
    })
    .catch(() => {
      this.password = "";
      // TODO error handling
    });
  }
}

export default LoginController;
