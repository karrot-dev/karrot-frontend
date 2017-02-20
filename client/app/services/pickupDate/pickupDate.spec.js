import PickupDateModule from "./pickupDate";

let { module } = angular.mock;

describe("pickupDate service", () => {
  beforeEach(module(PickupDateModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  let $httpBackend, PickupDate, now, clock;

  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    PickupDate = $injector.get("PickupDate");
  }));

  beforeEach(() => {
    now = new Date();
    clock = sinon.useFakeTimers(now.getTime());
  });

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    clock.restore();
  });

  let pickupData = [{
    "id": 15,
    "date": "2016-09-20T21:40:00Z",
    "collector_ids": [1, 2],
    "max_collectors": 2,
    "store": 9
  }];

  let pickupCreateData = {
    "date": "2016-09-20T21:40:00Z",
    "max_collectors": 2,
    "store": 9
  };

  let pickupModifyData = {
    "id": 15,
    "max_collectors": 5
  };

  let pickupModifiedData = {
    "id": 15,
    "date": "2016-09-20T21:40:00Z",
    "collector_ids": [1, 2],
    "max_collectors": 5,
    "store": 9
  };

  let pickupJoinedData = {
    "id": 15,
    "date": "2016-09-20T21:40:00Z",
    "collector_ids": [1, 2, 3],
    "max_collectors": 5,
    "store": 9
  };

  it("lists upcoming pickupdates", () => {
    $httpBackend.expectGET(`/api/pickup-dates/?date_0=${now.toISOString()}`).respond(pickupData);
    expect(PickupDate.list())
      .to.be.fulfilled.and
      .to.eventually.deep.equal(pickupData);
    $httpBackend.flush();
  });

  it("gets pickupdate", () => {
    $httpBackend.expectGET("/api/pickup-dates/15/").respond(pickupData[0]);
    expect(PickupDate.get(15))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(pickupData[0]);
    $httpBackend.flush();
  });

  it("filters upcoming pickupdates by store", () => {
    $httpBackend.expectGET(`/api/pickup-dates/?date_0=${now.toISOString()}&store=9`).respond(pickupData[0]);
    expect(PickupDate.listByStoreId(9))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(pickupData[0]);
    $httpBackend.flush();
  });

  it("filters upcoming pickupdates by group", () => {
    $httpBackend.expectGET(`/api/pickup-dates/?date_0=${now.toISOString()}&group=9`).respond(pickupData[0]);
    expect(PickupDate.listByGroupId(9))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(pickupData[0]);
    $httpBackend.flush();
  });

  it("creates pickupdate", () => {
    $httpBackend.expectPOST("/api/pickup-dates/", pickupCreateData).respond(pickupData[0]);
    expect(PickupDate.create(pickupCreateData))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(pickupData[0]);
    $httpBackend.flush();
  });

  it("save pickupdate", () => {
    $httpBackend.expectPATCH("/api/pickup-dates/15/", pickupModifyData).respond(pickupModifiedData);
    expect(PickupDate.save(pickupModifyData))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(pickupModifiedData);
    $httpBackend.flush();
  });

  it("delete pickupdate", () => {
    $httpBackend.expectDELETE("/api/pickup-dates/15/").respond(200);
    expect(PickupDate.delete(15)).to.be.fulfilled;
    $httpBackend.flush();
  });

  it("join pickupdate", () => {
    $httpBackend.expectPOST("/api/pickup-dates/15/add/").respond(pickupJoinedData);
    expect(PickupDate.join(15))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(pickupJoinedData);
    $httpBackend.flush();
  });

  it("leave pickupdate", () => {
    $httpBackend.expectPOST("/api/pickup-dates/15/remove/").respond(pickupModifiedData);
    expect(PickupDate.leave(15))
      .to.be.fulfilled.and
      .to.eventually.deep.equal(pickupModifiedData);
    $httpBackend.flush();
  });
});
