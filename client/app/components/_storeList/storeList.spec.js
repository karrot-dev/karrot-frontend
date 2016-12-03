import StoreListModule from "./storeList";

describe("StoreList", () => {
  let { module } = angular.mock;
  beforeEach(module(StoreListModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
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
    let $componentController, $httpBackend, $q, $mdDialog, $rootScope;

    beforeEach(inject(($injector) => {
      $httpBackend = $injector.get("$httpBackend");
      $componentController = $injector.get("$componentController");
      $q = $injector.get("$q");
      $mdDialog = $injector.get("$mdDialog");
      sinon.stub($mdDialog, "show");
      $rootScope = $injector.get("$rootScope");
    }));

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it("gets store data",() => {
      let $ctrl = $componentController("storeList", {}, { groupId: 67 });
      $httpBackend.expectGET("/api/stores/?group=67").respond([storeOne]);
      $httpBackend.flush();
      expect($ctrl.storeList).to.deep.equal([storeOne]);
    });

    it("opens dialog to create store", () => {
      // from controller init, could be mocked away
      let $ctrl = $componentController("storeList", {}, { groupId: 67 });
      $httpBackend.expectGET("/api/stores/?group=67").respond([]);
      $httpBackend.flush();

      // real test
      $mdDialog.show.returns($q((resolve) => {
        resolve({ id: 999 });
      }));
      $ctrl.openCreateStorePanel();
      $rootScope.$apply();
      expect($mdDialog.show).to.have.been.called;
      expect($ctrl.storeList).to.deep.equal([{ id: 999 }]);
    });
  });
});
