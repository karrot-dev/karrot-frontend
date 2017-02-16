import SignupModule from "./signup";
import SignupController from "./signup.controller";
import SignupComponent from "./signup.component";
import SignupTemplate from "./signup.html";

const { module } = angular.mock;

describe("Signup", () => {
  beforeEach(() => {
    module(SignupModule);
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
      expect(SignupModule).to.equal("signup");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject((_$componentController_) => {
      $componentController = _$componentController_;
    }));

    it("should exist", () => {
      let ctrl = $componentController("signup", {});
      expect(ctrl).to.exist;
    });

    context("signup", () => {
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

      let signupRequest = {
        "display_name": "test",
        "email": "test@test.org",
        "password": "123"
      };

      let signupResponse = {
        "id": 55,
        "display_name": "test",
        "email": "test@test.org"
      };

      it("signs user up", () => {
        $httpBackend.expectPOST("/api/users/", signupRequest).respond(200, signupResponse);
        $httpBackend.expectPOST("/api/auth/", {
          email: signupRequest.email,
          password: signupRequest.password
        }).respond(200);
        let ctrl = $componentController("signup", {});
        Object.assign(ctrl, {
          username: signupRequest.display_name,
          email: signupRequest.email,
          password: signupRequest.password
        });
        ctrl.signup();
        $httpBackend.flush();
        expect($state.go).to.have.been.calledWith("home");
      });
    });
  });

  describe("Template", () => {

  });

  describe("Component", () => {
    // component/directive specs
    let component = SignupComponent;

    it("includes the intended template",() => {
      expect(component.template).to.equal(SignupTemplate);
    });

    it("invokes the right controller", () => {
      expect(component.controller).to.equal(SignupController);
    });
  });
});
