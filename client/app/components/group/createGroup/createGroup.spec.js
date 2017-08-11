import CreateGroupModule from "./createGroup";

const { module } = angular.mock;

describe("CreateGroup", () => {
  beforeEach(module(CreateGroupModule));
  beforeEach(module({
    $translate: sinon.stub(),
    $mdToast: { showSimple: sinon.stub() }
  }));
  beforeEach(module(($stateProvider) => {
    $stateProvider
      .state("main", { url: "", abstract: true })
      .state("login", { url: "login" });
  }));

  beforeEach(inject(($translate, $q) => {
    $translate.returns($q.resolve());
  }));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named createGroup", () => {
      expect(CreateGroupModule).to.equal("createGroup");
    });
  });

  describe("Controller", () => {
    let $componentController, $httpBackend;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      $httpBackend = $injector.get("$httpBackend");
    }));

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it("creates group", () => {
      let $ctrl = $componentController("createGroup", {});
      let groupData = {
        name: "blabla",
        timezone: "Europe/Madrid"
      };
      $ctrl.createGroup(groupData);
      $httpBackend.expectPOST("/api/groups/", groupData).respond(201, { id: 987 });
      sinon.stub($ctrl.$state, "go");
      $httpBackend.flush();
      expect($ctrl.$state.go).to.have.been.calledWith("group", { groupId: 987 });
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $compile("<create-group></create-group>")(scope);
    });
  });

  describe("Route", () => {
    it("stays on route if logged in", inject((Authentication, $q, $rootScope, $state) => {
      sinon.stub(Authentication, "update").returns($q.resolve({ id: 1 }));
      $state.go("createGroup");
      $rootScope.$apply();
      expect($state.current.name).to.equal("createGroup");
    }));

    it("redirects to login if not logged in", inject((Authentication, $q, $rootScope, $state) => {
      // ignore error log
      $state.defaultErrorHandler(() => {});

      sinon.stub(Authentication, "update").returns($q.reject());
      $state.go("createGroup");
      $rootScope.$apply();
      expect($state.current.name).to.equal("login");
    }));
  });
});
