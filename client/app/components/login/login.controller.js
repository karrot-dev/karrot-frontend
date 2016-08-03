import angular from 'angular';

class LoginController {
  constructor($scope, Authentication) {
    'ngInject';
    this.name = 'login';
    $scope.user='';
    $scope.password=''
    $scope.remember=false;
  }
}

export default LoginController;
