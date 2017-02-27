import HistoryModule from "./history";

const { module } = angular.mock;

describe("History", () => {
  beforeEach(module(HistoryModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named history", () => {
      expect(HistoryModule).to.equal("history");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("history", {});
      expect($ctrl).to.exist;
    });
  });
});
