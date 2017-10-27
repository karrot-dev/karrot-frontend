class TopbarController {
  constructor(Authentication, SessionUser, $window, ScreenSize, $scope, $rootScope, $mdSidenav, $timeout) {
    "ngInject";

    Object.assign(this, {
      Authentication,
      SessionUser,
      ScreenSize,
      $mdSidenav,
      $scope,
      $rootScope,
      $timeout,
      reloadPage: () => $window.location.reload()  // makes it easier to stub
    });
  }

  $onInit() {
    this.Authentication.update();
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

  showPreviewHint() {
    return this.SessionUser.isLoggedIn() && !window.localStorage.getItem("hidePreviewHint");
  }
  hidePreviewHint() {

    console.log(window.localStorage.getItem("hidePreviewHint"));
    this.$timeout(() => {
      window.localStorage.setItem("hidePreviewHint", true);
      console.log(window.localStorage.getItem("hidePreviewHint"));
    })
  }
}

export default TopbarController;
