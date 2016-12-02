import CreateStoreMapModule from "./createStoreMap";

const { module } = angular.mock;

describe("CreateStoreMap", () => {
  beforeEach(module(CreateStoreMapModule));

  describe("Module", () => {
    it("is named createStoreMap", () => {
      expect(CreateStoreMapModule).to.equal("createStoreMap");
    });
  });

  describe("Controller", () => {
    let $componentController, $rootScope, $compile;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      $rootScope = $injector.get("$rootScope");
      $compile = $injector.get("$compile");
    }));

    it("sets marker", () => {
      let $ctrl = $componentController("createStoreMap", {});
      let lat = 1.99, lng = 2.99, name = "bla";
      $ctrl.setMarker(lat, lng, name);
      expect($ctrl.markers.pin.lat).to.equal(lat);
      expect($ctrl.markers.pin.lng).to.equal(lng);
    });

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
