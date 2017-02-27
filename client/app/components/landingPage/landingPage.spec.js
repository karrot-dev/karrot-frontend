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
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("landingPage", {});
      expect($ctrl).to.exist;
    });
  });
});
