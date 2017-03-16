import VerifyMailModule from "./verifyMail";

const { module } = angular.mock;

describe("VerifyMail", () => {
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
    Authentication = $injector.get("Authentication");
    sinon.stub(Authentication, "update");
    $q = $injector.get("$q");
    Authentication.update.returns($q((resolve) => {
      resolve({ email: "user@example.com" });
    }));
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
      User.verifyMail.withArgs("abc").returns($q((resolve) => {
        resolve();
      }));
      $state.go("verifyMail", { key: "abc" });
      $rootScope.$apply();
      expect($state.current.component).to.equal("verifyMail");
      inject(($injector) => {
        expect($injector.invoke($state.current.resolve.email)).to.eventually.equal("user@example.com");
        expect($injector.invoke($state.current.resolve.error)).to.eventually.be.false;
      });
      $rootScope.$apply();
    });

    it("sets error on reject", () => {
      User.verifyMail.withArgs("abc").returns($q((resolve, reject) => {
        reject({ error: "wontfix" });
      }));
      $state.go("verifyMail", { key: "abc" });
      $rootScope.$apply();
      expect($state.current.component).to.equal("verifyMail");
      inject(($injector) => {
        expect($injector.invoke($state.current.resolve.email)).to.eventually.equal("user@example.com");
        expect($injector.invoke($state.current.resolve.error)).to.eventually.deep.equal({ error: "wontfix" });
      });
      $rootScope.$apply();
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $compile("<verify-mail></verify-mail>")(scope);
    });
  });
});
