import TopbarModule from "./topbar";

const { module } = angular.mock;

describe("Topbar", () => {
  beforeEach(module(TopbarModule));

  let $log, $ctrl, Authentication, $q, $rootScope;

  let userData = { id: 5, "display_name": "abc" };

  beforeEach(inject(($injector, _$componentController_) => {
    $log = $injector.get("$log");
    $log.reset();
    Authentication = $injector.get("Authentication");
    sinon.stub(Authentication, "update");
    $q = $injector.get("$q");
    $rootScope = $injector.get("$rootScope");
    $ctrl = _$componentController_("topbar", {});
    Authentication.update.returns($q((resolve) => {
      resolve(userData);
    }));
  }));

  describe("Controller", () => {
    afterEach(() => {
      $log.assertEmpty();
    });

    it("calls $onInit", () => {
      $ctrl.$onInit();
      $rootScope.$apply();
      expect(Authentication.update).has.been.called;
      expect($ctrl.loggedInUser).to.deep.equal(userData);
    });
  });

  describe("View", () => {
    let $mdSidenav, $compile, scope;

    beforeEach(inject(($injector) => {
      $mdSidenav = $injector.get("$mdSidenav");
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
      $compile("<topbar></topbar>")(scope);
      scope.$apply();
      $rootScope.$apply();
    }));

    it("toggles Right Sidenav", () => {
      $ctrl.$onInit();
      expect($mdSidenav("right").isOpen()).to.eq(false);
      $ctrl.toggleRight();
      expect($mdSidenav("right").isOpen()).to.eq(true);
    });
  });
});
