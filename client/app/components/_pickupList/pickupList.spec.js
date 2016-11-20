import PickupListModule from "./pickupList";

describe("PickupList", () => {
  let $componentController, $httpBackend;

  let { module } = angular.mock;

  beforeEach(() => {
    module(PickupListModule);
    inject(($injector) => {
      $httpBackend = $injector.get("$httpBackend");
      $componentController = $injector.get("$componentController");
    });
  });

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
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
    "store": 9,
    "isUserMember": false,
    "isFull": false
  },
    {
      "id": 14,
      "date": "2016-09-16T01:00:00Z",
      "collector_ids": [
        1,
        8
      ],
      "max_collectors": 2,
      "store": 9,
      "isUserMember": true,
      "isFull": true
    },
    {
      "id": 11,
      "date": "2016-09-17T16:00:00Z",
      "collector_ids": [
        1
      ],
      "max_collectors": 3,
      "store": 9,
      "isUserMember": true,
      "isFull": false
    },
    {
      "id": 5,
      "date": "2016-09-18T12:00:18Z",
      "collector_ids": [],
      "max_collectors": 5,
      "store": 9,
      "isUserMember": false,
      "isFull": false
    },
    {
      "id": 4,
      "date": "2017-09-22T20:00:05Z",
      "collector_ids": [],
      "max_collectors": 2,
      "store": 9,
      "isUserMember": false,
      "isFull": false
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
        "store": 9,
        "isUserMember": false,
        "isFull": false
      },
        {
          "id": 14,
          "date": "2016-09-16T01:00:00Z",
          "collector_ids": [
            1,
            8
          ],
          "max_collectors": 2,
          "store": 9,
          "isUserMember": true,
          "isFull": true
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
        "store": 9,
        "isUserMember": true,
        "isFull": false
      }]
    },
    {
      "date": "2016-09-18",
      "items": [{
        "id": 5,
        "date": "2016-09-18T12:00:18Z",
        "collector_ids": [],
        "max_collectors": 5,
        "store": 9,
        "isUserMember": false,
        "isFull": false
      }]
    },
    {
      "date": "2017-09-22",
      "items": [{
        "id": 4,
        "date": "2017-09-22T20:00:05Z",
        "collector_ids": [],
        "max_collectors": 2,
        "store": 9,
        "isUserMember": false,
        "isFull": false
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

      $httpBackend.whenGET("/api/auth/status/").respond(authData);
      $httpBackend.whenGET("/api/pickup-dates/?store=9").respond(pickupData);
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
      $httpBackend.expectGET("/api/pickup-dates/?store=9").respond(pickupData);
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

      $httpBackend.whenGET("/api/auth/status/").respond(authData);
      $httpBackend.whenGET("/api/pickup-dates/?store=9").respond(pickupData);
      $httpBackend.whenGET("/api/stores/9/").respond(storeData);
    });

    afterEach(() => {
      $httpBackend.flush();
    });

    it("addPickupInfo get Store Info functionality", () => {
      $ctrl.userId = 1;
      $ctrl.addPickupInfosAndDisplay(pickupData);
      let updatedData = $ctrl.allPickups;
      expect(updatedData[0].storePromise).to.eventually.deep.equal(storeData);
    });

    describe("createPickup dialog", () => {
      let $q, $rootScope;
      beforeEach(() => {
        inject(($injector) => {
          $q = $injector.get("$q");
          $rootScope = $injector.get("$rootScope");
        });
      });

      it("is called and updates pickup list", () => {
        sinon.stub($ctrl.$mdDialog, "show");
        sinon.stub($ctrl, "updatePickups");
        $ctrl.$mdDialog.show.returns($q((resolve) => resolve()));
        $ctrl.openCreatePickupPanel();
        $rootScope.$apply();
        expect($ctrl.updatePickups).to.have.been.called;
      });
    });
  });
});
