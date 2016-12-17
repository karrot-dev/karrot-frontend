import JoinGroupModule from "./joinGroup";

const { module } = angular.mock;

describe("JoinGroup", () => {
  beforeEach(module(JoinGroupModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named joinGroup", () => {
      expect(JoinGroupModule).to.equal("joinGroup");
    });
  });

  describe("Controller", () => {
    let $componentController, $httpBackend, $mdDialog;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      $httpBackend = $injector.get("$httpBackend");
      $mdDialog = $injector. get("$mdDialog");
      sinon.stub($mdDialog, "hide");
    }));

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it("joins group", () => {
      let $ctrl = $componentController("joinGroup", {});
      $ctrl.$onInit();
      $httpBackend.expectGET("/api/groups/?include_empty=False").respond([]);
      $ctrl.joinGroup(1337);
      $httpBackend.expectPOST("/api/groups/1337/join/").respond();
      $httpBackend.expectGET("/api/auth/status/").respond([]);
      $httpBackend.flush();
      expect($mdDialog.hide).to.have.been.calledWith(1337);
    });
  });
});
