var loginForm = (Authentication, $state) => {
  'ngInject';
  return {
    restrict: 'A',
    link: (scope, element, attrs) => {
      element.on('submit', () => {
        Authentication.login(scope.user, scope.password)
        .then(() => {
          $state.go('home');
        }, (err) => {
          alert('Login failed');
          //do shake animation on submit button and show error
        });
      });
    }
  }
};

export default loginForm;
