import PickupDateModule from "./pickupDate";

let { module } = angular.mock;

describe("pickupDateSeries service", () => {
  beforeEach(module(PickupDateModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  let $httpBackend, PickupDateSeries;

  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    PickupDateSeries = $injector.get("PickupDateSeries");
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  let series = [{
    "id": 15,
    "start_date": new Date("2016-09-20T21:40:00Z"),
    "max_collectors": 2,
    "rule": {
      freq: "WEEKLY",
      byDay: ["MO"]
    },
    "store": 9
  }];

  let seriesResponse = [{
    "id": 15,
    "start_date": "2016-09-20T21:40:00.000Z",
    "max_collectors": 2,
    "rule": "FREQ=WEEKLY;BYDAY=MO",
    "store": 9
  }];

  it("gets series", () => {
    $httpBackend.expectGET("/api/pickup-date-series/15/").respond(seriesResponse[0]);
    expect(PickupDateSeries.get(15))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(series[0]);
    $httpBackend.flush();
  });

  it("filters upcoming pickupdates by store", () => {
    $httpBackend.expectGET("/api/pickup-date-series/?store=9").respond(seriesResponse);
    expect(PickupDateSeries.listByStoreId(9))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(series);
    $httpBackend.flush();
  });

  it("creates series", () => {
    $httpBackend.expectPOST("/api/pickup-date-series/", seriesResponse[0]).respond(seriesResponse[0]);
    expect(PickupDateSeries.create(series[0]))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(series[0]);
    $httpBackend.flush();
  });

  it("save series", () => {
    $httpBackend.expectPATCH("/api/pickup-date-series/15/", seriesResponse[0]).respond(seriesResponse[0]);
    expect(PickupDateSeries.save(series[0]))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(series[0]);
    $httpBackend.flush();
  });

  it("delete series", () => {
    $httpBackend.expectDELETE("/api/pickup-date-series/15/").respond(200);
    expect(PickupDateSeries.delete(15)).to.be.fulfilled;
    $httpBackend.flush();
  });
});
