import GroupMapModule from "./groupMap";

const { module } = angular.mock;

describe("GroupMap", () => {
  beforeEach(module(GroupMapModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named groupMap", () => {
      expect(GroupMapModule).to.equal("groupMap");
    });
  });

  describe("Controller", () => {
    let $ctrl;
    beforeEach(inject((_$componentController_) => {
      $ctrl = _$componentController_("groupMap");
    }));

    let anotherStore = {
      id: 98,
      group: 4,
      name: "something",
      latitude: 87, longitude: 66
    };

    it("creates markers", () => {
      expect($ctrl.getMarkers([anotherStore])).to.deep.equal({
        "store_98": {
          icon: {
            icon: "shopping-cart",
            markerColor: "darkblue",
            prefix: "fa",
            type: "awesomeMarker"
          },
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
      $ctrl.update();
      $rootScope.$apply();
      expect($ctrl.markers.store_98.lat).to.equal(87);
      $ctrl.$onDestroy();
    }));

  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $compile("<store-map></store-map>")(scope);
    });
  });
});
