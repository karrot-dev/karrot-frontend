import HistoryDetailModule from "./historyDetail";

const { module } = angular.mock;

describe("HistoryDetail", () => {
  beforeEach(module(HistoryDetailModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named historyDetail", () => {
      expect(HistoryDetailModule).to.equal("historyDetail");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("historyDetail", {});
      expect($ctrl).to.exist;
    });
  });
});
