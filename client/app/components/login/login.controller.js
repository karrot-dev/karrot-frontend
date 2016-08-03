import angular from 'angular';

class LoginController {
  constructor($scope, Authentication) {
    'ngInject';
    this.name = 'login';
    $scope.credentials={user:'',password:'',remember:''};
  }
}

export default LoginController;
