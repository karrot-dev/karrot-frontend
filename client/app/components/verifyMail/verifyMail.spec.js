import VerifyMailModule from "./verifyMail";

const { module } = angular.mock;

describe.only("VerifyMail", () => {
  beforeEach(module(VerifyMailModule));
  beforeEach(module(($stateProvider) => {
    $stateProvider
      .state("main", { url: "", abstract: true });
  }));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  let $state, $rootScope, Authentication, $q, User;
  beforeEach(inject(($injector) => {
    $rootScope = $injector.get("$rootScope");
    $state = $injector.get("$state");
    $q = $injector.get("$q");
    Authentication = $injector.get("Authentication");
    sinon.stub(Authentication, "update").returns($q.resolve({ email: "user@example.com" }));
    User = $injector.get("User");
    sinon.stub(User, "verifyMail");
  }));

  describe("Module", () => {
    it("is named verifyMail", () => {
      expect(VerifyMailModule).to.equal("verifyMail");
    });
  });

  describe("Route", () => {
    it("goes to state", () => {
      $state.go("verifyMail");
      $rootScope.$apply();
      expect($state.current.component).to.equal("verifyMail");
    });
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
      expect($ctrl.Authentication.update).to.have.been.called;
      $rootScope.$apply();
      expect($ctrl.user).to.deep.equal({ email: "user@example.com" });
    });
  });
});
