import JoinGroupModule from "./joinGroup";

const { module } = angular.mock;

describe("JoinGroup", () => {
  beforeEach(module(JoinGroupModule));
  beforeEach(module({ translateFilter: (a) => a }));

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

    it("joins group with password", () => {
      let $ctrl = $componentController("joinGroup", {}, { group: { id: 1337, protected: true } });
      $httpBackend.expectPOST("/api/groups/1337/join/", { password: "pwbla" }).respond();
      $ctrl.$onInit();
      $ctrl.password = "pwbla";
      let response = $ctrl.joinGroup();
      $httpBackend.flush();
      expect($mdDialog.hide).to.have.been.calledWith(1337);
      // check if we get a Promise back
      expect(response.then).to.exist;
    });

    it("joins group without password directly", () => {
      let $ctrl = $componentController("joinGroup", {}, { group: { id: 1337, protected: false } });
      $httpBackend.expectPOST("/api/groups/1337/join/").respond();
      $ctrl.$onInit();
      $httpBackend.flush();
      expect($mdDialog.hide).to.have.been.calledWith(1337);
    });

    it("shows error if password is wrong", () => {
      let $ctrl = $componentController("joinGroup", {}, { group: { id: 1337, protected: true } });
      $httpBackend.expectPOST("/api/groups/1337/join/", { password: "wrong" }).respond(400, "err");
      $ctrl.$onInit();
      $ctrl.password = "wrong";
      let $setValidity = sinon.stub();
      $ctrl.joinGroup({ form: { password: { $setValidity } } });
      $httpBackend.flush();
      expect($mdDialog.hide).to.not.have.been.called;
      expect($setValidity).to.have.been.calledWith("check", false);
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $compile("<join-group group='{protected: true}'></join-group>")(scope);
    });
  });
});
