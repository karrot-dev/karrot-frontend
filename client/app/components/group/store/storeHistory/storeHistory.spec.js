import StoreHistoryModule from "./storeHistory";

const { module } = angular.mock;

describe("StoreHistory", () => {
  beforeEach(module(StoreHistoryModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named storeHistory", () => {
      expect(StoreHistoryModule).to.equal("storeHistory");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("storeHistory", {});
      expect($ctrl).to.exist;
    });
  });
});
