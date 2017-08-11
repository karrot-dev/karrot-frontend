import VerifyMailModule from "./verifyMail";

const { module } = angular.mock;

describe("VerifyMail", () => {
  beforeEach(module(VerifyMailModule));
  beforeEach(module(($stateProvider) => {
    $stateProvider
      .state("main", { url: "", abstract: true });
  }));
  beforeEach(module({
    $translate: sinon.stub(),
    $mdToast: { showSimple: sinon.stub() }
  }));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  let $state, $rootScope, $q, User;
  beforeEach(inject(($injector, Authentication) => {
    $rootScope = $injector.get("$rootScope");
    $state = $injector.get("$state");
    $q = $injector.get("$q");
    sinon.stub(Authentication, "update").returns($q.resolve({ id: 1, email: "user@example.com" }));
    User = $injector.get("User");
    sinon.stub(User, "verifyMail");
  }));

  describe("Module", () => {
    it("is named verifyMail", () => {
      expect(VerifyMailModule).to.equal("verifyMail");
    });
  });

  describe("Route", () => {
    it("goes to state", inject(() => {
      expect($state.go("verifyMail")).to.eventually.be.fulfilled;
      $rootScope.$apply();
      expect($state.current.component).to.equal("verifyMail");
    }));
  });

  describe("Controller", () => {
    let $ctrl;
    beforeEach(inject((_$componentController_, $stateParams) => {
      $ctrl = _$componentController_("verifyMail", { });
      $stateParams.key = "abc";
    }));

    it("loads verification status", () => {
      $ctrl.User.verifyMail.returns($q.resolve());
      $ctrl.$onInit();
      $rootScope.$apply();
      expect($ctrl.User.verifyMail).to.have.been.calledWith("abc");
      expect($ctrl.error).to.be.false;
    });

    it("loads verification status with error", () => {
      $ctrl.User.verifyMail.returns($q.reject({ error: "wontfix" }));
      $ctrl.$onInit();
      $rootScope.$apply();
      expect($ctrl.User.verifyMail).to.have.been.calledWith("abc");
      expect($ctrl.error).to.deep.equal({ error: "wontfix" });
    });

    it("loads user data", () => {
      $ctrl.loadUser();
      $rootScope.$apply();
      expect($ctrl.user).to.deep.equal({ id: 1, email: "user@example.com" });
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      inject((User) => {
        User.verifyMail.returns($q.resolve());
        $compile("<verify-mail></verify-mail>")(scope);
      });
    });
  });
});
