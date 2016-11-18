import StoreMapModule from "./storeMap";

const { module } = angular.mock;

describe("StoreMap", () => {
  beforeEach(module(StoreMapModule));

  describe("Module", () => {
    it("is named storeMap", () => {
      expect(StoreMapModule).to.equal("storeMap");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("storeMap", {});
      expect($ctrl).to.exist;
    });
  });
});
