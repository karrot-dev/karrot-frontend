import logo from "./carrot-logo.svgimage";

class TopbarController {
  constructor(Authentication, $mdMedia, $scope, $mdSidenav) {
    "ngInject";
    $scope.screenIsSmall = !$mdMedia("gt-sm");
    $scope.$watch(() => {
      return $mdMedia("gt-sm");
    }, (big) => {
      $scope.screenIsSmall = !big;
    });

    $scope.toggleRight = () => {
      $mdSidenav("right")
        .toggle();
    };

    Object.assign(this, {
      logo,
      Authentication
    });
  }

  $onInit() {
    this.Authentication.update().then((data) => {
      this.loggedInUser = data;
    });
  }
}

export default TopbarController;
