import GroupOptionsModule from "./groupOptions";

const { module } = angular.mock;

describe("GroupOptions", () => {
  let $httpBackend, $log;
  beforeEach(module(GroupOptionsModule));
  beforeEach(module(($stateProvider) => {
    $stateProvider
      .state("main", { url: "", abstract: true });
  }));
  beforeEach(module({ translateFilter: (a) => a }));
  beforeEach(module(($mdAriaProvider) => {
    $mdAriaProvider.disableWarnings();
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
    it("is named groupOptions", () => {
      expect(GroupOptionsModule).to.equal("groupOptions");
    });
  });

  describe("Controller", () => {
    let $componentController, $q, SessionUser;

    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      $q = $injector.get("$q");

      SessionUser = $injector.get("SessionUser");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("groupOptions", {});
      expect($ctrl).to.exist;
    });

    it("should be able to leave a group", () => {
      let $ctrl = $componentController("groupOptions", {});

      // avoid the side effects of persisting the group after CurrentGroup.set()
      sinon.stub($ctrl.CurrentGroup, "persistCurrentGroup");

      let groupData = { id: 9834 };
      sinon.stub($ctrl.$mdDialog, "show");
      sinon.stub($ctrl.$state, "go");
      $ctrl.$mdDialog.show.returns($q.resolve());
      SessionUser.value = { id: 1 };
      $httpBackend.expectPOST(`/api/groups/${groupData.id}/leave/`).respond(200);
      $ctrl.CurrentGroup.set({ id: groupData.id });
      expect($ctrl.CurrentGroup.value).to.deep.equal({ id: groupData.id });
      Object.assign($ctrl, { groupData });
      $ctrl.leaveGroup();
      $httpBackend.flush();
      expect($ctrl.CurrentGroup.value).to.deep.equal({});
      expect($ctrl.$state.go).to.have.been.calledWith("home");
    });

    it("stays on page if leaving fails", () => {
      let $ctrl = $componentController("groupOptions", {});
      let groupData = { id: 98238 };
      sinon.stub($ctrl.$state, "go");
      sinon.stub($ctrl.$mdDialog, "show");
      $ctrl.$mdDialog.show.returns($q.resolve());
      $httpBackend.expectPOST(`/api/groups/${groupData.id}/leave/`).respond(400);
      Object.assign($ctrl, { groupData });
      $ctrl.leaveGroup();
      $httpBackend.flush();
      expect($ctrl.$state.go).to.not.have.been.calledWith("home");
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $compile("<group-options></group-options>")(scope);
    });
  });
});
