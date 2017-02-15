import GroupEditCreateFormModule from "./groupEditCreateForm";

const { module } = angular.mock;

describe("GroupEditCreateForm", () => {
  beforeEach(module(GroupEditCreateFormModule));
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
    it("is named groupEditCreateForm", () => {
      expect(GroupEditCreateFormModule).to.equal("groupEditCreateForm");
    });
  });

  describe("Controller", () => {
    let $componentController, Geocoding;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      Geocoding = $injector.get("Geocoding");
    }));

    it("initializes from binding", () => {
      let $ctrl = $componentController("groupEditCreateForm", {}, { editData: {
        latitude: 2, longitude: 3, address: "he"
      } });
      $ctrl.$onInit();
      expect($ctrl.query).to.equal("he");
      expect($ctrl.marker.p.lng).to.equal(3);
    });

    it("initializes without binding", () => {
      let $ctrl = $componentController("groupEditCreateForm", {});
      $ctrl.$onInit();
      expect($ctrl.query).to.be.undefined;
      expect($ctrl.marker).to.be.undefined;
    });

    it("does lookup", () => {
      let $ctrl = $componentController("groupEditCreateForm", {});
      $ctrl.query = "arg";
      $ctrl.geoLookup();
      expect(Geocoding.lookupAddress).to.have.been.calledWith("arg");
    });

    it("doesn't set coords if no value", () => {
      let $ctrl = $componentController("groupEditCreateForm", {}, { editData: {} });
      $ctrl.trySetLocation();
      expect($ctrl.editData.address).to.be.undefined;
    });

    it("resets coords if text is empty", () => {
      let $ctrl = $componentController("groupEditCreateForm", {});
      $ctrl.editData = { latitude: 30 };
      $ctrl.deleteIfEmpty();
      expect($ctrl.editData.latitude).to.be.null;
    });

  });
});
