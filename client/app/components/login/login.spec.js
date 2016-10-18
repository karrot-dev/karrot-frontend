import LoginModule from "./login";
import LoginController from "./login.controller";
import LoginComponent from "./login.component";
import LoginTemplate from "./login.html";

const { module } = angular.mock;

describe("Login", () => {
  beforeEach(() => {
    module(LoginModule);
    module(($stateProvider) => {
      $stateProvider
        .state("home", { url: "/" });
    });
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
        $httpBackend.expectGET("/api/auth/status/").respond(200, loginData);
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
        $httpBackend.expectGET("/api/auth/status/").respond(200, loginData);
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
    let component = LoginComponent;

    it("includes the intended template",() => {
      expect(component.template).to.equal(LoginTemplate);
    });

    it("invokes the right controller", () => {
      expect(component.controller).to.equal(LoginController);
    });
  });
});
