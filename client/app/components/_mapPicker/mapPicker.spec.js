import MapPickerModule from "./mapPicker";

const { module } = angular.mock;

describe("MapPicker", () => {
  beforeEach(module(MapPickerModule));
  beforeEach(module({ translateFilter: (a) => a }));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named mapPicker", () => {
      expect(MapPickerModule).to.equal("mapPicker");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("initializes from binding", () => {
      let $ctrl = $componentController("mapPicker", {}, { data: {
        latitude: 2, longitude: 3, address: "he"
      } });
      $ctrl.$onInit();
      expect($ctrl.query).to.equal("he");
      expect($ctrl.marker.p.lng).to.equal(3);
      expect($ctrl.isCreate).to.be.undefined;
    });

    it("initializes without binding", () => {
      let $ctrl = $componentController("mapPicker", {});
      $ctrl.$onInit();
      expect($ctrl.query).to.be.undefined;
      expect($ctrl.marker).to.be.undefined;
      expect($ctrl.isCreate).to.be.true;
    });

    it("does lookup", () => {
      let $ctrl = $componentController("mapPicker", {});
      sinon.stub($ctrl.Geocoding, "lookupAddress");
      $ctrl.query = "arg";
      $ctrl.geoLookup();
      expect($ctrl.Geocoding.lookupAddress).to.have.been.calledWith("arg");
    });

    it("doesn't set coords if no value", () => {
      let $ctrl = $componentController("mapPicker", {}, { data: {} });
      $ctrl.trySetLocation();
      expect($ctrl.data.address).to.be.undefined;
    });

    it("resets coords if text is empty", () => {
      let $ctrl = $componentController("mapPicker", {});
      $ctrl.data = { latitude: 30 };
      $ctrl.updateOrDeleteIfEmpty();
      expect($ctrl.data.latitude).to.be.null;
    });

    it("does not replace reference to marker", () => {
      let $ctrl = $componentController("mapPicker", {}, { data: {} });
      $ctrl.marker = { p: { lat: 12.34 } };
      let leafletMarker = $ctrl.marker.p;
      expect(leafletMarker.lat).to.equal(12.34);
      $ctrl.trySetLocation({
        address: "a", latitude: 99.99, longitude: 88.88
      });
      expect(leafletMarker.lat).to.equal(99.99);
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $compile("<map-picker></map-picker>")(scope);
    });
  });
});
