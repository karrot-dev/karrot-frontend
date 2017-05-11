import PickupListItemModule from "./pickupListItem";

describe("PickupListItem", () => {
  let $log, $componentController, $httpBackend, $q;

  let { module } = angular.mock;

  beforeEach(module(PickupListItemModule));
  beforeEach(module("PickupDate"));
  beforeEach(module("User"));

  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
    $httpBackend = $injector.get("$httpBackend");
    $componentController = $injector.get("$componentController");
    $q = $injector.get("$q");

    pickupData.storePromise = $q((resolve) => resolve(storeData));
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $log.assertEmpty();
  });

  let pickupData = {
    "id": 11,
    "date": "2016-09-17T16:00:00Z",
    "collector_ids": [
      1
    ],
    "max_collectors": 3,
    "store": 9
  };

  let storeData = {
    "id": 9
  };

  describe("Controller with date detail", () => {
    let $ctrl;

    beforeEach(() => {
      $ctrl = $componentController("pickupListItem", {
      }, {
        data: pickupData,
        parentCtrl: {
          "updatePickups": () => {}
        },
        onJoin: () => {},
        onLeave: () => {},
        meta: { isUserMember: true }
      });
      $ctrl.$onInit();
    });

    it("test join and leave function", () => {
      $httpBackend.expectPOST("/api/pickup-dates/11/add/").respond("");
      $httpBackend.expectPOST("/api/pickup-dates/11/remove/").respond("");
      $ctrl.join();
      $ctrl.leave();
      $httpBackend.flush();
    });
  });

  describe("Controller with store detail", () => {
    let $ctrl;

    beforeEach(() => {
      $ctrl = $componentController("pickupListItem", {
      }, {
        data: pickupData,
        showDetail: "store"
      });
    });

    it("gets store data", () => {
      $ctrl.$onInit();
      inject(($rootScope) => $rootScope.$apply());
      expect($ctrl.storeData).to.deep.equal(storeData);
    });
  });
});
