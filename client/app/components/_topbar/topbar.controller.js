class TopbarController {
  constructor(Authentication, SessionUser, $window, $mdMedia, $scope, $mdSidenav) {
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
      $mdSidenav,
      $scope,
      reloadPage: () => $window.location.reload()  // makes it easier to stub
    });
  }

  $onInit() {
    this.Authentication.update();
  }

  openSidenav() {
    this.$mdSidenav("left").open();
    this.destorySidenavListener = this.$scope.$on("$locationChangeStart", () => {
      this.$mdSidenav("left").close();
      this.destorySidenavListener();
    });
  }

  logOut(){
    this.Authentication.logout()
      .then(() => {
        this.reloadPage();
      }, () => {
        //Logout failed!
      });
  }
}

export default TopbarController;
