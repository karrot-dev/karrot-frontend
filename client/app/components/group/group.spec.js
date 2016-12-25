import GroupDetailModule from "./group";
import GroupDetailController from "./group.controller";
import GroupDetailComponent from "./group.component";
import GroupDetailTemplate from "./group.html";

const { module } = angular.mock;

describe("Group", () => {
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
    let $componentController;

    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      sinon.stub($state, "go");
    }));

    it("should exist", () => {
      let $ctrl = $componentController("group", {});
      expect($ctrl).to.exist;
    });
  });

  describe("Route", () => {
    beforeEach(() => {
      $httpBackend.expectGET("/api/auth/status/").respond({});
    });

    let groupData = { id: 12 };
    it("should load group information", () => {
      $httpBackend.expectGET(`/api/groups/${groupData.id}/`).respond(groupData);
      $state.go("group", { groupId: groupData.id });
      $httpBackend.flush();
      expect($state.current.component).to.equal("group");
    });
  });

});
