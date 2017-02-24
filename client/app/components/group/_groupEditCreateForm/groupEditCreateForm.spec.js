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
      let $ctrl = $componentController("groupEditCreateForm", {}, { data: {
        latitude: 2, longitude: 3, address: "he"
      } });
      $ctrl.$onInit();
      expect($ctrl.query).to.equal("he");
      expect($ctrl.marker.p.lng).to.equal(3);
      expect($ctrl.isCreate).to.be.undefined;
    });

    it("initializes without binding", () => {
      let $ctrl = $componentController("groupEditCreateForm", {});
      $ctrl.$onInit();
      expect($ctrl.query).to.be.undefined;
      expect($ctrl.marker).to.be.undefined;
      expect($ctrl.isCreate).to.be.true;
    });

    it("submits data with error", () => {
      let $ctrl = $componentController("groupEditCreateForm", {});
      let err = { data: "err" };
      $ctrl.onSubmit = () => {
        return { catch: (fn) => fn(err) };
      };
      $ctrl.submit();
      expect($ctrl.error).to.be.equal("err");
    });

    it("does lookup", () => {
      let $ctrl = $componentController("groupEditCreateForm", {});
      $ctrl.query = "arg";
      $ctrl.geoLookup();
      expect(Geocoding.lookupAddress).to.have.been.calledWith("arg");
    });

    it("doesn't set coords if no value", () => {
      let $ctrl = $componentController("groupEditCreateForm", {}, { data: {} });
      $ctrl.trySetLocation();
      expect($ctrl.data.address).to.be.undefined;
    });

    it("resets coords if text is empty", () => {
      let $ctrl = $componentController("groupEditCreateForm", {});
      $ctrl.data = { latitude: 30 };
      $ctrl.deleteIfEmpty();
      expect($ctrl.data.latitude).to.be.null;
    });

  });
});
