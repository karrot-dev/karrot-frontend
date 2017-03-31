import GroupInfoModule from "./groupInfo";

const { module } = angular.mock;

describe("GroupInfo", () => {
  beforeEach(module(GroupInfoModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named groupInfo", () => {
      expect(GroupInfoModule).to.equal("groupInfo");
    });
  });

  describe("Controller", () => {
    let $ctrl;
    beforeEach(inject((_$componentController_) => {
      $ctrl = _$componentController_("groupInfo");
    }));

    let groupData = {
      id: 98,
      name: "something",
      latitude: 87, longitude: 66,
      address: "new street 5"
    };

    it("creates markers", () => {
      $ctrl.$onChanges({ groupData: { currentValue: groupData } });
      expect($ctrl.map.markers).to.deep.equal({
        pin: {
          lat: 87, lng: 66,
          message: "new street 5",
          draggable: false
        }
      });
    });

    it("skips creating markers if no coordinate is given", () => {
      $ctrl.$onChanges({ groupData: { currentValue: { name: "group without location " } } });
      expect($ctrl.map.markers).to.deep.equal({});
    });

    it("checks if markers exist", () => {
      expect($ctrl.hasMarkers()).to.be.false;
      $ctrl.map.markers[1] = {};
      expect($ctrl.hasMarkers()).to.be.true;
    });
  });
});
