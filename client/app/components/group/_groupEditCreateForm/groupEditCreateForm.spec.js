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

    it("does lookup", () => {
      let $ctrl = $componentController("groupEditCreateForm", {});
      $ctrl.geoLookup("arg");
      expect(Geocoding.lookupAddress).to.have.been.calledWith("arg");
    });

    it("sets coords", () => {
      let $ctrl = $componentController("groupEditCreateForm", {}, { editData: {} });
      let item = {
        lat: 1, lng: 2, name: "bla"
      };
      $ctrl.setGeo(item);
      expect($ctrl.editData.address).to.equal("bla");
    });

    it("doesn't set coords if no value", () => {
      let $ctrl = $componentController("groupEditCreateForm", {}, { editData: {} });
      $ctrl.setGeo();
      expect($ctrl.editData.address).to.be.undefined;
    });
  });
});
