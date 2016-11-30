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
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("sets marker", () => {
      let $ctrl = $componentController("createStoreMap", {});
      let lat = 1.99, lng = 2.99, name = "bla";
      $ctrl.setMarker(lat, lng, name);
      expect($ctrl.markers.pin.lat).to.equal(lat);
      expect($ctrl.markers.pin.lng).to.equal(lng);
    });
  });
});
