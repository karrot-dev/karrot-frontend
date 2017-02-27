import LandingPageMapModule from "./landingPageMap";

const { module } = angular.mock;

describe("LandingPageMap", () => {
  beforeEach(module(LandingPageMapModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named landingPageMap", () => {
      expect(LandingPageMapModule).to.equal("landingPageMap");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("landingPageMap", {});
      expect($ctrl).to.exist;
    });
  });
});
