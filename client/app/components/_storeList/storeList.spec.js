import StoreListModule from "./storeList";

describe("StoreList", () => {
  let { module } = angular.mock;

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
    let $componentController, $httpBackend, $q, $mdDialog, $rootScope;

    beforeEach(() => {
      module(StoreListModule);
      inject(($injector) => {
        $httpBackend = $injector.get("$httpBackend");
        $componentController = $injector.get("$componentController");
        $q = $injector.get("$q");
        $mdDialog = $injector.get("$mdDialog");
        sinon.stub($mdDialog, "show");
        $rootScope = $injector.get("$rootScope");
      });
    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

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
      $mdDialog.show.returns($q((resolve) => {
        resolve({ id: 999 });
      }));
      $ctrl.openCreateStorePanel();
      $rootScope.$apply();
      expect($mdDialog.show).to.have.been.called;
      expect($ctrl.storeData).to.deep.equal([{ id: 999 }]);
    });
  });
});
