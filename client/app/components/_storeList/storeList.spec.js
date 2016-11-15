import StoreListModule from "./storeList";
import StoreModule from "../../common/store/store";

describe("StoreList", () => {
  let $componentController, $httpBackend;

  let { module } = angular.mock;

  beforeEach(() => {
    module(StoreListModule);
    module(StoreModule);

    angular.mock.module(($provide) => {
      $provide.value("$mdDialog", {});
      $provide.value("$document", {});
    });
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
    let controller;

    it("check binding of complete stores",() => {
      controller = $componentController("storeList", {
      }, {
        stores: [storeOne]
      });

      expect(controller.storeData).to.deep.equal([storeOne]);
    });


    it("maps stores-array",() => {
      controller = $componentController("storeList", {
      }, {
        stores: [1]
      });

      $httpBackend.expectGET("/api/stores/1/").respond(storeOne);
      $httpBackend.flush();
    });
  });
});
