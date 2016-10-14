import PickupListModule from "./pickupList";

describe("PickupList", () => {
  let $rootScope, $componentController, $httpBackend;

  let { module } = angular.mock;

  beforeEach(module(PickupListModule));
  beforeEach(module("User"));
  beforeEach(module("Store"));
  beforeEach(module("Authentication"));
  beforeEach(module("PickupDate"));
  
  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    $rootScope = $injector.get("$rootScope");
    $componentController = $injector.get("$componentController");
  }));
  
  let authData = {
    "id": 1,
    "display_name": "Lars",
    "first_name": "Lars",
    "last_name": "Wolf",
    "email": "l@l.de",
    "address": null,
    "latitude": null,
    "longitude": null
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

  let fullPickups = [
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
    }
  ];
  
  let storeData = {
    "id": 9,
    "name": "REWE Neuried",
    "description": "dasdsd",
    "group": 4,
    "address": "Muenchen",
    "latitude": 51.6180165487737,
    "longitude": 2.8125
  };

  
  describe("Module", () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe("Controller", () => {
    // controller specs
    let controller;
    
    beforeEach(() => {
      controller = $componentController("pickupList", {
        $scope: $rootScope.$new()
      }, {
        storeId: 9,
        header: "My amazing Pickups"
      });
    });
    
    
    it("bindings", () => {
      expect(controller.storeId).to.equal(9);
      expect(controller.header).to.equal("My amazing Pickups");
    });
    
    it("automatic update", () => {
      $httpBackend.expectGET("/api/auth/status/").respond(authData);
      $httpBackend.expectGET("/api/pickup-dates/?store=9").respond(pickupData);
      $httpBackend.flush();
    });
    
    
    it("addPickupInfo functionality", () => {
      $httpBackend.when("/api/auth/status/").respond(authData);
      $httpBackend.when("/api/pickup-dates/?store=9").respond(pickupData);
      $httpBackend.when("/api/stores/9/").respond(pickupData);
      
      controller.userId = 1;
      controller.addPickuplistInfos(pickupData);
      let updatedData = controller.allPickups;
      expect(updatedData).to.deep.equal(pickupDataInfoAdded);
      expect(updatedData[0].store).to.deep.equal(9);
    });
    
    it("filter functionality", () => {
      controller.allPickups = pickupDataInfoAdded;
      controller.pickupList = {
        showJoined: false,
        showOpen: false,
        showFull: true
      };
      expect(controller.filterPickups()).to.deep.equal(fullPickups);
    });
    
    it("groupByDate functionality", () => {
      expect(controller.groupByDate(pickupDataInfoAdded)).to.deep.equal(pickupDataInfoAddedGrouped);
    });
  });
  
  describe("Controller with showDetail = store", () => {
    // controller specs
    let controller;
    
    beforeEach(() => {
      controller = $componentController("pickupList", {
        $scope: $rootScope.$new()
      }, {
        storeId: 9,
        header: "My amazing Pickups",
        showDetail: "store"
      });
    });
    
    
    it("addPickupInfo get Store Info functionality", () => {
      $httpBackend.when("/api/auth/status/").respond(authData);
      $httpBackend.when("/api/pickup-dates/?store=9").respond(pickupData);
      $httpBackend.when("/api/stores/9/").respond(storeData);
      
      controller.userId = 1;
      controller.addPickuplistInfos(pickupData);
      let updatedData = controller.allPickups;
      expect(updatedData[0].store).to.eventually.deep.equal(storeData);
    });
  });

  describe("Template", () => {
    // template specs
    // tip: use regex to ensure correct bindings are used e.g., {{  }}
  });

  describe("Component", () => {
      // component/directive specs
  });
});
