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

  describe("Component", () => {
    let $scope, $ctrl, $httpBackend;
    beforeEach(inject((_$rootScope_, _$compile_, $injector) => {
      $scope = _$rootScope_.$new();
      let component = _$compile_("<store-list group-id='groupId'></store-list>")($scope);
      $ctrl = component.isolateScope().$ctrl;
      $httpBackend = $injector.get("$httpBackend");
    }));

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it("gets store data", () => {
      $httpBackend.expectGET("/api/stores/?group=67").respond([storeOne]);
      expect($ctrl.storeList).to.be.undefined;
      $scope.groupId = 67;
      $scope.$apply();
      expect($ctrl.groupId).to.equal(67);
      $httpBackend.flush();
      // avoid comparing the internal $$hashkey value
      expect(angular.toJson($ctrl.storeList)).to.equal(angular.toJson([storeOne]));
    });
  });

  describe("Controller", () => {
    let $componentController, $q, $mdDialog, $rootScope;

    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      $q = $injector.get("$q");
      $mdDialog = $injector.get("$mdDialog");
      sinon.stub($mdDialog, "show");
      $rootScope = $injector.get("$rootScope");
    }));

    it("opens dialog to create store", () => {
      // don't load storeList
      let $ctrl = $componentController("storeList", {}, { storeList: [] });
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
