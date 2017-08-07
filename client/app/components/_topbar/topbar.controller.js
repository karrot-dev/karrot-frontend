class TopbarController {
  constructor(Authentication, SessionUser, $window, $mdMedia, $scope, $rootScope, $mdSidenav) {
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
      $rootScope,
      reloadPage: () => $window.location.reload()  // makes it easier to stub
    });
  }

  openSidenav() {
    this.listeners = [];
    this.$mdSidenav("left").onClose(() => this.listeners.map((deregister) => deregister()));
    return this.$mdSidenav("left")
      .open()
      .then(() => {
        let close = () => this.$mdSidenav("left").close();
        this.listeners = [
          this.$scope.$on("$locationChangeStart", close),
          this.$rootScope.$on("$translateChangeSuccess", close)
        ];
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
