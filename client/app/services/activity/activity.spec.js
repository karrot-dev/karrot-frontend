import ActivityModule from "./activity";

const { module } = angular.mock;

describe("activity", () => {
  let $log;
  beforeEach(() => {
    module(ActivityModule);
    inject(($injector) => {
      $log = $injector.get("$log");
      $log.reset();
    });
  });
  afterEach(() => {
    $log.assertEmpty();
  });

  let $httpBackend, ActivityService;
  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    ActivityService = $injector.get("ActivityService");
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

  it("lists activity by group", () => {
    $httpBackend.expectGET("/api/activity/?group=5").respond({
      // pagination header
      "count": 1404,
      "next": "https://foodsaving.world/api/activity/?limit=50&offset=50&group=5",
      "previous": null,
      "results": resultData
    });
    expect(ActivityService.list({ group: 5 })).to.be.fulfilled;
    $httpBackend.flush();
  });

});
