import GroupEditModule from "./groupEdit";

const { module } = angular.mock;

describe("GroupEdit", () => {
  beforeEach(module(GroupEditModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named groupEdit", () => {
      expect(GroupEditModule).to.equal("groupEdit");
    });
  });

  describe("Controller", () => {
    let $componentController, $state, $httpBackend;
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

    it("modifies group", () => {
      let $ctrl = $componentController("groupEdit", {});
      let editData = {
        id: 85,
        name: "blabla"
      };
      $ctrl.submit(editData);
      $httpBackend.expectPATCH("/api/groups/85/", editData).respond(200, editData);
      $httpBackend.flush();
      expect($state.go).to.have.been.calledWith("^");
    });
  });
});
