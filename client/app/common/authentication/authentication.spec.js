import AuthenticationModule from "./authentication";

const { module } = angular.mock;

describe("authentication", () => {

  let $httpBackend, Authentication;

  beforeEach(module(AuthenticationModule));

  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    Authentication = $injector.get("Authentication");
  }));

  let loginData = {
    "id": 7,
    "display_name": "asdflo",
    "first_name": null,
    "last_name": null,
    "email": "asdf.asdf@asdf.asdf",
    "address": null,
    "latitude": null,
    "longitude": null
  };

  describe("service", () => {
    let failLogin = { error: "not_authed" };

    it("rejects anonymous user", (done) => {
      $httpBackend.expectGET("/api/auth/status/").respond(401, failLogin);
      Authentication.update()
        .then(() => {
          done(new Error("shouldn't be resolved"));
        })
        .catch((res) => {
          expect(res.data).to.deep.equal(failLogin);
          done();
        });
      $httpBackend.flush();
    });

    it("allows authenticated user", (done) => {
      $httpBackend.expectGET("/api/auth/status/").respond(loginData);
      Authentication.update()
        .then((data) => {
          expect(data).to.deep.equal(loginData);
          done();
        })
        .catch(() => {
          done(new Error("shouldn't be resolved"));
        });
      $httpBackend.flush();
    });

    it("allows login", (done) => {
      $httpBackend.expectPOST("/api/auth/").respond(loginData);
      Authentication.login("", "")
        .then((data) => {
          expect(data).to.be.deep.equal(loginData);
          done();
        })
        .catch(() => {
          done(new Error("shouldn't be resolved"));
        });
      $httpBackend.flush();
    });

    it("disallows login", (done) => {
      $httpBackend.expectPOST("/api/auth/").respond(400);
      Authentication.login("", "")
        .then(() => {
          done(new Error("shouldn't be resolved"));
        })
        .catch(() => {
          done();
        });
      $httpBackend.flush();
    });

    it("logs user out", (done) => {
      $httpBackend.expectPOST("/api/auth/logout/").respond(200);
      Authentication.logout()
        .then(() => {
          done();
        })
        .catch(() => {
          done(new Error("shouldn't be resolved"));
        });
      $httpBackend.flush();
    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });

});
