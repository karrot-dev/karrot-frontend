var signupForm = (User, $state) => {
  'ngInject';
  return {
    restrict: 'A',
    link: (scope, element, attrs) => {
      element.on('submit', () => {
        if(!scope.password || scope.password!==scope.passwordrepeat || scope.password.length < 1) {
          alert("Set a good password!");
          return;
        }
        var user = {
          display_name: scope.username,
          first_name: scope.firstName,
          last_name: scope.lastName,
          email: scope.email,
          password: scope.password
        };
        User.create(user)
        .then(() => {
          $state.go('login');
        }, (err) => {
          alert('Signup failed');
          //do shake animation on submit button and show error
        });
      });
    }
  }
};

export default signupForm;
