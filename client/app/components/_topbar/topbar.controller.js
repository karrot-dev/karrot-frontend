class TopbarController {
  constructor(Authentication, $state, $mdMedia, $scope, $mdSidenav) {
    "ngInject";
    $scope.screenIsSmall = !$mdMedia("gt-sm");
    $scope.$watch(() => {
      return $mdMedia("gt-sm");
    }, (big) => {
      $scope.screenIsSmall = !big;
    });

    Object.assign(this, {
      Authentication,
      $state,
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

  logOut(){
    this.Authentication.logout()
      .then(() => {
        this.$state.go("login");
      }, () => {
        //Logout failed!
      });
  }

  isLoggedIn() {
    return angular.isDefined(this.Authentication.data);
  }
}

export default TopbarController;
