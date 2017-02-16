import GroupDetailModule from "./groupDetail";

const { module } = angular.mock;

describe("GroupDetail", () => {
  let $httpBackend, $state, $log;
  beforeEach(module(GroupDetailModule));
  beforeEach(module(($stateProvider) => {
    $stateProvider
      .state("main", { url: "", abstract: true });
  }));

  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    $state = $injector.get("$state");
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe("Module", () => {
    it("is named groupDetail", () => {
      expect(GroupDetailModule).to.equal("groupDetail");
    });
  });

  describe("Controller", () => {
    let CurrentGroup, $componentController;

    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      CurrentGroup = $injector.get("CurrentGroup");
      sinon.stub($state, "go");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("groupDetail", {});
      expect($ctrl).to.exist;
    });

    it("should be able to leave a group", () => {
      let $q;
      inject(($injector) => {
        $q = $injector.get("$q");
      });
      let $ctrl = $componentController("groupDetail", {});
      let groupData = { id: 9834 };
      sinon.stub($ctrl.$mdDialog, "show");
      $ctrl.$mdDialog.show.returns($q((resolve) => resolve()));
      $httpBackend.expectPOST(`/api/groups/${groupData.id}/leave/`).respond(200);
      CurrentGroup.set({ id: groupData.id });
      expect(CurrentGroup.value).to.deep.equal({ id: groupData.id });
      Object.assign($ctrl, { groupData });
      $ctrl.leaveGroup();
      $httpBackend.flush();
      expect(CurrentGroup.value).to.deep.equal({});
      expect($state.go).to.have.been.calledWith("home");
    });

    it("stays on page if leaving fails", () => {
      let $q;
      inject(($injector) => {
        $q = $injector.get("$q");
      });
      let $ctrl = $componentController("groupDetail", {});
      let groupData = { id: 98238 };
      sinon.stub($ctrl.$mdDialog, "show");
      $ctrl.$mdDialog.show.returns($q((resolve) => resolve()));
      $httpBackend.expectPOST(`/api/groups/${groupData.id}/leave/`).respond(400);
      Object.assign($ctrl, { groupData });
      $ctrl.leaveGroup();
      $httpBackend.flush();
      expect($state.go).to.not.have.been.calledWith("home");
    });

    it("highlights correct tab", () => {
      let groupData = { id: 667, name: "blarb" };
      $state.current.name = "group.groupDetail.pickups";
      let $ctrl = $componentController("groupDetail", {});
      $ctrl.groupData = groupData;
      expect($ctrl.currentNavItem).to.equal("pickups");
    });
  });
});
