import TopbarModule from "./topbar";

const { module } = angular.mock;

describe("Topbar", () => {
  beforeEach(module(TopbarModule));
  module(($stateProvider) => {
    $stateProvider.state("home", { url: "/" });
  });

  let $log, $ctrl, $q, $rootScope;

  let userData = { id: 5, "display_name": "abc" };

  beforeEach(inject(($injector, _$componentController_) => {
    $log = $injector.get("$log");
    $log.reset();
    $q = $injector.get("$q");
    $rootScope = $injector.get("$rootScope");
    $ctrl = _$componentController_("topbar", {});
    sinon.stub($ctrl.Authentication, "update");
    $ctrl.Authentication.update.returns($q.resolve(userData));
  }));

  describe("Controller", () => {
    afterEach(() => {
      $log.assertEmpty();
    });

    it("calls $onInit", () => {
      $ctrl.$onInit();
      $rootScope.$apply();
      expect($ctrl.Authentication.update).has.been.called;
    });

    it("should redirect to login page after logout", () => {
      let $state;
      inject((_$state_) => {
        $state = _$state_;
      });
      sinon.stub($state, "go");
      sinon.stub($ctrl.Authentication, "logout");
      $ctrl.Authentication.logout.returns($q.resolve(undefined));
      $ctrl.logOut();
      $rootScope.$apply();
      expect($state.go).to.have.been.calledWith("login");
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
      $rootScope.$apply();
      expect($mdSidenav("right").isOpen()).to.be.false;
      $ctrl.toggleRight();
      expect($mdSidenav("right").isOpen()).to.be.true;
    });
  });
});
