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

  let fullPickups = [pickupData[1]];

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

      $httpBackend.whenGET(`/api/pickup-dates/?date_0=${now.toISOString()}&store=9`).respond(pickupData);
    });

    it("bindings", () => {
      expect($ctrl.storeId).to.equal(9);
      expect($ctrl.options.header).to.equal("My amazing Pickups");
      $httpBackend.flush();
    });

    it("updates pickup dates on init", () => {
      $httpBackend.expectGET(`/api/pickup-dates/?date_0=${now.toISOString()}&store=9`).respond(pickupData);
      $ctrl.$onInit();
      $httpBackend.flush();
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

      $httpBackend.whenGET(`/api/pickup-dates/?date_0=${now.toISOString()}&store=9`).respond(pickupData);
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

      $ctrl.Authentication.data = { id: 666 };
    });

    it("gets user id", () => {
      expect($ctrl.getUserId()).to.equal(666);
    });

    it("checks if date header should be shown", () => {
      expect($ctrl.showDateHeaderBefore(0, [])).to.be.true;
      expect($ctrl.showDateHeaderBefore(1, [
        { date: new Date("2017-05-10T11:42:33+00:00") },
        { date: new Date("2017-05-11T11:42:33+00:00") }
      ])).to.be.true;
      expect($ctrl.showDateHeaderBefore(1, [
        { date: new Date("2017-05-11T12:42:33+00:00") },
        { date: new Date("2017-05-11T11:42:33+00:00") }
      ])).to.be.false;
    });

    it("filters pickups", () => {
      $ctrl.allPickups = pickupData;
      $ctrl.options.filter = {
        showJoined: false,
        showOpen: false,
        showFull: true
      };
      expect($ctrl.getPickups()).to.deep.equal(fullPickups);
    });

    it("joins pickup date", () => {
      $ctrl.allPickups = [
        { id: 2, "collector_ids": [] },
        { id: 5, "collector_ids": [99] }
      ];
      $ctrl.joinPickup(5);
      expect($ctrl.allPickups).to.deep.equal([
        { id: 2, "collector_ids": [] },
        { id: 5, "collector_ids": [99, 666] }
      ]);
    });

    it("leaves pickup date", () => {
      $ctrl.allPickups = [
        { id: 2, "collector_ids": [] },
        { id: 5, "collector_ids": [95, 96, 666, 99] }
      ];
      $ctrl.leavePickup(5);
      expect($ctrl.allPickups).to.deep.equal([
        { id: 2, "collector_ids": [] },
        { id: 5, "collector_ids": [95, 96, 99] }
      ]);
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
      expect($ctrl.isUserMember({
        "collector_ids": [1,2,666]
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
      $ctrl.$mdDialog.show.returns($q.resolve({ "collector_ids": [] }));
      $ctrl.openCreatePickupPanel();
      $rootScope.$apply();
      expect($ctrl.allPickups).to.deep.equal([{ "collector_ids": [] }]);
    });
  });
});
