import GroupDetailModule from "./group";
import GroupDetailController from "./group.controller";
import GroupDetailComponent from "./group.component";
import GroupDetailTemplate from "./group.html";
import CurrentGroup from "../../services/group/group";

const { module } = angular.mock;

describe("Group", () => {
  let $httpBackend, $state;

  beforeEach(module(GroupDetailModule));
  beforeEach(module(CurrentGroup));
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
      $httpBackend.whenGET("/api/auth/status/").respond({ id: 43 });
      inject(($translate, $q, $injector) => {
        $translate.returns($q.resolve());
        let CurrentGroup = $injector.get("CurrentGroup");
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

});
