import CreateStoreMapModule from "./createStoreMap";

const { module } = angular.mock;

describe("CreateStoreMap", () => {
  beforeEach(module(CreateStoreMapModule));

  describe("Module", () => {
    it("is named createStoreMap", () => {
      expect(CreateStoreMapModule).to.equal("createStoreMap");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("createStoreMap", {});
      expect($ctrl).to.exist;
    });
  });
});
