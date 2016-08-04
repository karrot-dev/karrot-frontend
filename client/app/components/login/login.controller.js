class LoginController {
  constructor($scope) {
    'ngInject';
    this.name = 'login';
    $scope.user='';
    $scope.password=''
    $scope.remember=false;
    $scope.loginStatus='';
  }
}

export default LoginController;
