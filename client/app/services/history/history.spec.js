import HistoryModule from "./history";

const { module } = angular.mock;

describe("history", () => {
  let $log, History;
  beforeEach(() => {
    module(HistoryModule);
    inject(($injector) => {
      $log = $injector.get("$log");
      $log.reset();
      History = $injector.get("History");
    });
  });
  afterEach(() => {
    $log.assertEmpty();
  });

  it("exists", () => {
    expect(History).to.exist;
  });

});
