import StoreActivityModule from "./storeActivity";

const { module } = angular.mock;

describe("StoreActivity", () => {
  beforeEach(module(StoreActivityModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named storeActivity", () => {
      expect(StoreActivityModule).to.equal("storeActivity");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("storeActivity", {});
      expect($ctrl).to.exist;
    });
  });
});
