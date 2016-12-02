import AuthenticationModule from "./authentication";

const { module } = angular.mock;

describe("hook", () => {

  let $httpBackend, $state, $transitions, createHook;

  beforeEach(module(AuthenticationModule));
  beforeEach(module(($stateProvider, hookProvider) => {
    $stateProvider
      .state("home", { url: "/" })
      .state("login", { url: "/login" });
    createHook = hookProvider.createHook;
  }));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    $state = $injector.get("$state");
    $transitions = $injector.get("$transitions");
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  let loginData = {
    "display_name": "asdflo",
    "email": "asdf.asdf@asdf.asdf"
  };

  context("when logged in", () => {

    beforeEach(() => {
      $httpBackend.expectGET("/api/auth/status/").respond(loginData);
    });

    it("can redirect", () => {
      let target = "login";
      let authenticated = "home"; // we are logged in and want it to send us to home
      let anonymous = true; // this is ignored as we are logged in

      // register hook
      let hook = createHook(target, { authenticated, anonymous });
      hook($transitions);

      $state.go(target);
      $httpBackend.flush();
      expect($state.current.name).to.equal(authenticated);
    });

    it("can pass through to target", () => {
      let target = "home";
      let authenticated = true; // we are logged in and are happy with the target
      let anonymous = true; // this is ignored as we are logged in

      // register hook
      let hook = createHook(target, { authenticated, anonymous });
      hook($transitions);

      $state.go(target);
      $httpBackend.flush();
      expect($state.current.name).to.equal(target);
    });

  });

  context("when logged out", () => {

    beforeEach(() => {
      $httpBackend.expectGET("/api/auth/status/").respond(401);
    });

    it("can redirect", () => {
      let target = "home";
      let anonymous = "login"; // send anonymous user here
      let authenticated = ""; // ignored as we are not logged in

      // register hook
      let hook = createHook(target, { authenticated, anonymous });
      hook($transitions);

      $state.go(target);
      $httpBackend.flush();
      expect($state.current.name).to.equal(anonymous);
    });

    it("can pass through to target", () => {
      let target = "login";
      let anonymous = true; // pass through to target
      let authenticated = ""; // ignored as we are not logged in

      // register hook
      let hook = createHook(target, { authenticated, anonymous });
      hook($transitions);

      $state.go(target);
      $httpBackend.flush();
      expect($state.current.name).to.equal(target);
    });

  });

});
