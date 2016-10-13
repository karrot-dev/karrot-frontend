import StoreListModule from "./storeList";

describe("StoreList", () => {
  let $rootScope, $componentController, $httpBackend;

  let { module } = angular.mock;

  beforeEach(module(StoreListModule));
  beforeEach(module("Store"));

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

  describe("Module", () => {
    // top-level specs: i.e., routes, injection, naming
  });

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

  describe("Template", () => {
    // template specs
    // tip: use regex to ensure correct bindings are used e.g., {{  }}
  });

  describe("Component", () => {
      // component/directive specs
  });
});
