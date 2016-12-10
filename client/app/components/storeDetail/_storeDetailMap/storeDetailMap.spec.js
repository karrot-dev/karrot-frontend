import StoreDetailMapModule from "./storeDetailMap";

const { module } = angular.mock;

describe("StoreDetailMap", () => {
  beforeEach(module(StoreDetailMapModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named storeDetailMap", () => {
      expect(StoreDetailMapModule).to.equal("storeDetailMap");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("storeDetailMap", {});
      expect($ctrl).to.exist;
    });
  });
});
