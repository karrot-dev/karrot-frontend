class TopbarController {
  constructor(Authentication, SessionUser, $state, $mdMedia, $scope, $mdSidenav) {
    "ngInject";
    $scope.screenIsSmall = !$mdMedia("gt-sm");
    $scope.$watch(() => {
      return $mdMedia("gt-sm");
    }, (big) => {
      $scope.screenIsSmall = !big;
    });

    Object.assign(this, {
      Authentication,
      SessionUser,
      $state,
      $mdSidenav
    });
  }

  $onInit() {
    this.Authentication.update();
  }

  toggleRight() {
    this.$mdSidenav("right").toggle();
  }

  logOut(){
    this.Authentication.logout()
      .then(() => {
        this.$state.go("login");
      }, () => {
        //Logout failed!
      });
  }
}

export default TopbarController;
