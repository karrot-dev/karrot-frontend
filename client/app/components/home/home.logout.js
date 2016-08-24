var logout = (Authentication, $state) => {
  'ngInject';
  return {
    restrict: 'A',
    link: (scope, element/*, attrs*/) => {
      element.on('click', () => {
        Authentication.logout()
        .then(() => {
          $state.go('login');
        }, () => {
          //Logout failed!
        });
      });
    }
  }
};

export default logout;
