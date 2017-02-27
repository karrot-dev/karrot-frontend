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

    it("transforms data", () => {
      let data = [{
        typus: "GROUP_JOIN",
        date: new Date("2017-02-20T12:00:20Z")
      }];
      let $ctrl = $componentController("history", {}, { data });
      $ctrl.$onChanges({ data: "is unused" });
      expect(data[0].translate).to.be.equal("HISTORY.GROUP_JOIN");
      expect(data[0].compareDate).to.be.equal("2017-02-20");
    });
  });
});
