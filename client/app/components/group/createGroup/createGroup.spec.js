import CreateGroupModule from "./createGroup";

const { module } = angular.mock;

describe("CreateGroup", () => {
  beforeEach(module(CreateGroupModule));

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
    let $componentController, $httpBackend, $state;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      $httpBackend = $injector.get("$httpBackend");
      $state = $injector.get("$state");
      sinon.stub($state, "go");
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
      $httpBackend.flush();
      expect($state.go).to.have.been.calledWith("group", { groupId: 987 });
    });
  });
});
