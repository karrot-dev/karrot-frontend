import LoginModule from "./login";

const { module } = angular.mock;

describe("Login", () => {
  beforeEach(() => {
    module(LoginModule);
    module(($stateProvider) => {
      $stateProvider
        .state("splash", { url: "", abstract: true })
        .state("home", { url: "/" });
    });
  });

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named login", () => {
      expect(LoginModule).to.equal("login");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject((_$componentController_) => {
      $componentController = _$componentController_;
    }));

    it("should exist", () => {
      let ctrl = $componentController("login", {});
      expect(ctrl).to.exist;
    });

    context("login", () => {
      let $httpBackend, $state;
      beforeEach(() => {
        inject((_$httpBackend_, _$state_) => {
          $httpBackend = _$httpBackend_;
          $state = _$state_;
          sinon.stub($state, "go");
        });
      });

      afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      let loginData = {
        "id": 7,
        "display_name": "asdflo",
        "email": "asdf.asdf@asdf.asdf"
      };

      it("logs user in", () => {
        let email = "example@example.com";
        let password = "correctPassword";
        $httpBackend.expectPOST("/api/auth/", { email, password }).respond(200, loginData);
        let ctrl = $componentController("login", {});
        Object.assign(ctrl, { email, password });
        ctrl.login();
        $httpBackend.flush();
        expect($state.go).to.have.been.calledWith("home");
      });

      it("rejects wrong password", () => {
        let email = "example@example.com";
        let password = "wrongPassword";
        $httpBackend.expectPOST("/api/auth/", { email, password }).respond(400);
        let ctrl = $componentController("login", {});
        Object.assign(ctrl, { email, password });
        ctrl.login();
        $httpBackend.flush();
        expect($state.go).to.not.have.been.called;
        expect(ctrl.password).to.equal("");
      });
    });

  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $compile("<login></login>")(scope);
    });
  });
});
