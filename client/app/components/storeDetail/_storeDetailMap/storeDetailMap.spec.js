import StoreDetailMapModule from "./storeDetailMap";

const { module } = angular.mock;

describe("StoreDetailMap", () => {
  beforeEach(module(StoreDetailMapModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named storeDetailMap", () => {
      expect(StoreDetailMapModule).to.equal("storeDetailMap");
    });
  });

  describe("Controller", () => {
    let $rootScope, $compile;
    beforeEach(inject(($injector) => {
      $rootScope = $injector.get("$rootScope");
      $compile = $injector.get("$compile");
    }));

    it("updates marker on change", () => {
      let $scope = $rootScope.$new();
      let component = $compile(
        "<store-detail-map store-data='storeData'></create-store-map>"
      )($scope);
      let $ctrl = component.isolateScope().$ctrl;
      expect($ctrl.markers).to.deep.equal({});

      Object.assign($scope, {
        storeData: {
          latitude: 1.99, longitude: 2.99, address: "test1"
        }
      });
      $scope.$apply();
      expect($ctrl.markers).to.deep.equal({
        pin: { lat: 1.99, lng: 2.99, message: "test1", draggable: false }
      });
    });
  });
});
