class SignupController {
  constructor($scope) {
    'ngInject';
    this.name = 'signup';
    $scope.firstName='';
    $scope.lastName='';
    $scope.username='';
    $scope.email='';
    $scope.password='';
    $scope.passwordrepeat='';
  }
}

export default SignupController;
