import StoreListModule from "./storeList";

describe("StoreList", () => {
  let $componentController, $httpBackend;

  let { module } = angular.mock;

  beforeEach(() => {
    module(StoreListModule);
    inject(($injector) => {
      $httpBackend = $injector.get("$httpBackend");
      $componentController = $injector.get("$componentController");
    });
  });

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

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
    it("check binding of complete stores",() => {
      let $ctrl = $componentController("storeList", {
      }, {
        stores: [storeOne]
      });

      expect($ctrl.storeData).to.deep.equal([storeOne]);
    });


    it("maps stores-array",() => {
      $componentController("storeList", {
      }, {
        stores: [1]
      });

      $httpBackend.expectGET("/api/stores/1/").respond(storeOne);
      $httpBackend.flush();
    });

    it("opens dialog to create store", () => {
      let $ctrl = $componentController("storeList", {}, { stores: [] } );
      $ctrl.openCreateStorePanel();
    });
  });
});
