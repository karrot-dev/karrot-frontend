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

    it("joins group", () => {
      let $ctrl = $componentController("joinGroup", {});
      $ctrl.$onInit();
      $httpBackend.expectGET("/api/groups/?include_empty=False").respond([]);
      $ctrl.active = { id: 1337 };
      let response = $ctrl.joinGroup();
      $httpBackend.expectPOST("/api/groups/1337/join/").respond();
      $httpBackend.expectGET("/api/auth/status/").respond([]);
      $httpBackend.flush();
      expect($mdDialog.hide).to.have.been.calledWith(1337);
      // check if we get a Promise back
      expect(response.then).to.exist;
    });

    it("should change active group", () => {
      let $ctrl = $componentController("joinGroup", {});
      $ctrl.active = { id: 1337 };
      $ctrl.toggle({ id: 5555 });
      expect($ctrl.active.id).to.equal(5555);
    });

    it("should close on click on active group", () => {
      let $ctrl = $componentController("joinGroup", {});
      $ctrl.active = { id: 1337 };
      $ctrl.toggle({ id: 1337 });
      expect($ctrl.active).to.be.null;
    });

    it("should toggle check if group is protected", () => {
      let $ctrl = $componentController("joinGroup", {});
      $ctrl.active = { id: 1337, protected: true };
      $ctrl.toggleCheck();
      expect($ctrl.check).to.be.true;
    });

    it("should join group directly if group is not protected", () => {
      let $ctrl = $componentController("joinGroup", {});
      $ctrl.active = { id: 1337, protected: false };
      $ctrl.toggleCheck();
      $httpBackend.expectPOST("/api/groups/1337/join/").respond();
      $httpBackend.flush();

      // dont go to check
      expect($ctrl.check).to.be.false;
      // window should get closed
      expect($mdDialog.hide).to.have.been.calledWith(1337);
    });

    it("selects group if provided", () => {
      let $ctrl = $componentController("joinGroup", {}, {
        selectedGroup: 5
      });
      sinon.stub($ctrl, "toggleCheck");
      $httpBackend.expectGET("/api/groups/?include_empty=False").respond(200, [{
        id: 5,
        members: [1]
      }]);
      $httpBackend.expectGET("/api/auth/status/").respond([]);
      $ctrl.$onInit();
      $httpBackend.flush();
      expect($ctrl.active).to.deep.equal({ id: 5, members: [1] });
      expect($ctrl.toggleCheck).to.have.been.called;
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      scope.$ctrl = { groups: [{}] };
      $compile("<join-group></join-group>")(scope);
    });
  });
});
