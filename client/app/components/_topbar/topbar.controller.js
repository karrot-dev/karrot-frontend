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
      $mdSidenav('right')
          .toggle()
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
  
  buildToggler(navID) {
      return function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }
    }
}

export default TopbarController;
