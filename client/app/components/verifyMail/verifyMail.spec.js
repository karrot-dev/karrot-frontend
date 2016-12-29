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

  let $state, $httpBackend;
  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    $state = $injector.get("$state");
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe("Module", () => {
    it("is named verifyMail", () => {
      expect(VerifyMailModule).to.equal("verifyMail");
    });
  });

  describe.skip("Route", () => {
    it("goes to state", () => {
      $httpBackend.expectGET("/api/auth/status/").respond({ email: "lala@bla.com" });
      $httpBackend.expectPOST("/api/users/verify_mail/", { key: "abc" }).respond();
      $state.go("verifyMail", { key: "abc" });
      $httpBackend.flush();
      expect($state.current.component).to.equal("verifyMail");
      expect($state.current.resolve.email).to.equal("lala@bla.com");
      expect($state.current.resolve.error).to.be.false;
    });

    it("sets error on reject", () => {
      $httpBackend.expectGET("/api/auth/status/").respond({ email: "" });
      $httpBackend.expectPOST("/api/users/verify_mail/", { key: "abc" }).respond(400, { error: "wontfix" });
      $state.go("verifyMail", { key: "abc" });
      $httpBackend.flush();
      expect($state.current.component).to.equal("verifyMail");
      expect($state.current.resolve.error).to.equal({ error: "wontfix" });
    });
  });
});
