import StoresModule from "./stores";

const { module } = angular.mock;

describe("Stores", () => {
  beforeEach(module(StoresModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named stores", () => {
      expect(StoresModule).to.equal("stores");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("stores", {});
      expect($ctrl).to.exist;
    });
  });
});
