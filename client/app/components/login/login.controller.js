class LoginController {
  constructor(Authentication, $state, $scope) {
    "ngInject";
    Object.assign(this, {
      Authentication,
      $state,
      $scope,
      email: "",
      password: "",
      error: { wrong: false }
    });
  }

  login() {
    this.error.wrong = false;
    this.Authentication.login(this.email, this.password)
    .then(() => {
      this.$state.go("home");
    })
    .catch(() => {
      this.password = "";
      this.error.wrong = true;
    });
  }
}

export default LoginController;
