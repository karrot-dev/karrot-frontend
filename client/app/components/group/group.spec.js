import GroupDetailModule from "./group";

const { module } = angular.mock;

describe("Group", () => {
  let $httpBackend, $state;

  beforeEach(module(GroupDetailModule));
  beforeEach(module({ $translate: sinon.stub() }));
  beforeEach(module(($stateProvider) => {
    $stateProvider
      .state("main", { url: "", abstract: true })
      .state("groupInfo", { parent: "main", url: "groupInfo" });
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

  describe("Controller", () => {
    let $componentController;

    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      sinon.stub($state, "go");
    }));

    it("loads users and stores on init", () => {
      let $ctrl = $componentController("group", {});
      sinon.stub($ctrl.User, "list");
      sinon.stub($ctrl.CurrentUsers, "set");
      sinon.stub($ctrl.Store, "listByGroupId");
      sinon.stub($ctrl.CurrentStores, "set");
      inject(($rootScope, $q) => {
        $ctrl.User.list.returns($q.resolve([{ id: 5 }]));
        $ctrl.Store.listByGroupId.returns($q.resolve([{ id: 97 }]));
        $ctrl.$onInit();
        $rootScope.$apply();
      });
      expect($ctrl.CurrentUsers.set).to.have.been.calledWith([{ id: 5 }]);
      expect($ctrl.CurrentStores.set).to.have.been.calledWith([{ id: 97 }]);
    });
  });

  describe("Route", () => {
    beforeEach(() => {
      $httpBackend.whenGET("/api/auth/status/").respond({ id: 43 });
      inject(($translate, $q, CurrentGroup) => {
        $translate.returns($q.resolve());
        sinon.stub(CurrentGroup, "set");
      });
    });

    it("loads group information & redirects to substate", () => {
      let groupData = { id: 12, members: [43] };
      $httpBackend.whenGET(`/api/groups/${groupData.id}/`).respond(groupData);
      $state.go("group", { groupId: groupData.id });
      $httpBackend.flush();
      expect($state.current.name).to.equal("group.groupDetail.pickups");
    });

    it("redirects to group info if user is not in group", () => {
      let groupData = { id: 13, members: [234] };
      $httpBackend.whenGET(`/api/groups/${groupData.id}/`).respond(groupData);
      $state.go("group", { groupId: groupData.id });
      $httpBackend.flush();
      expect($state.current.name).to.equal("groupInfo");
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $compile("<group></group>")(scope);
    });
  });

});
