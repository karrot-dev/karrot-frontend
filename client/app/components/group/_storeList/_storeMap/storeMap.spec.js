import StoreMapModule from "./storeMap";

const { module } = angular.mock;

describe("StoreMap", () => {
  beforeEach(module(StoreMapModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named storeMap", () => {
      expect(StoreMapModule).to.equal("storeMap");
    });
  });

  describe("Controller", () => {
    let $ctrl;
    beforeEach(inject((_$componentController_) => {
      $ctrl = _$componentController_("storeMap");
    }));

    let anotherStore = {
      id: 98,
      group: 4,
      name: "something",
      latitude: 87, longitude: 66
    };

    it("creates markers", () => {
      expect($ctrl.getMarkers([anotherStore])).to.deep.equal({
        "98": {
          lat: 87, lng: 66,
          message: "<a ui-sref='group.store({ storeId: 98, groupId: 4 })'>something</a>",
          draggable: false
        }
      });
    });

    it("skips creating markers if no coordinate is given", () => {
      expect($ctrl.getMarkers([{ id: 4 }])).to.deep.equal({});
    });

    it("checks if markers exist", () => {
      expect($ctrl.hasMarkers()).to.be.false;
      $ctrl.markers[1] = {};
      expect($ctrl.hasMarkers()).to.be.true;
    });

    it("updates markers after adding item to CurrentStores", inject(($rootScope) => {
      $ctrl.$onInit();
      expect($ctrl.markers).to.deep.equal({});
      $ctrl.CurrentStores.pushItem(anotherStore);
      $rootScope.$apply();
      expect($ctrl.markers[98].lat).to.equal(87);
      $ctrl.$onDestroy();
    }));

  });
});
