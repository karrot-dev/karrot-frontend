import HistoryModule from "./history";

const { module } = angular.mock;

describe("history", () => {
  let $log;
  beforeEach(() => {
    module(HistoryModule);
    inject(($injector) => {
      $log = $injector.get("$log");
      $log.reset();
    });
  });
  afterEach(() => {
    $log.assertEmpty();
  });

  let $httpBackend, HistoryService;
  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    HistoryService = $injector.get("HistoryService");
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  let resultData = [{
    "id": 1452,
    "date": "2017-02-26T21:13:59.342669Z",
    "typus": "STORE_MODIFY",
    "group": 5,
    "store": 14,
    "users": [101],
    "payload": {}
  }];

  it("lists history by group", () => {
    $httpBackend.expectGET("/api/history/?group=5").respond({
      // pagination header
      "count": 1404,
      "next": "https://foodsaving.world/api/history/?limit=50&offset=50&group=5",
      "previous": null,
      "results": resultData
    });
    expect(HistoryService.list({ group: 5 })).to.be.fulfilled
      .and.to.have.property("results")
      .and.to.have.property("next");
    $httpBackend.flush();
  });

});
