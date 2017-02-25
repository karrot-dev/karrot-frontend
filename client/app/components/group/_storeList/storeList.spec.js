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
});
