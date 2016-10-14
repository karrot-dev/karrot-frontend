let loginForm = (Authentication, $state) => {
  "ngInject";
  return {
    restrict: "A",
    link: (scope, element/*, attrs*/) => {
      element.on("submit", () => {
        Authentication.login(scope.user, scope.password)
        .then(() => {
          scope.loginStatus = "success";
          scope.loginForm.$error.failed = false;
          $state.go("home");
        }, (/*err*/) => {
          scope.loginForm.$error.failed = true;
          scope.password = "";
          //do shake animation on submit button and show error
        });
      });
    }
  };
};

export default loginForm;
