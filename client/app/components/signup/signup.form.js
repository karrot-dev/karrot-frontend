let signupForm = (User, $state) => {
  "ngInject";
  return {
    restrict: "A",
    link: (scope, element/*, attrs*/) => {
      element.on("submit", () => {
        if (!scope.password || scope.password !== scope.passwordrepeat || scope.password.length < 1) {
          scope.signupForm.$error.password = true;
          return;
        }
        let user = {
          display_name: scope.username,
          first_name: scope.firstName,
          last_name: scope.lastName,
          email: scope.email,
          password: scope.password
        };
        User.create(user)
        .then(() => {
          $state.go("login");
        }, (/*err*/) => {
          scope.signupForm.$error.failed = true;
          scope.password = "";
          scope.passwordrepeat = "";
          //do shake animation on submit button and show error
        });
      });
    }
  };
};

export default signupForm;
