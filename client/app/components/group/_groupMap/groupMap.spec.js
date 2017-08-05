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

    let storeData = {
      id: 98,
      group: 4,
      name: "something",
      latitude: 87, longitude: 66
    };

    it("creates store markers", () => {
      $ctrl.CurrentStores.set([storeData]);
      expect($ctrl.getMarkers()).to.deep.equal({
        "store_98": {
          icon: {
            icon: "shopping-cart",
            markerColor: "darkblue",
            prefix: "fa",
            type: "awesomeMarker"
          },
          lat: 87, lng: 66,
          message: "<a ui-sref='group.store({ storeId: 98, groupId: 4 })'>something</a>",
          draggable: false,
          opacity: 1
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

    it("updates markers after adding item to CurrentStores", inject(($rootScope, $timeout) => {
      $ctrl.$onInit();
      expect($ctrl.markers).to.deep.equal({});
      $ctrl.CurrentStores.pushItem(storeData);
      $rootScope.$apply();
      $timeout.flush();
      expect($ctrl.markers.store_98.lat).to.equal(87);
      $ctrl.$onDestroy();
    }));

    it("switches back to overview mode", inject(($rootScope, $timeout) => {
      $ctrl.$onInit();
      expect($ctrl.bounds).to.deep.equal({});

      // set stores
      $ctrl.CurrentStores.set([storeData]);
      $rootScope.$apply();
      $timeout.flush();
      expect($ctrl.bounds.northEast.lat).to.equal(87);

      // drag map away
      $ctrl.center = { lat: 0, lng: 0 };
      $rootScope.$apply();

      // switch back to overview
      sinon.spy($ctrl, "showOverview");
      $ctrl.CurrentGroup.setMapOverview();
      $rootScope.$apply();
      expect($ctrl.bounds.northEast.lat).to.equal(87);
      expect($ctrl.markers.store_98.opacity).to.equal(1);
      expect($ctrl.showOverview).to.have.been.called;

      $ctrl.showOverview.restore();
      $ctrl.$onDestroy();
    }));

    it("centers to store", inject(($rootScope, $timeout) => {
      $ctrl.$onInit();
      expect($ctrl.markers).to.deep.equal({});
      $ctrl.CurrentStores.set([storeData, { id: 999, latitude: 1, longitude: 1 }]);
      $ctrl.CurrentStores.setSelected(storeData);

      $ctrl.CurrentGroup.setMapCenter({ lat: 87, lng: 66 });
      $rootScope.$apply();
      $timeout.flush();
      expect($ctrl.center.lat).to.equal(87);
      expect($ctrl.markers.store_98.opacity).to.equal(1);
      expect($ctrl.markers.store_999.opacity).to.equal(0.5);
      $ctrl.$onDestroy();
    }));

    it("shows user markers", inject(($rootScope, $timeout) => {
      $ctrl.$onInit();
      expect($ctrl.markers).to.deep.equal({});
      $ctrl.CurrentUsers.set([{ id: 5, latitude: 33, longitude: 44 }, { id: 999, latitude: 33, longitude: 44 }]);
      $ctrl.CurrentGroup.set({ members: [5] });

      $ctrl.CurrentGroup.map.options.showUsers = true;
      $rootScope.$apply();
      $timeout.flush();
      expect(Object.keys($ctrl.markers).length).to.equal(1);
      expect($ctrl.markers.user_5.lat).to.equal(33);
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
