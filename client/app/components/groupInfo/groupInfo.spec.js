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

    it("checks if user is logged in", () => {
      expect($ctrl.isLoggedIn()).to.be.false;
      $ctrl.Authentication.data = { id: 5 };
      expect($ctrl.isLoggedIn()).to.be.true;
    });

    it("checks if user is member of group", () => {
      $ctrl.Authentication.data = { id: 5 };
      $ctrl.groupData = { members: [] };
      expect($ctrl.isMember()).to.be.false;
      $ctrl.groupData.members = [5];
      expect($ctrl.isMember()).to.be.true;
    });

    it("opens join dialog", () => {
      $ctrl.groupData = { id: 1337 };
      inject(($q, $rootScope) => {
        sinon.stub($ctrl.$mdDialog, "show");
        sinon.stub($ctrl.$state, "go");
        $ctrl.$mdDialog.show.returns($q((resolve) => {
          resolve(1337);
        }));
        $ctrl.openJoinGroup();
        $rootScope.$apply();
        expect($ctrl.$state.go).to.have.been.calledWith( "group", { groupId: 1337 } );
      });
    });

  });
});
