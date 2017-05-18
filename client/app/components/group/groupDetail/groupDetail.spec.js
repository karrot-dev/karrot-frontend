import GroupDetailModule from "./groupDetail";

const { module } = angular.mock;

describe("GroupDetail", () => {
  let $httpBackend, $log;
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
    let $componentController, $q, Authentication;

    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      $q = $injector.get("$q");

      Authentication = $injector.get("Authentication");
    }));

    it("should be able to leave a group", () => {
      let $ctrl = $componentController("groupDetail", {});
      let groupData = { id: 9834 };
      sinon.stub($ctrl.$mdDialog, "show");
      sinon.stub($ctrl.$state, "go");
      $ctrl.$mdDialog.show.returns($q((resolve) => resolve()));
      Authentication.data = { id: 1 };
      $httpBackend.expectPOST(`/api/groups/${groupData.id}/leave/`).respond(200);
      sinon.stub($ctrl.CurrentGroup, "persistCurrentGroup");
      $ctrl.CurrentGroup.set({ id: groupData.id });
      expect($ctrl.CurrentGroup.value).to.deep.equal({ id: groupData.id });
      Object.assign($ctrl, { groupData });
      $ctrl.leaveGroup();
      $httpBackend.flush();
      expect($ctrl.CurrentGroup.value).to.deep.equal({});
      expect($ctrl.$state.go).to.have.been.calledWith("home");
    });

    it("stays on page if leaving fails", () => {
      let $ctrl = $componentController("groupDetail", {});
      let groupData = { id: 98238 };
      sinon.stub($ctrl.$state, "go");
      sinon.stub($ctrl.$mdDialog, "show");
      $ctrl.$mdDialog.show.returns($q((resolve) => resolve()));
      $httpBackend.expectPOST(`/api/groups/${groupData.id}/leave/`).respond(400);
      Object.assign($ctrl, { groupData });
      $ctrl.leaveGroup();
      $httpBackend.flush();
      expect($ctrl.$state.go).to.not.have.been.calledWith("home");
    });

    it("highlights correct tab", () => {
      let groupData = { id: 667, name: "blarb" };
      let $ctrl = $componentController("groupDetail", {});
      $ctrl.$state.current.name = "group.groupDetail.pickups";
      $ctrl.groupData = groupData;
      $ctrl.$onInit();
      expect($ctrl.currentNavItem).to.equal("pickups");
    });
  });
});
