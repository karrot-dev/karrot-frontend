import PickupListItemModule from "./pickupListItem";

describe("PickupListItem", () => {
  let $rootScope, $componentController, $httpBackend;

  let { module } = angular.mock;

  beforeEach(module(PickupListItemModule));
  beforeEach(module("PickupDate"));
  
  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    $rootScope = $injector.get("$rootScope");
    $componentController = $injector.get("$componentController");
  }));
  
  let pickupData = {
    "id": 11,
    "date": "2016-09-17T16:00:00Z",
    "collector_ids": [
      1
    ],
    "max_collectors": 3,
    "store": 9,
    "isUserMember": true,
    "isFull": false
  };

  describe("Controller with date detail", () => {
    let controller;
    
    beforeEach(() => {
      controller = $componentController("pickupListItem", {
        $scope: $rootScope.$new()
      }, {
        data: pickupData,
        parentCtrl: {
          "updatePickups": () => {}
        }
      });
    });
    
    it("test date info", () => {
      expect(controller.info.text).to.deep.equal("Saturday, 17.09.2016");
    });
    
    it("test join and leave function", () => {
      $httpBackend.expectPOST("/api/pickup-dates/11/join");
    });
  });
});
