import uiRouter from "@uirouter/angularjs";
import ngMaterial from "angular-material";
import authCheckConfig from "app.authCheck";
import AuthenticationModule from "services/authentication/authentication";

const { module } = angular.mock;

describe("authCheck", () => {
  beforeEach(module(
    angular.module("authTestApp", [
      uiRouter, AuthenticationModule, ngMaterial
    ]).config(authCheckConfig).name
  ));
  beforeEach(module(($stateProvider) => {
    $stateProvider
      .state("authNeeded", { url: "secret", data: { authCheck: true } })
      .state("login", { url: "login" });
  }));
  beforeEach(module({ $translate: sinon.stub() }));

  let $log, $httpBackend, $state, SessionUser;
  beforeEach(inject(($injector, $translate, $q) => {
    $log = $injector.get("$log");
    $log.reset();
    $httpBackend = $injector.get("$httpBackend");
    $state = $injector.get("$state");
    SessionUser = $injector.get("SessionUser");
    $translate.returns($q.resolve());
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $log.assertEmpty();
  });

  it("goes to authed state", () => {
    $httpBackend.expectGET("/api/auth/status/").respond(200, { id: 5 });
    sinon.stub(SessionUser, "set").returns({ id: 5 });
    $state.go("authNeeded");
    $httpBackend.flush();
    expect($state.current.name).to.equal("authNeeded");
  });

  it("goes to login", () => {
    $httpBackend.expectGET("/api/auth/status/").respond(401);
    $state.go("authNeeded");
    $httpBackend.flush();
    expect($state.current.name).to.equal("login");
  });

  it("goes to authed state on non-401", () => {
    $httpBackend.expectGET("/api/auth/status/").respond(404);
    $state.go("authNeeded");
    $httpBackend.flush();
    expect($state.current.name).to.equal("authNeeded");
  });
});