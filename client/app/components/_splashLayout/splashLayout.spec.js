import SplashLayoutModule from "./splashLayout";

const { module } = angular.mock;

describe("SplashLayout", () => {
  beforeEach(module(SplashLayoutModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named splashLayout", () => {
      expect(SplashLayoutModule).to.equal("splashLayout");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("splashLayout", {});
      expect($ctrl).to.exist;
    });
  });
});
