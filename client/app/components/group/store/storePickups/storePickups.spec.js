import StorePickupsModule from "./storePickups";

const { module } = angular.mock;

describe("StorePickups", () => {
  beforeEach(module(StorePickupsModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named storePickups", () => {
      expect(StorePickupsModule).to.equal("storePickups");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("storePickups", {});
      expect($ctrl).to.exist;
    });
  });
});
