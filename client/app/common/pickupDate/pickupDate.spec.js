import PickupDateModule from "./pickupDate";

let { module } = angular.mock;

describe("pickupDate service", () => {
  beforeEach(module(PickupDateModule));
  let $httpBackend, PickupDate;

  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    PickupDate = $injector.get("PickupDate");
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  let pickupData = {
    "id": 15,
    "date": "2016-09-20T21:40:00Z",
    "collector_ids": [1, 2],
    "max_collectors": 2,
    "store": 9
  };

  let pickupCreateData = {
    "date": "2016-09-20T21:40:00Z",
    "max_collectors": 2,
    "store": 9
  };

  let pickupModifyData = {
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

  it("lists all pickupdates", () => {
    $httpBackend.expectGET("/api/pickup-dates/").respond([pickupData]);
    PickupDate.get().then((data) => {
      expect(data).to.deep.equal([pickupData]);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });

  it("gets pickupdate", () => {
    $httpBackend.expectGET("/api/pickup-dates/15/").respond(pickupData);
    PickupDate.get({ id: 15 }).then((data) => {
      expect(data).to.deep.equal(pickupData);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });

  it("filters pickupdates", () => {
    $httpBackend.expectGET("/api/pickup-dates/?store=9").respond(pickupData);
    PickupDate.get({ store: 9 }).then((data) => {
      expect(data).to.deep.equal(pickupData);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });

  it("creates pickupdate", () => {
    $httpBackend.expectPOST("/api/pickup-dates/", pickupCreateData).respond(pickupData);
    PickupDate.create(pickupCreateData).then((data) => {
      expect(data).to.deep.equal(pickupData);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });

  it("save pickupdate", () => {
    $httpBackend.expectPATCH("/api/pickup-dates/15/", pickupModifyData).respond(pickupModifiedData);
    PickupDate.save(15, pickupModifyData).then((data) => {
      expect(data).to.deep.equal(pickupModifiedData);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });

  it("delete pickupdate", () => {
    $httpBackend.expectDELETE("/api/pickup-dates/15/").respond(200);
    PickupDate.delete(15).then(() => {
      assert(true);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });

  it("join pickupdate", () => {
    $httpBackend.expectPOST("/api/pickup-dates/15/add/").respond(pickupJoinedData);
    PickupDate.join(15).then((data) => {
      expect(data).to.deep.equal(pickupJoinedData);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });

  it("leave pickupdate", () => {
    $httpBackend.expectPOST("/api/pickup-dates/15/remove/").respond(pickupModifiedData);
    PickupDate.leave(15).then((data) => {
      expect(data).to.deep.equal(pickupModifiedData);
    }).catch(() => {
      assert.fail();
    });
    $httpBackend.flush();
  });
});
