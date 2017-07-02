import LandingPageModule from "./landingPage";

const { module } = angular.mock;

describe("LandingPage", () => {
  beforeEach(module(LandingPageModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named landingPage", () => {
      expect(LandingPageModule).to.equal("landingPage");
    });
  });

  describe("Controller", () => {
    let $componentController, $location;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      $location = $injector.get("$location");
    }));

    it("goes to map", () => {
      let $ctrl = $componentController("landingPage", {});
      $ctrl.goToMap();
      expect($location.hash()).to.equal("map");
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $compile("<landing-page></landing-page>")(scope);
    });
  });
});
