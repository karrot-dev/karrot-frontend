class TopbarController {
  constructor(Authentication, $mdMedia, $scope, $mdSidenav) {
    "ngInject";
    $scope.screenIsSmall = !$mdMedia("gt-sm");
    $scope.$watch(() => {
      return $mdMedia("gt-sm");
    }, (big) => {
      $scope.screenIsSmall = !big;
    });

    Object.assign(this, {
      Authentication,
      $mdSidenav
    });
  }

  $onInit() {
    this.Authentication.update().then((data) => {
      this.loggedInUser = data;
    });
  }

  toggleRight() {
    this.$mdSidenav("right").toggle();
  }

  isLoggedIn() {
    return angular.isDefined(this.Authentication.data);
  }
}

export default TopbarController;
