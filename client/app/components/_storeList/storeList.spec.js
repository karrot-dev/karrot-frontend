import StoreListModule from "./storeList";
import StoreModule from "../../common/store/store";

describe("StoreList", () => {
  let $rootScope, $componentController, $httpBackend;

  let { module } = angular.mock;

  beforeEach(module(StoreListModule));
  beforeEach(module(StoreModule));

  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    $rootScope = $injector.get("$rootScope");
    $componentController = $injector.get("$componentController");
  }));
  
  let storeOne = {
    "id": 1,
    "name": "Teststore1",
    "description": "all the good stuff",
    "group": 1,
    "address": null,
    "latitude": null,
    "longitude": null
  };

  describe("Controller", () => {
    let controller;
        
    it("check binding of complete stores",() => {
      controller = $componentController("storeList", {
        $scope: $rootScope.$new()
      }, {
        stores: [storeOne]
      });
      
      expect(controller.storeData).to.deep.equal([storeOne]);
    });
    
    
    it("maps stores-array",() => {
      controller = $componentController("storeList", {
        $scope: $rootScope.$new()
      }, {
        stores: [1]
      });
      
      $httpBackend.expectGET("/api/stores/1/").respond(storeOne);
      $httpBackend.flush();
    });
  });
});
