import StoreMapModule from "./storeMap";

const { module } = angular.mock;

describe("StoreMap", () => {
  beforeEach(module(StoreMapModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named storeMap", () => {
      expect(StoreMapModule).to.equal("storeMap");
    });
  });

  describe("Controller", () => {
    let $rootScope, $compile;
    beforeEach(inject(($injector) => {
      $rootScope = $injector.get("$rootScope");
      $compile = $injector.get("$compile");
    }));

    it("updates markers", () => {
      let $scope = $rootScope.$new();
      $scope.storeList = [];
      let component = $compile("<store-map store-list='storeList'></store-map>")($scope);
      let $ctrl = component.isolateScope().$ctrl;
      expect($ctrl.hasMarkers()).to.be.false;

      $scope.storeList = [{ id: 99, group: 5, latitude: 1.99, longitude: 2.99, name: "test1" }];
      $scope.$apply();
      expect($ctrl.hasMarkers()).to.be.true;
      expect($ctrl.markers).to.deep.equal({
        99: {
          lat: 1.99,
          lng: 2.99,
          message: "<a ui-sref='group.store({ storeId: 99, groupId: 5 })'>test1</a>",
          draggable: false }
      });
    });
  });
});
