import PickupListModule from "./pickupList";

describe("PickupList", () => {
  let $log, $componentController, $httpBackend, now, clock;

  let { module } = angular.mock;

  beforeEach(() => {
    module(PickupListModule);
    inject(($injector) => {
      $log = $injector.get("$log");
      $log.reset();
      $httpBackend = $injector.get("$httpBackend");
      $componentController = $injector.get("$componentController");
    });
    now = new Date(2016, 8, 1);
    clock = sinon.useFakeTimers(now.getTime());
  });

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $log.assertEmpty();
    clock.restore();
  });

  let authData = {
    "id": 1,
    "display_name": "Lars"
  };

  let pickupData = [{
    "id": 15,
    "date": "2016-09-16T21:40:00Z",
    "collector_ids": [],
    "max_collectors": 2,
    "store": 9
  },
  {
    "id": 14,
    "date": "2016-09-16T01:00:00Z",
    "collector_ids": [
      1,
      8
    ],
    "max_collectors": 2,
    "store": 9
  },
  {
    "id": 11,
    "date": "2016-09-17T16:00:00Z",
    "collector_ids": [
      1
    ],
    "max_collectors": 3,
    "store": 9
  },
  {
    "id": 5,
    "date": "2016-09-18T12:00:18Z",
    "collector_ids": [],
    "max_collectors": 5,
    "store": 9
  },
  {
    "id": 4,
    "date": "2017-09-22T20:00:05Z",
    "collector_ids": [],
    "max_collectors": 2,
    "store": 9
  }];

  let pickupDataInfoAdded = [{
    "id": 15,
    "date": "2016-09-16T21:40:00Z",
    "collector_ids": [],
    "max_collectors": 2,
    "store": 9
  },
  {
    "id": 14,
    "date": "2016-09-16T01:00:00Z",
    "collector_ids": [
      1,
      8
    ],
    "max_collectors": 2,
    "store": 9
  },
  {
    "id": 11,
    "date": "2016-09-17T16:00:00Z",
    "collector_ids": [
      1
    ],
    "max_collectors": 3,
    "store": 9
  },
  {
    "id": 5,
    "date": "2016-09-18T12:00:18Z",
    "collector_ids": [],
    "max_collectors": 5,
    "store": 9
  },
  {
    "id": 4,
    "date": "2017-09-22T20:00:05Z",
    "collector_ids": [],
    "max_collectors": 2,
    "store": 9
  }];

  let fullPickups = [pickupDataInfoAdded[1]];

  let pickupDataInfoAddedGrouped = [
    {
      "date": "2016-09-16",
      "items": [{
        "id": 15,
        "date": "2016-09-16T21:40:00Z",
        "collector_ids": [],
        "max_collectors": 2,
        "store": 9
      },
      {
        "id": 14,
        "date": "2016-09-16T01:00:00Z",
        "collector_ids": [
          1,
          8
        ],
        "max_collectors": 2,
        "store": 9
      }]
    },
    {
      "date": "2016-09-17",
      "items": [{
        "id": 11,
        "date": "2016-09-17T16:00:00Z",
        "collector_ids": [
          1
        ],
        "max_collectors": 3,
        "store": 9
      }]
    },
    {
      "date": "2016-09-18",
      "items": [{
        "id": 5,
        "date": "2016-09-18T12:00:18Z",
        "collector_ids": [],
        "max_collectors": 5,
        "store": 9
      }]
    },
    {
      "date": "2017-09-22",
      "items": [{
        "id": 4,
        "date": "2017-09-22T20:00:05Z",
        "collector_ids": [],
        "max_collectors": 2,
        "store": 9
      }]
    }];

  let storeData = {
    "id": 9,
    "name": "REWE Neuried"
  };

  describe("Controller with showDetail = date (default)", () => {
    let $ctrl;

    beforeEach(() => {
      $ctrl = $componentController("pickupList", {
      }, {
        storeId: 9,
        options: {
          header: "My amazing Pickups"
        }
      });
      $ctrl.$onInit();

      $httpBackend.whenGET("/api/auth/status/").respond(authData);
      $httpBackend.whenGET(`/api/pickup-dates/?date_0=${now.toISOString()}&store=9`).respond(pickupData);
    });

    afterEach(() => {
      $httpBackend.flush();
    });


    it("bindings", () => {
      expect($ctrl.storeId).to.equal(9);
      expect($ctrl.options.header).to.equal("My amazing Pickups");
    });

    it("automatic update", () => {
      $httpBackend.expectGET("/api/auth/status/").respond(authData);
      $httpBackend.expectGET(`/api/pickup-dates/?date_0=${now.toISOString()}&store=9`).respond(pickupData);
    });


    it("addPickupInfo functionality", () => {
      $ctrl.userId = 1;
      $ctrl.addPickupInfosAndDisplay(pickupData);
      let updatedData = $ctrl.allPickups;
      expect(updatedData).to.deep.equal(pickupDataInfoAdded);
      expect(updatedData[0].store).to.deep.equal(9);
    });

    it("filter functionality", () => {
      $ctrl.allPickups = pickupDataInfoAdded;
      $ctrl.options.filter = {
        showJoined: false,
        showOpen: false,
        showFull: true
      };
      expect($ctrl.filterAndDisplayPickups()).to.deep.equal(fullPickups);
    });

    it("groupByDate functionality", () => {
      expect($ctrl.groupByDate(pickupDataInfoAdded)).to.deep.equal(pickupDataInfoAddedGrouped);
    });
  });

  describe("Controller with showDetail = store", () => {
    let $ctrl;

    beforeEach(() => {
      $ctrl = $componentController("pickupList", {
      }, {
        storeId: 9,
        options: {
          header: "My amazing Pickups",
          showDetail: "store"
        }
      });
      $ctrl.$onInit();

      $httpBackend.whenGET("/api/auth/status/").respond(authData);
      $httpBackend.whenGET(`/api/pickup-dates/?date_0=${now.toISOString()}&store=9`).respond(pickupData);
      $httpBackend.whenGET("/api/stores/9/").respond(storeData);
    });

    it("addPickupInfo get Store Info functionality", () => {
      $ctrl.userId = 1;
      $ctrl.addPickupInfosAndDisplay(pickupData);
      let updatedData = $ctrl.allPickups;
      expect(updatedData[0].storePromise).to.eventually.deep.equal(storeData);
      $httpBackend.flush();
    });
  });

  describe("controller functions", () => {
    let $q, $rootScope, $ctrl;
    beforeEach(() => {
      inject(($injector) => {
        $q = $injector.get("$q");
        $rootScope = $injector.get("$rootScope");
      });
      $ctrl = $componentController("pickupList", {}, {
        options: { filter: {} }
      });
    });

    it("isFull functionality", () => {
      expect($ctrl.isFull({
        "collector_ids": [1,2,3],
        "max_collectors": 3
      })).to.equal.true;
      expect($ctrl.isFull({
        "collector_ids": [1,2],
        "max_collectors": 3
      })).to.equal.false;

      // can also be unset, then unlimited people can join
      expect($ctrl.isFull({
        "collector_ids": [1,2]
      })).to.equal.false;
    });

    it("isUserMember functionality", () => {
      $ctrl.userId = 1;
      expect($ctrl.isUserMember({
        "collector_ids": [1,2,3]
      })).to.equal.true;
      expect($ctrl.isUserMember({
        "collector_ids": [2,3]
      })).to.equal.false;
    });

    it("deletes pickup", () => {
      $ctrl.allPickups = [
        { id: 54 },
        { id: 87 }
      ];
      sinon.stub($ctrl.$mdDialog, "show");
      sinon.stub($ctrl.PickupDate, "delete");
      $ctrl.$mdDialog.show.returns($q.resolve());
      $ctrl.PickupDate.delete.returns($q.resolve());
      $ctrl.isDeleteSeries = false;
      $ctrl.delete({ id: 87 });
      $rootScope.$apply();
      expect($ctrl.PickupDate.delete).to.have.been.calledWith(87);
      expect($ctrl.allPickups).to.deep.equal([{ id: 54 }]);
    });

    it("deletes pickup series", () => {
      $ctrl.allPickups = [
        { id: 2, series: 12 },
        { id: 1, series: 3 },
        { id: 9 }
      ];
      sinon.stub($ctrl.$mdDialog, "show");
      sinon.stub($ctrl.PickupDateSeries, "delete");
      $ctrl.$mdDialog.show.returns($q.resolve());
      $ctrl.PickupDateSeries.delete.returns($q.resolve());
      $ctrl.isDeleteSeries = true;
      $ctrl.delete({ id: 87, series: 12 });
      $rootScope.$apply();
      expect($ctrl.pickupToDelete.id).to.equal(87);
      expect($ctrl.PickupDateSeries.delete).to.have.been.calledWith(12);
      expect($ctrl.allPickups).to.deep.equal([
        { id: 1, series: 3 },
        { id: 9 }
      ]);
    });

    it("pickupEditCreate dialog is called and updates pickup list", () => {
      $ctrl.allPickups = [];
      sinon.stub($ctrl.$mdDialog, "show");
      $ctrl.$mdDialog.show.returns($q((resolve) => resolve({
        "collector_ids": []
      })));
      $ctrl.openCreatePickupPanel();
      $rootScope.$apply();
      expect($ctrl.allPickups).to.deep.equal([{ "collector_ids": [] }]);
    });
  });
});
