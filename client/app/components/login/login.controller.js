class LoginController {
  constructor($scope) {
    'ngInject';
    this.name = 'login';
    $scope.user='';
    $scope.password=''
    $scope.remember=false;
  }
}

export default LoginController;
