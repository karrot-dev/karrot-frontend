import StoreEditCreateFormModule from "./storeEditCreateForm";

const { module } = angular.mock;

describe("StoreEditCreateForm", () => {
  beforeEach(module(StoreEditCreateFormModule));
  beforeEach(module({
    Geocoding: {
      lookupAddress: sinon.stub()
    }
  }));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named storeEditCreateForm", () => {
      expect(StoreEditCreateFormModule).to.equal("storeEditCreateForm");
    });
  });


  describe("Controller", () => {
    let $componentController, Geocoding;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      Geocoding = $injector.get("Geocoding");
    }));

    it("initializes from binding", () => {
      let $ctrl = $componentController("storeEditCreateForm", {}, { data: {
        latitude: 2, longitude: 3, address: "he"
      } });
      $ctrl.$onInit();
      expect($ctrl.query).to.equal("he");
      expect($ctrl.marker.p.lng).to.equal(3);
      expect($ctrl.isCreate).to.be.undefined;
    });

    it("initializes without binding", () => {
      let $ctrl = $componentController("storeEditCreateForm", {});
      $ctrl.$onInit();
      expect($ctrl.query).to.be.undefined;
      expect($ctrl.marker).to.be.undefined;
      expect($ctrl.isCreate).to.be.true;
    });

    it("does lookup", () => {
      let $ctrl = $componentController("storeEditCreateForm", {});
      $ctrl.query = "arg";
      $ctrl.geoLookup();
      expect(Geocoding.lookupAddress).to.have.been.calledWith("arg");
    });

    it("doesn't set coords if no value", () => {
      let $ctrl = $componentController("storeEditCreateForm", {}, { data: {} });
      $ctrl.trySetLocation();
      expect($ctrl.data.address).to.be.undefined;
    });

    it("resets coords if text is empty", () => {
      let $ctrl = $componentController("storeEditCreateForm", {});
      $ctrl.data = { latitude: 30 };
      $ctrl.deleteIfEmpty();
      expect($ctrl.data.latitude).to.be.null;
    });
  });
});
