import CreateStoreMapModule from "./createStoreMap";

const { module } = angular.mock;

describe("CreateStoreMap", () => {
  beforeEach(module(CreateStoreMapModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named createStoreMap", () => {
      expect(CreateStoreMapModule).to.equal("createStoreMap");
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
        "<create-store-map address='lookedUpAddress' latitude='latitude' longitude='longitude'></create-store-map>"
      )($scope);
      let $ctrl = component.isolateScope().$ctrl;
      expect($ctrl.markers).to.deep.equal({});

      Object.assign($scope, {
        lookedUpAddress: "test1", latitude: 1.99, longitude: 2.99
      });
      $scope.$apply();
      expect($ctrl.markers).to.deep.equal({
        pin: { lat: 1.99, lng: 2.99, message: "test1", draggable: false }
      });
    });

  });
});
