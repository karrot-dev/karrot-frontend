import GroupDetailModule from "./groupDetail";
import GroupDetailController from "./groupDetail.controller";
import GroupDetailComponent from "./groupDetail.component";
import GroupDetailTemplate from "./groupDetail.html";

const { module } = angular.mock;

describe("GroupDetail", () => {
  let $httpBackend, $state;

  beforeEach(module(GroupDetailModule));
  beforeEach(module(($stateProvider) => {
    $stateProvider
      .state("main", { url: "", abstract: true });
  }));

  let $log;
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

  describe("Component", () => {
    let component = GroupDetailComponent;

    it("includes the intended template",() => {
      expect(component.template).to.equal(GroupDetailTemplate);
    });

    it("invokes the right controller", () => {
      expect(component.controller).to.equal(GroupDetailController);
    });

  });

  describe("Controller", () => {
    let CurrentGroup, $componentController;

    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      CurrentGroup = $injector.get("CurrentGroup");
      sinon.stub($state, "go");
    }));

    it("should be able to leave a group", () => {
      let $ctrl = $componentController("groupDetail", {});
      let groupData = { id: 9834 };
      $httpBackend.expectPOST(`/api/groups/${groupData.id}/leave/`).respond(200);
      Object.assign($ctrl, { groupData });
      $ctrl.leaveGroup();
      $httpBackend.flush();
      expect($state.go).to.have.been.calledWith("home");
    });

    it("clears the current group if you leave it", () => {
      let $ctrl = $componentController("groupDetail", {});
      let groupData = { id: 2424 };
      $httpBackend.expectPOST(`/api/groups/${groupData.id}/leave/`).respond(200);
      CurrentGroup.set({ id: groupData.id });
      expect(CurrentGroup.value).to.deep.equal({ id: groupData.id });
      Object.assign($ctrl, { groupData });
      $ctrl.leaveGroup();
      $httpBackend.flush();
      expect(CurrentGroup.value).to.deep.equal({});
      expect($state.go).to.have.been.calledWith("home");
    });

    it("sets an error flag if leaving fails", () => {
      let $ctrl = $componentController("groupDetail", {});
      let groupData = { id: 98238 };
      $httpBackend.expectPOST(`/api/groups/${groupData.id}/leave/`).respond(400);
      Object.assign($ctrl, { groupData });
      $ctrl.leaveGroup();
      $httpBackend.flush();
      expect($ctrl.error.leaveGroup).to.be.true;
      expect($state.go).to.not.have.been.called;
    });

    it("saves groupData", () => {
      let groupData = { id: 667, name: "blarb" };
      let $ctrl = $componentController("groupDetail", {}, { groupData });
      let feedback = $ctrl.updateGroupData();
      $httpBackend.expectPATCH(`/api/groups/${groupData.id}/`, groupData).respond(groupData);
      $httpBackend.flush();
      expect(feedback).to.eventually.deep.equal(groupData);
    });

  });

  describe("Route", () => {
    beforeEach(() => {
      $httpBackend.expectGET("/api/auth/status/").respond({});
    });

    let groupData = { id: 12 };
    it("should load group information", () => {
      $httpBackend.expectGET(`/api/groups/${groupData.id}/`).respond(groupData);
      $state.go("groupDetail", { groupId: groupData.id });
      $httpBackend.flush();
      expect($state.current.component).to.equal("groupDetail");
    });
  });

});
