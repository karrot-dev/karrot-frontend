import SignupModule from "./signup";

const { module } = angular.mock;

describe("Signup", () => {
  beforeEach(() => {
    module(SignupModule);
    module(($stateProvider) => {
      $stateProvider
      .state("splash", { url: "", abstract: true })
      .state("home", { });
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
      expect(SignupModule).to.equal("signup");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject((_$componentController_) => {
      $componentController = _$componentController_;
    }));

    let $httpBackend, $state;
    beforeEach(() => {
      inject((_$httpBackend_, _$state_, $q) => {
        $httpBackend = _$httpBackend_;
        $state = _$state_;
        sinon.stub($state, "go").returns($q.resolve());
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

    it("accepts invite", () => {
      let ctrl = $componentController("signup", {});
      let user = { id: 5 };
      Object.assign(ctrl, {
        username: signupRequest.display_name,
        email: signupRequest.email,
        password: signupRequest.password
      });
      inject(($q, $rootScope) => {
        sinon.stub(ctrl.User, "create").returns($q.resolve());
        sinon.stub(ctrl.Authentication, "login").returns($q.resolve(user));
        sinon.stub(ctrl.Invitation, "accept").returns($q.resolve());
        ctrl.$stateParams.invite = "mytoken";
        expect(ctrl.signup()).to.eventually.be.fulfilled;
        $rootScope.$apply();
        expect(ctrl.Invitation.accept).to.have.been.calledWith("mytoken");
        expect($state.go).to.have.been.calledWith("home");
      });
    });

    it("prefills e-mail from url", () => {
      inject((Authentication, Invitation, $state, $q, $rootScope, $stateParams) => {
        expect($state.href("signup", { email: "la@la.com" })).to.equal("#!/signup?email=la%40la.com");
        $stateParams.email = "la@la.com";

        let ctrl = $componentController("signup", {});
        expect(ctrl.email).to.equal("la@la.com");
      });
    });
  });

  describe("Route", () => {
    it("stays on page if logged out", () => {
      inject((Authentication, Invitation, $q, $rootScope, $state) => {
        sinon.stub(Authentication, "update").returns($q.reject());
        sinon.stub(Invitation, "accept");
        expect($state.go("signup", { invite: "mytoken" })).to.eventually.be.fulfilled;
        $rootScope.$apply();
        expect(Invitation.accept).to.not.have.been.called;
        expect($state.current.name).to.equal("signup");
      });
    });

    it("accepts invite and redirects to home if logged in", () => {
      inject((Authentication, Invitation, $q, $rootScope, $state) => {
        sinon.stub(Authentication, "update").returns($q.resolve());
        sinon.stub(Invitation, "accept").returns($q.resolve());
        expect($state.go("signup", { invite: "mytoken" })).to.eventually.be.fulfilled;
        $rootScope.$apply();
        expect(Invitation.accept).to.have.been.calledWith("mytoken");
        expect($state.current.name).to.equal("home");
      });
    });

    it("without invite just go to home", () => {
      inject((Authentication, Invitation, $q, $rootScope, $state) => {
        sinon.stub(Authentication, "update").returns($q.resolve());
        sinon.stub(Invitation, "accept");
        expect($state.go("signup")).to.eventually.be.fulfilled;
        $rootScope.$apply();
        expect(Invitation.accept).to.not.have.been.called;
        expect($state.current.name).to.equal("home");
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
      $compile("<signup></signup>")(scope);
    });
  });
});
