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

  let processedResult = resultData.map((e) => {
    e.date = new Date(e.date);
    return e;
  });

  it("lists history by group and gets another page", () => {
    $httpBackend.expectGET("/api/history/?group=5").respond({
      "next": "https://foodsaving.world/api/history/?limit=50&offset=50&group=5",
      "results": resultData
    });
    $httpBackend.expectGET("/api/history/?limit=50&offset=50&group=5").respond({
      "next": "https://foodsaving.world/api/history/?limit=50&offset=100&group=5",
      "results": resultData
    });
    HistoryService.list({ group: 5 }).then((data) => {
      expect(data.results).to.deep.equal(processedResult);
      data.next().then((data) => {
        expect(data.results).to.deep.equal(processedResult);
      });
    });
    $httpBackend.flush();
  });

});
