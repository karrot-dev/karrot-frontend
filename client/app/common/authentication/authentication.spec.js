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
    let failLoginStatusString = "{\"error\": \"not_authed\"}";

    it("rejects anonymous user", () => {
      $httpBackend.expectGET("/api/auth/status/").respond(() => {
        return [401, failLoginStatusString];
      });
      Authentication.update()
        .then(() => {
          assert.done(new Error("shouldn't be resolved"));
        })
        .catch(() => {
          assert.done();
        });
      $httpBackend.flush();
    });

    it("allows authenticated user", () => {
      $httpBackend.expectGET("/api/auth/status/").respond(loginData);
      Authentication.update()
        .then(() => {
          assert.done();
        })
        .catch(() => {
          assert.fail();
        });
      $httpBackend.flush();
    });

    it("allows login", () => {
      $httpBackend.expectPOST("/api/auth/").respond(loginData);
      Authentication.login("", "")
        .then((data) => {
          expect(data).to.be.deep.equal(loginData);
        })
        .catch(() => {
          assert.fail();
        });
      $httpBackend.flush();
    });

    it("disallows login", () => {
      $httpBackend.expectPOST("/api/auth/").respond(() => {
        return [400];
      });
      Authentication.login("", "")
        .then(() => {
          assert.fail();
        })
        .catch(() => {
          assert.done();
        });
      $httpBackend.flush();
    });

    it("logs user out", () => {
      $httpBackend.expectPOST("/api/auth/logout/").respond(() => {
        return [200];
      });
      Authentication.logout()
        .then(() => {
          assert.done();
        });
      $httpBackend.flush();
    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });

});
