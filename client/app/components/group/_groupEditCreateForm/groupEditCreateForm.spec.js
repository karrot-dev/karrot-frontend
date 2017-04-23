import GroupEditCreateFormModule from "./groupEditCreateForm";
import User from "../../../services/user/user";

const { module } = angular.mock;

describe("GroupEditCreateForm", () => {
  beforeEach(module(GroupEditCreateFormModule));
  beforeEach(module(User));

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
    let $componentController, $q, $rootScope;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      $q = $injector.get("$q");
      $rootScope = $injector.get("$rootScope");
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
      $ctrl.onSubmit = () => $q.reject(err);
      $ctrl.submit();
      $rootScope.$apply();
      expect($ctrl.error).to.be.equal("err");
    });

    it("does lookup", () => {
      let $ctrl = $componentController("groupEditCreateForm", {});
      sinon.stub($ctrl.Geocoding, "lookupAddress");
      $ctrl.query = "arg";
      $ctrl.geoLookup();
      expect($ctrl.Geocoding.lookupAddress).to.have.been.calledWith("arg");
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

    it("does not replace reference to marker", () => {
      let $ctrl = $componentController("groupEditCreateForm", {}, { data: {} });
      $ctrl.marker = { p: { lat: 12.34 } };
      let leafletMarker = $ctrl.marker.p;
      expect(leafletMarker.lat).to.equal(12.34);
      $ctrl.trySetLocation({
        address: "a", latitude: 99.99, longitude: 88.88
      });
      expect(leafletMarker.lat).to.equal(99.99);
    });

  });
});
