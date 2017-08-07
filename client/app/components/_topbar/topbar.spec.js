import TopbarModule from "./topbar";

// needed to load ngMaterial-mock, which provides the $material service
import "angular-material/angular-material-mocks";

const { module } = angular.mock;

describe("Topbar", () => {
  beforeEach(module(TopbarModule));
  beforeEach(module("ngMaterial-mock"));
  beforeEach(module(($stateProvider) => {
    $stateProvider.state("home", { url: "/" });
  }));
  beforeEach(module(($mdAriaProvider) => {
    $mdAriaProvider.disableWarnings();
  }));
  beforeEach(module({
    $translate: { use: () => {} },
    translateFilter: (a) => a
  }));

  let $log;

  let userData = { id: 5, "display_name": "abc" };

  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));

  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Component", () => {
    let el, $ctrl;

    beforeEach(inject((Authentication, $q, $rootScope, $compile) => {
      sinon.stub(Authentication, "update");
      Authentication.update.returns($q.resolve(userData));
      el = $compile("<topbar></topbar>")($rootScope);
      $ctrl = el.controller("topbar");
      $rootScope.$apply();
    }));

    it("opens Sidenav", () => {
      expect($ctrl.$mdSidenav("left").isOpen()).to.be.false;
      $ctrl.openSidenav();
      expect($ctrl.$mdSidenav("left").isOpen()).to.be.true;
    });

    it("closes sidenav on location change", inject(($location, $rootScope, $material) => {
      expect($ctrl.openSidenav()).to.eventually.be.fulfilled;
      $material.flushInterimElement();  // pretend to run the ngMaterial animations
      expect($ctrl.$mdSidenav("left").isOpen()).to.be.true;

      $location.url("new");
      $rootScope.$apply();
      expect($ctrl.$mdSidenav("left").isOpen()).to.be.false;
    }));

    it("closes sidenav on language change", inject(($rootScope, $material) => {
      expect($ctrl.openSidenav()).to.eventually.be.fulfilled;
      $material.flushInterimElement();  // pretend to run the ngMaterial animations
      expect($ctrl.$mdSidenav("left").isOpen()).to.be.true;

      $rootScope.$emit("$translateChangeSuccess");
      $rootScope.$apply();
      expect($ctrl.$mdSidenav("left").isOpen()).to.be.false;
    }));
  });
});

describe("Logout", () => {
  beforeEach(module(TopbarModule));

  it("should reload whole page", () => {
    inject(($componentController, $q, $rootScope) => {
      let $ctrl = $componentController("topbar", {});
      sinon.stub($ctrl, "reloadPage");
      sinon.stub($ctrl.Authentication, "logout");
      $ctrl.Authentication.logout.returns($q.resolve(undefined));
      $ctrl.logOut();
      $rootScope.$apply();
      expect($ctrl.reloadPage).to.have.been.called;
    });
  });
});
