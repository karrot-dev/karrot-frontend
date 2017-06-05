import AuthenticationModule from "./authentication";

const { module } = angular.mock;

describe("authentication", () => {

  let $httpBackend, Authentication;

  beforeEach(module(AuthenticationModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  beforeEach(inject((_$httpBackend_, _Authentication_) => {
    $httpBackend = _$httpBackend_;
    Authentication = _Authentication_;
  }));

  let loginData = {
    "id": 7,
    "display_name": "asdflo",
    "email": "asdf.asdf@asdf.asdf",
    "address": null,
    "latitude": null,
    "longitude": null
  };

  describe("Auth service", () => {
    let failLogin = { error: "not_authed" };

    it("rejects anonymous user", () => {
      $httpBackend.expectGET("/api/auth/status/").respond(401, failLogin);
      expect(Authentication.update())
        .to.be.rejected.and
        .to.eventually.deep.equal(failLogin);
      $httpBackend.flush();
    });

    it("allows authenticated user", () => {
      $httpBackend.expectGET("/api/auth/status/").respond(loginData);
      expect(Authentication.update())
        .to.be.fulfilled.and
        .to.eventually.deep.equal(loginData);
      $httpBackend.flush();
    });

    it("allows login", () => {
      $httpBackend.expectPOST("/api/auth/").respond(loginData);
      expect(Authentication.login("", ""))
        .to.be.fulfilled.and
        .to.eventually.deep.equal(loginData);
      $httpBackend.flush();
    });

    it("disallows login", () => {
      $httpBackend.expectPOST("/api/auth/").respond(400);
      expect(Authentication.login("", "")).to.be.rejected;
      $httpBackend.flush();
    });

    it("logs user out", () => {
      $httpBackend.expectPOST("/api/auth/logout/").respond(200);
      expect(Authentication.logout()).to.be.fulfilled;
      $httpBackend.flush();
    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });

});
